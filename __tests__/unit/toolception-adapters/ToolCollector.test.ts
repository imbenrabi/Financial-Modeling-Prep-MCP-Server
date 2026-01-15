import { describe, it, expect } from 'vitest';
import { ToolCollector } from '../../../src/toolception-adapters/ToolCollector.js';

describe('ToolCollector', () => {
  describe('Tool Registration', () => {
    it('should capture tool registrations', () => {
      const collector = new ToolCollector();

      collector.tool(
        'testTool',
        'Test tool description',
        { param: 'string' },
        async () => ({ content: [{ type: 'text', text: 'result' }] })
      );

      const tools = collector.getToolDefinitions();
      expect(tools).toHaveLength(1);
      expect(tools[0].name).toBe('testTool');
      expect(tools[0].description).toBe('Test tool description');
      expect(tools[0].inputSchema).toEqual({ param: 'string' });
    });

    it('should capture multiple tool registrations', () => {
      const collector = new ToolCollector();

      collector.tool('tool1', 'First tool', {}, async () => ({ content: [] }));
      collector.tool('tool2', 'Second tool', {}, async () => ({ content: [] }));
      collector.tool('tool3', 'Third tool', {}, async () => ({ content: [] }));

      expect(collector.getToolCount()).toBe(3);
    });

    it('should clear all tools', () => {
      const collector = new ToolCollector();

      collector.tool('tool1', 'Test', {}, async () => ({ content: [] }));
      expect(collector.getToolCount()).toBe(1);

      collector.clear();
      expect(collector.getToolCount()).toBe(0);
    });
  });

  describe('MCP Annotations', () => {
    it('should add annotations to tool definitions', () => {
      const collector = new ToolCollector();

      // Register a mock tool
      collector.tool(
        'testTool',
        'Test tool',
        {},
        async () => ({
          content: [{ type: 'text', text: 'test result' }]
        })
      );

      // Get the tool definition
      const tools = collector.getToolDefinitions();
      expect(tools).toHaveLength(1);

      // Verify annotations were added to the tool definition
      expect(tools[0].annotations).toMatchObject({
        readOnlyHint: true,
        openWorldHint: true,
        idempotentHint: true,
      });
    });

    it('should add annotations to all registered tools', () => {
      const collector = new ToolCollector();

      collector.tool('tool1', 'First tool', {}, async () => ({ content: [] }));
      collector.tool('tool2', 'Second tool', {}, async () => ({ content: [] }));
      collector.tool('tool3', 'Third tool', {}, async () => ({ content: [] }));

      const tools = collector.getToolDefinitions();
      expect(tools).toHaveLength(3);

      // All tools should have the same annotations
      tools.forEach(tool => {
        expect(tool.annotations).toMatchObject({
          readOnlyHint: true,
          openWorldHint: true,
          idempotentHint: true,
        });
      });
    });

    it('should preserve handler functionality', async () => {
      const collector = new ToolCollector();

      collector.tool(
        'paramTool',
        'Tool with parameters',
        {},
        async (params) => ({
          content: [{ type: 'text', text: `Received: ${params.input}` }]
        })
      );

      const tools = collector.getToolDefinitions();
      const result = await tools[0].handler({ input: 'test-value' });

      // Handler should work normally
      expect(result.content[0].text).toBe('Received: test-value');

      // And tool definition should have annotations
      expect(tools[0].annotations).toBeDefined();
    });
  });
});
