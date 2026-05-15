import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { McpServerFactory, type McpServerOptions } from "./McpServerFactory.js";
import * as validation from "../utils/validation.js";
import { ServerModeEnforcer } from "../server-mode-enforcer/index.js";


vi.mock("../prompts/index.js", () => ({
  registerPrompts: vi.fn(),
}));

vi.mock("@modelcontextprotocol/sdk/server/mcp.js", () => ({
  McpServer: vi.fn().mockImplementation((serverInfo, options) => ({
    name: serverInfo.name,
    version: serverInfo.version,
    capabilities: options?.capabilities,
  })),
}));

vi.mock("../utils/validation.js", () => ({
  parseCommaSeparatedToolSets: vi.fn(),
  validateDynamicToolDiscoveryConfig: vi.fn(),
  validateAndSanitizeToolsetName: vi.fn(),
  validateToolSets: vi.fn(),
  validateToolsetModules: vi.fn(),
}));

vi.mock("../dynamic-toolset-manager/DynamicToolsetManager.js", () => ({
  DynamicToolsetManager: vi.fn().mockImplementation(() => ({
    id: "mock-tool-manager",
    getAvailableToolsets: vi.fn().mockReturnValue(["search", "company", "quotes"]),
    getActiveToolsets: vi.fn().mockReturnValue([]),
  })),
}));

vi.mock("../tools/meta-tools.js", () => ({
  registerMetaTools: vi.fn(),
}));

vi.mock("../tools/index.js", () => ({
  registerAllTools: vi.fn(),
  registerToolsBySet: vi.fn(),
}));

vi.mock("../utils/getServerVersion.js", () => ({
  getServerVersion: vi.fn().mockReturnValue("1.0.0"),
}));

vi.mock("../server-mode-enforcer/index.js", () => ({
  ServerModeEnforcer: {
    getInstance: vi.fn(),
  },
}));

// Mock console methods to avoid noise in tests
const mockConsoleLog = vi.fn();
const mockConsoleWarn = vi.fn();
const mockConsoleError = vi.fn();

// Get typed references to the mocked functions
const mockParseCommaSeparatedToolSets = vi.mocked(validation.parseCommaSeparatedToolSets);
const mockValidateDynamicToolDiscoveryConfig = vi.mocked(validation.validateDynamicToolDiscoveryConfig);
const mockServerModeEnforcer = vi.mocked(ServerModeEnforcer);

describe("McpServerFactory", () => {
  let factory: McpServerFactory;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "log").mockImplementation(mockConsoleLog);
    vi.spyOn(console, "warn").mockImplementation(mockConsoleWarn);
    vi.spyOn(console, "error").mockImplementation(mockConsoleError);

    // Set up default ServerModeEnforcer mock behavior (not initialized)
    mockServerModeEnforcer.getInstance.mockImplementation(() => {
      throw new Error("Instance not initialized");
    });

    factory = new McpServerFactory();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Constructor", () => {
    it("should create factory", () => {
      expect(factory).toBeInstanceOf(McpServerFactory);
    });
  });

  describe("createServer", () => {
    it("should create server in ALL_TOOLS mode by default", () => {
      const options: McpServerOptions = {
        config: {},
      };

      const result = factory.createServer(options);

      expect(result.mode).toBe("ALL_TOOLS");
      expect(result.mcpServer).toBeDefined();
      expect(result.toolManager).toBeUndefined();
      expect(mockConsoleLog).toHaveBeenCalledWith(
        "[McpServerFactory] Creating server in ALL_TOOLS mode"
      );
    });

    it("should create server in DYNAMIC_TOOL_DISCOVERY mode when configured", () => {
      mockValidateDynamicToolDiscoveryConfig.mockReturnValue(true);

      const options: McpServerOptions = {
        config: {
          DYNAMIC_TOOL_DISCOVERY: "true",
        },
      };

      const result = factory.createServer(options);

      expect(result.mode).toBe("DYNAMIC_TOOL_DISCOVERY");
      expect(result.mcpServer).toBeDefined();
      expect(result.toolManager).toBeDefined();
      expect(mockConsoleLog).toHaveBeenCalledWith(
        "[McpServerFactory] Creating server in DYNAMIC_TOOL_DISCOVERY mode"
      );
    });

    it("should create server in STATIC_TOOL_SETS mode when FMP_TOOL_SETS is provided", () => {
      mockParseCommaSeparatedToolSets.mockReturnValue(["search", "company"]);

      const options: McpServerOptions = {
        config: {
          FMP_TOOL_SETS: "search,company",
        },
      };

      const result = factory.createServer(options);

      expect(result.mode).toBe("STATIC_TOOL_SETS");
      expect(result.mcpServer).toBeDefined();
      expect(result.toolManager).toBeUndefined();
      expect(mockConsoleLog).toHaveBeenCalledWith(
        "[McpServerFactory] Creating server in STATIC_TOOL_SETS mode"
      );
    });

    it("should resolve access token from server configuration", () => {
      const options: McpServerOptions = {
        config: {},
        serverAccessToken: "server-token",
      };

      const result = factory.createServer(options);

      expect(result.mcpServer).toBeDefined();
    });

    it("should resolve access token from session config with priority", () => {
      const options: McpServerOptions = {
        config: {
          FMP_ACCESS_TOKEN: "session-token",
        },
        serverAccessToken: undefined,
      };

      const result = factory.createServer(options);

      expect(result.mcpServer).toBeDefined();
    });

    it("should handle empty tool sets in STATIC_TOOL_SETS mode and fallback to ALL_TOOLS", () => {
      mockParseCommaSeparatedToolSets.mockReturnValue([]);

      const options: McpServerOptions = {
        config: {
          FMP_TOOL_SETS: "",
        },
      };

      const result = factory.createServer(options);

      expect(result.mode).toBe("ALL_TOOLS");
      expect(result.mcpServer).toBeDefined();
    });
  });

  describe("Server Mode Resolution", () => {
    it("should prioritize DYNAMIC_TOOL_DISCOVERY over STATIC_TOOL_SETS", () => {
      mockValidateDynamicToolDiscoveryConfig.mockReturnValue(true);
      mockParseCommaSeparatedToolSets.mockReturnValue(["search", "company"]);

      const options: McpServerOptions = {
        config: {
          DYNAMIC_TOOL_DISCOVERY: "true",
          FMP_TOOL_SETS: "search,company",
        },
      };

      const result = factory.createServer(options);

      expect(result.mode).toBe("DYNAMIC_TOOL_DISCOVERY");
    });

    it("should handle invalid DYNAMIC_TOOL_DISCOVERY config", () => {
      mockValidateDynamicToolDiscoveryConfig.mockReturnValue(false);

      const options: McpServerOptions = {
        config: {
          DYNAMIC_TOOL_DISCOVERY: "invalid",
        },
      };

      const result = factory.createServer(options);

      expect(result.mode).toBe("ALL_TOOLS");
    });

    it("should handle empty FMP_TOOL_SETS", () => {
      mockParseCommaSeparatedToolSets.mockReturnValue([]);

      const options: McpServerOptions = {
        config: {
          FMP_TOOL_SETS: "",
        },
      };

      const result = factory.createServer(options);

      expect(result.mode).toBe("ALL_TOOLS");
    });

    it("should fallback to ALL_TOOLS when FMP_TOOL_SETS contains only invalid toolsets", () => {
      // Mock parseCommaSeparatedToolSets to return empty array (indicating all toolsets were invalid)
      mockParseCommaSeparatedToolSets.mockReturnValue([]);

      const options: McpServerOptions = {
        config: {
          FMP_TOOL_SETS: "invalid,nonexistent,badtool",
        },
      };

      const result = factory.createServer(options);

      expect(result.mode).toBe("ALL_TOOLS");
      expect(mockParseCommaSeparatedToolSets).toHaveBeenCalledWith("invalid,nonexistent,badtool");
      expect(mockConsoleWarn).toHaveBeenCalledWith(
        '[McpServerFactory] No valid toolsets found in session config FMP_TOOL_SETS: "invalid,nonexistent,badtool". Falling back to ALL_TOOLS mode.'
      );
    });
  });

  describe("Server-Level Mode Enforcement", () => {
    it("should prioritize server-level DYNAMIC_TOOL_DISCOVERY enforcement over session config", () => {
      // Mock ServerModeEnforcer to return server-level enforcement
      mockServerModeEnforcer.getInstance.mockReturnValue({
        serverModeOverride: "DYNAMIC_TOOL_DISCOVERY",
        toolSets: [],
      } as any);

      const options: McpServerOptions = {
        config: {
          FMP_TOOL_SETS: "search,company", // Session wants STATIC_TOOL_SETS
        },
      };

      const result = factory.createServer(options);

      expect(result.mode).toBe("DYNAMIC_TOOL_DISCOVERY");
      expect(mockConsoleLog).toHaveBeenCalledWith(
        "[McpServerFactory] Server-level mode enforced: DYNAMIC_TOOL_DISCOVERY"
      );
    });

    it("should prioritize server-level STATIC_TOOL_SETS enforcement over session config", () => {
      // Mock ServerModeEnforcer to return server-level enforcement with toolsets
      mockServerModeEnforcer.getInstance.mockReturnValue({
        serverModeOverride: "STATIC_TOOL_SETS",
        toolSets: ["search", "quotes"],
      } as any);

      mockValidateDynamicToolDiscoveryConfig.mockReturnValue(true);

      const options: McpServerOptions = {
        config: {
          DYNAMIC_TOOL_DISCOVERY: "true", // Session wants DYNAMIC_TOOL_DISCOVERY
        },
      };

      const result = factory.createServer(options);

      expect(result.mode).toBe("STATIC_TOOL_SETS");
      expect(mockConsoleLog).toHaveBeenCalledWith(
        "[McpServerFactory] Server-level mode enforced: STATIC_TOOL_SETS"
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        "[McpServerFactory] Loading static toolsets from server-level: search, quotes"
      );
    });

    it("should fall back to session-based resolution when ServerModeEnforcer not initialized", () => {
      // Default mock behavior: throws "Instance not initialized"
      mockValidateDynamicToolDiscoveryConfig.mockReturnValue(true);

      const options: McpServerOptions = {
        config: {
          DYNAMIC_TOOL_DISCOVERY: "true",
        },
      };

      const result = factory.createServer(options);

      expect(result.mode).toBe("DYNAMIC_TOOL_DISCOVERY");
      expect(mockConsoleLog).toHaveBeenCalledWith(
        "[McpServerFactory] No server-level mode enforcement, using session-based mode resolution"
      );
    });

    it("should use server-level toolsets for STATIC_TOOL_SETS mode", () => {
      // Mock ServerModeEnforcer to return server-level enforcement with toolsets
      mockServerModeEnforcer.getInstance.mockReturnValue({
        serverModeOverride: "STATIC_TOOL_SETS",
        toolSets: ["company", "search"],
      } as any);

      const options: McpServerOptions = {
        config: {},
      };

      const result = factory.createServer(options);

      expect(result.mode).toBe("STATIC_TOOL_SETS");
      expect(mockConsoleLog).toHaveBeenCalledWith(
        "[McpServerFactory] Loading static toolsets from server-level: company, search"
      );
    });

    it("should handle server-level enforcement with no mode override", () => {
      // Mock ServerModeEnforcer with null override (no enforcement)
      mockServerModeEnforcer.getInstance.mockReturnValue({
        serverModeOverride: null,
        toolSets: [],
      } as any);

      const options: McpServerOptions = {
        config: {},
      };

      const result = factory.createServer(options);

      expect(result.mode).toBe("ALL_TOOLS");
      // Should not log server-level enforcement message
      expect(mockConsoleLog).not.toHaveBeenCalledWith(
        expect.stringContaining("Server-level mode enforced")
      );
    });
  });

  describe("Error Handling", () => {
    it("should handle missing config gracefully", () => {
      const options: McpServerOptions = {
      };

      const result = factory.createServer(options);

      expect(result.mode).toBe("ALL_TOOLS");
      expect(result.mcpServer).toBeDefined();
    });

    it("should handle undefined access token", () => {
      const options: McpServerOptions = {
        config: {},
      };

      const result = factory.createServer(options);

      expect(result.mcpServer).toBeDefined();
    });

    it("should handle empty session config", () => {
      const options: McpServerOptions = {
        config: {},
      };

      const result = factory.createServer(options);

      expect(result.mode).toBe("ALL_TOOLS");
      expect(result.mcpServer).toBeDefined();
    });
  });

  describe("Integration Scenarios", () => {
    it("should handle complete DYNAMIC_TOOL_DISCOVERY scenario", () => {
      mockValidateDynamicToolDiscoveryConfig.mockReturnValue(true);

      const options: McpServerOptions = {
        config: {
          DYNAMIC_TOOL_DISCOVERY: "true",
          FMP_ACCESS_TOKEN: "dynamic-token",
        },
      };

      const result = factory.createServer(options);

      expect(result.mode).toBe("DYNAMIC_TOOL_DISCOVERY");
      expect(result.mcpServer).toBeDefined();
      expect(result.toolManager).toBeDefined();
    });

    it("should handle complete STATIC_TOOL_SETS scenario", () => {
      mockParseCommaSeparatedToolSets.mockReturnValue(["search", "company", "quotes"]);

      const options: McpServerOptions = {
        config: {
          FMP_TOOL_SETS: "search,company,quotes",
          FMP_ACCESS_TOKEN: "static-token",
        },
      };

      const result = factory.createServer(options);

      expect(result.mode).toBe("STATIC_TOOL_SETS");
      expect(result.mcpServer).toBeDefined();
      expect(result.toolManager).toBeUndefined();
    });

    it("should handle complete ALL_TOOLS scenario", () => {
      const options: McpServerOptions = {
        config: {
          FMP_ACCESS_TOKEN: "all-tools-token",
        },
      };

      const result = factory.createServer(options);

      expect(result.mode).toBe("ALL_TOOLS");
      expect(result.mcpServer).toBeDefined();
      expect(result.toolManager).toBeUndefined();
    });
  });
});
