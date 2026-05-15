import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerSearchTools } from "./search.js";
import { registerDirectoryTools } from "./directory.js";
import { registerAnalystTools } from "./analyst.js";
import { registerCalendarTools } from "./calendar.js";
import { registerChartTools } from "./chart.js";
import { registerCompanyTools } from "./company.js";
import { registerCOTTools } from "./cot.js";
import { registerESGTools } from "./esg.js";
import { registerEconomicsTools } from "./economics.js";
import { registerDCFTools } from "./dcf.js";
import { registerFundTools } from "./fund.js";
import { registerCommodityTools } from "./commodity.js";
import { registerFundraisersTools } from "./fundraisers.js";
import { registerCryptoTools } from "./crypto.js";
import { registerForexTools } from "./forex.js";
import { registerStatementsTools } from "./statements.js";
import { registerForm13FTools } from "./form-13f.js";
import { registerIndexesTools } from "./indexes.js";
import { registerInsiderTradesTools } from "./insider-trades.js";
import { registerMarketPerformanceTools } from "./market-performance.js";
import { registerMarketHoursTools } from "./market-hours.js";
import { registerNewsTools } from "./news.js";
import { registerTechnicalIndicatorsTools } from "./technical-indicators.js";
import { registerQuotesTools } from "./quotes.js";
import { registerEarningsTranscriptTools } from "./earnings-transcript.js";
import { registerSECFilingsTools } from "./sec-filings.js";
import { registerGovernmentTradingTools } from "./government-trading.js";
import { registerBulkTools } from "./bulk.js";
import { getModulesForToolSets } from "../constants/index.js";
import type { ToolSet } from "../types/index.js";

/**
 * Single source of truth: module name -> registration function.
 *
 * Insertion order is preserved by ES2015+ object literals and is the
 * order used by registerAllTools() below. Adding a new domain only
 * requires adding the import above and one entry here; registerAllTools
 * picks it up automatically. The toolRegistration smoke test asserts
 * that registerAllTools and the per-module sum stay equal, which
 * catches accidental omissions if someone forgets the import.
 */
const MODULE_REGISTRATIONS = {
  search: registerSearchTools,
  directory: registerDirectoryTools,
  analyst: registerAnalystTools,
  calendar: registerCalendarTools,
  chart: registerChartTools,
  company: registerCompanyTools,
  cot: registerCOTTools,
  esg: registerESGTools,
  economics: registerEconomicsTools,
  dcf: registerDCFTools,
  fund: registerFundTools,
  commodity: registerCommodityTools,
  fundraisers: registerFundraisersTools,
  crypto: registerCryptoTools,
  forex: registerForexTools,
  statements: registerStatementsTools,
  "form-13f": registerForm13FTools,
  indexes: registerIndexesTools,
  "insider-trades": registerInsiderTradesTools,
  "market-performance": registerMarketPerformanceTools,
  "market-hours": registerMarketHoursTools,
  news: registerNewsTools,
  "technical-indicators": registerTechnicalIndicatorsTools,
  quotes: registerQuotesTools,
  "earnings-transcript": registerEarningsTranscriptTools,
  "sec-filings": registerSECFilingsTools,
  "government-trading": registerGovernmentTradingTools,
  bulk: registerBulkTools,
} as const satisfies Record<string, (server: McpServer, accessToken?: string) => void>;

/**
 * Register tools based on specified tool sets
 * @param server The MCP server instance
 * @param toolSets Array of tool set names to load (if empty, loads all tools)
 * @param accessToken The Financial Modeling Prep API access token (optional when using lazy loading)
 */
export function registerToolsBySet(
  server: McpServer,
  toolSets: ToolSet[],
  accessToken?: string
): void {
  // If no tool sets specified, load all tools for backward compatibility
  if (toolSets.length === 0) {
    registerAllTools(server, accessToken);
    return;
  }

  // Get the modules that should be loaded for the specified tool sets
  const modulesToLoad = getModulesForToolSets(toolSets);

  // Register each required module
  for (const moduleName of modulesToLoad) {
    const registrationFunction =
      MODULE_REGISTRATIONS[moduleName as keyof typeof MODULE_REGISTRATIONS];
    if (registrationFunction) {
      registrationFunction(server, accessToken);
    } else {
      console.warn(`Unknown module: ${moduleName}`);
    }
  }

  console.log(
    `Loaded ${modulesToLoad.length} modules for tool sets: ${toolSets.join(
      ", "
    )}`
  );
}

/**
 * Register every tool module with the MCP server.
 *
 * Iterates MODULE_REGISTRATIONS so this function cannot drift from the
 * per-module map - they are the same source of truth.
 *
 * @param server The MCP server instance
 * @param accessToken The Financial Modeling Prep API access token (optional when using lazy loading)
 */
export function registerAllTools(
  server: McpServer,
  accessToken?: string
): void {
  for (const register of Object.values(MODULE_REGISTRATIONS)) {
    register(server, accessToken);
  }
}