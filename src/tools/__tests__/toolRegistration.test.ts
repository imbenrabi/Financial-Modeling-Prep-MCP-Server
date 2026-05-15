import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { z } from "zod";

import { FMPClient } from "../../api/FMPClient.js";
import { registerAllTools } from "../index.js";

import { registerAnalystTools } from "../analyst.js";
import { registerBulkTools } from "../bulk.js";
import { registerCalendarTools } from "../calendar.js";
import { registerChartTools } from "../chart.js";
import { registerCommodityTools } from "../commodity.js";
import { registerCompanyTools } from "../company.js";
import { registerCOTTools } from "../cot.js";
import { registerCryptoTools } from "../crypto.js";
import { registerDCFTools } from "../dcf.js";
import { registerDirectoryTools } from "../directory.js";
import { registerEarningsTranscriptTools } from "../earnings-transcript.js";
import { registerEconomicsTools } from "../economics.js";
import { registerESGTools } from "../esg.js";
import { registerForexTools } from "../forex.js";
import { registerForm13FTools } from "../form-13f.js";
import { registerFundTools } from "../fund.js";
import { registerFundraisersTools } from "../fundraisers.js";
import { registerGovernmentTradingTools } from "../government-trading.js";
import { registerIndexesTools } from "../indexes.js";
import { registerInsiderTradesTools } from "../insider-trades.js";
import { registerMarketHoursTools } from "../market-hours.js";
import { registerMarketPerformanceTools } from "../market-performance.js";
import { registerNewsTools } from "../news.js";
import { registerQuotesTools } from "../quotes.js";
import { registerSearchTools } from "../search.js";
import { registerSECFilingsTools } from "../sec-filings.js";
import { registerStatementsTools } from "../statements.js";
import { registerTechnicalIndicatorsTools } from "../technical-indicators.js";

/**
 * Tool registration tests.
 *
 * This file exercises every register*Tools function in src/tools/* (except
 * meta-tools, which is covered by DynamicToolsetManager tests). For each
 * registration it verifies:
 *
 *   - At least one tool is registered.
 *   - All registered tool names are unique within the module.
 *   - Names follow MCP conventions (non-empty, no whitespace).
 *   - Descriptions are non-empty strings.
 *   - Schemas are objects whose properties are Zod types (server.tool's
 *     "ZodRawShape" contract).
 *   - Every handler is an async function.
 *   - Every handler returns the documented happy-path shape when the
 *     underlying FMPClient resolves.
 *   - Every handler returns { isError: true } when the underlying
 *     FMPClient rejects.
 *
 * Cross-cutting assertions:
 *   - Tool names are globally unique across every module.
 *   - registerAllTools registers the same total as summing the modules.
 */

interface RegisteredTool {
  name: string;
  description: string;
  schema: unknown;
  handler: (...args: unknown[]) => Promise<unknown>;
}

interface MockServer {
  tool: ReturnType<typeof vi.fn>;
  registered: RegisteredTool[];
}

function createMockServer(): MockServer {
  const registered: RegisteredTool[] = [];
  const tool = vi.fn((name: string, description: string, schema: unknown, handler: (...args: unknown[]) => Promise<unknown>) => {
    registered.push({ name, description, schema, handler });
  });
  return { tool, registered };
}

type RegisterFn = (server: unknown, accessToken?: string) => void;

const registrations: ReadonlyArray<{ module: string; register: RegisterFn }> = [
  { module: "analyst", register: registerAnalystTools as RegisterFn },
  { module: "bulk", register: registerBulkTools as RegisterFn },
  { module: "calendar", register: registerCalendarTools as RegisterFn },
  { module: "chart", register: registerChartTools as RegisterFn },
  { module: "commodity", register: registerCommodityTools as RegisterFn },
  { module: "company", register: registerCompanyTools as RegisterFn },
  { module: "cot", register: registerCOTTools as RegisterFn },
  { module: "crypto", register: registerCryptoTools as RegisterFn },
  { module: "dcf", register: registerDCFTools as RegisterFn },
  { module: "directory", register: registerDirectoryTools as RegisterFn },
  { module: "earnings-transcript", register: registerEarningsTranscriptTools as RegisterFn },
  { module: "economics", register: registerEconomicsTools as RegisterFn },
  { module: "esg", register: registerESGTools as RegisterFn },
  { module: "forex", register: registerForexTools as RegisterFn },
  { module: "form-13f", register: registerForm13FTools as RegisterFn },
  { module: "fund", register: registerFundTools as RegisterFn },
  { module: "fundraisers", register: registerFundraisersTools as RegisterFn },
  { module: "government-trading", register: registerGovernmentTradingTools as RegisterFn },
  { module: "indexes", register: registerIndexesTools as RegisterFn },
  { module: "insider-trades", register: registerInsiderTradesTools as RegisterFn },
  { module: "market-hours", register: registerMarketHoursTools as RegisterFn },
  { module: "market-performance", register: registerMarketPerformanceTools as RegisterFn },
  { module: "news", register: registerNewsTools as RegisterFn },
  { module: "quotes", register: registerQuotesTools as RegisterFn },
  { module: "search", register: registerSearchTools as RegisterFn },
  { module: "sec-filings", register: registerSECFilingsTools as RegisterFn },
  { module: "statements", register: registerStatementsTools as RegisterFn },
  { module: "technical-indicators", register: registerTechnicalIndicatorsTools as RegisterFn },
];

function registerModule(register: RegisterFn): RegisteredTool[] {
  const server = createMockServer();
  register(server, "test-token");
  return server.registered;
}

function isZodType(value: unknown): boolean {
  return (
    value !== null &&
    typeof value === "object" &&
    "_def" in (value as Record<string, unknown>) &&
    "parse" in (value as Record<string, unknown>)
  );
}

describe("Tool registration", () => {
  // FMPClient has three protected fetch methods. Subclasses call them via
  // super.get / super.getCSV / super.post; mocking the prototype makes
  // every domain client return our controlled value without per-client setup.
  beforeEach(() => {
    vi.spyOn(FMPClient.prototype as unknown as { get: (...args: unknown[]) => Promise<unknown> }, "get").mockResolvedValue([]);
    vi.spyOn(FMPClient.prototype as unknown as { getCSV: (...args: unknown[]) => Promise<unknown> }, "getCSV").mockResolvedValue("col1,col2\n1,2");
    vi.spyOn(FMPClient.prototype as unknown as { post: (...args: unknown[]) => Promise<unknown> }, "post").mockResolvedValue({});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe.each(registrations)("$module", ({ register }) => {
    it("registers at least one tool", () => {
      const tools = registerModule(register);
      expect(tools.length).toBeGreaterThan(0);
    });

    it("tool names are unique within the module", () => {
      const tools = registerModule(register);
      const names = tools.map((t) => t.name);
      expect(new Set(names).size).toBe(names.length);
    });

    it("tool names follow MCP conventions (non-empty, no whitespace)", () => {
      const tools = registerModule(register);
      for (const t of tools) {
        expect(typeof t.name).toBe("string");
        expect(t.name.length).toBeGreaterThan(0);
        expect(t.name).not.toMatch(/\s/);
      }
    });

    it("tool descriptions are non-empty strings", () => {
      const tools = registerModule(register);
      for (const t of tools) {
        expect(typeof t.description).toBe("string");
        expect(t.description.length).toBeGreaterThan(0);
      }
    });

    it("tool schemas are ZodRawShape (object of Zod types)", () => {
      const tools = registerModule(register);
      for (const t of tools) {
        expect(typeof t.schema).toBe("object");
        expect(t.schema).not.toBeNull();
        for (const [key, value] of Object.entries(t.schema as Record<string, unknown>)) {
          expect(
            isZodType(value),
            `${t.name}.${key} must be a Zod type`
          ).toBe(true);
        }
      }
    });

    it("handlers are async functions", () => {
      const tools = registerModule(register);
      for (const t of tools) {
        expect(t.handler.constructor.name).toBe("AsyncFunction");
      }
    });

    it("handlers return MCP content shape on success", async () => {
      const tools = registerModule(register);
      for (const t of tools) {
        // Invoke with empty args; the underlying FMPClient is mocked.
        const result = (await t.handler({})) as {
          content: Array<{ type: string; text: string }>;
          isError?: boolean;
        };
        expect(result).toMatchObject({
          content: expect.arrayContaining([
            expect.objectContaining({ type: "text" }),
          ]),
        });
        expect(result.content[0]).toHaveProperty("text");
        expect(typeof result.content[0].text).toBe("string");
        expect(result.isError).not.toBe(true);
      }
    });

    it("handlers return isError on client failure", async () => {
      const tools = registerModule(register);
      const err = new Error("Simulated client failure");
      vi.spyOn(FMPClient.prototype as unknown as { get: (...args: unknown[]) => Promise<unknown> }, "get").mockRejectedValue(err);
      vi.spyOn(FMPClient.prototype as unknown as { getCSV: (...args: unknown[]) => Promise<unknown> }, "getCSV").mockRejectedValue(err);
      vi.spyOn(FMPClient.prototype as unknown as { post: (...args: unknown[]) => Promise<unknown> }, "post").mockRejectedValue(err);

      for (const t of tools) {
        const result = (await t.handler({})) as {
          content: Array<{ type: string; text: string }>;
          isError?: boolean;
        };
        expect(result.isError).toBe(true);
        expect(result.content[0].text).toContain("Error");
      }
    });
  });

  it("tool names are globally unique across every module", () => {
    const all: Array<{ name: string; module: string }> = [];
    for (const { module, register } of registrations) {
      for (const t of registerModule(register)) {
        all.push({ name: t.name, module });
      }
    }
    const byName = new Map<string, string[]>();
    for (const { name, module } of all) {
      const existing = byName.get(name) ?? [];
      existing.push(module);
      byName.set(name, existing);
    }
    const duplicates = Array.from(byName.entries())
      .filter(([, modules]) => modules.length > 1)
      .map(([name, modules]) => `${name} -> [${modules.join(", ")}]`);
    expect(duplicates).toEqual([]);
  });

  it("total tool count is at least 200", () => {
    let total = 0;
    for (const { register } of registrations) {
      total += registerModule(register).length;
    }
    expect(total).toBeGreaterThanOrEqual(200);
  });

  it("registerAllTools registers the same total as summing modules", () => {
    let modulesTotal = 0;
    for (const { register } of registrations) {
      modulesTotal += registerModule(register).length;
    }

    const allServer = createMockServer();
    registerAllTools(allServer as unknown as Parameters<typeof registerAllTools>[0], "test-token");

    expect(allServer.registered.length).toBe(modulesTotal);
  });
});