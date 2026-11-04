import { z } from "zod";
import { InsiderTradesClient } from "../api/insider-trades/InsiderTradesClient.js";
import type { ToolRegistrar } from "../toolception-adapters/ToolCollector.js";

/**
 * Register all insider trades-related tools with the MCP server
 * @param server The MCP server instance
 * @param accessToken The Financial Modeling Prep API access token (optional when using lazy loading)
 */
export function registerInsiderTradesTools(
  server: ToolRegistrar,
  accessToken?: string
): void {
  const insiderTradesClient = new InsiderTradesClient(accessToken);

  server.tool(
    "getLatestInsiderTrading",
    "Access the latest insider trading activity using the Latest Insider Trading API. Track which company insiders are buying or selling stocks and analyze their transactions.",
    {
      date: z
        .string()
        .optional()
        .describe("Date of insider trades (YYYY-MM-DD)"),
      page: z.number().optional().describe("Page number (default: 0)"),
      limit: z
        .number()
        .optional()
        .describe("Limit on number of results (default: 100, max: 100)"),
    },
    async ({ date, page, limit }) => {
      try {
        const results = await insiderTradesClient.getLatestInsiderTrading({
          date,
          page,
          limit,
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
    "searchInsiderTrades",
    "Search insider trading activity by company or symbol using the Search Insider Trades API. Find specific trades made by corporate insiders, including executives and directors.",
    {
      symbol: z.string().optional().describe("Stock symbol"),
      page: z.number().optional().describe("Page number (default: 0)"),
      limit: z
        .number()
        .optional()
        .describe("Limit on number of results (default: 100, max: 100)"),
      reportingCik: z.string().optional().describe("Reporting CIK number"),
      companyCik: z.string().optional().describe("Company CIK number"),
      transactionType: z
        .string()
        .optional()
        .describe("Transaction type (e.g., S-Sale)"),
    },
    async ({
      symbol,
      page,
      limit,
      reportingCik,
      companyCik,
      transactionType,
    }) => {
      try {
        const results = await insiderTradesClient.searchInsiderTrades({
          symbol,
          page,
          limit,
          reportingCik,
          companyCik,
          transactionType,
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
    "searchInsiderTradesByReportingName",
    "Search for insider trading activity by reporting name using the Search Insider Trades by Reporting Name API. Track trading activities of specific individuals or groups involved in corporate insider transactions.",
    {
      name: z.string().describe("Reporting person's name to search for"),
    },
    async ({ name }) => {
      try {
        const results =
          await insiderTradesClient.searchInsiderTradesByReportingName(name);
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
    "getInsiderTransactionTypes",
    "Access a comprehensive list of insider transaction types with the All Insider Transaction Types API. This API provides details on various transaction actions, including purchases, sales, and other corporate actions involving insider trading.",
    {}, 
    async () => {
      try {
        const results = await insiderTradesClient.getInsiderTransactionTypes();
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
    "getInsiderTradeStatistics",
    "Analyze insider trading activity with the Insider Trade Statistics API. This API provides key statistics on insider transactions, including total purchases, sales, and trends for specific companies or stock symbols.",
    {
      symbol: z.string().describe("Stock symbol"),
    },
    async ({ symbol }) => {
      try {
        const results = await insiderTradesClient.getInsiderTradeStatistics(
          symbol
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
    "getAcquisitionOwnership",
    "Track changes in stock ownership during acquisitions using the Acquisition Ownership API. This API provides detailed information on how mergers, takeovers, or beneficial ownership changes impact the stock ownership structure of a company.",
    {
      symbol: z.string().describe("Stock symbol"),
      limit: z
        .number()
        .optional()
        .describe("Limit on number of results (default: 2000)"),
    },
    async ({ symbol, limit }) => {
      try {
        const results = await insiderTradesClient.getAcquisitionOwnership(
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
}
