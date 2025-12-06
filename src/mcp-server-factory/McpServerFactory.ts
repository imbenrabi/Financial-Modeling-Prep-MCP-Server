import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { parseCommaSeparatedToolSets, validateDynamicToolDiscoveryConfig } from '../utils/validation.js';
import { DynamicToolsetManager } from '../dynamic-toolset-manager/DynamicToolsetManager.js';
import { registerMetaTools } from '../tools/meta-tools.js';
import { registerAllTools, registerToolsBySet } from '../tools/index.js';
import { getServerVersion } from '../utils/getServerVersion.js';
import { ServerModeEnforcer } from '../server-mode-enforcer/index.js';
import { registerPrompts } from "../prompts/index.js";
import type { ServerMode, ToolSet } from "../types/index.js";
/**
 * Session configuration type matching the SDK's CreateServerArg config
 */
export interface SessionConfig {
  FMP_ACCESS_TOKEN?: string;
  FMP_TOOL_SETS?: string;
  DYNAMIC_TOOL_DISCOVERY?: string;
}

/**
 * Configuration options for server creation
 * Compatible with SDK's CreateServerArg<T> where T = SessionConfig
 */
export interface McpServerOptions {
  config?: SessionConfig;
  serverAccessToken?: string;
}

/**
 * Result of server creation
 */
export interface McpServerCreationResult {
  mcpServer: McpServer;
  toolManager?: DynamicToolsetManager; // Only present in DYNAMIC_TOOL_DISCOVERY mode
  mode: ServerMode;
}

/**
 * Factory class for creating and configuring MCP servers
 * Handles server creation logic and tool registration based on mode
 */
export class McpServerFactory {
  private readonly version: string;

  constructor() {
    this.version = getServerVersion();  
  }

  /**
   * Public helper: determine mode from session config with enforcer precedence
   */
  public determineMode(sessionConfig?: SessionConfig): ServerMode {
    return this._resolveSessionMode(sessionConfig);
  }

  /**
   * Public helper: determine static tool sets considering enforcer precedence
   * Returns an empty array when none are applicable
   */
  public determineStaticToolSets(sessionConfig?: SessionConfig): ToolSet[] {
    // Prefer server-level toolsets if enforced
    try {
      const enforcer = ServerModeEnforcer.getInstance();
      if (enforcer.serverModeOverride === 'STATIC_TOOL_SETS') {
        return enforcer.toolSets;
      }
    } catch {
      // Enforcer not initialized – fall back to session config
    }

    if (sessionConfig?.FMP_TOOL_SETS && typeof sessionConfig.FMP_TOOL_SETS === 'string') {
      const parsed = parseCommaSeparatedToolSets(sessionConfig.FMP_TOOL_SETS);
      return parsed;
    }

    return [];
  }

  /**
   * Creates a new MCP server with the appropriate configuration and tools
   * Compatible with SDK's CreateServerFn<SessionConfig> signature
   * @param options - Server creation options
   * @returns Server creation result with server, manager, and mode
   */
  public createServer(options: McpServerOptions): McpServerCreationResult {
    const { config, serverAccessToken } = options;

    // Resolve access token and mode first
    const accessToken = this._resolveAccessToken(serverAccessToken, config);
    const mode = this._resolveSessionMode(config);
    
    console.log(`[McpServerFactory] Creating server in ${mode} mode`);

    // Create the base MCP server with appropriate capabilities
    const isDynamicMode = mode === 'DYNAMIC_TOOL_DISCOVERY';
    const mcpServer = this._createMcpServerInstance(isDynamicMode);

    // Register tools based on mode
    const toolManager = this._registerToolsForMode(mcpServer, mode, config, accessToken);

    // Register prompts with mode-aware context
    const staticToolSets = this._resolveStaticToolsetsFromContext(mode);
    registerPrompts(mcpServer, {
      mode,
      version: this.version,
      listChanged: isDynamicMode,
      staticToolSets,
    });

    return {
      mcpServer,
      toolManager,
      mode
    };
  }

  /**
   * Creates a new, isolated McpServer instance with proper configuration schema
   * @param isDynamicMode - Whether this server instance supports dynamic tool changes
   * @returns Configured McpServer instance
   * 
   * Note: There's a known issue in @modelcontextprotocol/sdk v1.0.0 where the main
   * capabilities.tools.listChanged field may not reflect the server configuration correctly.
   * The serverInfo.capabilities.tools.listChanged field does reflect the correct value.
   */
  private _createMcpServerInstance(isDynamicMode: boolean = false): McpServer {
    return new McpServer(
      {
        name: "Financial Modeling Prep MCP (Stateful)",
        version: this.version,
      },
      {
        capabilities: {
          tools: { 
            listChanged: isDynamicMode // Only enable dynamic tool changes in dynamic mode
          },
          // Expose prompts capability for human-friendly prompts listing
          // Keep listChanged false for now; this server does not dynamically change prompts
          prompts: {
            listChanged: false
          }
        },
      }
    );
  }

  /**
   * Resolves the access token with priority: server token > session config
   * @param serverToken - Access token from server configuration
   * @param sessionConfig - Configuration from session
   * @returns Resolved access token or undefined
   */
  private _resolveAccessToken(
    serverToken?: string, 
    sessionConfig?: SessionConfig
  ): string | undefined {
    // Precedence: server-level token overrides session config
    return serverToken || sessionConfig?.FMP_ACCESS_TOKEN;
  }

  /**
   * Determines the server mode based on server-level enforcement and session configuration
   * @param sessionConfig - Configuration from session
   * @returns Determined server mode
   */
  private _resolveSessionMode(sessionConfig?: SessionConfig): ServerMode {
    // Check for server-level mode enforcement first
    try {
      const enforcer = ServerModeEnforcer.getInstance();
      const serverModeOverride = enforcer.serverModeOverride;
      
      if (serverModeOverride) {
        console.log(`[McpServerFactory] Server-level mode enforced: ${serverModeOverride}`);
        return serverModeOverride;
      }
    } catch (error) {
      // ServerModeEnforcer not initialized, continue with session-based resolution
      console.log('[McpServerFactory] No server-level mode enforcement, using session-based mode resolution');
    }

    // Fall back to session-based mode resolution
    const isDynamic = validateDynamicToolDiscoveryConfig(sessionConfig?.DYNAMIC_TOOL_DISCOVERY);
    
    if (isDynamic === true) {
      return 'DYNAMIC_TOOL_DISCOVERY';
    }
    
    // Check if specific toolsets are provided in session config
    if (sessionConfig?.FMP_TOOL_SETS && typeof sessionConfig.FMP_TOOL_SETS === 'string') {
      // Validate the toolsets before deciding on STATIC_TOOL_SETS mode
      const validToolSets = parseCommaSeparatedToolSets(sessionConfig.FMP_TOOL_SETS);
      
      if (validToolSets.length > 0) {
        return 'STATIC_TOOL_SETS';
      } else {
        console.warn(`[McpServerFactory] No valid toolsets found in session config FMP_TOOL_SETS: "${sessionConfig.FMP_TOOL_SETS}". Falling back to ALL_TOOLS mode.`);
        return 'ALL_TOOLS';
      }
    }
    
    // Default to legacy mode (all tools)
    return 'ALL_TOOLS';
  }

  /**
   * Registers tools based on the determined server mode
   * @param mcpServer - The MCP server instance
   * @param mode - The determined server mode  
   * @param sessionConfig - Configuration from session
   * @param accessToken - Resolved access token
   * @returns Tool manager instance (if applicable) 
   */
  private _registerToolsForMode(
    mcpServer: McpServer,
    mode: ServerMode,
    sessionConfig?: SessionConfig,
    accessToken?: string
  ): DynamicToolsetManager | undefined {
    let toolManager: DynamicToolsetManager | undefined = undefined;

    switch (mode) {
      case 'DYNAMIC_TOOL_DISCOVERY':
        // For dynamic mode, create a new manager instance and register meta-tools
        // Each session gets its own isolated DynamicToolsetManager instance
        toolManager = new DynamicToolsetManager(mcpServer, accessToken);
        registerMetaTools(mcpServer, toolManager);
        console.log(`[McpServerFactory] Created isolated toolset manager and registered meta-tools for dynamic mode`);
        break;
      
      case 'STATIC_TOOL_SETS':
        // For static mode, check server-level enforcement first, then session config
        let toolSets: ToolSet[] = [];
        let source = 'session';
        
        try {
          const enforcer = ServerModeEnforcer.getInstance();
          if (enforcer.serverModeOverride === 'STATIC_TOOL_SETS') {
            toolSets = enforcer.toolSets;
            source = 'server-level';
          }
        } catch (error) {
          // ServerModeEnforcer not available, fall back to session config
        }
        
        // If no server-level toolsets, parse from session config
        if (toolSets.length === 0) {
          const toolSetsString = (sessionConfig?.FMP_TOOL_SETS as string) || '';
          toolSets = parseCommaSeparatedToolSets(toolSetsString);
        }
        
        console.log(`[McpServerFactory] Loading static toolsets from ${source}: ${toolSets.join(', ')}`);
        registerToolsBySet(mcpServer, toolSets, accessToken);
        // toolManager remains undefined for static mode
        break;

      case 'ALL_TOOLS':
      default:
        // For legacy mode, register all available tools
        console.log(`[McpServerFactory] Loading all tools (Legacy Mode)`);
        registerAllTools(mcpServer, accessToken);
        // toolManager remains undefined for legacy mode
        break;
    }

    return toolManager;
  }

  /**
   * Resolves static toolsets from server-level enforcement or session config for prompt context
   * @param mode - The determined server mode
   * @param sessionConfig - Configuration from session
   * @returns Resolved static toolsets or undefined
   */
  private _resolveStaticToolsetsFromContext(mode: ServerMode): ToolSet[] | undefined {
    if (mode !== 'STATIC_TOOL_SETS') return undefined;

    // Prefer server-level toolsets if enforced
    try {
      if (mode === 'STATIC_TOOL_SETS') {
        const enforcer = ServerModeEnforcer.getInstance();
        return enforcer.toolSets;
      }
    } catch {
      return undefined;
    }
  }
}
