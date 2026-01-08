#!/usr/bin/env node

import minimist from 'minimist';
import { createMcpServer, defineEndpoint } from 'toolception';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getAvailableToolSets, DEFAULT_PORT } from './constants/index.js';
import { showHelp } from './utils/showHelp.js';
import { ServerModeEnforcer } from './server-mode-enforcer/index.js';
import { ModeConfigMapper } from './toolception-adapters/index.js';
import { MODULE_ADAPTERS } from './toolception-adapters/moduleAdapters.js';
import { getServerVersion } from './utils/getServerVersion.js';

// Parse command line arguments
const argv = minimist(process.argv.slice(2));

// Show help if requested
if (argv.help || argv.h) {
  const availableToolSets = getAvailableToolSets();
  showHelp(availableToolSets);
  process.exit(0);
}

// Define custom HTTP endpoints for health checks
const pingEndpoint = defineEndpoint({
  method: 'GET',
  path: '/ping',
  responseSchema: z.object({
    status: z.literal('ok')
  }),
  handler: async () => ({ status: 'ok' as const })
});

const healthCheckEndpoint = defineEndpoint({
  method: 'GET',
  path: '/healthcheck',
  responseSchema: z.object({
    status: z.string(),
    timestamp: z.string(),
    uptime: z.number(),
    sessionManagement: z.string(),
    server: z.object({
      type: z.string(),
      version: z.string(),
    }),
    memoryUsage: z.object({
      rss: z.string(),
      heapTotal: z.string(),
      heapUsed: z.string(),
      external: z.string(),
    }),
  }),
  handler: async () => {
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime,
      sessionManagement: 'stateful',
      server: {
        type: 'FmpMcpServer',
        version: getServerVersion(),
      },
      memoryUsage: {
        rss: Math.round(memoryUsage.rss / 1024 / 1024) + 'MB',
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + 'MB',
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + 'MB',
        external: Math.round(memoryUsage.external / 1024 / 1024) + 'MB',
      },
    };
  }
});

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
    console.warn('[FMP MCP Server] No FMP access token provided. Tools will fail without authentication.');
  }

  // Build toolception configuration
  const toolceptionConfig = ModeConfigMapper.toToolceptionConfig(
    mode,
    {}, // No session config - using server-level enforcement
    enforcer,
    fmpToken,
    MODULE_ADAPTERS
  );

  try {
    // Create and start server using toolception
    const { start, close } = await createMcpServer({
      catalog: toolceptionConfig.catalog,
      moduleLoaders: toolceptionConfig.moduleLoaders,
      startup: toolceptionConfig.startup,
      context: toolceptionConfig.context,
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
        customEndpoints: [pingEndpoint, healthCheckEndpoint]
      }
    });

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
