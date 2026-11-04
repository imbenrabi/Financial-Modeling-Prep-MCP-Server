/**
 * ToolCollector - Virtual MCP server that captures tool registrations
 *
 * This class implements the ToolRegistrar.tool() method to intercept tool registrations
 * from existing registerXxxTools() functions and convert them to toolception's
 * McpToolDefinition format.
 */

import type { CallToolResult } from '@modelcontextprotocol/server';
import type { McpToolDefinition } from 'toolception';
import type { z } from 'zod';

/**
 * The registration surface the `registerXxxTools` functions in `src/tools` use.
 *
 * MCP SDK v2 removed `McpServer.tool()`, so the tool modules no longer take an
 * `McpServer`. Handler arguments are still inferred from the Zod shape, as the
 * SDK's own `tool()` overload did.
 */
export interface ToolRegistrar {
  tool<Shape extends z.ZodRawShape>(
    name: string,
    description: string,
    schema: Shape,
    handler: (params: z.infer<z.ZodObject<Shape>>) => Promise<CallToolResult>
  ): void;
}

/**
 * Virtual server that captures tool registrations instead of registering them
 */
export class ToolCollector implements ToolRegistrar {
  private tools: McpToolDefinition[] = [];

  /**
   * Implementation of ToolRegistrar.tool() that captures registrations
   *
   * @param name - Tool name
   * @param description - Human-readable description
   * @param schema - Zod schema object with parameter definitions
   * @param handler - Async function that handles tool execution
   */
  tool<Shape extends z.ZodRawShape>(
    name: string,
    description: string,
    schema: Shape,
    handler: (params: z.infer<z.ZodObject<Shape>>) => Promise<CallToolResult>
  ): void {
    this.tools.push({
      name,
      description,
      inputSchema: schema,
      handler,
      // Add MCP annotations to tool definition
      // All FMP tools are read-only data fetchers that call external APIs
      annotations: {
        readOnlyHint: true,      // All FMP tools are read-only data fetchers
        openWorldHint: true,     // All FMP tools call external FMP API (open world)
        idempotentHint: true,    // Read operations are idempotent
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
