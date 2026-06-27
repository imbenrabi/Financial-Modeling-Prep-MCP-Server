import type { ToolSet, ToolSetDefinition } from "../types/index.js";
import { DEFAULT_PORT } from "../constants/index.js";

/**
 * Display help information for the Financial Modeling Prep MCP Server
 *
 * Shows comprehensive usage information including:
 * - Command line options and their descriptions
 * - Available tool sets with names and descriptions
 * - Usage examples for different scenarios
 * - Environment variable configuration options
 *
 * @param availableToolSets - Array of available tool sets with their definitions
 *
 * @example
 * ```typescript
 * import { getAvailableToolSets } from "../constants/index.js";
 * import { showHelp } from "./showHelp.js";
 *
 * const toolSets = getAvailableToolSets();
 * showHelp(toolSets);
 * ```
 */
export function showHelp(
  availableToolSets: Array<{ key: ToolSet; definition: ToolSetDefinition }>
): void {
  console.log(`
Financial Modeling Prep MCP Server

Usage: npm start [options]

Options:
  --port <number>                   Server port (default: ${DEFAULT_PORT})
  --fmp-token <token>               FMP API access token
  --dynamic-tool-discovery          Enable dynamic toolset management mode
  --fmp-tool-sets <toolsets>        Comma-separated list of toolsets to load in static mode
  --help, -h                        Show this help message

Server Modes:
  Dynamic Mode     Starts with 3 meta-tools, load toolsets on-demand
  Static Mode      Pre-loads specific toolsets (use --fmp-tool-sets)
  Legacy Mode      Loads all 253 tools (default)

Available Tool Sets:
`);

  availableToolSets.forEach(({ key, definition }) => {
    console.log(`  ${key.padEnd(20)} ${definition.name}`);
    console.log(`  ${" ".repeat(20)} ${definition.description}`);
    console.log();
  });

  console.log(`
Examples:
  npm start                                    # Legacy mode (all tools)
  npm start -- --port 4000                    # Custom port
  npm start -- --dynamic-tool-discovery       # Dynamic mode
  npm start -- --fmp-tool-sets search,company # Static mode with specific tools
  npm start -- --fmp-token YOUR_TOKEN         # With API token

Environment Variables:
  PORT                     Server port (default: ${DEFAULT_PORT})
  FMP_ACCESS_TOKEN         Financial Modeling Prep API access token
  DYNAMIC_TOOL_DISCOVERY   Enable dynamic toolset management mode (true/false)
  FMP_TOOL_SETS           Comma-separated list of toolsets for static mode

Configuration Precedence:
  1. CLI Arguments (highest priority)
  2. Environment Variables
  3. Session Configuration (lowest priority)

Note: Server-level configurations override ALL session-level configurations.
`);
}
