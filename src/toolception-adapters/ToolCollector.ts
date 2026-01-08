/**
 * ToolCollector - Virtual MCP server that captures tool registrations
 *
 * This class mocks the McpServer.tool() method to intercept tool registrations
 * from existing registerXxxTools() functions and convert them to toolception's
 * McpToolDefinition format.
 */

export interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, any>;
  handler: (args: any) => Promise<any> | any;
}

/**
 * Virtual server that captures tool registrations instead of registering them
 */
export class ToolCollector {
  private tools: McpToolDefinition[] = [];

  /**
   * Mock implementation of McpServer.tool() that captures registrations
   *
   * @param name - Tool name
   * @param description - Human-readable description
   * @param schema - Zod schema object with parameter definitions
   * @param handler - Async function that handles tool execution
   */
  tool(
    name: string,
    description: string,
    schema: Record<string, any>,
    handler: (params: any) => Promise<any>
  ): void {
    this.tools.push({
      name,
      description,
      inputSchema: schema,
      handler: async (params: any) => {
        // Execute the handler and return its result
        return await handler(params);
      }
    });
  }

  /**
   * Get all captured tool definitions
   * @returns Array of toolception-compatible tool definitions
   */
  getToolDefinitions(): McpToolDefinition[] {
    return this.tools;
  }

  /**
   * Get count of captured tools
   * @returns Number of tools registered
   */
  getToolCount(): number {
    return this.tools.length;
  }

  /**
   * Clear all captured tools (useful for testing)
   */
  clear(): void {
    this.tools = [];
  }
}
