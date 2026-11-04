import { z } from "zod";
import { DirectoryClient } from "../api/directory/DirectoryClient.js";
import type { ToolRegistrar } from "../toolception-adapters/ToolCollector.js";

/**
 * Register all directory-related tools with the MCP server
 * @param server The MCP server instance
 * @param accessToken The Financial Modeling Prep API access token (optional when using lazy loading)
 */
export function registerDirectoryTools(
  server: ToolRegistrar,
  accessToken?: string
): void {
  const directoryClient = new DirectoryClient(accessToken);

  server.tool(
    "getCompanySymbols",
    "Easily retrieve a comprehensive list of financial symbols with the FMP Company Symbols List API. Access a broad range of stock symbols and other tradable financial instruments from various global exchanges, helping you explore the full range of available securities.",
    {}, 
    async () => {
      try {
        const results = await directoryClient.getCompanySymbols();
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
    "getFinancialStatementSymbols", 
    "Access a comprehensive list of companies with available financial statements through the FMP Financial Statement Symbols List API. Find companies listed on major global exchanges and obtain up-to-date financial data including income statements, balance sheets, and cash flow statements, are provided.",
    {}, 
    async () => {
      try {
        const results = await directoryClient.getFinancialStatementSymbols();
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
    "getCIKList",
    "Access a comprehensive database of CIK (Central Index Key) numbers for SEC-registered entities with the FMP CIK List API. This endpoint is essential for businesses, financial professionals, and individuals who need quick access to CIK numbers for regulatory compliance, financial transactions, and investment research.",
    {
      limit: z
        .number()
        .optional()
        .describe("Optional limit on number of results (default: 1000)"),
    },
    async ({ limit }) => {
      try {
        const results = await directoryClient.getCIKList(limit);
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
    "getSymbolChanges",
    "Stay informed about the latest stock symbol changes with the FMP Stock Symbol Changes API. Track changes due to mergers, acquisitions, stock splits, and name changes to ensure accurate trading and analysis.",
    {
      invalid: z
        .boolean()
        .optional()
        .describe("Optional filter for invalid symbols (default: false)"),
      limit: z
        .number()
        .optional()
        .describe("Optional limit on number of results (default: 100)"),
    },
    async ({ invalid, limit }) => {
      try {
        const results = await directoryClient.getSymbolChanges(invalid, limit);
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
    "getETFList",
    "Quickly find ticker symbols and company names for Exchange Traded Funds (ETFs) using the FMP ETF Symbol Search API. This tool simplifies identifying specific ETFs by their name or ticker.",
    {}, 
    async () => {
      try {
        const results = await directoryClient.getETFList();
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
    "getActivelyTradingList",
    "List all actively trading companies and financial instruments with the FMP Actively Trading List API. This endpoint allows users to filter and display securities that are currently being traded on public exchanges, ensuring you access real-time market activity.",
    {}, 
    async () => {
      try {
        const results = await directoryClient.getActivelyTradingList();
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
    "getEarningsTranscriptList",
    "Access available earnings transcripts for companies with the FMP Earnings Transcript List API. Retrieve a list of companies with earnings transcripts, along with the total number of transcripts available for each company.",
    {}, 
    async () => {
      try {
        const results = await directoryClient.getEarningsTranscriptList();
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
    "getAvailableExchanges",
    "Access a complete list of supported stock exchanges using the FMP Available Exchanges API. This API provides a comprehensive overview of global stock exchanges, allowing users to identify where securities are traded and filter data by specific exchanges for further analysis.",
    {}, 
    async () => {
      try {
        const results = await directoryClient.getAvailableExchanges();
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
    "getAvailableSectors",
    "Access a complete list of industry sectors using the FMP Available Sectors API. This API helps users categorize and filter companies based on their respective sectors, enabling deeper analysis and more focused queries across different industries.",
    {}, 
    async () => {
      try {
        const results = await directoryClient.getAvailableSectors();
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
    "getAvailableIndustries", 
    "Access a comprehensive list of industries where stock symbols are available using the FMP Available Industries API. This API helps users filter and categorize companies based on their industry for more focused research and analysis.",
    {}, 
    async () => {
      try {
        const results = await directoryClient.getAvailableIndustries();
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
    "getAvailableCountries",
    "Access a comprehensive list of countries where stock symbols are available with the FMP Available Countries API. This API enables users to filter and analyze stock symbols based on the country of origin or the primary market where the securities are traded.",
    {}, 
    async () => {
      try {
        const results = await directoryClient.getAvailableCountries();
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
