import { z } from "zod";
import { TipRanksClient } from "../api/tipranks/TipRanksClient.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

/**
 * Register all TipRanks partner tools with the MCP server
 * @param server The MCP server instance
 * @param accessToken The Financial Modeling Prep API access token (optional when using lazy loading)
 */
export function registerTipRanksTools(
  server: McpServer,
  accessToken?: string
): void {
  const tipRanksClient = new TipRanksClient(accessToken);

  server.tool(
    "searchTipRanksAnalystRatings",
    "Search individual analyst ratings sourced from TipRanks with the FMP Analyst Ratings Search API (partner data). Each row has the analyst, firm, recommendation, price target, action taken and the originating article, newest first. Filter by symbol, analyst (expertUID) and recommendation date range.",
    {
      symbol: z.string().optional().describe("Filter by stock symbol"),
      expertUID: z.string().optional().describe("Filter by TipRanks analyst identifier (expertUID)"),
      from_date: z.string().optional().describe("Start of the date window (YYYY-MM-DD)"),
      to: z.string().optional().describe("End of the date window (YYYY-MM-DD)"),
      nonadjusted: z.boolean().optional().describe("Return price targets in their native currency instead of converting them"),
      limit: z.number().optional().describe("Limit the number of results (max 5000)"),
      page: z.number().optional().describe("Page number for pagination"),
    },
    async ({ symbol, expertUID, from_date, to, nonadjusted, limit, page }) => {
      try {
        const results = await tipRanksClient.searchAnalystRatings({ symbol, expertUID, from: from_date, to, nonadjusted, limit, page });
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
    "getTipRanksPointInTimeRatingsBySymbol",
    "Get a point-in-time summary of a symbol's analyst ratings with the FMP Point in time Ratings by Symbol API (TipRanks partner data). Collapses the rating history up to the chosen date to each analyst's latest active call, with analyst rank, success rate and average return.",
    {
      symbol: z.string().describe("Stock symbol"),
      date: z.string().optional().describe("As-of date (YYYY-MM-DD); defaults to the latest snapshot"),
      nonadjusted: z.boolean().optional().describe("Return price targets in their native currency instead of converting them"),
      limit: z.number().optional().describe("Limit the number of results (max 5000)"),
      page: z.number().optional().describe("Page number for pagination"),
    },
    async ({ symbol, date, nonadjusted, limit, page }) => {
      try {
        const results = await tipRanksClient.getPointInTimeBySymbol(symbol, { date, nonadjusted, limit, page });
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
    "getTipRanksPointInTimeRatingsByAnalyst",
    "Get a point-in-time summary of a single analyst's ratings with the FMP Point in time Ratings by Analyst API (TipRanks partner data). Returns one row per symbol the analyst covers, with their latest active call, price target and track-record statistics.",
    {
      expertUID: z.string().describe("TipRanks analyst identifier (expertUID), as returned by lookupTipRanksAnalyst"),
      date: z.string().optional().describe("As-of date (YYYY-MM-DD); defaults to the latest snapshot"),
      nonadjusted: z.boolean().optional().describe("Return price targets in their native currency instead of converting them"),
      limit: z.number().optional().describe("Limit the number of results (max 5000)"),
      page: z.number().optional().describe("Page number for pagination"),
    },
    async ({ expertUID, date, nonadjusted, limit, page }) => {
      try {
        const results = await tipRanksClient.getPointInTimeByAnalyst(expertUID, { date, nonadjusted, limit, page });
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
    "getTipRanksSymbolSummary",
    "Get an aggregated rollup of all TipRanks ratings on one stock over a date window with the FMP Ratings Summary by Symbol API (partner data). Includes buy/hold/sell and analyst-action breakdowns and price-target accuracy. The window defaults to the trailing twelve months.",
    {
      symbol: z.string().describe("Stock symbol"),
      from_date: z.string().optional().describe("Start of the date window (YYYY-MM-DD)"),
      to: z.string().optional().describe("End of the date window (YYYY-MM-DD)"),
    },
    async ({ symbol, from_date: from, to }) => {
      try {
        const results = await tipRanksClient.getSymbolSummary(symbol, { from, to });
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
    "getTipRanksAnalystSummary",
    "Get an aggregated rollup of every recommendation one analyst has issued over a date window with the FMP Ratings Summary by Analyst API (TipRanks partner data), including their price-target track record. The window defaults to the trailing twelve months.",
    {
      expertUID: z.string().describe("TipRanks analyst identifier (expertUID), as returned by lookupTipRanksAnalyst"),
      from_date: z.string().optional().describe("Start of the date window (YYYY-MM-DD)"),
      to: z.string().optional().describe("End of the date window (YYYY-MM-DD)"),
    },
    async ({ expertUID, from_date: from, to }) => {
      try {
        const results = await tipRanksClient.getAnalystSummary(expertUID, { from, to });
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
    "getTipRanksFirmSummary",
    "Get an aggregated rollup of all ratings issued by analysts at one firm over a date window with the FMP Ratings Summary by Firm API (TipRanks partner data). The firm name must match exactly (e.g. Morgan Stanley). The window defaults to the trailing twelve months.",
    {
      firmName: z.string().describe("Firm name, exactly as published (e.g. Morgan Stanley)"),
      from_date: z.string().optional().describe("Start of the date window (YYYY-MM-DD)"),
      to: z.string().optional().describe("End of the date window (YYYY-MM-DD)"),
    },
    async ({ firmName, from_date: from, to }) => {
      try {
        const results = await tipRanksClient.getFirmSummary(firmName, { from, to });
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
    "lookupTipRanksAnalyst",
    "Look up a TipRanks analyst by name with the FMP Analyst Directory Lookup API (partner data). Returns the expertUID used by the other TipRanks tools, the analyst's firm, star rating and performance metrics. The name must be passed exactly as published; there is no fuzzy matching.",
    {
      analystName: z.string().describe("Analyst name, exactly as published"),
    },
    async ({ analystName }) => {
      try {
        const results = await tipRanksClient.lookupAnalyst(analystName);
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
