import { z } from "zod";
import { SearchClient } from "../api/search/SearchClient.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

/**
 * Register all search-related tools with the MCP server
 * @param server The MCP server instance
 * @param accessToken The Financial Modeling Prep API access token (optional when using lazy loading)
 */
export function registerSearchTools(
  server: McpServer,
  accessToken?: string
): void {
  const searchClient = new SearchClient(accessToken);

  server.tool(
    "searchSymbol",
    "Easily find the ticker symbol of any stock with the FMP Stock Symbol Search API. Search by company name or symbol across multiple global markets.",
    {
      query: z.string().describe("The search query to find stock symbols"),
      limit: z
        .number()
        .optional()
        .describe("Optional limit on number of results (default: 50)"),
      exchange: z
        .string()
        .optional()
        .describe("Optional exchange filter (e.g., NASDAQ, NYSE)"),
    },
    async ({ query, limit, exchange }) => {
      try {
        const results = await searchClient.searchSymbol(query, limit, exchange);
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
    "searchName",
    "Search for ticker symbols, company names, and exchange details for equity securities and ETFs listed on various exchanges with the FMP Name Search API. This endpoint is useful for retrieving ticker symbols when you know the full or partial company or asset name but not the symbol identifier.",
    {
      query: z.string().describe("The search query to find company names"),
      limit: z
        .number()
        .optional()
        .describe("Optional limit on number of results (default: 50)"),
      exchange: z
        .string()
        .optional()
        .describe("Optional exchange filter (e.g., NASDAQ, NYSE)"),
    },
    async ({ query, limit, exchange }) => {
      try {
        const results = await searchClient.searchName(query, limit, exchange);
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
    "searchCIK",
    "Easily retrieve the Central Index Key (CIK) for publicly traded companies with the FMP CIK API. Access unique identifiers needed for SEC filings and regulatory documents for a streamlined compliance and financial analysis process.",
    {
      cik: z.string().describe("The CIK number to search for"),
      limit: z
        .number()
        .optional()
        .describe("Optional limit on number of results (default: 50)"),
    },
    async ({ cik, limit }) => {
      try {
        const results = await searchClient.searchCIK(cik, limit);
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
    "searchCUSIP",
    "Easily search and retrieve financial securities information by CUSIP number using the FMP CUSIP API. Find key details such as company name, stock symbol, and market capitalization associated with the CUSIP.",
    {
      cusip: z.string().describe("The CUSIP number to search for"),
    },
    async ({ cusip }) => {
      try {
        const results = await searchClient.searchCUSIP(cusip);
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
    "searchISIN",
    "Easily search and retrieve the International Securities Identification Number (ISIN) for financial securities using the FMP ISIN API. Find key details such as company name, stock symbol, and market capitalization associated with the ISIN.",
    {
      isin: z.string().describe("The ISIN number to search for"),
    },
    async ({ isin }) => {
      try {
        const results = await searchClient.searchISIN(isin);
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
    "stockScreener",
    "Discover stocks that align with your investment strategy using the FMP Stock Screener API. Filter stocks based on market cap, price, volume, beta, sector, country, and more to identify the best opportunities.",
    {
      marketCapMoreThan: z
        .number()
        .optional()
        .describe("Filter companies with market cap greater than this value"),
      marketCapLowerThan: z
        .number()
        .optional()
        .describe("Filter companies with market cap less than this value"),
      sector: z
        .string()
        .optional()
        .describe("Filter by sector (e.g., Technology)"),
      industry: z
        .string()
        .optional()
        .describe("Filter by industry (e.g., Consumer Electronics)"),
      betaMoreThan: z
        .number()
        .optional()
        .describe("Filter companies with beta greater than this value"),
      betaLowerThan: z
        .number()
        .optional()
        .describe("Filter companies with beta less than this value"),
      priceMoreThan: z
        .number()
        .optional()
        .describe("Filter companies with price greater than this value"),
      priceLowerThan: z
        .number()
        .optional()
        .describe("Filter companies with price less than this value"),
      dividendMoreThan: z
        .number()
        .optional()
        .describe("Filter companies with dividend greater than this value"),
      dividendLowerThan: z
        .number()
        .optional()
        .describe("Filter companies with dividend less than this value"),
      volumeMoreThan: z
        .number()
        .optional()
        .describe("Filter companies with volume greater than this value"),
      volumeLowerThan: z
        .number()
        .optional()
        .describe("Filter companies with volume less than this value"),
      avgVolumeMoreThan: z
        .number()
        .optional()
        .describe("Filter companies with average volume greater than this value"),
      avgVolumeLowerThan: z
        .number()
        .optional()
        .describe("Filter companies with average volume less than this value"),
      exchange: z
        .string()
        .optional()
        .describe("Filter by exchange (e.g., NASDAQ)"),
      country: z.string().optional().describe("Filter by country (e.g., US)"),
      isEtf: z.boolean().optional().describe("Filter ETFs"),
      isFund: z.boolean().optional().describe("Filter funds"),
      isActivelyTrading: z
        .boolean()
        .optional()
        .describe("Filter actively trading companies"),
      limit: z.number().optional().describe("Limit number of results"),
      page: z.number().optional().describe("Page number for pagination"),
      includeAllShareClasses: z
        .boolean()
        .optional()
        .describe("Include all share classes"),
    },
    async (params) => {
      try {
        const results = await searchClient.stockScreener(params);
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
    "searchExchangeVariants",
    "Search across multiple public exchanges to find where a given stock symbol is listed using the FMP Exchange Variants API. This allows users to quickly identify all the exchanges where a security is actively traded.",
    {
      symbol: z
        .string()
        .describe("The stock symbol to search for exchange variants"),
    },
    async ({ symbol }) => {
      try {
        const results = await searchClient.searchExchangeVariants(symbol);
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
