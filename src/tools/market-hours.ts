import { z } from "zod";
import { MarketHoursClient } from "../api/market-hours/MarketHoursClient.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

/**
 * Register all market hours-related tools with the MCP server
 * @param server The MCP server instance
 * @param accessToken The Financial Modeling Prep API access token (optional when using lazy loading)
 */
export function registerMarketHoursTools(
  server: McpServer,
  accessToken?: string
): void {
  const marketHoursClient = new MarketHoursClient(accessToken);

  server.tool(
    "getExchangeMarketHours",
    "Retrieve trading hours for specific stock exchanges using the Global Exchange Market Hours API. Find out the opening and closing times of global exchanges to plan your trading strategies effectively.",
    {
      exchange: z.string().describe("Exchange code (e.g., NASDAQ, NYSE)"),
    },
    async ({ exchange }) => {
      try {
        const results = await marketHoursClient.getExchangeMarketHours(
          exchange
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
    "getHolidaysByExchange",
    "Access holiday schedules for specific stock exchanges using the Global Exchange Market Hours API. Find out the dates when global exchanges are closed for holidays and plan your trading activities accordingly.",
    {
      exchange: z.string().describe("Exchange code (e.g., NASDAQ, NYSE)"),
      from_date: z.string().optional().describe("Start date for the holidays (YYYY-MM-DD format)"),
      to: z.string().optional().describe("End date for the holidays (YYYY-MM-DD format)"),
    },
    async ({ exchange, from_date: from, to }) => {
      try {
        const results = await marketHoursClient.getHolidaysByExchange(
          exchange,
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
    "getAllExchangeMarketHours",
    "View the market hours for all exchanges. Check when different markets are active.",
    {},
    async () => {
    try {
      const results = await marketHoursClient.getAllExchangeMarketHours();
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
