import { z } from "zod";
import { EconomicsClient } from "../api/economics/EconomicsClient.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

/**
 * Register all economics-related tools with the MCP server
 * @param server The MCP server instance
 * @param accessToken The Financial Modeling Prep API access token (optional when using lazy loading)
 */
export function registerEconomicsTools(
  server: McpServer,
  accessToken?: string
): void {
  const economicsClient = new EconomicsClient(accessToken);

  server.tool(
    "getTreasuryRates",
    "Access real-time and historical Treasury rates for all maturities with the FMP Treasury Rates API. Track key benchmarks for interest rates across the economy.",
    {
      from_date: z
        .string()
        .optional()
        .describe("Optional start date (YYYY-MM-DD)"),
      to: z
        .string()
        .optional()
        .describe("Optional end date (YYYY-MM-DD)"),
    },
    async ({ from_date: from, to }) => {
      try {
        const results = await economicsClient.getTreasuryRates(from, to);
        return {
          content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "getEconomicIndicators",
    "Access real-time and historical economic data for key indicators like GDP, unemployment, and inflation with the FMP Economic Indicators API. Use this data to measure economic performance and identify growth trends.",
    {
      name: z
        .string()
        .describe("Name of the indicator"),
      from_date: z
        .string()
        .optional()
        .describe("Optional start date (YYYY-MM-DD)"),
      to: z
        .string()
        .optional()
        .describe("Optional end date (YYYY-MM-DD)"),
    },
    async ({ name, from_date: from, to }) => {
      try {
        const results = await economicsClient.getEconomicIndicators(
          name,
          from,
          to
        );
        return {
          content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "getEconomicCalendar",
    "Stay informed with the FMP Economic Data Releases Calendar API. Access a comprehensive calendar of upcoming economic data releases to prepare for market impacts and make informed investment decisions.",
    {
      from_date: z
        .string()
        .optional()
        .describe("Optional start date (YYYY-MM-DD)"),
      to: z
        .string()
        .optional()
        .describe("Optional end date (YYYY-MM-DD)"),
    },
    async ({ from_date: from, to }) => {
      try {
        const results = await economicsClient.getEconomicCalendar(from, to);
        return {
          content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "getMarketRiskPremium",
    "Access the market risk premium for specific dates with the FMP Market Risk Premium API. Use this key financial metric to assess the additional return expected from investing in the stock market over a risk-free investment.",
    {},
    async () => {
      try {
        const results = await economicsClient.getMarketRiskPremium();
        return {
          content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
