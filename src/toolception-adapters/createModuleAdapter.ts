import { ToolCollector, type McpToolDefinition } from './ToolCollector.js';
import type { ModuleLoader } from 'toolception';

/**
 * Context object passed to module loaders by toolception
 * May contain configuration and authentication details
 */
export interface ModuleLoaderContext {
  /** Optional FMP API access token (from server-level context) */
  accessToken?: string;
  /** Optional FMP API access token (from session context via query param) */
  FMP_ACCESS_TOKEN?: string;
  /** Additional context properties toolception may provide */
  [key: string]: unknown;
}

/**
 * Type for existing FMP tool registration functions
 *
 * These functions follow the pattern: registerXxxTools(server, accessToken?)
 * where server is typically McpServer but can be any object implementing ToolRegistrar.
 *
 * @param server - Should implement ToolRegistrar interface with a .tool() method.
 *                 At runtime, receives either McpServer or ToolCollector instance.
 * @param accessToken - Optional FMP API access token
 *
 * @example
 * ```typescript
 * function registerMyTools(server: McpServer, accessToken?: string): void {
 *   server.tool("myTool", "Description", schema, handler);
 * }
 * ```
 *
 * Note: Uses `any` for server parameter due to TypeScript contravariance limitations.
 * The actual implementation must have a .tool() method compatible with ToolRegistrar.
 */
export type RegisterToolsFunction = (server: any, accessToken?: string) => void;

/**
 * Creates a toolception-compatible module loader from an existing registerXxxTools function
 *
 * This adapter bridges the gap between FMP's imperative tool registration pattern
 * and toolception's declarative module loader pattern.
 *
 * @param moduleName - Name of the module (e.g., "search", "quotes")
 * @param registerFn - Existing registerXxxTools function
 * @returns Toolception-compatible module loader
 *
 * @example
 * ```typescript
 * import { registerSearchTools } from '../tools/search.js';
 *
 * const searchLoader = createModuleAdapter('search', registerSearchTools);
 * const tools = await searchLoader({ accessToken: 'demo' });
 * ```
 */
export function createModuleAdapter(
  moduleName: string,
  registerFn: RegisterToolsFunction
): ModuleLoader {
  return async (context?: unknown): Promise<McpToolDefinition[]> => {
    // Create a virtual server to capture tool registrations
    const collector = new ToolCollector();

    // Extract access token from context
    // Session context FMP_ACCESS_TOKEN takes priority (shallow merge puts it on top)
    // Falls back to server-level accessToken
    const accessToken = (context as ModuleLoaderContext)?.FMP_ACCESS_TOKEN
      || (context as ModuleLoaderContext)?.accessToken;

    try {
      // Execute the registration function with our collector
      // ToolCollector implements ToolRegistrar, providing the .tool() method
      // that registerFn expects from McpServer
      registerFn(collector, accessToken);

      // Return the captured tool definitions
      const tools = collector.getToolDefinitions();

      console.log(
        `[ModuleAdapter] Loaded ${tools.length} tools from module '${moduleName}'`
      );

      return tools;
    } catch (error) {
      console.error(
        `[ModuleAdapter] Failed to load module '${moduleName}':`,
        error
      );
      throw new Error(
        `Module adapter failed for '${moduleName}': ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  };
}
