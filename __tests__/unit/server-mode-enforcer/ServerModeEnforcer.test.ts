import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ServerModeEnforcer } from "../../../src/server-mode-enforcer/ServerModeEnforcer.js";

// Mock the validation utilities
vi.mock("../../../src/utils/validation.js", () => ({
  validateDynamicToolDiscoveryConfig: vi.fn(),
}));

// Mock the constants
vi.mock("../../../src/constants/index.js", () => ({
  getAvailableToolSets: vi.fn(),
}));

// Import mocked functions
import { validateDynamicToolDiscoveryConfig } from "../../../src/utils/validation.js";
import { getAvailableToolSets } from "../../../src/constants/index.js";

describe("ServerModeEnforcer", () => {
  let mockValidateDynamicToolDiscoveryConfig: ReturnType<typeof vi.mocked<typeof validateDynamicToolDiscoveryConfig>>;
  let mockGetAvailableToolSets: ReturnType<typeof vi.mocked<typeof getAvailableToolSets>>;
  let mockProcessExit: any;
  let mockConsoleError: ReturnType<typeof vi.spyOn>;
  let mockConsoleWarn: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Reset singleton before each test
    ServerModeEnforcer.reset();
    
    mockValidateDynamicToolDiscoveryConfig = vi.mocked(validateDynamicToolDiscoveryConfig);
    mockGetAvailableToolSets = vi.mocked(getAvailableToolSets);
    mockProcessExit = vi.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit called");
    });
    mockConsoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    mockConsoleWarn = vi.spyOn(console, "warn").mockImplementation(() => {});
    
    // Setup default mock implementations
    mockValidateDynamicToolDiscoveryConfig.mockImplementation((value: unknown) => value === "true");
    mockGetAvailableToolSets.mockReturnValue([
      { key: "search", definition: {} as any },
      { key: "company", definition: {} as any },
      { key: "quotes", definition: {} as any },
    ]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    ServerModeEnforcer.reset();
  });

  describe("Singleton pattern", () => {
    it("should throw error when getInstance called before initialize", () => {
      expect(() => ServerModeEnforcer.getInstance()).toThrow("Instance not initialized");
    });

    it("should return same instance after initialization", () => {
      ServerModeEnforcer.initialize({}, {});
      const instance1 = ServerModeEnforcer.getInstance();
      const instance2 = ServerModeEnforcer.getInstance();
      expect(instance1).toBe(instance2);
    });

    it("should warn when initialized twice", () => {
      ServerModeEnforcer.initialize({}, {});
      ServerModeEnforcer.initialize({}, { different: "args" });
      
      expect(mockConsoleWarn).toHaveBeenCalledWith(
        "[ServerModeEnforcer] Already initialized, ignoring subsequent initialization"
      );
    });

    it("should reset singleton properly", () => {
      ServerModeEnforcer.initialize({}, {});
      ServerModeEnforcer.reset();
      expect(() => ServerModeEnforcer.getInstance()).toThrow("Instance not initialized");
    });
  });

  describe("Mode determination and toolsets", () => {
    it("should return null when no overrides are configured", () => {
      ServerModeEnforcer.initialize({}, {});
      const enforcer = ServerModeEnforcer.getInstance();
      expect(enforcer.serverModeOverride).toBe(null);
      expect(enforcer.toolSets).toEqual([]);
    });

    it("should return DYNAMIC_TOOL_DISCOVERY for CLI dynamic-tool-discovery flag", () => {
      ServerModeEnforcer.initialize({}, { "dynamic-tool-discovery": true });
      const enforcer = ServerModeEnforcer.getInstance();
      expect(enforcer.serverModeOverride).toBe("DYNAMIC_TOOL_DISCOVERY");
      expect(enforcer.toolSets).toEqual([]);
    });

    it("should return STATIC_TOOL_SETS and store toolsets for CLI tool-sets", () => {
      ServerModeEnforcer.initialize({}, { "tool-sets": "search,company" });
      const enforcer = ServerModeEnforcer.getInstance();
      expect(enforcer.serverModeOverride).toBe("STATIC_TOOL_SETS");
      expect(enforcer.toolSets).toEqual(["search", "company"]);
    });

    it("should return copy of toolsets to prevent mutation", () => {
      ServerModeEnforcer.initialize({}, { "tool-sets": "search,company" });
      const enforcer = ServerModeEnforcer.getInstance();
      const toolSets1 = enforcer.toolSets;
      const toolSets2 = enforcer.toolSets;
      
      expect(toolSets1).toEqual(["search", "company"]);
      expect(toolSets1).not.toBe(toolSets2); // Different array instances
      
      toolSets1.push("quotes" as any);
      expect(enforcer.toolSets).toEqual(["search", "company"]); // Original unchanged
    });

    it("should return DYNAMIC_TOOL_DISCOVERY for env var", () => {
      mockValidateDynamicToolDiscoveryConfig.mockReturnValue(true);
      
      ServerModeEnforcer.initialize({ DYNAMIC_TOOL_DISCOVERY: "true" }, {});
      const enforcer = ServerModeEnforcer.getInstance();
      expect(enforcer.serverModeOverride).toBe("DYNAMIC_TOOL_DISCOVERY");
      expect(enforcer.toolSets).toEqual([]);
    });

    it("should return STATIC_TOOL_SETS and store toolsets for env var", () => {
      ServerModeEnforcer.initialize({ FMP_TOOL_SETS: "quotes" }, {});
      const enforcer = ServerModeEnforcer.getInstance();
      expect(enforcer.serverModeOverride).toBe("STATIC_TOOL_SETS");
      expect(enforcer.toolSets).toEqual(["quotes"]);
    });
  });

  describe("Precedence rules", () => {
    it("should prioritize CLI args over env vars", () => {
      mockValidateDynamicToolDiscoveryConfig.mockReturnValue(true);

      ServerModeEnforcer.initialize(
        { DYNAMIC_TOOL_DISCOVERY: "true" },
        { "tool-sets": "search" }
      );
      
      const enforcer = ServerModeEnforcer.getInstance();
      expect(enforcer.serverModeOverride).toBe("STATIC_TOOL_SETS");
      expect(enforcer.toolSets).toEqual(["search"]);
    });

    it("should prioritize CLI dynamic flag over other CLI tool sets", () => {
      ServerModeEnforcer.initialize(
        {},
        { 
          "dynamic-tool-discovery": true,
          "tool-sets": "company"
        }
      );

      const enforcer = ServerModeEnforcer.getInstance();
      expect(enforcer.serverModeOverride).toBe("DYNAMIC_TOOL_DISCOVERY");
      expect(enforcer.toolSets).toEqual([]);
    });
  });

  describe("Tool Set Validation", () => {
    it("should exit process when invalid tool sets are provided via CLI", () => {
      mockGetAvailableToolSets.mockReturnValue([
        { key: "search", definition: {} as any },
        { key: "company", definition: {} as any },
      ]);

      expect(() => {
        ServerModeEnforcer.initialize({}, { "tool-sets": "search,invalid,company" });
      }).toThrow("process.exit called");

      expect(mockConsoleError).toHaveBeenCalledWith("Invalid tool sets: invalid");
      expect(mockConsoleError).toHaveBeenCalledWith("Available tool sets: search, company");
      expect(mockProcessExit).toHaveBeenCalledWith(1);
    });

    it("should handle valid tool sets without error", () => {
      mockGetAvailableToolSets.mockReturnValue([
        { key: "search", definition: {} as any },
        { key: "company", definition: {} as any },
        { key: "quotes", definition: {} as any },
      ]);

      expect(() => {
        ServerModeEnforcer.initialize({}, { "tool-sets": "search,company" });
        const enforcer = ServerModeEnforcer.getInstance();
        expect(enforcer.serverModeOverride).toBe("STATIC_TOOL_SETS");
        expect(enforcer.toolSets).toEqual(["search", "company"]);
      }).not.toThrow();

      expect(mockProcessExit).not.toHaveBeenCalled();
      expect(mockConsoleError).not.toHaveBeenCalled();
    });
  });

  describe("Edge cases", () => {
    it("should return null for empty tool sets", () => {
      ServerModeEnforcer.initialize({ FMP_TOOL_SETS: "" }, {});
      const enforcer = ServerModeEnforcer.getInstance();
      expect(enforcer.serverModeOverride).toBe(null);
      expect(enforcer.toolSets).toEqual([]);
    });

    it("should return null for invalid dynamic tool discovery", () => {
      mockValidateDynamicToolDiscoveryConfig.mockReturnValue(false);
      
      ServerModeEnforcer.initialize({ DYNAMIC_TOOL_DISCOVERY: "invalid" }, {});
      const enforcer = ServerModeEnforcer.getInstance();
      expect(enforcer.serverModeOverride).toBe(null);
      expect(enforcer.toolSets).toEqual([]);
    });

    it("should return null for non-boolean CLI dynamic flag", () => {
      ServerModeEnforcer.initialize({}, { "dynamic-tool-discovery": "not-boolean" });
      const enforcer = ServerModeEnforcer.getInstance();
      expect(enforcer.serverModeOverride).toBe(null);
      expect(enforcer.toolSets).toEqual([]);
    });
  });
});
