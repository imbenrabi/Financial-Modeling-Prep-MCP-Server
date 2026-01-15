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
 * Smoke tests for Legacy/All Tools Mode (ALL_TOOLS)
 *
 * In Legacy Mode:
 * - Server starts with ALL 250+ tools loaded
 * - No meta-tools are present
 * - Tools from all categories are available
 * - This is the default mode when no mode is configured
 */
describe('Legacy/All Tools Mode Smoke Tests', () => {
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

  it('should load all tools by default', async () => {
    // Start server with no mode configuration = legacy mode
    server = await startTestServer({
      env: {},
    });

    const sessionConfig: SessionConfig = {};

    // Initialize
    await initializeSession(server.port, sessionConfig);

    // List tools
    const toolsResponse = await listTools(server.port, sessionConfig);

    const tools = toolsResponse.result.tools;

    // Should have 200+ tools (the full catalog)
    expect(tools.length).toBeGreaterThan(200);
    expect(tools.length).toBeLessThan(300);

    // Should NOT have meta-tools
    const toolNames = tools.map((t: any) => t.name);
    expect(toolNames).not.toContain('enable_toolset');
    expect(toolNames).not.toContain('disable_toolset');
    expect(toolNames).not.toContain('list_toolsets');
  }, 40000);

  it('should have tools from multiple categories', async () => {
    server = await startTestServer({
      env: {},
    });

    const sessionConfig: SessionConfig = {};

    // Initialize
    await initializeSession(server.port, sessionConfig);

    // List tools
    const toolsResponse = await listTools(server.port, sessionConfig);

    const toolNames = toolsResponse.result.tools.map((t: any) => t.name);

    // Sample check: verify tools from different categories exist
    const expectedCategories = [
      'searchSymbol', // search
      'getCompanyProfile', // company
      'getQuote', // quotes
      'getIncomeStatement', // statements
      'getEarningsCalendar', // calendar
      'getLightChart', // charts
      'getStockNews', // news
      'getCryptocurrencyQuote', // crypto
      'getForexQuote', // forex
      'getTreasuryRates', // economics
    ];

    for (const tool of expectedCategories) {
      expect(toolNames).toContain(tool);
    }
  }, 40000);

  it('should maintain all tools across multiple requests', async () => {
    server = await startTestServer({
      env: {},
    });

    const sessionConfig: SessionConfig = {};

    // Initialize
    await initializeSession(server.port, sessionConfig);

    // List tools first time
    const toolsResponse1 = await listTools(server.port, sessionConfig);
    const toolCount1 = toolsResponse1.result.tools.length;

    // List tools second time
    const toolsResponse2 = await listTools(server.port, sessionConfig);
    const toolCount2 = toolsResponse2.result.tools.length;

    // Should have the same number of tools
    expect(toolCount1).toBe(toolCount2);
    expect(toolCount1).toBeGreaterThan(200);
  }, 40000);

  it('should not have meta-tools in legacy mode', async () => {
    server = await startTestServer({
      env: {},
    });

    const sessionConfig: SessionConfig = {};

    await initializeSession(server.port, sessionConfig);
    const toolsResponse = await listTools(server.port, sessionConfig);

    const toolNames = toolsResponse.result.tools.map((t: any) => t.name);

    // Explicitly check that no meta-tools are present
    const metaTools = [
      'enable_toolset',
      'disable_toolset',
      'list_toolsets',
      'describe_toolset',
      'list_tools',
    ];

    for (const metaTool of metaTools) {
      expect(toolNames).not.toContain(metaTool);
    }
  }, 40000);
});
