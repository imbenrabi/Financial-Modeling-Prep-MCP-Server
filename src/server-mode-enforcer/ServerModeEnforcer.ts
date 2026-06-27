import { validateDynamicToolDiscoveryConfig } from '../utils/validation.js';
import { getAvailableToolSets } from '../constants/index.js';
import type { ServerMode, ToolSet } from '../types/index.js';

/**
 * Simple server mode enforcer that checks environment variables and CLI arguments
 * for server-level mode overrides. Uses singleton pattern for global access.
 * 
 * Precedence: CLI arguments > Environment variables
 * 
 * @example
 * ```typescript
 * // Initialize in main()
 * ServerModeEnforcer.initialize(process.env, minimist(process.argv.slice(2)));
 * 
 * // Access from factory
 * const enforcer = ServerModeEnforcer.getInstance();
 * const override = enforcer.serverModeOverride;
 * if (override) {
 *   console.log(`Server mode enforced: ${override}`);
 * }
 * ```
 */
export class ServerModeEnforcer {
  private static instance: ServerModeEnforcer | null = null;
  
  private readonly _serverModeOverride: ServerMode | null;
  private readonly _toolSets: ToolSet[] = [];

  private constructor(
    envVars: Record<string, string | undefined>,
    cliArgs: Record<string, unknown>
  ) {
    const result = this._determineOverride(envVars, cliArgs);
    this._serverModeOverride = result.mode;
    this._toolSets = result.toolSets || [];
  }

  /**
   * Initialize the singleton instance with environment variables and CLI arguments
   */
  public static initialize(
    envVars: Record<string, string | undefined>,
    cliArgs: Record<string, unknown>
  ): void {
    if (ServerModeEnforcer.instance) {
      console.warn('[ServerModeEnforcer] Already initialized, ignoring subsequent initialization');
      return;
    }
    ServerModeEnforcer.instance = new ServerModeEnforcer(envVars, cliArgs);
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(): ServerModeEnforcer {
    if (!ServerModeEnforcer.instance) {
      throw new Error('[ServerModeEnforcer] Instance not initialized. Call ServerModeEnforcer.initialize() first.');
    }
    return ServerModeEnforcer.instance;
  }

  /**
   * Reset the singleton instance (for testing)
   */
  public static reset(): void {
    ServerModeEnforcer.instance = null;
  }

  /**
   * Gets the server mode override, or null if no override is needed
   */
  public get serverModeOverride(): ServerMode | null {
    return this._serverModeOverride;
  }

  /**
   * Gets the validated toolsets when mode is STATIC_TOOL_SETS
   */
  public get toolSets(): ToolSet[] {
    return [...this._toolSets]; // Return copy to prevent mutation
  }

  /**
   * Determines if there's a server-level mode override from CLI args or env vars
   */
  private _determineOverride(
    envVars: Record<string, string | undefined>,
    cliArgs: Record<string, unknown>
  ): { mode: ServerMode | null; toolSets?: ToolSet[] } {
    // Check CLI arguments first (highest precedence)

    // Support multiple CLI argument variations for dynamic tool discovery
    const dynamicToolDiscovery =
      cliArgs['dynamic-tool-discovery'] === true ||
      cliArgs['dynamicToolDiscovery'] === true;
    
    if (dynamicToolDiscovery) {
      return { mode: 'DYNAMIC_TOOL_DISCOVERY' };
    }
    
    // Support multiple CLI argument variations for tool sets
    const toolSetsInput =
      cliArgs["fmp-tool-sets"] || 
      cliArgs["tool-sets"] || 
      cliArgs["toolSets"];
    
    if (toolSetsInput && typeof toolSetsInput === 'string') {
      const toolSets = this._parseAndValidateToolSets(toolSetsInput);
      if (toolSets.length > 0) {
        return { mode: 'STATIC_TOOL_SETS', toolSets };
      }
    }

    // Check environment variables second
    if (envVars.DYNAMIC_TOOL_DISCOVERY && validateDynamicToolDiscoveryConfig(envVars.DYNAMIC_TOOL_DISCOVERY)) {
      return { mode: 'DYNAMIC_TOOL_DISCOVERY' };
    }
    
    if (envVars.FMP_TOOL_SETS) {
      const toolSets = this._parseAndValidateToolSets(envVars.FMP_TOOL_SETS as string);
      if (toolSets.length > 0) {
        return { mode: 'STATIC_TOOL_SETS', toolSets };
      }
    }

    // No override needed
    return { mode: null };
  }

  /**
   * Parses and validates tool sets, with error handling and process exit on invalid sets
   */
  private _parseAndValidateToolSets(input: string): ToolSet[] {
    if (!input || typeof input !== 'string') {
      return [];
    }

    // Parse tool sets (split by comma, trim whitespace)
    const toolSets = input.split(",").map((s) => s.trim()) as ToolSet[];
    
    // Get available tool sets for validation
    const availableToolSets = getAvailableToolSets().map(({ key }) => key);
    
    // Find invalid tool sets
    const invalidToolSets = toolSets.filter(
      (ts) => !availableToolSets.includes(ts)
    );
    
    // Exit process if invalid tool sets found (matches previous behavior)
    if (invalidToolSets.length > 0) {
      console.error(`Invalid tool sets: ${invalidToolSets.join(", ")}`);
      console.error(`Available tool sets: ${availableToolSets.join(", ")}`);
      process.exit(1);
    }

    return toolSets.filter(ts => ts.length > 0);
  }
}
