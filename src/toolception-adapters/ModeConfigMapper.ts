import type { ServerMode, ToolSet, SessionConfig } from '../types/index.js';
import { TOOL_SETS } from '../constants/toolSets.js';
import { parseCommaSeparatedToolSets } from '../utils/validation.js';
import type { ServerModeEnforcer } from '../server-mode-enforcer/ServerModeEnforcer.js';
import type { ModuleLoader } from 'toolception';

/**
 * Toolception configuration options
 * Based on toolception's CreateMcpServerOptions type
 */
export interface ToolceptionConfig {
  catalog: ToolSetCatalog;
  moduleLoaders: Record<string, ModuleLoader>;
  startup: {
    mode: 'DYNAMIC' | 'STATIC';
    toolsets?: string[] | 'ALL';  // Changed from initialToolsets in toolception 0.5.1 - matches toolception's type
  };
  context: {
    accessToken?: string;
    [key: string]: any;
  };
  exposurePolicy: {
    namespaceToolsWithSetKey: boolean;
    maxActiveToolsets?: number;
    allowlist?: ToolSet[];
  };
}

/**
 * Toolception toolset catalog
 */
export interface ToolSetCatalog {
  [key: string]: {
    name: string;
    description: string;
    decisionCriteria?: string;
    modules?: string[];
  };
}

/**
 * Maps FMP's ServerMode to toolception configuration
 *
 * This class translates between FMP's three modes (DYNAMIC_TOOL_DISCOVERY,
 * STATIC_TOOL_SETS, ALL_TOOLS) and toolception's configuration format.
 */
export class ModeConfigMapper {
  /**
   * Convert FMP ServerMode to toolception configuration
   *
   * @param mode - FMP server mode
   * @param sessionConfig - Session configuration (may be empty for server-level config)
   * @param enforcer - Server mode enforcer instance
   * @param accessToken - FMP API access token
   * @param moduleLoaders - Record of module name to loader function
   * @returns Toolception configuration object
   */
  static toToolceptionConfig(
    mode: ServerMode,
    sessionConfig: SessionConfig,
    enforcer: ServerModeEnforcer,
    accessToken?: string,
    moduleLoaders?: Record<string, ModuleLoader>
  ): ToolceptionConfig {
    const catalog = this.buildCatalog();
    const loaders = moduleLoaders || {};

    switch (mode) {
      case 'DYNAMIC_TOOL_DISCOVERY':
        return {
          catalog,
          moduleLoaders: loaders,
          startup: {
            mode: 'DYNAMIC'
          },
          context: {
            accessToken
          },
          exposurePolicy: {
            namespaceToolsWithSetKey: false, // Flat namespace per user requirement
            maxActiveToolsets: undefined // No limit
          }
        };

      case 'STATIC_TOOL_SETS': {
        // Get toolsets from enforcer or session config
        const toolsets = this.resolveToolSets(enforcer, sessionConfig);

        return {
          catalog,
          moduleLoaders: loaders,
          startup: {
            mode: 'STATIC',
            toolsets: toolsets  // Changed from initialToolsets in toolception 0.5.1
          },
          context: {
            accessToken
          },
          exposurePolicy: {
            namespaceToolsWithSetKey: false,
            allowlist: toolsets
          }
        };
      }

      case 'ALL_TOOLS': {
        // Load all available toolsets using the "ALL" shorthand
        return {
          catalog,
          moduleLoaders: loaders,
          startup: {
            mode: 'STATIC',
            toolsets: 'ALL'  // Changed from initialToolsets array in toolception 0.5.1
          },
          context: {
            accessToken
          },
          exposurePolicy: {
            namespaceToolsWithSetKey: false
          }
        };
      }

      default:
        throw new Error(`Unknown server mode: ${mode}`);
    }
  }

  /**
   * Build toolception catalog from FMP TOOL_SETS
   */
  private static buildCatalog(): ToolSetCatalog {
    const catalog: ToolSetCatalog = {};

    for (const [key, definition] of Object.entries(TOOL_SETS)) {
      catalog[key] = {
        name: definition.name,
        description: definition.description,
        decisionCriteria: definition.decisionCriteria,
        modules: definition.modules
      };
    }

    return catalog;
  }

  /**
   * Resolve tool sets from enforcer or session config
   */
  private static resolveToolSets(
    enforcer: ServerModeEnforcer,
    sessionConfig: SessionConfig
  ): ToolSet[] {
    // Check if enforcer has server-level toolsets
    if (enforcer.serverModeOverride === 'STATIC_TOOL_SETS') {
      return enforcer.toolSets;
    }

    // Fall back to session config
    if (sessionConfig?.FMP_TOOL_SETS && typeof sessionConfig.FMP_TOOL_SETS === 'string') {
      return parseCommaSeparatedToolSets(sessionConfig.FMP_TOOL_SETS);
    }

    // Default to empty (will be handled by caller)
    return [];
  }
}
