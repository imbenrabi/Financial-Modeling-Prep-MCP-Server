import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ServerModeEnforcer } from '../../src/server-mode-enforcer/ServerModeEnforcer.js';
import {
  type ServerInstance,
  type SessionConfig,
  startTestServer,
  initializeSession,
  listTools,
  resetSession,
} from './smoke-test-utils.js';

/**
 * Smoke tests for Static/Toolsets Mode (STATIC_TOOL_SETS)
 *
 * In Static Mode:
 * - Server starts with pre-configured toolsets
 * - Tools from configured toolsets are immediately available
 * - No meta-tools are present
 * - Number of tools is moderate (not 5, not 250+)
 * - Session-level toolset configuration is supported
 */
describe('Static/Toolsets Mode Smoke Tests', () => {
  let server: ServerInstance;

  beforeEach(() => {
    // Reset ServerModeEnforcer singleton before each test
    ServerModeEnforcer.reset();
  });

  afterEach(async () => {
    if (server) {
      await server.close();
    }
    ServerModeEnforcer.reset();
    resetSession();
  });

  it('should load configured toolsets from environment', async () => {
    // Start server with specific toolsets
    server = await startTestServer({
      env: { FMP_TOOL_SETS: 'search,company,quotes' },
    });

    const sessionConfig: SessionConfig = {};

    // Initialize
    await initializeSession(server.port, sessionConfig);

    // List tools
    const toolsResponse = await listTools(server.port, sessionConfig);

    const tools = toolsResponse.result.tools;
    const toolNames = tools.map((t: any) => t.name);

    // Should have tools from search, company, quotes
    expect(toolNames).toContain('searchSymbol'); // from search
    expect(toolNames).toContain('getCompanyProfile'); // from company
    expect(toolNames).toContain('getQuote'); // from quotes

    // Should NOT have meta-tools
    expect(toolNames).not.toContain('enable_toolset');
    expect(toolNames).not.toContain('disable_toolset');

    // Should NOT have tools from other toolsets
    expect(toolNames).not.toContain('getCryptocurrencyQuote'); // from crypto
    expect(toolNames).not.toContain('getForexQuote'); // from forex

    // Should have a moderate number of tools (not 5, not 250+)
    expect(tools.length).toBeGreaterThan(10);
    expect(tools.length).toBeLessThan(100);
  }, 40000);

  it('should respect server-level toolset configuration across sessions', async () => {
    // Start server with specific toolsets configured at server level
    server = await startTestServer({
      env: {
        FMP_TOOL_SETS: 'search,quotes',
      },
    });

    const sessionConfig: SessionConfig = {};

    // Initialize
    await initializeSession(server.port, sessionConfig);

    // List tools
    const toolsResponse = await listTools(server.port, sessionConfig);

    const toolNames = toolsResponse.result.tools.map((t: any) => t.name);

    // Should have search and quotes tools
    expect(toolNames).toContain('searchSymbol');
    expect(toolNames).toContain('getQuote');

    // Should NOT have company tools (not in server-configured toolsets)
    expect(toolNames).not.toContain('getCompanyProfile');

    // Reset session and verify same toolsets are available
    resetSession();

    await initializeSession(server.port, sessionConfig);
    const secondSession = await listTools(server.port, sessionConfig);

    // Second session should have the same tools (server-level config)
    expect(secondSession.result.tools.length).toBe(toolsResponse.result.tools.length);
  }, 40000);

  it('should load multiple toolsets correctly', async () => {
    // Start with many toolsets
    server = await startTestServer({
      env: { FMP_TOOL_SETS: 'search,company,quotes,statements,calendar' },
    });

    const sessionConfig: SessionConfig = {};

    await initializeSession(server.port, sessionConfig);
    const toolsResponse = await listTools(server.port, sessionConfig);

    const toolNames = toolsResponse.result.tools.map((t: any) => t.name);

    // Should have tools from all configured toolsets
    expect(toolNames).toContain('searchSymbol'); // search
    expect(toolNames).toContain('getCompanyProfile'); // company
    expect(toolNames).toContain('getQuote'); // quotes
    expect(toolNames).toContain('getIncomeStatement'); // statements
    expect(toolNames).toContain('getEarningsCalendar'); // calendar

    // Should still not have meta-tools
    expect(toolNames).not.toContain('enable_toolset');

    // Should have a significant number of tools
    expect(toolsResponse.result.tools.length).toBeGreaterThan(30);
  }, 40000);

  it('should include MCP annotations on FMP tool definitions', async () => {
    // Start server with search toolset
    server = await startTestServer({
      env: { FMP_TOOL_SETS: 'search' },
    });

    const sessionConfig: SessionConfig = { FMP_TOOL_SETS: 'search' };

    // Initialize session
    await initializeSession(server.port, sessionConfig);

    // List tools to get tool definitions
    const toolsResponse = await listTools(server.port, sessionConfig);

    expect(toolsResponse.result.tools).toBeDefined();
    expect(Array.isArray(toolsResponse.result.tools)).toBe(true);
    expect(toolsResponse.result.tools.length).toBeGreaterThan(0);

    // Find the searchSymbol tool
    const searchSymbolTool = toolsResponse.result.tools.find(
      (t: any) => t.name === 'searchSymbol'
    );

    expect(searchSymbolTool).toBeDefined();

    // Verify MCP annotations are present on the tool definition
    expect(searchSymbolTool.annotations).toBeDefined();
    expect(searchSymbolTool.annotations).toHaveProperty('readOnlyHint', true);
    expect(searchSymbolTool.annotations).toHaveProperty('openWorldHint', true);
    expect(searchSymbolTool.annotations).toHaveProperty('idempotentHint', true);
  }, 40000);
});
