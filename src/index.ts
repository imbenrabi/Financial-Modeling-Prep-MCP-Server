#!/usr/bin/env node

import minimist from 'minimist';
import { createMcpServer } from 'toolception';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import Fastify from 'fastify';
import { createHash } from 'node:crypto';
import { getAvailableToolSets, DEFAULT_PORT } from './constants/index.js';
import { showHelp } from './utils/showHelp.js';
import { ServerModeEnforcer } from './server-mode-enforcer/index.js';
import { ModeConfigMapper } from './toolception-adapters/index.js';
import { MODULE_ADAPTERS } from './toolception-adapters/moduleAdapters.js';
import { getServerVersion } from './utils/getServerVersion.js';
import { pingEndpoint, healthCheckEndpoint, serverCardEndpoint } from './endpoints/index.js';
import { registerPrompts } from './prompts/index.js';

/**
 * Generate a stable client ID from request properties when mcp-client-id header is missing.
 * This fixes issues with MCP clients (like Glama, Smithery) that don't send the header.
 *
 * Uses a hash of: IP address + User-Agent
 * This provides reasonable stability across requests from the same client.
 * Note: Accept header is intentionally excluded as it can vary between requests.
 */
function generateStableClientId(ip: string, userAgent: string): string {
  const fingerprint = `${ip}|${userAgent}`;
  const hash = createHash('sha256').update(fingerprint).digest('hex').slice(0, 16);
  return `auto-${hash}`;
}

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

    // Create custom Fastify instance with middleware to inject mcp-client-id
    // This fixes issues with MCP clients that don't send the required header
    const app = Fastify({ logger: false });

    // Add hook to inject mcp-client-id header if missing
    // This MUST run before toolception's route handlers
    app.addHook('preHandler', async (request, _reply) => {
      const existingClientId = request.headers['mcp-client-id'];

      if (!existingClientId || (typeof existingClientId === 'string' && existingClientId.trim() === '')) {
        // Generate stable client ID from request fingerprint
        const ip = request.ip || request.headers['x-forwarded-for'] || 'unknown';
        const userAgent = request.headers['user-agent'] || '';

        const stableId = generateStableClientId(
          typeof ip === 'string' ? ip : Array.isArray(ip) ? ip[0] : 'unknown',
          typeof userAgent === 'string' ? userAgent : ''
        );

        // Inject the header so toolception sees it
        request.headers['mcp-client-id'] = stableId;

        // Log for debugging - same stableId will appear for requests from same client
        console.log(`[FMP MCP Server] Auto-generated mcp-client-id: ${stableId} for client without header`);
      }
    });

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
        app, // Use our custom Fastify instance with the preHandler hook
        customEndpoints: [pingEndpoint, healthCheckEndpoint, serverCardEndpoint]
      }
    });

    // Register prompts with the MCP server
    registerPrompts(server, {
      mode,
      version,
      listChanged: mode === 'DYNAMIC_TOOL_DISCOVERY',
      staticToolSets: enforcer.toolSets
    });
    console.log('[FMP MCP Server] Prompts registered');

    console.log('[FMP MCP Server] Starting HTTP server...');
    await start();

    // When we pass http.app, toolception registers routes but doesn't call listen()
    // We need to start the server ourselves
    await app.listen({ host: '0.0.0.0', port: PORT });

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
