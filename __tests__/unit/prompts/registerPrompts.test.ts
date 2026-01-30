import { describe, it, expect, vi } from 'vitest';
import { registerPrompts } from '../../../src/prompts/index.js';

describe('registerPrompts', () => {
  function createMockServer(hasPrompt = true) {
    const calls: any = {};
    const server: any = {};
    if (hasPrompt) {
      server.prompt = vi.fn((_name: string, _title: string, _schema: any, handler: any) => {
        calls.prompt = { handler };
      });
    }
    // ensure no accidental tool alias usage
    server.tool = vi.fn();
    return { server, calls };
  }

  const baseCtx = {
    mode: 'ALL_TOOLS' as const,
    version: '1.0.0',
    listChanged: false,
  };

  it('registers native prompt when supported', async () => {
    const { server, calls } = createMockServer(true);
    registerPrompts(server, baseCtx);

    expect(server.prompt).toHaveBeenCalled();
    expect(server.tool).not.toHaveBeenCalled();

    // Execute handlers to ensure they return structured content
    const promptResult = await calls.prompt.handler();
    expect(promptResult.messages[0].content[0].text).toContain('# Server Capabilities');
  });

  it('does nothing when prompt API is not available (no alias)', async () => {
    const { server } = createMockServer(false);
    registerPrompts(server, { ...baseCtx, mode: 'STATIC_TOOL_SETS', staticToolSets: ['search'] as any });
    expect(server.prompt).toBeUndefined();
    expect(server.tool).not.toHaveBeenCalled();
  });

  it('renders dynamic mode content with meta-tools note', async () => {
    const { server, calls } = createMockServer(true);
    registerPrompts(server, { ...baseCtx, mode: 'DYNAMIC_TOOL_DISCOVERY', listChanged: true });
    const promptResult = await calls.prompt.handler();
    expect(promptResult.messages[0].content[0].text).toContain('enable_toolset');
    expect(promptResult.messages[0].content[0].text).toContain('list_toolsets');
  });
});


