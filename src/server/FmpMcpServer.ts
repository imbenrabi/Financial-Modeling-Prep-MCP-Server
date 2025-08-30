import express from "express";
import type { Server as HttpServer } from "node:http";
import {
  createStatefulServer,
  type CreateServerArg,
} from "@smithery/sdk/server/stateful.js";
import { z } from "zod";
import { ClientStorage, type StorageOptions } from "../client-storage/index.js";
import {
  McpServerFactory,
  type SessionConfig,
} from "../mcp-server-factory/index.js";
import { computeClientId } from "../utils/computeClientId.js";
import { resolveAccessToken } from "../utils/resolveAccessToken.js";
import { areStringSetsEqual } from "../utils/validation.js";
import type { ServerMode, ToolSet } from "../types/index.js";

export interface ServerOptions {
  accessToken?: string;
  cacheOptions?: StorageOptions;
}

// Zod schema for session configuration - matches the JSON schema in McpServerFactory
const SessionConfigSchema = z.object({
  FMP_ACCESS_TOKEN: z.string().optional().describe("Financial Modeling Prep API access token"),
  FMP_TOOL_SETS: z.string().optional().describe("Comma-separated list of tool sets to load (e.g., 'search,company,quotes'). If not specified, all tools will be loaded."),
  DYNAMIC_TOOL_DISCOVERY: z.string().optional().describe("Enable dynamic toolset management. Set to 'true' to use meta-tools for runtime toolset loading. Default is 'false'.")
});

/**
 * A stateful MCP Server service that manages isolated sessions using a dedicated cache.
 * Each session gets its own McpServer instance and its own DynamicToolsetManager,
 * allowing for unique, per-session tool configurations.
 */
export class FmpMcpServer {
  private app: express.Application;
  private httpServer: HttpServer | null = null;
  private cache: ClientStorage;
  private serverOptions: ServerOptions;
  private serverFactory: McpServerFactory;

  constructor(options: ServerOptions = {}) {
    this.serverOptions = options;
    this.cache = new ClientStorage(options.cacheOptions);
    this.serverFactory = new McpServerFactory();
    this.app = express();
    this._setupRoutes();
  }

  /**
   * Starts the HTTP server on the specified port.
   * @param port - The port number to listen on
   */
  public start(port: number): void {
    if (this.httpServer) {
      console.warn("[FmpMcpServer] ⚠️  Server is already running.");
      return;
    }

    if (!this.serverOptions.accessToken) {
      console.warn(
        "[FmpMcpServer] ⚠️ Server access token is required for operations - running dummy server"
      );
    }

    try {
      this.httpServer = this.app.listen(port, () => {
        console.log(
          `[FmpMcpServer] 🚀 MCP Server started successfully on port ${port}`
        );
        console.log(
          `[FmpMcpServer] 🧠 Client storage configured with maxSize: ${this.cache["maxSize"]}, ttl: ${this.cache["ttl"]}ms`
        );
        console.log(
          `[FmpMcpServer] 🏥 Health endpoint available at http://localhost:${port}/healthcheck`
        );
        console.log(
          `[FmpMcpServer] 🔌 MCP endpoint available at http://localhost:${port}/mcp`
        );
      });

      this.httpServer.on("error", (error) => {
        console.error(`[FmpMcpServer] ❌ Server failed to start:`, error);
        this.httpServer = null;
      });
    } catch (error) {
      console.error(
        `[FmpMcpServer] ❌ Failed to start server on port ${port}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Stops the HTTP server and the cache's background cleanup tasks.
   * Performs graceful shutdown with proper cleanup.
   */
  public stop(): void {
    try {
      console.log("[FmpMcpServer] 🛑 Initiating server shutdown...");

      // Stop the cache's background cleanup tasks first
      this.cache.stop();
      console.log("[FmpMcpServer] ✅ Client storage stopped");

      // Close the HTTP server
      if (this.httpServer) {
        this.httpServer.close(() => {
          console.log(
            "[FmpMcpServer] ✅ Stateful MCP Server stopped successfully"
          );
        });
        this.httpServer = null;
      } else {
        console.log("[FmpMcpServer] ℹ️  Server was not running");
      }
    } catch (error) {
      console.error("[FmpMcpServer] ❌ Error during server shutdown:", error);
      // Ensure cleanup even if errors occur
      this.httpServer = null;
      throw error;
    }
  }

  /**
   * Sets up the Express routes, including the main stateful MCP handler.
   */
  private _setupRoutes(): void {
    try {
      // Add a helpful response for GET requests to /mcp endpoint
      this.app.get("/mcp", (req, res) => {
        res.status(200).json({
          message: "MCP Server is running",
          usage:
            "This endpoint accepts POST requests with JSON-RPC payloads for MCP protocol communication",
          example:
            "Use POST with Content-Type: application/json and Accept: application/json, text/event-stream",
          documentation:
            "See https://github.com/imbenrabi/Financial-Modeling-Prep-MCP-Server/blob/main/README.md for complete usage examples",
          healthCheck: "/healthcheck",
          ping: "/ping",
        });
      });

      // createStatefulServer provides the middleware that handles session creation and routing.
      // We pass it our core logic function for handling session resources.
      const { app: mcpApp } = createStatefulServer((params) =>
        this._getSessionResources(params),
        {
          schema: SessionConfigSchema // Pass the Zod schema for .well-known/mcp-config endpoint
        }
      );
      this.app.use(mcpApp); // Mount the stateful server middleware

      // Add ping endpoint for deployment health checks - required by Glama.ai
      this.app.get("/ping", (req, res) => {
        res.status(200).json({ status: "ok" });
      });

      // Add comprehensive health check endpoint
      this.app.get("/healthcheck", (req, res) => {
        try {
          const cacheSize = this.cache.getEntryCount();
          const uptime = process.uptime();
          const memoryUsage = process.memoryUsage();

          res.status(200).json({
            status: "ok",
            timestamp: new Date().toISOString(),
            uptime: uptime,
            sessionManagement: "stateful",
            activeClients: cacheSize,
            cache: {
              size: cacheSize,
              maxSize: this.cache.getMaxSize(),
              ttl: this.cache.getTtl(),
            },
            server: {
              type: "FmpMcpServer",
              version: process.env.npm_package_version || "unknown",
            },
            memoryUsage: {
              rss: Math.round(memoryUsage.rss / 1024 / 1024) + "MB",
              heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + "MB",
              heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + "MB",
              external: Math.round(memoryUsage.external / 1024 / 1024) + "MB",
            },
          });
        } catch (error) {
          console.error("[McpServer] ❌ Health check error:", error);
          res.status(500).json({
            status: "error",
            timestamp: new Date().toISOString(),
            error: "Health check failed",
          });
        }
      });

      console.log("[McpServer] ✅ Routes configured successfully");
    } catch (error) {
      console.error("[McpServer] ❌ Failed to setup routes:", error);
      throw error;
    }
  }

  private _getStaticToolSets(sessionConfig: SessionConfig, desiredMode: ServerMode): ToolSet[] {
    return desiredMode === 'STATIC_TOOL_SETS'
      ? this.serverFactory.determineStaticToolSets(sessionConfig)
      : [];
  }

  private _getDesiredMode(sessionConfig: SessionConfig): ServerMode {
    return this.serverFactory.determineMode(sessionConfig);
  }

  private _shouldReuse(cached: NonNullable<ReturnType<typeof this.cache.get>>, desiredMode: ServerMode, desiredStaticSets: string[]): boolean {
    return cached.mode === desiredMode && (
      desiredMode !== 'STATIC_TOOL_SETS' || areStringSetsEqual(cached.staticToolSets || [], desiredStaticSets)
    );
  }

  /**
   * The core logic for getting or creating resources keyed by clientId.
   * This function is passed to the stateful server handler and is called for each request.
   * Implements proper error handling and logging for session management.
   * Compatible with SDK's CreateServerFn<SessionConfig> signature.
   */
  private _getSessionResources(params: CreateServerArg<SessionConfig>): any {
    const { config: sessionConfig } = params;

    try {
      const resolvedToken = resolveAccessToken(
        this.serverOptions.accessToken,
        sessionConfig
      );
      const clientId = computeClientId(resolvedToken);
      const desiredMode = this._getDesiredMode(sessionConfig);
      const desiredStaticToolSets = this._getStaticToolSets(sessionConfig, desiredMode);

      // Check storage first and compare against desired config when present
      const cached = this.cache.get(clientId);
      if (cached) {
        const shouldReuse = this._shouldReuse(cached, desiredMode, desiredStaticToolSets);

        if (shouldReuse) {
          console.log(
            `[FmpMcpServer] ✅ Reusing cached resources for client: ${clientId}`
          );
          return cached.mcpServer;
        }

        console.log(
          `[FmpMcpServer] ♻️ Recreating resources for client: ${clientId} (cached mode: ${cached.mode}, desired mode: ${desiredMode})`
        );
        // Fall through to create a new instance and replace cache
      }

      // Create new server using factory's comprehensive method
      console.log(
        `[FmpMcpServer] 🔧 Creating new resources for client: ${clientId}`
      );
      const result = this.serverFactory.createServer({
        config: sessionConfig,
        serverAccessToken: this.serverOptions.accessToken,
      });

      console.log(
        `[FmpMcpServer] ✅ Client ${clientId} created successfully with mode: ${result.mode}`
      );

      const staticToolSets = this._getStaticToolSets(sessionConfig, result.mode);

      // Store the resources by clientId
      this.cache.set(clientId, {
        mcpServer: result.mcpServer,
        toolManager: result.toolManager,
        mode: result.mode,
        staticToolSets
      });

      return result.mcpServer;
    } catch (error) {
      console.error(
        `[FmpMcpServer] ❌ Failed to create resources for request:`,
        error
      );

      // Log detailed error information for debugging
      if (error instanceof Error) {
        console.error(`[FmpMcpServer] Error details: ${error.message}`);
        console.error(`[FmpMcpServer] Stack trace:`, error.stack);
      }

      // Re-throw to let the stateful server handle the error appropriately
      throw error;
    }
  }

  /**
   * Gets the current server status and statistics
   * @returns Server status information
   */
  public getStatus() {
    return {
      running: this.httpServer !== null,
      activeSessions: this.cache.getEntryCount(),
      cacheConfig: {
        maxSize: this.cache.getMaxSize(),
        ttl: this.cache.getTtl(),
      },
      serverOptions: {
        hasAccessToken: !!this.serverOptions.accessToken,
      },
    };
  }

  /**
   * Gets the Express application instance (useful for testing)
   * @returns Express application
   */
  public getApp(): express.Application {
    return this.app;
  }

  /**
   * Checks if the server is currently running
   * @returns True if server is running
   */
  public isRunning(): boolean {
    return this.httpServer !== null;
  }
}
