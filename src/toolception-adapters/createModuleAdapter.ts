import { ToolCollector, type McpToolDefinition } from './ToolCollector.js';
import type { ModuleLoader } from 'toolception';

/**
 * Type for existing FMP tool registration functions
 * These functions follow the pattern: registerXxxTools(server, accessToken?)
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
    // Context is passed by toolception and may contain our accessToken
    const accessToken = (context as any)?.accessToken;

    try {
      // Execute the registration function with our collector
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
