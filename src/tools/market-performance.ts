import { z } from "zod";
import { MarketPerformanceClient } from "../api/market-performance/MarketPerformanceClient.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

/**
 * Register all market performance-related tools with the MCP server
 * @param server The MCP server instance
 * @param accessToken The Financial Modeling Prep API access token (optional when using lazy loading)
 */
export function registerMarketPerformanceTools(
  server: McpServer,
  accessToken?: string
): void {
  const marketPerformanceClient = new MarketPerformanceClient(accessToken);

  server.tool(
    "getSectorPerformanceSnapshot",
    "Get a snapshot of sector performance using the Market Sector Performance Snapshot API. Analyze how different industries are performing in the market based on average changes across sectors.",
    {
      date: z.string().describe("Date (YYYY-MM-DD)"),
      exchange: z.string().optional().describe("Exchange (e.g., NASDAQ)"),
      sector: z.string().optional().describe("Sector (e.g., Energy)"),
    },
    async ({ date, exchange, sector }) => {
      try {
        const results =
          await marketPerformanceClient.getSectorPerformanceSnapshot(date, {
            exchange,
            sector,
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
    "getIndustryPerformanceSnapshot",
    "Access detailed performance data by industry using the Industry Performance Snapshot API. Analyze trends, movements, and daily performance metrics for specific industries across various stock exchanges.",
    {
      date: z.string().describe("Date (YYYY-MM-DD)"),
      exchange: z.string().optional().describe("Exchange (e.g., NASDAQ)"),
      industry: z
        .string()
        .optional()
        .describe("Industry (e.g., Biotechnology)"),
    },
    async ({ date, exchange, industry }) => {
      try {
        const results =
          await marketPerformanceClient.getIndustryPerformanceSnapshot(date, {
            exchange,
            industry,
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
    "getHistoricalSectorPerformance",
    "Access historical sector performance data using the Historical Market Sector Performance API. Review how different sectors have performed over time across various stock exchanges.",
    {
      sector: z.string().describe("Sector (e.g., Energy)"),
      from_date: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      to: z.string().optional().describe("End date (YYYY-MM-DD)"),
      exchange: z.string().optional().describe("Exchange (e.g., NASDAQ)"),
    },
    async ({ sector, from_date: from, to, exchange }) => {
      try {
        const results =
          await marketPerformanceClient.getHistoricalSectorPerformance(sector, {
            from,
            to,
            exchange,
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
    "getHistoricalIndustryPerformance",
    "Access historical performance data for industries using the Historical Industry Performance API. Track long-term trends and analyze how different industries have evolved over time across various stock exchanges.",
    {
      industry: z.string().describe("Industry (e.g., Biotechnology)"),
      from_date: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      to: z.string().optional().describe("End date (YYYY-MM-DD)"),
      exchange: z.string().optional().describe("Exchange (e.g., NASDAQ)"),
    },
    async ({ industry, from_date: from, to, exchange }) => {
      try {
        const results =
          await marketPerformanceClient.getHistoricalIndustryPerformance(
            industry,
            { from, to, exchange }
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
    "getSectorPESnapshot",
    "Retrieve the price-to-earnings (P/E) ratios for various sectors using the Sector P/E Snapshot API. Compare valuation levels across sectors to better understand market valuations.",
    {
      date: z.string().describe("Date (YYYY-MM-DD)"),
      exchange: z.string().optional().describe("Exchange (e.g., NASDAQ)"),
      sector: z.string().optional().describe("Sector (e.g., Energy)"),
    },
    async ({ date, exchange, sector }) => {
      try {
        const results = await marketPerformanceClient.getSectorPESnapshot(
          date,
          {
            exchange,
            sector,
          }
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
    "getIndustryPESnapshot",
    "View price-to-earnings (P/E) ratios for different industries using the Industry P/E Snapshot API. Analyze valuation levels across various industries to understand how each is priced relative to its earnings.",
    {
      date: z.string().describe("Date (YYYY-MM-DD)"),
      exchange: z.string().optional().describe("Exchange (e.g., NASDAQ)"),
      industry: z
        .string()
        .optional()
        .describe("Industry (e.g., Biotechnology)"),
    },
    async ({ date, exchange, industry }) => {
      try {
        const results = await marketPerformanceClient.getIndustryPESnapshot(
          date,
          { exchange, industry }
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
    "getHistoricalSectorPE",
    "Access historical price-to-earnings (P/E) ratios for various sectors using the Historical Sector P/E API. Analyze how sector valuations have evolved over time to understand long-term trends and market shifts.",
    {
      sector: z.string().describe("Sector (e.g., Energy)"),
      from_date: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      to: z.string().optional().describe("End date (YYYY-MM-DD)"),
      exchange: z.string().optional().describe("Exchange (e.g., NASDAQ)"),
    },
    async ({ sector, from_date: from, to, exchange }) => {
      try {
        const results = await marketPerformanceClient.getHistoricalSectorPE(
          sector,
          { from, to, exchange }
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
    "getHistoricalIndustryPE",
    "Access historical price-to-earnings (P/E) ratios by industry using the Historical Industry P/E API. Track valuation trends across various industries to understand how market sentiment and valuations have evolved over time.",
    {
      industry: z.string().describe("Industry (e.g., Biotechnology)"),
      from_date: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      to: z.string().optional().describe("End date (YYYY-MM-DD)"),
      exchange: z.string().optional().describe("Exchange (e.g., NASDAQ)"),
    },
    async ({ industry, from_date: from, to, exchange }) => {
      try {
        const results = await marketPerformanceClient.getHistoricalIndustryPE(
          industry,
          { from, to, exchange }
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
    "getBiggestGainers",
    "Track the stocks with the largest price increases using the Top Stock Gainers API. Identify the companies that are leading the market with significant price surges, offering potential growth opportunities.",
    {},
    async () => {
      try {
        const results = await marketPerformanceClient.getBiggestGainers();
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

  server.tool(
    "getBiggestLosers",
    "Access data on the stocks with the largest price drops using the Biggest Stock Losers API. Identify companies experiencing significant declines and track the stocks that are falling the fastest in the market.",
    {}, 
    async () => {
      try {
        const results = await marketPerformanceClient.getBiggestLosers();
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

  server.tool(
    "getMostActiveStocks", 
    "View the most actively traded stocks using the Top Traded Stocks API. Identify the companies experiencing the highest trading volumes in the market and track where the most trading activity is happening.",
    {}, 
    async () => {
      try {
        const results = await marketPerformanceClient.getMostActiveStocks();
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
