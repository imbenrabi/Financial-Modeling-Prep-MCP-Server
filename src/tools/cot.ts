import { z } from "zod";
import { COTClient } from "../api/cot/COTClient.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

/**
 * Register all COT-related tools with the MCP server
 * @param server The MCP server instance
 * @param accessToken The Financial Modeling Prep API access token (optional when using lazy loading)
 */
export function registerCOTTools(server: McpServer, accessToken?: string): void {
  const cotClient = new COTClient(accessToken);

  server.tool(
    "getCOTReports",
    "Access comprehensive Commitment of Traders (COT) reports with the FMP COT Report API. This API provides detailed information about long and short positions across various sectors, helping you assess market sentiment and track positions in commodities, indices, and financial instruments.",
    {
      symbol: z.string().describe("Commodity symbol"),
      from_date: z
        .string()
        .optional()
        .describe("Optional start date (YYYY-MM-DD)"),
      to: z
        .string()
        .optional()
        .describe("Optional end date (YYYY-MM-DD)"),
    },
    async ({ symbol, from_date: from, to }) => {
      try {
        const results = await cotClient.getReports(symbol, from, to);
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
    "getCOTAnalysis",
    "Gain in-depth insights into market sentiment with the FMP COT Report Analysis API. Analyze the Commitment of Traders (COT) reports for a specific date range to evaluate market dynamics, sentiment, and potential reversals across various sectors.",
    {
      symbol: z.string().describe("Commodity symbol"),
      from_date: z
        .string()
        .optional()
        .describe("Optional start date (YYYY-MM-DD)"),
      to: z
        .string()
        .optional()
        .describe("Optional end date (YYYY-MM-DD)"),
    },
    async ({ symbol, from_date: from, to }) => {
      try {
        const results = await cotClient.getAnalysis(symbol, from, to);
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

  server.tool("getCOTList",
    "Access a comprehensive list of available Commitment of Traders (COT) reports by commodity or futures contract using the FMP COT Report List API. This API provides an overview of different market segments, allowing users to retrieve and explore COT reports for a wide variety of commodities and financial instruments.",
    {},
    async () => {
      try {
        const results = await cotClient.getList();
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
  });
}
