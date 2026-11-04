import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { Client, StreamableHTTPClientTransport } from '@modelcontextprotocol/client';
import { ServerModeEnforcer } from '../../src/server-mode-enforcer/ServerModeEnforcer.js';
import { type ServerInstance, startTestServer } from './smoke-test-utils.js';

/**
 * Smoke tests for concurrent clients in Dynamic Mode.
 *
 * Every client (one `mcp-client-id` each) keeps its own enabled/disabled toolsets,
 * so one client enabling or disabling a toolset must never change what another
 * client lists, can call, or is notified about. This is the behaviour the SDK v2
 * move had to keep; `npm run verify:toolception` checks the same against a
 * toolception candidate.
 */
interface Connected {
  client: Client;
  /** Number of `tools/list_changed` notifications this client has received. */
  listChangedCount(): number;
}

/** How long to wait for a notification that must NOT arrive, after the one that should has. */
const NOTIFICATION_SETTLE_MS = 300;

const settle = () => new Promise((resolve) => setTimeout(resolve, NOTIFICATION_SETTLE_MS));

describe('Multi-client Dynamic Mode Smoke Tests', () => {
  let server: ServerInstance;
  const clients: Connected[] = [];

  async function connect(clientId: string): Promise<Connected> {
    const transport = new StreamableHTTPClientTransport(new URL(`http://localhost:${server.port}/mcp`), {
      requestInit: { headers: { 'mcp-client-id': clientId } },
    });
    const client = new Client({ name: 'smoke-multi-client', version: '1.0.0' });
    let notifications = 0;
    client.setNotificationHandler('notifications/tools/list_changed', () => {
      notifications += 1;
    });
    await client.connect(transport);
    const connected = { client, listChangedCount: () => notifications };
    clients.push(connected);
    return connected;
  }

  async function toolNames({ client }: Connected): Promise<string[]> {
    return (await client.listTools()).tools.map((tool) => tool.name).toSorted();
  }

  function metaCall({ client }: Connected, tool: 'enable_toolset' | 'disable_toolset', name: string) {
    return client.callTool({ name: tool, arguments: { name } });
  }

  beforeAll(async () => {
    ServerModeEnforcer.reset();
    server = await startTestServer({ env: { DYNAMIC_TOOL_DISCOVERY: 'true' } });
  }, 40000);

  afterAll(async () => {
    await Promise.all(clients.map(({ client }) => client.close().catch(() => undefined)));
    await server?.close();
    ServerModeEnforcer.reset();
  });

  it('keeps each client\'s enabled toolsets, tool calls and notifications separate', async () => {
    const a = await connect('multi-a');
    const b = await connect('multi-b');
    const metaTools = await toolNames(b);
    expect(metaTools).toHaveLength(5);
    expect(await toolNames(a)).toEqual(metaTools);

    // A enables search: A is notified, B still sees only the meta-tools and gets nothing
    const aNotified = a.listChangedCount();
    const bNotified = b.listChangedCount();
    await metaCall(a, 'enable_toolset', 'search');
    await vi.waitFor(() => expect(a.listChangedCount()).toBeGreaterThan(aNotified));
    await settle();
    expect(await toolNames(a)).toContain('searchSymbol');
    expect(await toolNames(b)).toEqual(metaTools);
    expect(b.listChangedCount()).toBe(bNotified);

    // B enables company and search: B is notified, A never sees company or gets a notification
    const aNotifiedBefore = a.listChangedCount();
    const bNotifiedBefore = b.listChangedCount();
    await metaCall(b, 'enable_toolset', 'company');
    await metaCall(b, 'enable_toolset', 'search');
    await vi.waitFor(() => expect(b.listChangedCount()).toBeGreaterThan(bNotifiedBefore));
    await settle();
    expect(a.listChangedCount()).toBe(aNotifiedBefore);
    const bTools = await toolNames(b);
    expect(bTools).toContain('searchSymbol');
    expect(bTools).toContain('getCompanyProfile');
    expect(await toolNames(a)).not.toContain('getCompanyProfile');

    // A disables search: its tools go away for A only, and only B can still call them
    await metaCall(a, 'disable_toolset', 'search');
    expect(await toolNames(a)).toEqual(metaTools);
    expect(await toolNames(b)).toContain('searchSymbol');
    await expect(a.client.callTool({ name: 'searchSymbol', arguments: { query: 'AAPL' } })).rejects.toThrow();
    const result = await b.client.callTool({ name: 'searchSymbol', arguments: { query: 'AAPL' } });
    // The handler ran: any error is the FMP call failing, not the tool being unknown
    const text = (result.content as Array<{ text?: string }>)[0]?.text ?? '';
    expect(text).not.toMatch(/not found/i);
  }, 60000);
});
