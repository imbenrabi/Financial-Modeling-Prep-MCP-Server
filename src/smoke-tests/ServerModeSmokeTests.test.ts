import { describe, it, expect, beforeEach, afterEach, vi, beforeAll, afterAll } from 'vitest';
import { spawn, ChildProcess } from 'child_process';
import { join } from 'path';
import axios, { AxiosResponse } from 'axios';
import { ServerModeEnforcer } from '../server-mode-enforcer/ServerModeEnforcer.js';

/**
 * Test utilities for smoke tests
 */

interface ServerInstance {
  process: ChildProcess;
  port: number;
  close: () => Promise<void>;
}

interface McpRequest {
  jsonrpc: string;
  id: number | string;
  method: string;
  params?: any;
}

interface McpResponse {
  jsonrpc: string;
  id: number | string;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

interface SessionConfig {
  DYNAMIC_TOOL_DISCOVERY?: string;
  FMP_TOOL_SETS?: string;
  FMP_ACCESS_TOKEN?: string;
}

/**
 * Start a test server instance on a random available port
 */
async function startTestServer(options: {
  env?: Record<string, string>;
  args?: string[];
  timeout?: number;
}): Promise<ServerInstance> {
  const { env = {}, args = [], timeout = 30000 } = options;

  // Find available port
  const port = await findAvailablePort();

  // Build environment with defaults
  const serverEnv = {
    ...process.env,
    PORT: port.toString(),
    FMP_ACCESS_TOKEN: env.FMP_ACCESS_TOKEN || 'test-token-123',
    ...env,
  };

  // Start server process
  const serverPath = join(process.cwd(), 'dist', 'index.js');
  const serverProcess = spawn('node', [serverPath, ...args], {
    env: serverEnv,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  let stdout = '';
  let stderr = '';

  serverProcess.stdout?.on('data', (data) => {
    stdout += data.toString();
  });

  serverProcess.stderr?.on('data', (data) => {
    stderr += data.toString();
  });

  // Wait for server to be ready
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    try {
      const response = await axios.get(`http://localhost:${port}/ping`, {
        timeout: 1000,
      });
      if (response.status === 200 && response.data.status === 'ok') {
        break;
      }
    } catch (error) {
      // Server not ready yet, wait and retry
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  // Check if server started successfully
  try {
    await axios.get(`http://localhost:${port}/ping`, { timeout: 1000 });
  } catch (error) {
    serverProcess.kill();
    throw new Error(
      `Server failed to start within ${timeout}ms.\nStdout: ${stdout}\nStderr: ${stderr}`
    );
  }

  return {
    process: serverProcess,
    port,
    close: async () => {
      return new Promise((resolve) => {
        serverProcess.on('close', () => resolve());
        serverProcess.kill('SIGTERM');
        // Force kill after 5 seconds if not closed
        setTimeout(() => serverProcess.kill('SIGKILL'), 5000);
      });
    },
  };
}

/**
 * Find an available port
 */
async function findAvailablePort(): Promise<number> {
  const net = await import('net');
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on('error', reject);
    server.listen(0, () => {
      const address = server.address();
      if (address && typeof address === 'object') {
        const port = address.port;
        server.close(() => resolve(port));
      } else {
        reject(new Error('Failed to get port from server address'));
      }
    });
  });
}

/**
 * Make an MCP HTTP request
 */
async function makeRequest(
  port: number,
  request: McpRequest,
  sessionConfig?: SessionConfig
): Promise<McpResponse> {
  const url = new URL(`http://localhost:${port}/mcp`);

  // Add session config as base64 query parameter if provided
  if (sessionConfig) {
    const configBase64 = Buffer.from(JSON.stringify(sessionConfig)).toString('base64');
    url.searchParams.set('config', configBase64);
  }

  const response: AxiosResponse<McpResponse> = await axios.post(url.toString(), request, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/event-stream',
    },
  });

  return response.data;
}

/**
 * Smoke tests for server modes
 */
describe('Server Mode Smoke Tests', () => {
  beforeEach(() => {
    // Reset ServerModeEnforcer singleton before each test
    ServerModeEnforcer.reset();
  });

  describe('Dynamic Mode Smoke Tests', () => {
    let server: ServerInstance;

    afterEach(async () => {
      if (server) {
        await server.close();
      }
      ServerModeEnforcer.reset();
    });

    it('should return exactly 5 meta-tools in dynamic mode', async () => {
      server = await startTestServer({
        env: { DYNAMIC_TOOL_DISCOVERY: 'true' },
      });

      // Initialize session
      const initResponse = await makeRequest(server.port, {
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {
          protocolVersion: '2024-11-05',
          clientInfo: { name: 'test', version: '1.0.0' },
          capabilities: {},
        },
      });

      expect(initResponse.result).toBeDefined();
      expect(initResponse.result.capabilities.tools.listChanged).toBe(true);

      // List tools
      const toolsResponse = await makeRequest(server.port, {
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/list',
        params: {},
      });

      // Assert exactly 5 meta-tools
      expect(toolsResponse.result.tools).toHaveLength(5);
      const toolNames = toolsResponse.result.tools.map((t: any) => t.name);
      expect(toolNames).toEqual(
        expect.arrayContaining([
          'enable_toolset',
          'disable_toolset',
          'list_toolsets',
          'describe_toolset',
          'list_tools',
        ])
      );
    }, 40000);

    it('should enable toolset and verify tools are loaded', async () => {
      server = await startTestServer({
        env: { DYNAMIC_TOOL_DISCOVERY: 'true' },
      });

      // Initialize
      await makeRequest(server.port, {
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {
          protocolVersion: '2024-11-05',
          clientInfo: { name: 'test', version: '1.0.0' },
          capabilities: {},
        },
      });

      // Enable search toolset
      const enableResponse = await makeRequest(server.port, {
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/call',
        params: {
          name: 'enable_toolset',
          arguments: { toolset: 'search' },
        },
      });

      expect(enableResponse.result).toBeDefined();

      // List tools again
      const toolsResponse = await makeRequest(server.port, {
        jsonrpc: '2.0',
        id: 3,
        method: 'tools/list',
        params: {},
      });

      // Should have more than 5 tools now (meta-tools + search tools)
      expect(toolsResponse.result.tools.length).toBeGreaterThan(5);

      // Check for search tools
      const toolNames = toolsResponse.result.tools.map((t: any) => t.name);
      expect(toolNames).toContain('searchSymbol');
    }, 40000);

    it('should disable toolset and verify tools are removed', async () => {
      server = await startTestServer({
        env: { DYNAMIC_TOOL_DISCOVERY: 'true' },
      });

      // Initialize
      await makeRequest(server.port, {
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {
          protocolVersion: '2024-11-05',
          clientInfo: { name: 'test', version: '1.0.0' },
          capabilities: {},
        },
      });

      // Enable search toolset
      await makeRequest(server.port, {
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/call',
        params: {
          name: 'enable_toolset',
          arguments: { toolset: 'search' },
        },
      });

      // Disable search toolset
      await makeRequest(server.port, {
        jsonrpc: '2.0',
        id: 3,
        method: 'tools/call',
        params: {
          name: 'disable_toolset',
          arguments: { toolset: 'search' },
        },
      });

      // List tools
      const toolsResponse = await makeRequest(server.port, {
        jsonrpc: '2.0',
        id: 4,
        method: 'tools/list',
        params: {},
      });

      // Should be back to 5 meta-tools
      expect(toolsResponse.result.tools).toHaveLength(5);

      const toolNames = toolsResponse.result.tools.map((t: any) => t.name);
      expect(toolNames).not.toContain('searchSymbol');
    }, 40000);

    it('should support session-level API key override', async () => {
      server = await startTestServer({
        env: {
          FMP_ACCESS_TOKEN: 'env-token-456',
        },
      });

      // Initialize with session config containing different token
      const sessionConfig: SessionConfig = {
        DYNAMIC_TOOL_DISCOVERY: 'true',
        FMP_ACCESS_TOKEN: 'session-token-789',
      };

      const initResponse = await makeRequest(
        server.port,
        {
          jsonrpc: '2.0',
          id: 1,
          method: 'initialize',
          params: {
            protocolVersion: '2024-11-05',
            clientInfo: { name: 'test', version: '1.0.0' },
            capabilities: {},
          },
        },
        sessionConfig
      );

      expect(initResponse.result).toBeDefined();

      // List tools to verify session is working
      const toolsResponse = await makeRequest(
        server.port,
        {
          jsonrpc: '2.0',
          id: 2,
          method: 'tools/list',
          params: {},
        },
        sessionConfig
      );

      expect(toolsResponse.result.tools).toHaveLength(5);
    }, 40000);
  });

  describe('Static/Toolsets Mode Smoke Tests', () => {
    let server: ServerInstance;

    afterEach(async () => {
      if (server) {
        await server.close();
      }
      ServerModeEnforcer.reset();
    });

    it('should load configured toolsets in static mode', async () => {
      server = await startTestServer({
        env: { FMP_TOOL_SETS: 'search,company,quotes' },
      });

      // Initialize
      await makeRequest(server.port, {
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {
          protocolVersion: '2024-11-05',
          clientInfo: { name: 'test', version: '1.0.0' },
          capabilities: {},
        },
      });

      // List tools
      const toolsResponse = await makeRequest(server.port, {
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/list',
        params: {},
      });

      const tools = toolsResponse.result.tools;
      const toolNames = tools.map((t: any) => t.name);

      // Should have tools from search, company, quotes
      expect(toolNames).toContain('searchSymbol');
      expect(toolNames).toContain('getCompanyProfile');
      expect(toolNames).toContain('getQuote');

      // Should NOT have meta-tools or tools from other toolsets
      expect(toolNames).not.toContain('enable_toolset');
      expect(toolNames).not.toContain('getCryptocurrencyQuote');
      expect(toolNames).not.toContain('getForexQuote');

      // Should have a reasonable number of tools (not 5, not 250+)
      expect(tools.length).toBeGreaterThan(10);
      expect(tools.length).toBeLessThan(100);
    }, 40000);

    it('should support session-level toolset configuration', async () => {
      server = await startTestServer({
        env: {}, // No server-level mode enforcement
      });

      // Initialize with session config
      const sessionConfig: SessionConfig = {
        FMP_TOOL_SETS: 'search,quotes',
      };

      await makeRequest(
        server.port,
        {
          jsonrpc: '2.0',
          id: 1,
          method: 'initialize',
          params: {
            protocolVersion: '2024-11-05',
            clientInfo: { name: 'test', version: '1.0.0' },
            capabilities: {},
          },
        },
        sessionConfig
      );

      // List tools
      const toolsResponse = await makeRequest(
        server.port,
        {
          jsonrpc: '2.0',
          id: 2,
          method: 'tools/list',
          params: {},
        },
        sessionConfig
      );

      const toolNames = toolsResponse.result.tools.map((t: any) => t.name);

      // Should have search and quotes tools
      expect(toolNames).toContain('searchSymbol');
      expect(toolNames).toContain('getQuote');

      // Should NOT have company tools (not in configured toolsets)
      expect(toolNames).not.toContain('getCompanyProfile');
    }, 40000);

    it('should isolate different sessions with different toolsets', async () => {
      server = await startTestServer({
        env: {}, // No server-level enforcement
      });

      // Session 1: search only
      const session1Config: SessionConfig = {
        FMP_TOOL_SETS: 'search',
      };

      await makeRequest(
        server.port,
        {
          jsonrpc: '2.0',
          id: 1,
          method: 'initialize',
          params: {
            protocolVersion: '2024-11-05',
            clientInfo: { name: 'session1', version: '1.0.0' },
            capabilities: {},
          },
        },
        session1Config
      );

      const session1Tools = await makeRequest(
        server.port,
        {
          jsonrpc: '2.0',
          id: 2,
          method: 'tools/list',
          params: {},
        },
        session1Config
      );

      const session1ToolNames = session1Tools.result.tools.map((t: any) => t.name);

      // Session 2: quotes only
      const session2Config: SessionConfig = {
        FMP_TOOL_SETS: 'quotes',
      };

      await makeRequest(
        server.port,
        {
          jsonrpc: '2.0',
          id: 1,
          method: 'initialize',
          params: {
            protocolVersion: '2024-11-05',
            clientInfo: { name: 'session2', version: '1.0.0' },
            capabilities: {},
          },
        },
        session2Config
      );

      const session2Tools = await makeRequest(
        server.port,
        {
          jsonrpc: '2.0',
          id: 2,
          method: 'tools/list',
          params: {},
        },
        session2Config
      );

      const session2ToolNames = session2Tools.result.tools.map((t: any) => t.name);

      // Session 1 should have search tools but not quotes
      expect(session1ToolNames).toContain('searchSymbol');
      expect(session1ToolNames).not.toContain('getQuote');

      // Session 2 should have quotes tools but not search
      expect(session2ToolNames).toContain('getQuote');
      expect(session2ToolNames).not.toContain('searchSymbol');
    }, 40000);
  });

  describe('Legacy/All Tools Mode Smoke Tests', () => {
    let server: ServerInstance;

    afterEach(async () => {
      if (server) {
        await server.close();
      }
      ServerModeEnforcer.reset();
    });

    it('should load all tools in legacy mode', async () => {
      server = await startTestServer({
        env: {}, // No mode configuration = legacy mode
      });

      // Initialize
      await makeRequest(server.port, {
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {
          protocolVersion: '2024-11-05',
          clientInfo: { name: 'test', version: '1.0.0' },
          capabilities: {},
        },
      });

      // List tools
      const toolsResponse = await makeRequest(server.port, {
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/list',
        params: {},
      });

      const tools = toolsResponse.result.tools;

      // Should have 200+ tools (not exactly 250, but a large number)
      expect(tools.length).toBeGreaterThan(200);
      expect(tools.length).toBeLessThan(300);

      // Should NOT have meta-tools
      const toolNames = tools.map((t: any) => t.name);
      expect(toolNames).not.toContain('enable_toolset');
      expect(toolNames).not.toContain('disable_toolset');
    }, 40000);

    it('should have tools from multiple categories', async () => {
      server = await startTestServer({
        env: {},
      });

      // Initialize
      await makeRequest(server.port, {
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {
          protocolVersion: '2024-11-05',
          clientInfo: { name: 'test', version: '1.0.0' },
          capabilities: {},
        },
      });

      // List tools
      const toolsResponse = await makeRequest(server.port, {
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/list',
        params: {},
      });

      const toolNames = toolsResponse.result.tools.map((t: any) => t.name);

      // Sample check: verify tools from different categories exist
      const expectedCategories = [
        'searchSymbol', // search
        'getCompanyProfile', // company
        'getQuote', // quotes
        'getIncomeStatement', // statements
        'getEarningsCalendar', // calendar
        'getHistoricalPrice', // charts
        'getStockNews', // news
        'getCryptocurrencyQuote', // crypto
        'getForexQuote', // forex
        'getTreasuryRates', // economics
      ];

      for (const tool of expectedCategories) {
        expect(toolNames).toContain(tool);
      }
    }, 40000);
  });

  describe('Session Operations Tests', () => {
    let server: ServerInstance;

    afterEach(async () => {
      if (server) {
        await server.close();
      }
      ServerModeEnforcer.reset();
    });

    it('should maintain session state across requests', async () => {
      server = await startTestServer({
        env: { DYNAMIC_TOOL_DISCOVERY: 'true' },
      });

      const sessionConfig: SessionConfig = {
        DYNAMIC_TOOL_DISCOVERY: 'true',
      };

      // Initialize
      await makeRequest(
        server.port,
        {
          jsonrpc: '2.0',
          id: 1,
          method: 'initialize',
          params: {
            protocolVersion: '2024-11-05',
            clientInfo: { name: 'persistent-session', version: '1.0.0' },
            capabilities: {},
          },
        },
        sessionConfig
      );

      // Enable toolset
      await makeRequest(
        server.port,
        {
          jsonrpc: '2.0',
          id: 2,
          method: 'tools/call',
          params: {
            name: 'enable_toolset',
            arguments: { toolset: 'search' },
          },
        },
        sessionConfig
      );

      // Make another request with same config - state should persist
      const toolsResponse = await makeRequest(
        server.port,
        {
          jsonrpc: '2.0',
          id: 3,
          method: 'tools/list',
          params: {},
        },
        sessionConfig
      );

      const toolNames = toolsResponse.result.tools.map((t: any) => t.name);
      expect(toolNames).toContain('searchSymbol');
    }, 40000);

    it('should call list_toolsets meta-tool', async () => {
      server = await startTestServer({
        env: { DYNAMIC_TOOL_DISCOVERY: 'true' },
      });

      // Initialize
      await makeRequest(server.port, {
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {
          protocolVersion: '2024-11-05',
          clientInfo: { name: 'test', version: '1.0.0' },
          capabilities: {},
        },
      });

      // Call list_toolsets
      const listToolsetsResponse = await makeRequest(server.port, {
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/call',
        params: {
          name: 'list_toolsets',
          arguments: {},
        },
      });

      expect(listToolsetsResponse.result).toBeDefined();
      expect(listToolsetsResponse.result.content).toBeDefined();

      // Should have array of toolsets
      const content = JSON.parse(listToolsetsResponse.result.content[0].text);
      expect(Array.isArray(content.toolsets)).toBe(true);
      expect(content.toolsets.length).toBeGreaterThan(0);

      // Check that each toolset has expected structure
      const firstToolset = content.toolsets[0];
      expect(firstToolset).toHaveProperty('key');
      expect(firstToolset).toHaveProperty('name');
      expect(firstToolset).toHaveProperty('description');
    }, 40000);
  });
});
