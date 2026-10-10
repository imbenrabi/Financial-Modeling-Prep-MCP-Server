#!/usr/bin/env tsx

/**
 * Verifies this server against a candidate toolception build before the
 * dependency is bumped.
 *
 * Usage:
 *   npm run verify:toolception -- --source <spec> [--strict] [--keep]
 *
 * <spec> is one of:
 *   - an npm version or tag (e.g. 0.7.0, latest)
 *   - a path to a packed tarball (npm pack output)
 *   - git:<ref> to build code-rabi/toolception at a branch, tag or commit
 *
 * The candidate is installed with --no-save, so package.json and the lockfile
 * stay untouched; node_modules is restored with `npm ci` afterwards unless
 * --keep is passed. Checks marked "tracked" cover known issues that are fixed
 * in pending PRs; they only fail the run with --strict.
 */

import { execSync, spawn, type ChildProcess } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, readFileSync } from 'node:fs';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

type CheckLevel = 'required' | 'tracked';

interface CheckResult {
  name: string;
  level: CheckLevel;
  passed: boolean;
  detail: string;
}

const TOOLCEPTION_REPO = 'https://github.com/code-rabi/toolception.git';
const SHARED_DEPS = ['@modelcontextprotocol/sdk', 'fastify', 'zod'];
const TOKEN_MISSING = 'FMP_ACCESS_TOKEN is required';
const results: CheckResult[] = [];

function record(name: string, level: CheckLevel, passed: boolean, detail = ''): void {
  results.push({ name, level, passed, detail });
  console.log(`${passed ? 'PASS' : 'FAIL'} [${level}] ${name}${detail ? ` - ${detail}` : ''}`);
}

function run(command: string, cwd = process.cwd()): string {
  return execSync(command, { cwd, stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8' });
}

function parseArgs(argv: string[]): { source: string; strict: boolean; keep: boolean } {
  const sourceIndex = argv.indexOf('--source');
  const source = sourceIndex >= 0 ? argv[sourceIndex + 1] : undefined;
  if (!source) {
    console.error('Missing --source <npm version | tarball path | git:ref>');
    process.exit(2);
  }
  return { source, strict: argv.includes('--strict'), keep: argv.includes('--keep') };
}

/**
 * Turns the --source value into something `npm install` accepts.
 * git refs are cloned, built and packed into a temporary directory.
 */
function resolveInstallSpec(source: string): string {
  if (source.startsWith('git:')) {
    const ref = source.slice('git:'.length);
    const dir = mkdtempSync(join(tmpdir(), 'toolception-'));
    console.log(`Building toolception ${ref} in ${dir}`);
    run(`git clone --quiet ${TOOLCEPTION_REPO} ${dir}`);
    run(`git checkout --quiet ${ref}`, dir);
    run('npm ci --no-audit --no-fund --engine-strict=false', dir);
    run('npm run build', dir);
    run(`npm pack --pack-destination ${dir}`, dir);
    const tarball = readdirSync(dir).find((file) => file.endsWith('.tgz'));
    if (!tarball) throw new Error('npm pack produced no tarball');
    return join(dir, tarball);
  }
  if (source.endsWith('.tgz')) return resolve(source);
  return `toolception@${source}`;
}

function readVersion(packageDir: string): string {
  return JSON.parse(readFileSync(join(packageDir, 'package.json'), 'utf8')).version;
}

function checkSharedDependencies(spec: string): void {
  const installed = readVersion('node_modules/toolception');
  record('installed toolception', 'required', true, `${installed} from ${spec}`);
  for (const dep of SHARED_DEPS) {
    const nested = join('node_modules/toolception/node_modules', dep);
    const topLevel = readVersion(join('node_modules', dep));
    const duplicated = existsSync(nested);
    const detail = duplicated ? `toolception has its own ${readVersion(nested)}, server has ${topLevel}` : topLevel;
    record(`single copy of ${dep}`, 'required', !duplicated, detail);
  }
}

function runProjectChecks(): void {
  for (const script of ['typecheck', 'lint', 'build', 'test:run']) {
    try {
      run(`npm run ${script}`);
      record(`npm run ${script}`, 'required', true);
    } catch (error) {
      const { stdout = '', stderr = '' } = error as { stdout?: string; stderr?: string };
      const output = `${stdout}${stderr}`.trim().split('\n').slice(-15).join('\n');
      record(`npm run ${script}`, 'required', false, `\n${output}`);
    }
  }
}

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

async function startServer(env: Record<string, string>): Promise<{ port: number; child: ChildProcess }> {
  const port = await findFreePort();
  const child = spawn('node', ['dist/index.js'], {
    env: { ...process.env, FMP_ACCESS_TOKEN: '', ...env, PORT: String(port) },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  for (let poll = 0; poll < 60; poll++) {
    try {
      const response = await fetch(`http://localhost:${port}/healthcheck`);
      if (response.ok) return { port, child };
    } catch {
      // not listening yet
    }
    await new Promise((wait) => setTimeout(wait, 250));
  }
  child.kill();
  throw new Error(`server did not start with ${JSON.stringify(env)}`);
}

async function connect(port: number, clientId: string, token?: string): Promise<Client> {
  const config = token ? `?config=${Buffer.from(JSON.stringify({ FMP_ACCESS_TOKEN: token })).toString('base64')}` : '';
  const transport = new StreamableHTTPClientTransport(new URL(`http://localhost:${port}/mcp${config}`), {
    requestInit: { headers: { 'mcp-client-id': clientId } },
  });
  const client = new Client({ name: 'verify-toolception', version: '1.0.0' });
  await client.connect(transport);
  return client;
}

function resultText(result: unknown): string {
  const content = (result as { content?: Array<{ text?: string }> }).content;
  return content?.[0]?.text ?? '';
}

async function attempt(name: string, level: CheckLevel, check: () => Promise<string>): Promise<void> {
  try {
    record(name, level, true, await check());
  } catch (error) {
    record(name, level, false, error instanceof Error ? error.message.slice(0, 200) : String(error));
  }
}

function expect(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

/**
 * Exercises one server mode end to end with real MCP clients.
 */
async function checkMode(mode: string, env: Record<string, string>, enableToolset: boolean): Promise<void> {
  const { port, child } = await startServer(env);
  const label = (name: string) => `${mode}: ${name}`;
  try {
    const first = await connect(port, `verify-${mode}-a`, 'session-token');
    if (enableToolset) await first.callTool({ name: 'enable_toolset', arguments: { name: 'search' } });

    await attempt(label('searchSymbol advertises its Zod schema'), 'required', async () => {
      const tools = (await first.listTools()).tools;
      const schema = tools.find((tool) => tool.name === 'searchSymbol')?.inputSchema;
      expect(Boolean(schema?.properties?.query) && Boolean(schema?.required?.includes('query')), 'query missing from schema');
      return `${tools.length} tools listed`;
    });
    await attempt(label('invalid arguments are rejected'), 'required', async () => {
      const text = resultText(await first.callTool({ name: 'searchSymbol', arguments: {} }));
      expect(text.includes('Input validation error'), text);
      return 'rejected before the handler';
    });
    await attempt(label('prompts are listed'), 'tracked', async () => {
      const listed = await first.listPrompts().catch((error: Error) => {
        throw new Error(`${error.message} (fixed by server #108)`);
      });
      const prompts = listed.prompts.map((prompt) => prompt.name);
      expect(prompts.includes('list_mcp_assets'), `got [${prompts.join(', ')}] (fixed by server #108)`);
      return prompts.join(', ');
    });
    await attempt(label('session token reaches the handler'), 'tracked', async () => {
      const text = resultText(await first.callTool({ name: 'searchSymbol', arguments: { query: 'AAPL' } }));
      expect(!text.includes(TOKEN_MISSING), `${text} (fixed by toolception#27)`);
      return 'handler used the ?config= token';
    });

    const second = await connect(port, `verify-${mode}-b`);
    if (enableToolset) await second.callTool({ name: 'enable_toolset', arguments: { name: 'search' } });
    await attempt(label('first client survives a second client'), 'tracked', async () => {
      await first.listTools();
      return 'both sessions usable';
    });
    await attempt(label('client without a token gets the token error'), 'required', async () => {
      const text = resultText(await second.callTool({ name: 'searchSymbol', arguments: { query: 'AAPL' } }));
      expect(text.includes(TOKEN_MISSING), text);
      return 'handler ran with arguments';
    });
  } finally {
    child.kill();
  }
}

async function main(): Promise<void> {
  const { source, strict, keep } = parseArgs(process.argv.slice(2));
  const spec = resolveInstallSpec(source);
  console.log(`Installing ${spec} (--no-save)`);
  run(`npm install --no-save --no-audit --no-fund --engine-strict=false ${spec}`);

  try {
    checkSharedDependencies(spec);
    runProjectChecks();
    await checkMode('ALL_TOOLS', {}, false);
    await checkMode('STATIC_TOOL_SETS', { FMP_TOOL_SETS: 'search,quotes' }, false);
    await checkMode('DYNAMIC_TOOL_DISCOVERY', { DYNAMIC_TOOL_DISCOVERY: 'true' }, true);
  } finally {
    if (!keep) {
      console.log('Restoring node_modules from the lockfile (npm ci)');
      run('npm ci --no-audit --no-fund --engine-strict=false');
    }
  }

  const failedRequired = results.filter((check) => !check.passed && check.level === 'required');
  const failedTracked = results.filter((check) => !check.passed && check.level === 'tracked');
  console.log(`\n${results.length - failedRequired.length - failedTracked.length}/${results.length} checks passed`);
  console.log(`required failures: ${failedRequired.length}, tracked failures: ${failedTracked.length}${strict ? ' (strict)' : ''}`);
  if (failedRequired.length > 0 || (strict && failedTracked.length > 0)) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
