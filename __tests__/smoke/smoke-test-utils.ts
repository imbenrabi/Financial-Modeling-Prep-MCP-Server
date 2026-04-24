/**
 * Shared utilities for smoke tests
 */

import { spawn, ChildProcess } from 'child_process';
import { join } from 'path';
import axios, { AxiosResponse } from 'axios';

export interface ServerInstance {
  process: ChildProcess;
  port: number;
  close: () => Promise<void>;
}

export interface McpRequest {
  jsonrpc: string;
  id: number | string;
  method: string;
  params?: any;
}

export interface McpResponse {
  jsonrpc: string;
  id: number | string;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

export interface SessionConfig {
  DYNAMIC_TOOL_DISCOVERY?: string;
  FMP_TOOL_SETS?: string;
  FMP_ACCESS_TOKEN?: string;
}

/**
 * Start a test server instance on a random available port
 */
export async function startTestServer(options: {
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
export async function findAvailablePort(): Promise<number> {
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

// Session state management
let clientId: string | null = null;
let sessionId: string | null = null;

/**
 * Get or create a stable client ID
 */
function getClientId(): string {
  if (!clientId) {
    clientId = `smoke-test-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  }
  return clientId;
}

/**
 * Reset session state (for cleanup between tests)
 */
export function resetSession(): void {
  clientId = null;
  sessionId = null;
}

/**
 * Make an MCP HTTP request
 * Handles SSE (Server-Sent Events) response format and session management
 */
export async function makeRequest(
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

  // Build headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json, text/event-stream',
    'mcp-client-id': getClientId(),
  };

  // Add session ID if we have one (for requests after initialize)
  if (sessionId && request.method !== 'initialize') {
    headers['mcp-session-id'] = sessionId;
  }

  try {
    const response = await axios.post(url.toString(), request, {
      headers,
      responseType: 'text',
      validateStatus: () => true, // Accept all status codes
    });

    // Extract session ID from response headers on initialize
    if (request.method === 'initialize' && response.headers['mcp-session-id']) {
      sessionId = response.headers['mcp-session-id'];
    }

    // If we got a non-200 response, throw an error with details
    if (response.status !== 200) {
      console.error('Non-200 response:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        url: url.toString(),
        request,
        headers: response.headers,
      });
      throw new Error(`HTTP ${response.status}: ${response.data}`);
    }

    // Parse SSE response format
    // Expected format: "event: message\ndata: {json}\n\n"
    const responseText = response.data;

    // Extract JSON from SSE data field
    const dataMatch = responseText.match(/data: (.+)/);
    if (!dataMatch) {
      throw new Error(`Failed to parse SSE response: ${responseText}`);
    }

    return JSON.parse(dataMatch[1]);
  } catch (error) {
    console.error('Request failed:', {
      url: url.toString(),
      request,
      sessionConfig,
      clientId: getClientId(),
      sessionId,
      error: error instanceof Error ? error.message : error,
    });
    throw error;
  }
}

/**
 * Helper to initialize a session
 */
export async function initializeSession(
  port: number,
  sessionConfig?: SessionConfig
): Promise<McpResponse> {
  return makeRequest(
    port,
    {
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        clientInfo: { name: 'smoke-test', version: '1.0.0' },
        capabilities: {},
      },
    },
    sessionConfig
  );
}

/**
 * Helper to list tools
 */
export async function listTools(
  port: number,
  sessionConfig?: SessionConfig
): Promise<McpResponse> {
  return makeRequest(
    port,
    {
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/list',
      params: {},
    },
    sessionConfig
  );
}

/**
 * Helper to call a tool
 */
export async function callTool(
  port: number,
  toolName: string,
  args: Record<string, any>,
  sessionConfig?: SessionConfig
): Promise<McpResponse> {
  return makeRequest(
    port,
    {
      jsonrpc: '2.0',
      id: 3,
      method: 'tools/call',
      params: {
        name: toolName,
        arguments: args,
      },
    },
    sessionConfig
  );
}
