import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import Fastify, { type FastifyInstance } from 'fastify';
import { createMcpServer } from 'toolception';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { createClientIdHook } from '../../../src/utils/clientIdHook.js';
import { ModeConfigMapper } from '../../../src/toolception-adapters/ModeConfigMapper.js';
import { MODULE_ADAPTERS } from '../../../src/toolception-adapters/moduleAdapters.js';

interface McpResponse {
  status: number;
  sessionId: string | null;
  body: { result?: { tools?: unknown[] }; error?: { message: string } };
}

const INITIALIZE = {
  jsonrpc: '2.0',
  id: 1,
  method: 'initialize',
  params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'test', version: '1' } },
};
const TOOLS_LIST = { jsonrpc: '2.0', id: 2, method: 'tools/list' };

// Real toolception transport and MCP SDK, so the session header goes through the same
// writeHead path as production. A changed User-Agent changes the fingerprint the same way
// a changed proxy IP does.
describe('createClientIdHook with the toolception transport', () => {
  let app: FastifyInstance;
  let close: () => Promise<void>;
  let url: string;

  async function post(
    message: object,
    headers: Record<string, string>
  ): Promise<McpResponse> {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json, text/event-stream',
        ...headers,
      },
      body: JSON.stringify(message),
    });
    const text = await response.text();
    const data = text.split('\n').find((line) => line.startsWith('data: '));
    return {
      status: response.status,
      sessionId: response.headers.get('mcp-session-id'),
      body: JSON.parse(data ? data.slice('data: '.length) : text),
    };
  }

  beforeAll(async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    const config = ModeConfigMapper.toToolceptionConfig(
      'STATIC_TOOL_SETS',
      { serverModeOverride: 'STATIC_TOOL_SETS', toolSets: ['search'] },
      undefined,
      MODULE_ADAPTERS
    );
    app = Fastify({ logger: false });
    app.addHook('preHandler', createClientIdHook());
    const server = await createMcpServer({
      catalog: config.catalog,
      moduleLoaders: config.moduleLoaders,
      startup: config.startup,
      context: config.context,
      sessionContext: config.sessionContext,
      exposurePolicy: config.exposurePolicy,
      createServer: () => new McpServer({ name: 'test', version: '1' }, { capabilities: { tools: {} } }),
      http: { port: 0, host: '127.0.0.1', basePath: '/', cors: true, logger: false, app },
    });
    close = server.close;
    await server.start();
    await app.listen({ host: '127.0.0.1', port: 0 });
    const address = app.server.address();
    if (address === null || typeof address === 'string') {
      throw new Error('Server did not bind a TCP port');
    }
    url = `http://127.0.0.1:${address.port}/mcp`;
  });

  afterAll(async () => {
    await close();
    await app.close();
    vi.restoreAllMocks();
  });

  it('keeps a session when its later requests fingerprint differently', async () => {
    const initialized = await post(INITIALIZE, { 'user-agent': 'client/1' });
    expect(initialized.status).toBe(200);
    expect(initialized.sessionId).toBeTruthy();

    const listed = await post(TOOLS_LIST, {
      'user-agent': 'client/2',
      'mcp-session-id': initialized.sessionId!,
    });

    expect(listed.status).toBe(200);
    expect(listed.body.result?.tools?.length).toBeGreaterThan(0);
  });

  it('still rejects a session ID the server never issued', async () => {
    const listed = await post(TOOLS_LIST, {
      'user-agent': 'client/1',
      'mcp-session-id': '00000000-0000-4000-8000-000000000000',
    });

    expect(listed.status).toBe(400);
    expect(listed.body.error?.message).toBe('Session not found or expired');
  });

  it('leaves a client-supplied mcp-client-id in charge', async () => {
    const initialized = await post(INITIALIZE, { 'mcp-client-id': 'own-id' });
    const listed = await post(TOOLS_LIST, {
      'mcp-client-id': 'own-id',
      'mcp-session-id': initialized.sessionId!,
    });

    expect(listed.status).toBe(200);
    expect(listed.body.result?.tools?.length).toBeGreaterThan(0);
  });
});
