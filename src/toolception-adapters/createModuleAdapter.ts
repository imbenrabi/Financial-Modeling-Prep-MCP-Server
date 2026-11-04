import { ToolCollector, type ToolRegistrar } from './ToolCollector.js';
import type { McpToolDefinition, ModuleLoader } from 'toolception';

/**
 * Context object passed to module loaders by toolception
 * May contain configuration and authentication details
 */
interface ModuleLoaderContext {
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
 * where server is a ToolRegistrar. At runtime it is always a ToolCollector.
 *
 * @param server - The ToolRegistrar the function registers its tools on.
 * @param accessToken - Optional FMP API access token
 *
 * @example
 * ```typescript
 * function registerMyTools(server: ToolRegistrar, accessToken?: string): void {
 *   server.tool("myTool", "Description", schema, handler);
 * }
 * ```
 */
type RegisterToolsFunction = (server: ToolRegistrar, accessToken?: string) => void;

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
      // that registerFn expects
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
        }`, { cause: error }
      );
    }
  };
}
