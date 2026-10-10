#!/usr/bin/env tsx

/**
 * Verifies this server against a candidate toolception build before the
 * dependency is bumped.
 *
 * Usage:
 *   npm run verify:toolception -- --source <spec> [--keep]
 *
 * <spec> is one of:
 *   - an npm version or tag (e.g. 0.7.0, latest)
 *   - a path to a packed tarball (npm pack output)
 *   - git:<ref> to build code-rabi/toolception at a branch, tag or commit
 *
 * The candidate is installed with --no-save, so package.json and the lockfile
 * stay untouched; node_modules is restored with `npm ci` afterwards unless
 * --keep is passed. Every check must pass; the per-client checks need a
 * toolception build that includes code-rabi/toolception#27.
 */

import { execFileSync, spawn, type ChildProcess } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, readFileSync } from 'node:fs';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

/** Outcome of one verification check. */
interface CheckResult {
  name: string;
  passed: boolean;
  detail: string;
}

const TOOLCEPTION_REPO = 'https://github.com/code-rabi/toolception.git';
const SHARED_DEPS = ['@modelcontextprotocol/sdk', 'fastify', 'zod'];
const TOKEN_MISSING = 'FMP_ACCESS_TOKEN is required';
const STARTUP_POLLS = 60;
const STARTUP_POLL_MS = 250;
const OUTPUT_TAIL_CHARS = 2000;
const results: CheckResult[] = [];

/** Stores a check outcome and prints it as one PASS/FAIL line. */
function record(name: string, passed: boolean, detail = ''): void {
  results.push({ name, passed, detail });
  console.log(`${passed ? 'PASS' : 'FAIL'} ${name}${detail ? ` - ${detail}` : ''}`);
}

/** Runs a command without a shell, so arguments with spaces or metacharacters stay literal. */
function run(file: string, args: string[], cwd = process.cwd()): string {
  return execFileSync(file, args, {
    cwd,
    stdio: ['ignore', 'pipe', 'pipe'],
    encoding: 'utf8',
    shell: process.platform === 'win32',
  });
}

/** Reads --source and --keep from the command line; exits with code 2 when --source is missing. */
function parseArgs(argv: string[]): { source: string; keep: boolean } {
  const sourceIndex = argv.indexOf('--source');
  const source = sourceIndex >= 0 ? argv[sourceIndex + 1] : undefined;
  if (!source) {
    console.error('Missing --source <npm version | tarball path | git:ref>');
    process.exit(2);
  }
  return { source, keep: argv.includes('--keep') };
}

/**
 * Turns the --source value into something `npm install` accepts.
 * git refs are cloned, built and packed into a temporary directory.
 */
function resolveInstallSpec(source: string): string {
  if (source.startsWith('git:')) {
    const ref = source.slice('git:'.length);
    if (!ref || ref.startsWith('-')) throw new Error(`Invalid git ref: "${ref}"`);
    const dir = mkdtempSync(join(tmpdir(), 'toolception-'));
    console.log(`Building toolception ${ref} in ${dir}`);
    run('git', ['clone', '--quiet', TOOLCEPTION_REPO, dir]);
    run('git', ['checkout', '--quiet', ref], dir);
    run('npm', ['ci', '--no-audit', '--no-fund', '--engine-strict=false'], dir);
    run('npm', ['run', 'build'], dir);
    run('npm', ['pack', '--pack-destination', dir], dir);
    const tarball = readdirSync(dir).find((file) => file.endsWith('.tgz'));
    if (!tarball) throw new Error('npm pack produced no tarball');
    return join(dir, tarball);
  }
  if (source.endsWith('.tgz')) return resolve(source);
  return `toolception@${source}`;
}

/** Returns the `version` field of the package.json inside `packageDir`. */
function readVersion(packageDir: string): string {
  const manifest: { version: string } = JSON.parse(readFileSync(join(packageDir, 'package.json'), 'utf8'));
  return manifest.version;
}

/** Records the installed toolception version and checks that it shares one copy of each shared dependency with the server. */
function checkSharedDependencies(spec: string): void {
  const installed = readVersion('node_modules/toolception');
  record('installed toolception', true, `${installed} from ${spec}`);
  for (const dep of SHARED_DEPS) {
    const nested = join('node_modules/toolception/node_modules', dep);
    const topLevel = readVersion(join('node_modules', dep));
    const duplicated = existsSync(nested);
    const detail = duplicated ? `toolception has its own ${readVersion(nested)}, server has ${topLevel}` : topLevel;
    record(`single copy of ${dep}`, !duplicated, detail);
  }
}

/** Runs the server's own typecheck, lint, build and test scripts against the installed candidate. */
function runProjectChecks(): void {
  for (const script of ['typecheck', 'lint', 'build', 'test:run']) {
    try {
      run('npm', ['run', script]);
      record(`npm run ${script}`, true);
    } catch (error) {
      const { stdout = '', stderr = '' } = error as { stdout?: string; stderr?: string };
      const output = `${stdout}${stderr}`.trim().split('\n').slice(-15).join('\n');
      record(`npm run ${script}`, false, `\n${output}`);
    }
  }
}

/** Asks the OS for an unused TCP port. */
function findFreePort(): Promise<number> {
  return new Promise((resolvePort, reject) => {
    const probe = createServer();
    probe.on('error', reject);
    probe.listen(0, () => {
      const address = probe.address();
      const port = typeof address === 'object' && address ? address.port : 0;
      probe.close(() => resolvePort(port));
    });
  });
}

/**
 * Starts the built server on a free port and waits for /healthcheck.
 * The child's stdout and stderr are drained so a chatty server can't fill the pipe;
 * the tail is included in the error when startup fails.
 */
async function startServer(env: Record<string, string>): Promise<{ port: number; child: ChildProcess }> {
  const port = await findFreePort();
  const child = spawn('node', ['dist/index.js'], {
    env: { ...process.env, FMP_ACCESS_TOKEN: '', ...env, PORT: String(port) },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let output = '';
  const collect = (chunk: Buffer) => {
    output = (output + chunk.toString()).slice(-OUTPUT_TAIL_CHARS);
  };
  child.stdout?.on('data', collect);
  child.stderr?.on('data', collect);
  for (let poll = 0; poll < STARTUP_POLLS; poll++) {
    try {
      const response = await fetch(`http://localhost:${port}/healthcheck`);
      if (response.ok) return { port, child };
    } catch {
      // not listening yet
    }
    await new Promise((wait) => setTimeout(wait, STARTUP_POLL_MS));
  }
  child.kill();
  throw new Error(`server did not start with ${JSON.stringify(env)}\n${output.trim()}`);
}

/** Opens an MCP client session against the server, optionally passing a session token through `?config=`. */
async function connect(port: number, clientId: string, token?: string): Promise<Client> {
  const config = token ? `?config=${Buffer.from(JSON.stringify({ FMP_ACCESS_TOKEN: token })).toString('base64')}` : '';
  const transport = new StreamableHTTPClientTransport(new URL(`http://localhost:${port}/mcp${config}`), {
    requestInit: { headers: { 'mcp-client-id': clientId } },
  });
  const client = new Client({ name: 'verify-toolception', version: '1.0.0' });
  await client.connect(transport);
  return client;
}

/** Returns the first text block of a tool result, or an empty string. */
function resultText(result: unknown): string {
  const content = (result as { content?: Array<{ text?: string }> }).content;
  return content?.[0]?.text ?? '';
}

/** Runs one check and records it as passed (with the returned detail) or failed (with the error message). */
async function attempt(name: string, check: () => Promise<string>): Promise<void> {
  try {
    record(name, true, await check());
  } catch (error) {
    record(name, false, error instanceof Error ? error.message.slice(0, 200) : String(error));
  }
}

/** Throws `message` when `condition` is false. */
function expect(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

/**
 * Exercises one server mode end to end with real MCP clients. If the server
 * doesn't start or a client can't connect, that is recorded as a failed check
 * and the remaining modes still run.
 *
 * @param mode - prefix for every check name in this mode
 * @param env - environment variables that select the mode
 * @param enableToolset - whether clients must call enable_toolset first (dynamic discovery)
 */
async function checkMode(mode: string, env: Record<string, string>, enableToolset: boolean): Promise<void> {
  const label = (name: string) => `${mode}: ${name}`;
  let child: ChildProcess | undefined;
  try {
    const server = await startServer(env);
    child = server.child;
    const { port } = server;
    const first = await connect(port, `verify-${mode}-a`, 'session-token');
    if (enableToolset) await first.callTool({ name: 'enable_toolset', arguments: { name: 'search' } });

    await attempt(label('searchSymbol advertises its Zod schema'), async () => {
      const tools = (await first.listTools()).tools;
      const schema = tools.find((tool) => tool.name === 'searchSymbol')?.inputSchema;
      expect(Boolean(schema?.properties?.query) && Boolean(schema?.required?.includes('query')), 'query missing from schema');
      return `${tools.length} tools listed`;
    });
    await attempt(label('invalid arguments are rejected'), async () => {
      const text = resultText(await first.callTool({ name: 'searchSymbol', arguments: {} }));
      expect(text.includes('Input validation error'), text);
      return 'rejected before the handler';
    });
    await attempt(label('prompts are listed'), async () => {
      const prompts = (await first.listPrompts()).prompts.map((prompt) => prompt.name);
      expect(prompts.includes('list_mcp_assets'), `got [${prompts.join(', ')}]`);
      return prompts.join(', ');
    });
    await attempt(label('session token reaches the handler'), async () => {
      const text = resultText(await first.callTool({ name: 'searchSymbol', arguments: { query: 'AAPL' } }));
      expect(!text.includes(TOKEN_MISSING), `needs toolception#27: ${text}`);
      return 'handler used the ?config= token';
    });

    const second = await connect(port, `verify-${mode}-b`);
    if (enableToolset) await second.callTool({ name: 'enable_toolset', arguments: { name: 'search' } });
    await attempt(label('first client survives a second client'), async () => {
      await first.listTools().catch((error: Error) => {
        throw new Error(`needs toolception#27: ${error.message}`);
      });
      return 'both sessions usable';
    });
    await attempt(label('client without a token gets the token error'), async () => {
      const text = resultText(await second.callTool({ name: 'searchSymbol', arguments: { query: 'AAPL' } }));
      expect(text.includes(TOKEN_MISSING), text);
      return 'handler ran with arguments';
    });
  } catch (error) {
    record(label('server starts and accepts clients'), false, error instanceof Error ? error.message : String(error));
  } finally {
    child?.kill();
  }
}

/** Installs the candidate, runs every check, restores node_modules and exits 1 if any check failed. */
async function main(): Promise<void> {
  const { source, keep } = parseArgs(process.argv.slice(2));
  const spec = resolveInstallSpec(source);
  console.log(`Installing ${spec} (--no-save)`);
  run('npm', ['install', '--no-save', '--no-audit', '--no-fund', '--engine-strict=false', spec]);

  try {
    checkSharedDependencies(spec);
    runProjectChecks();
    await checkMode('ALL_TOOLS', {}, false);
    await checkMode('STATIC_TOOL_SETS', { FMP_TOOL_SETS: 'search,quotes' }, false);
    await checkMode('DYNAMIC_TOOL_DISCOVERY', { DYNAMIC_TOOL_DISCOVERY: 'true' }, true);
  } finally {
    if (!keep) {
      console.log('Restoring node_modules from the lockfile (npm ci)');
      run('npm', ['ci', '--no-audit', '--no-fund', '--engine-strict=false']);
    }
  }

  const failed = results.filter((check) => !check.passed);
  console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
  if (failed.length > 0) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
