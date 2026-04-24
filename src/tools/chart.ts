import { z } from "zod";
import { ChartClient } from "../api/chart/ChartClient.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

/**
 * Register all chart-related tools with the MCP server
 * @param server The MCP server instance
 * @param accessToken The Financial Modeling Prep API access token (optional when using lazy loading)
 */
export function registerChartTools(
  server: McpServer,
  accessToken?: string
): void {
  const chartClient = new ChartClient(accessToken);

  server.tool(
    "getLightChart",
    "Access simplified stock chart data using the FMP Basic Stock Chart API. This API provides essential charting information, including date, price, and trading volume, making it ideal for tracking stock performance with minimal data and creating basic price and volume charts.",
    {
      symbol: z.string().describe("Stock symbol"),
      from_date: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      to: z.string().optional().describe("End date (YYYY-MM-DD)"),
    },
    async ({ symbol, from_date: from, to }) => {
      try {
        const results = await chartClient.getLightChart(symbol, from, to);
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
    "getFullChart",
    "Access full price and volume data for any stock symbol using the FMP Comprehensive Stock Price and Volume Data API. Get detailed insights, including open, high, low, close prices, trading volume, price changes, percentage changes, and volume-weighted average price (VWAP).",
    {
      symbol: z.string().describe("Stock symbol"),
      from_date: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      to: z.string().optional().describe("End date (YYYY-MM-DD)"),
    },
    async ({ symbol, from_date: from, to }) => {
      try {
        const results = await chartClient.getFullChart(symbol, from, to);
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
    "getUnadjustedChart",
    "Access stock price and volume data without adjustments for stock splits with the FMP Unadjusted Stock Price Chart API. Get accurate insights into stock performance, including open, high, low, and close prices, along with trading volume, without split-related changes.",
    {
      symbol: z.string().describe("Stock symbol"),
      from_date: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      to: z.string().optional().describe("End date (YYYY-MM-DD)"),
    },
    async ({ symbol, from_date: from, to }) => {
      try {
        const results = await chartClient.getUnadjustedChart(symbol, from, to);
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
    "getDividendAdjustedChart",
    "Analyze stock performance with dividend adjustments using the FMP Dividend-Adjusted Price Chart API. Access end-of-day price and volume data that accounts for dividend payouts, offering a more comprehensive view of stock trends over time.",
    {
      symbol: z.string().describe("Stock symbol"),
      from_date: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      to: z.string().optional().describe("End date (YYYY-MM-DD)"),
    },
    async ({ symbol, from_date: from, to }) => {
      try {
        const results = await chartClient.getDividendAdjustedChart(symbol, from, to);
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
    "getIntradayChart",
    "Access precise intraday stock price and volume data with the FMP Interval Stock Chart API. Retrieve real-time or historical stock data in intervals, including key information such as open, high, low, and close prices, and trading volume for each minute.",
    {
      symbol: z.string().describe("Stock symbol"),
      interval: z
        .enum(["1min", "5min", "15min", "30min", "1hour", "4hour"])
        .describe("Time interval"),
      from_date: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      to: z.string().optional().describe("End date (YYYY-MM-DD)"),
    },
    async ({ symbol, interval, from_date: from, to }) => {
      try {
        const results = await chartClient.getIntradayChart(symbol, interval, from, to);
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
