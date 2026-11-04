import { z } from "zod";
import { AnalystClient } from "../api/analyst/AnalystClient.js";
import type { ToolRegistrar } from "../toolception-adapters/ToolCollector.js";

/**
 * Register all analyst-related tools with the MCP server
 * @param server The MCP server instance
 * @param accessToken The Financial Modeling Prep API access token (optional when using lazy loading)
 */
export function registerAnalystTools(
  server: ToolRegistrar,
  accessToken?: string
): void {
  const analystClient = new AnalystClient(accessToken);

  server.tool(
    "getAnalystEstimates",
    "Retrieve analyst financial estimates for stock symbols with the FMP Financial Estimates API. Access projected figures like revenue, earnings per share (EPS), and other key financial metrics as forecasted by industry analysts to inform your investment decisions.",
    {
      symbol: z.string().describe("Stock symbol"),
      period: z
        .enum(["annual", "quarter"])
        .describe("Period (annual or quarter)"),
      page: z.number().optional().describe("Optional page number (default: 0)"),
      limit: z
        .number()
        .optional()
        .describe(
          "Optional limit on number of results (default: 10, max: 1000)"
        ),
    },
    async ({ symbol, period, page, limit }) => {
      try {
        const results = await analystClient.getAnalystEstimates(
          symbol,
          period,
          page,
          limit
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
    "getRatingsSnapshot",
    "Quickly assess the financial health and performance of companies with the FMP Ratings Snapshot API. This API provides a comprehensive snapshot of financial ratings for stock symbols in our database, based on various key financial ratios.",
    {
      symbol: z.string().describe("Stock symbol"),
      limit: z
        .number()
        .optional()
        .describe("Optional limit on number of results (default: 1)"),
    },
    async ({ symbol, limit }) => {
      try {
        const results = await analystClient.getRatingsSnapshot(symbol, limit);
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
    "getHistoricalRatings",
    "Track changes in financial performance over time with the FMP Historical Ratings API. This API provides access to historical financial ratings for stock symbols in our database, allowing users to view ratings and key financial metric scores for specific dates.",
    {
      symbol: z.string().describe("Stock symbol"),
      limit: z
        .number()
        .optional()
        .describe(
          "Optional limit on number of results (default: 1, max: 10000)"
        ),
    },
    async ({ symbol, limit }) => {
      try {
        const results = await analystClient.getHistoricalRatings(symbol, limit);
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
    "getPriceTargetSummary",
    "Gain insights into analysts' expectations for stock prices with the FMP Price Target Summary API. This API provides access to average price targets from analysts across various timeframes, helping investors assess future stock performance based on expert opinions.",
    {
      symbol: z.string().describe("Stock symbol"),
    },
    async ({ symbol }) => {
      try {
        const results = await analystClient.getPriceTargetSummary(symbol);
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
    "getPriceTargetConsensus",
    "Access analysts' consensus price targets with the FMP Price Target Consensus API. This API provides high, low, median, and consensus price targets for stocks, offering investors a comprehensive view of market expectations for future stock prices.",
    {
      symbol: z.string().describe("Stock symbol"),
    },
    async ({ symbol }) => {
      try {
        const results = await analystClient.getPriceTargetConsensus(symbol);
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
    "getPriceTargetNews",
    "Stay informed with real-time updates on analysts' price targets for stocks using the FMP Price Target News API. Access the latest forecasts, stock prices at the time of the update, and direct links to trusted news sources for deeper insights.",
    {
      symbol: z.string().describe("Stock symbol"),
      page: z.number().optional().describe("Optional page number (default: 0)"),
      limit: z
        .number()
        .optional()
        .describe("Optional limit on number of results (default: 10)"),
    },
    async ({ symbol, page, limit }) => {
      try {
        const results = await analystClient.getPriceTargetNews(
          symbol,
          page,
          limit
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
    "getPriceTargetLatestNews",
    "Stay updated with the most recent analyst price target updates for all stock symbols using the FMP Price Target Latest News API. Get access to detailed forecasts, stock prices at the time of the update, analyst insights, and direct links to news sources for deeper analysis.",
    {
      page: z
        .number()
        .optional()
        .describe("Optional page number (default: 0, max: 100)"),
      limit: z
        .number()
        .optional()
        .describe(
          "Optional limit on number of results (default: 10, max: 1000)"
        ),
    },
    async ({ page, limit }) => {
      try {
        const results = await analystClient.getPriceTargetLatestNews(
          page,
          limit
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
    "getStockGrades",
    "Access the latest stock grades from top analysts and financial institutions with the FMP Grades API. Track grading actions, such as upgrades, downgrades, or maintained ratings, for specific stock symbols, providing valuable insight into how experts evaluate companies over time.",
    {
      symbol: z.string().describe("Stock symbol"),
    },
    async ({ symbol }) => {
      try {
        const results = await analystClient.getStockGrades(symbol);
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
    "getHistoricalStockGrades",
    "Access a comprehensive record of analyst grades with the FMP Historical Grades API. This tool allows you to track historical changes in analyst ratings for specific stock symbols.",
    {
      symbol: z.string().describe("Stock symbol"),
      limit: z
        .number()
        .optional()
        .describe(
          "Optional limit on number of results (default: 100, max: 1000)"
        ),
    },
    async ({ symbol, limit }) => {
      try {
        const results = await analystClient.getHistoricalStockGrades(
          symbol,
          limit
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
    "getStockGradeSummary",
    "Quickly access an overall view of analyst ratings with the FMP Grades Summary API. This API provides a consolidated summary of market sentiment for individual stock symbols, including the total number of strong buy, buy, hold, sell, and strong sell ratings. Understand the overall consensus on a stock’s outlook with just a few data points.",
    {
      symbol: z.string().describe("Stock symbol"),
    },
    async ({ symbol }) => {
      try {
        const results = await analystClient.getStockGradeSummary(symbol);
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
    "getStockGradeNews",
    "Stay informed on the latest analyst grade changes with the FMP Grade News API. This API provides real-time updates on stock rating changes, including the grading company, previous and new grades, and the action taken. Direct links to trusted news sources and stock prices at the time of the update help you stay ahead of market trends and analyst opinions for specific stock symbols.",
    {
      symbol: z.string().describe("Stock symbol"),
      page: z.number().optional().describe("Optional page number (default: 0)"),
      limit: z
        .number()
        .optional()
        .describe("Optional limit on number of results (default: 1, max: 100)"),
    },
    async ({ symbol, page, limit }) => {
      try {
        const results = await analystClient.getStockGradeNews(
          symbol,
          page,
          limit
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
    "getStockGradeLatestNews",
    "Stay informed on the latest stock rating changes with the FMP Grade Latest News API. This API provides the most recent updates on analyst ratings for all stock symbols, including links to the original news sources. Track stock price movements, grading firm actions, and market sentiment shifts in real time, sourced from trusted publishers.",
    {
      page: z
        .number()
        .optional()
        .describe("Optional page number (default: 0, max: 100)"),
      limit: z
        .number()
        .optional()
        .describe(
          "Optional limit on number of results (default: 10, max: 1000)"
        ),
    },
    async ({ page, limit }) => {
      try {
        const results = await analystClient.getStockGradeLatestNews(
          page,
          limit
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
}
