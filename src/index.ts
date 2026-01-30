#!/usr/bin/env node

import minimist from 'minimist';
import { createMcpServer } from 'toolception';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { getAvailableToolSets, DEFAULT_PORT } from './constants/index.js';
import { showHelp } from './utils/showHelp.js';
import { ServerModeEnforcer } from './server-mode-enforcer/index.js';
import { ModeConfigMapper } from './toolception-adapters/index.js';
import { MODULE_ADAPTERS } from './toolception-adapters/moduleAdapters.js';
import { getServerVersion } from './utils/getServerVersion.js';
import { pingEndpoint, healthCheckEndpoint, serverCardEndpoint } from './endpoints/index.js';

// Parse command line arguments
const argv = minimist(process.argv.slice(2));

// Show help if requested
if (argv.help || argv.h) {
  const availableToolSets = getAvailableToolSets();
  showHelp(availableToolSets);
  process.exit(0);
}

async function main() {
  // Initialize the ServerModeEnforcer with env vars and CLI args
  // This will also validate tool sets and exit if invalid ones are found
  ServerModeEnforcer.initialize(process.env, argv);

  const PORT = argv.port || (process.env.PORT ? parseInt(process.env.PORT) : DEFAULT_PORT);
  const fmpToken = argv['fmp-token'] || process.env.FMP_ACCESS_TOKEN;
  const version = getServerVersion();

  // Get enforcer instance to determine mode
  const enforcer = ServerModeEnforcer.getInstance();
  const mode = enforcer.serverModeOverride || 'ALL_TOOLS';

  console.log(`[FMP MCP Server] Starting v${version} in ${mode} mode...`);

  if (!fmpToken) {
    console.warn('[FMP MCP Server] No server-level FMP access token configured. Provide via: (1) FMP_ACCESS_TOKEN env var, (2) --fmp-token CLI arg, or (3) session config {"FMP_ACCESS_TOKEN":"your_token"}. Without auth, API calls will fail.');
  }

  // Build toolception configuration
  const toolceptionConfig = ModeConfigMapper.toToolceptionConfig(
    mode,
    {}, // No session config - using server-level enforcement
    enforcer,
    fmpToken,
    MODULE_ADAPTERS
  );

  console.log('[FMP MCP Server] Toolception config:', JSON.stringify({
    startup: toolceptionConfig.startup,
    exposurePolicy: toolceptionConfig.exposurePolicy,
    catalogKeys: Object.keys(toolceptionConfig.catalog),
    moduleLoaderKeys: Object.keys(toolceptionConfig.moduleLoaders)
  }, null, 2));

  try {
    console.log('[FMP MCP Server] Calling createMcpServer...');
    // Create and start server using toolception
    const { start, close, server } = await createMcpServer({
      catalog: toolceptionConfig.catalog,
      moduleLoaders: toolceptionConfig.moduleLoaders,
      startup: toolceptionConfig.startup,
      context: toolceptionConfig.context,
      sessionContext: toolceptionConfig.sessionContext,
      exposurePolicy: toolceptionConfig.exposurePolicy,
      createServer: () => {
        // Toolception will create its own MCP server instance
        // We just need to provide the factory function
        return new McpServer(
          {
            name: 'Financial Modeling Prep MCP (Stateful)',
            version
          },
          {
            capabilities: {
              tools: { listChanged: mode === 'DYNAMIC_TOOL_DISCOVERY' },
              prompts: { listChanged: false }
            }
          }
        );
      },
      http: {
        port: PORT,
        host: '0.0.0.0',
        basePath: '/',
        cors: true,
        logger: false,
        customEndpoints: [pingEndpoint, healthCheckEndpoint, serverCardEndpoint]
      }
    });

    console.log('[FMP MCP Server] Starting HTTP server...');
    await start();

    console.log(`[FMP MCP Server] Server started successfully on port ${PORT}`);
    console.log(`[FMP MCP Server] MCP endpoint: http://localhost:${PORT}/mcp`);
    console.log(`[FMP MCP Server] Mode: ${mode}`);
    console.log(`[FMP MCP Server] Token: ${fmpToken ? 'Configured' : 'Not configured'}`);

    // Graceful shutdown handler
    const handleShutdown = async (signal: string) => {
      console.log(`\nReceived ${signal}, shutting down server...`);
      try {
        await close();
        console.log('Server stopped successfully');
        process.exit(0);
      } catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
      }
    };

    process.on('SIGINT', () => handleShutdown('SIGINT')); // Catches Ctrl+C
    process.on('SIGTERM', () => handleShutdown('SIGTERM')); // Catches kill signals

  } catch (error) {
    console.error('[FMP MCP Server] Failed to start server:', error);
    if (error instanceof Error) {
      console.error('[FMP MCP Server] Error details:', error.message);
      console.error('[FMP MCP Server] Stack trace:', error.stack);
    }
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('[FMP MCP Server] Fatal error:', error);
  process.exit(1);
});
