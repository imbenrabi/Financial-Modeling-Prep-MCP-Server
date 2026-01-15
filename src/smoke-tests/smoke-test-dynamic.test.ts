import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ServerModeEnforcer } from '../server-mode-enforcer/ServerModeEnforcer.js';
import {
  type ServerInstance,
  type SessionConfig,
  startTestServer,
  initializeSession,
  listTools,
  callTool,
  makeRequest,
  resetSession,
} from './smoke-test-utils.js';

/**
 * Smoke tests for Dynamic Mode (DYNAMIC_TOOL_DISCOVERY)
 *
 * In Dynamic Mode:
 * - Server starts with exactly 5 meta-tools
 * - Meta-tools: enable_toolset, disable_toolset, list_toolsets, describe_toolset, list_tools
 * - Toolsets can be dynamically enabled/disabled during runtime
 * - Session-level configuration is supported
 * - API keys can be overridden per session
 */
describe('Dynamic Mode Smoke Tests', () => {
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
    resetSession(); // Reset session state between tests
  });

  it('should return exactly 5 meta-tools', async () => {
    // Start server in dynamic mode
    server = await startTestServer({
      env: { DYNAMIC_TOOL_DISCOVERY: 'true' },
    });

    // Use session config to maintain session state
    const sessionConfig: SessionConfig = { DYNAMIC_TOOL_DISCOVERY: 'true' };

    // Initialize session
    const initResponse = await initializeSession(server.port, sessionConfig);

    expect(initResponse.result).toBeDefined();
    expect(initResponse.result.capabilities.tools.listChanged).toBe(true);

    // List tools
    const toolsResponse = await listTools(server.port, sessionConfig);

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

  it('should enable toolset and load its tools', async () => {
    server = await startTestServer({
      env: { DYNAMIC_TOOL_DISCOVERY: 'true' },
    });

    const sessionConfig: SessionConfig = { DYNAMIC_TOOL_DISCOVERY: 'true' };

    // Initialize
    await initializeSession(server.port, sessionConfig);

    // List tools before enabling
    const beforeTools = await listTools(server.port, sessionConfig);
    console.log('Tools before enable:', beforeTools.result.tools.length);

    // Enable search toolset
    const enableResponse = await callTool(
      server.port,
      'enable_toolset',
      { name: 'search' },
      sessionConfig
    );

    console.log('Enable response:', JSON.stringify(enableResponse, null, 2));

    // Verify we got a response
    expect(enableResponse.result).toBeDefined();

    // List tools again
    const toolsResponse = await listTools(server.port, sessionConfig);
    console.log('Tools after enable:', toolsResponse.result.tools.length);
    console.log('Tool names:', toolsResponse.result.tools.map((t: any) => t.name));

    // Should have more than 5 tools now (meta-tools + search tools)
    expect(toolsResponse.result.tools.length).toBeGreaterThan(5);

    // Check for search tools
    const toolNames = toolsResponse.result.tools.map((t: any) => t.name);
    expect(toolNames).toContain('searchSymbol');
  }, 40000);

  it('should disable toolset (state only, tools remain)', async () => {
    server = await startTestServer({
      env: { DYNAMIC_TOOL_DISCOVERY: 'true' },
    });

    const sessionConfig: SessionConfig = { DYNAMIC_TOOL_DISCOVERY: 'true' };

    // Initialize
    await initializeSession(server.port, sessionConfig);

    // Enable search toolset
    await callTool(server.port, 'enable_toolset', { name: 'search' }, sessionConfig);

    // Verify tools were loaded
    const beforeDisable = await listTools(server.port, sessionConfig);
    expect(beforeDisable.result.tools.length).toBeGreaterThan(5);

    // Disable search toolset (note: tools remain registered, only state changes)
    const disableResponse = await callTool(
      server.port,
      'disable_toolset',
      { name: 'search' },
      sessionConfig
    );

    expect(disableResponse.result).toBeDefined();

    // List tools - tools should still be present (disable only changes state)
    const afterDisable = await listTools(server.port, sessionConfig);
    expect(afterDisable.result.tools.length).toBeGreaterThan(5);

    // Verify that the toolset is marked as disabled
    const toolsetsResponse = await callTool(
      server.port,
      'list_toolsets',
      {},
      sessionConfig
    );

    const content = JSON.parse(toolsetsResponse.result.content[0].text);
    const searchToolset = content.toolsets.find((ts: any) => ts.key === 'search');
    expect(searchToolset.active).toBe(false);
  }, 40000);

  it('should support session-level API key override', async () => {
    server = await startTestServer({
      env: {
        DYNAMIC_TOOL_DISCOVERY: 'true', // Start in dynamic mode
        FMP_ACCESS_TOKEN: 'env-token-456',
      },
    });

    // Initialize with session config containing different token
    const sessionConfig: SessionConfig = {
      DYNAMIC_TOOL_DISCOVERY: 'true',
      FMP_ACCESS_TOKEN: 'session-token-789',
    };

    const initResponse = await initializeSession(server.port, sessionConfig);

    expect(initResponse.result).toBeDefined();

    // List tools to verify session is working with overridden token
    const toolsResponse = await listTools(server.port, sessionConfig);

    // Should have 5 meta-tools in dynamic mode
    expect(toolsResponse.result.tools).toHaveLength(5);
  }, 40000);

  it('should maintain session state across requests', async () => {
    server = await startTestServer({
      env: { DYNAMIC_TOOL_DISCOVERY: 'true' },
    });

    const sessionConfig: SessionConfig = { DYNAMIC_TOOL_DISCOVERY: 'true' };

    // Initialize
    await initializeSession(server.port, sessionConfig);

    // Enable toolset
    await callTool(server.port, 'enable_toolset', { name: 'search' }, sessionConfig);

    // Make another request with same config - state should persist
    const toolsResponse = await listTools(server.port, sessionConfig);

    const toolNames = toolsResponse.result.tools.map((t: any) => t.name);
    expect(toolNames).toContain('searchSymbol');
  }, 40000);

  it('should call list_toolsets meta-tool', async () => {
    server = await startTestServer({
      env: { DYNAMIC_TOOL_DISCOVERY: 'true' },
    });

    const sessionConfig: SessionConfig = { DYNAMIC_TOOL_DISCOVERY: 'true' };

    // Initialize
    await initializeSession(server.port, sessionConfig);

    // Call list_toolsets
    const listToolsetsResponse = await callTool(
      server.port,
      'list_toolsets',
      {},
      sessionConfig
    );

    expect(listToolsetsResponse.result).toBeDefined();
    expect(listToolsetsResponse.result.content).toBeDefined();

    // Should have array of toolsets
    const content = JSON.parse(listToolsetsResponse.result.content[0].text);
    expect(Array.isArray(content.toolsets)).toBe(true);
    expect(content.toolsets.length).toBeGreaterThan(0);

    // Check that each toolset has expected structure
    const firstToolset = content.toolsets[0];
    expect(firstToolset).toHaveProperty('key');
    expect(firstToolset).toHaveProperty('active');
    // Toolsets should have basic metadata
    expect(typeof firstToolset.key).toBe('string');
    expect(typeof firstToolset.active).toBe('boolean');
  }, 40000);
});
