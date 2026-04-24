import { z } from "zod";
import { TechnicalIndicatorsClient } from "../api/technical-indicators/TechnicalIndicatorsClient.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

/**
 * Register all technical indicators-related tools with the MCP server
 * @param server The MCP server instance
 * @param accessToken The Financial Modeling Prep API access token (optional when using lazy loading)
 */
export function registerTechnicalIndicatorsTools(
  server: McpServer,
  accessToken?: string
): void {
  const technicalIndicatorsClient = new TechnicalIndicatorsClient(accessToken);

  server.tool(
    "getSMA",
    "Calculate the Simple Moving Average (SMA) for a stock using the FMP SMA API. This tool helps users analyze trends and identify potential buy or sell signals based on historical price data.",
    {
      symbol: z.string().describe("Stock symbol"),
      periodLength: z.number().describe("Period length for the indicator"),
      timeframe: z
        .string()
        .describe("Timeframe (1min, 5min, 15min, 30min, 1hour, 4hour, 1day)"),
      from_date: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      to: z.string().optional().describe("End date (YYYY-MM-DD)"),
    },
    async ({ symbol, periodLength, timeframe, from_date: from, to }) => {
      try {
        const results = await technicalIndicatorsClient.getSMA({
          symbol,
          periodLength,
          timeframe,
          from,
          to,
        });
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
    "getEMA",
    "Calculate the Exponential Moving Average (EMA) for a stock using the FMP EMA API. This tool helps users analyze trends and identify potential buy or sell signals based on historical price data.",
    {
      symbol: z.string().describe("Stock symbol"),
      periodLength: z.number().describe("Period length for the indicator"),
      timeframe: z
        .string()
        .describe("Timeframe (1min, 5min, 15min, 30min, 1hour, 4hour, 1day)"),
      from_date: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      to: z.string().optional().describe("End date (YYYY-MM-DD)"),
    },
    async ({ symbol, periodLength, timeframe, from_date: from, to }) => {
      try {
        const results = await technicalIndicatorsClient.getEMA({
          symbol,
          periodLength,
          timeframe,
          from,
          to,
        });
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
    "getWMA",
    "Calculate the Weighted Moving Average (WMA) for a stock using the FMP WMA API. This tool helps users analyze trends and identify potential buy or sell signals based on historical price data.",
    {
      symbol: z.string().describe("Stock symbol"),
      periodLength: z.number().describe("Period length for the indicator"),
      timeframe: z
        .string()
        .describe("Timeframe (1min, 5min, 15min, 30min, 1hour, 4hour, 1day)"),
      from_date: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      to: z.string().optional().describe("End date (YYYY-MM-DD)"),
    },
    async ({ symbol, periodLength, timeframe, from_date: from, to }) => {
      try {
        const results = await technicalIndicatorsClient.getWMA({
          symbol,
          periodLength,
          timeframe,
          from,
          to,
        });
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
    "getDEMA",
    "Calculate the Double Exponential Moving Average (DEMA) for a stock using the FMP DEMA API. This tool helps users analyze trends and identify potential buy or sell signals based on historical price data.",
    {
      symbol: z.string().describe("Stock symbol"),
      periodLength: z.number().describe("Period length for the indicator"),
      timeframe: z
        .string()
        .describe("Timeframe (1min, 5min, 15min, 30min, 1hour, 4hour, 1day)"),
      from_date: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      to: z.string().optional().describe("End date (YYYY-MM-DD)"),
    },
    async ({ symbol, periodLength, timeframe, from_date: from, to }) => {
      try {
        const results = await technicalIndicatorsClient.getDEMA({
          symbol,
          periodLength,
          timeframe,
          from,
          to,
        });
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
    "getTEMA",
    "Calculate the Triple Exponential Moving Average (TEMA) for a stock using the FMP TEMA API. This tool helps users analyze trends and identify potential buy or sell signals based on historical price data.",
    {
      symbol: z.string().describe("Stock symbol"),
      periodLength: z.number().describe("Period length for the indicator"),
      timeframe: z
        .string()
        .describe("Timeframe (1min, 5min, 15min, 30min, 1hour, 4hour, 1day)"),
      from_date: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      to: z.string().optional().describe("End date (YYYY-MM-DD)"),
    },
    async ({ symbol, periodLength, timeframe, from_date: from, to }) => {
      try {
        const results = await technicalIndicatorsClient.getTEMA({
          symbol,
          periodLength,
          timeframe,
          from,
          to,
        });
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
    "getRSI",
    "Calculate the Relative Strength Index (RSI) for a stock using the FMP RSI API. This tool helps users analyze momentum and overbought/oversold conditions based on historical price data.",
    {
      symbol: z.string().describe("Stock symbol"),
      periodLength: z.number().describe("Period length for the indicator"),
      timeframe: z
        .string()
        .describe("Timeframe (1min, 5min, 15min, 30min, 1hour, 4hour, 1day)"),
      from_date: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      to: z.string().optional().describe("End date (YYYY-MM-DD)"),
    },
    async ({ symbol, periodLength, timeframe, from_date: from, to }) => {
      try {
        const results = await technicalIndicatorsClient.getRSI({
          symbol,
          periodLength,
          timeframe,
          from,
          to,
        });
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
    "getStandardDeviation",
    "Calculate the Standard Deviation for a stock using the FMP Standard Deviation API. This tool helps users analyze volatility and risk associated with historical price data.",
    {
      symbol: z.string().describe("Stock symbol"),
      periodLength: z.number().describe("Period length for the indicator"),
      timeframe: z
        .string()
        .describe("Timeframe (1min, 5min, 15min, 30min, 1hour, 4hour, 1day)"),
      from_date: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      to: z.string().optional().describe("End date (YYYY-MM-DD)"),
    },
    async ({ symbol, periodLength, timeframe, from_date: from, to }) => {
      try {
        const results = await technicalIndicatorsClient.getStandardDeviation({
          symbol,
          periodLength,
          timeframe,
          from,
          to,
        });
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
    "getWilliams",
    "Calculate the Williams %R for a stock using the FMP Williams %R API. This tool helps users analyze overbought/oversold conditions and potential reversal signals based on historical price data.",
    {
      symbol: z.string().describe("Stock symbol"),
      periodLength: z.number().describe("Period length for the indicator"),
      timeframe: z
        .string()
        .describe("Timeframe (1min, 5min, 15min, 30min, 1hour, 4hour, 1day)"),
      from_date: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      to: z.string().optional().describe("End date (YYYY-MM-DD)"),
    },
    async ({ symbol, periodLength, timeframe, from_date: from, to }) => {
      try {
        const results = await technicalIndicatorsClient.getWilliams({
          symbol,
          periodLength,
          timeframe,
          from,
          to,
        });
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
    "getADX",
    "Calculate the Average Directional Index (ADX) for a stock using the FMP ADX API. This tool helps users analyze trend strength and direction based on historical price data.",
    {
      symbol: z.string().describe("Stock symbol"),
      periodLength: z.number().describe("Period length for the indicator"),
      timeframe: z
        .string()
        .describe("Timeframe (1min, 5min, 15min, 30min, 1hour, 4hour, 1day)"),
      from_date: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      to: z.string().optional().describe("End date (YYYY-MM-DD)"),
    },
    async ({ symbol, periodLength, timeframe, from_date: from, to }) => {
      try {
        const results = await technicalIndicatorsClient.getADX({
          symbol,
          periodLength,
          timeframe,
          from,
          to,
        });
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
