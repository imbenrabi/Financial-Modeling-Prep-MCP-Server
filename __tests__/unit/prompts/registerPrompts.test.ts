import { describe, it, expect } from 'vitest';
import { McpServer, InMemoryTransport } from '@modelcontextprotocol/server';
import { Client } from '@modelcontextprotocol/client';
import { registerPrompts } from '../../../src/prompts/index.js';

// A real McpServer and Client over an in-memory transport. The MCP SDK removed
// server.prompt() in v2, so a mock that only fakes it would pass while the real
// prompt silently stopped registering.
describe('registerPrompts', () => {
  const baseCtx = {
    mode: 'ALL_TOOLS' as const,
    version: '1.0.0',
    listChanged: false,
  };

  async function connect(ctx: Parameters<typeof registerPrompts>[1]): Promise<Client> {
    const server = new McpServer(
      { name: 'test', version: '1.0.0' },
      { capabilities: { prompts: { listChanged: false } } }
    );
    registerPrompts(server, ctx);
    const [serverSide, clientSide] = InMemoryTransport.createLinkedPair();
    const client = new Client({ name: 'test-client', version: '1.0.0' });
    await Promise.all([server.connect(serverSide), client.connect(clientSide)]);
    return client;
  }

  async function overviewText(client: Client): Promise<string> {
    const result = await client.getPrompt({ name: 'list_mcp_assets' });
    const content = result.messages[0]?.content;
    return content?.type === 'text' ? content.text : '';
  }

  it('lists list_mcp_assets to clients', async () => {
    const client = await connect(baseCtx);
    const { prompts } = await client.listPrompts();
    expect(prompts.map((prompt) => prompt.name)).toEqual(['list_mcp_assets']);
    expect(prompts[0]?.description).toContain('Human-friendly overview');
  });

  it('returns the overview as a single text message', async () => {
    const client = await connect(baseCtx);
    expect(await overviewText(client)).toContain('# Server Capabilities');
  });

  it('renders static mode content with the configured toolsets', async () => {
    const client = await connect({ ...baseCtx, mode: 'STATIC_TOOL_SETS', staticToolSets: ['search'] });
    const text = await overviewText(client);
    expect(text).toContain('Static mode with configured toolsets (1)');
    expect(text).toContain('- search:');
  });

  it('renders dynamic mode content with meta-tools note', async () => {
    const client = await connect({ ...baseCtx, mode: 'DYNAMIC_TOOL_DISCOVERY', listChanged: true });
    const text = await overviewText(client);
    expect(text).toContain('enable_toolset');
    expect(text).toContain('list_toolsets');
  });
});
