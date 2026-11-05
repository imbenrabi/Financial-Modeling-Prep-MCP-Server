import type { CallToolResult } from "@modelcontextprotocol/server";
import type { z } from "zod";

/**
 * Tool sets configuration based on Financial Modeling Prep API categories
 * Each set contains related functionality that users might want to access together
 */

export type ToolSet =
  | "search"
  | "company"
  | "quotes"
  | "statements"
  | "calendar"
  | "charts"
  | "news"
  | "analyst"
  | "market-performance"
  | "insider-trades"
  | "institutional"
  | "indexes"
  | "economics"
  | "crypto"
  | "forex"
  | "commodities"
  | "etf-funds"
  | "esg"
  | "technical-indicators"
  | "senate"
  | "sec-filings"
  | "earnings"
  | "dcf"
  | "bulk";

/**
 * Tool set definition
 */
export interface ToolSetDefinition {
  name: string;
  description: string;
  decisionCriteria: string;
  modules: string[];
}

/**
 * Server mode enumeration
 */
export type ServerMode = 'DYNAMIC_TOOL_DISCOVERY' | 'STATIC_TOOL_SETS' | 'ALL_TOOLS';

/**
 * The registration surface the `registerXxxTools` functions in `src/tools` use.
 *
 * MCP SDK v2 removed `McpServer.tool()`, so the tool modules no longer take an
 * `McpServer`. Handler arguments are still inferred from the Zod shape, as the
 * SDK's own `tool()` overload did.
 */
export interface ToolRegistrar {
  tool<Shape extends z.ZodRawShape>(
    name: string,
    description: string,
    schema: Shape,
    handler: (params: z.infer<z.ZodObject<Shape>>) => Promise<CallToolResult>
  ): void;
}
