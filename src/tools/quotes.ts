import { z } from "zod";
import { QuotesClient } from "../api/quotes/QuotesClient.js";
import type { ToolRegistrar } from "../toolception-adapters/ToolCollector.js";

/**
 * Register all quotes-related tools with the MCP server
 * @param server The MCP server instance
 * @param accessToken The Financial Modeling Prep API access token (optional when using lazy loading)
 */
export function registerQuotesTools(
  server: ToolRegistrar,
  accessToken?: string
): void {
  const quotesClient = new QuotesClient(accessToken);

  server.tool(
    "getQuote",
    "Access real-time stock quotes with the FMP Stock Quote API. Get up-to-the-minute prices, changes, and volume data for individual stocks.",
    {
      symbol: z.string().describe("Stock symbol"),
    },
    async ({ symbol }) => {
      try {
        const results = await quotesClient.getQuote({ symbol });
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
    "getQuoteShort",
    "Get quick snapshots of real-time stock quotes with the FMP Stock Quote Short API. Access key stock data like current price, volume, and price changes for instant market insights.",
    {
      symbol: z.string().describe("Stock symbol"),
    },
    async ({ symbol }) => {
      try {
        const results = await quotesClient.getQuoteShort({ symbol });
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
    "getAftermarketTrade",
    "Track real-time trading activity occurring after regular market hours with the FMP Aftermarket Trade API. Access key details such as trade prices, sizes, and timestamps for trades executed during the post-market session.",
    {
      symbol: z.string().describe("Stock symbol"),
    },
    async ({ symbol }) => {
      try {
        const results = await quotesClient.getAftermarketTrade({ symbol });
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
    "getAftermarketQuote",
    "Access real-time aftermarket quotes for stocks with the FMP Aftermarket Quote API. Track bid and ask prices, volume, and other relevant data outside of regular trading hours.",
    {
      symbol: z.string().describe("Stock symbol"),
    },
    async ({ symbol }) => {
      try {
        const results = await quotesClient.getAftermarketQuote({ symbol });
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
    "getStockPriceChange",
    "Track stock price fluctuations in real-time with the FMP Stock Price Change API. Monitor percentage and value changes over various time periods, including daily, weekly, monthly, and long-term.",
    {
      symbol: z.string().describe("Stock symbol"),
    },
    async ({ symbol }) => {
      try {
        const results = await quotesClient.getStockPriceChange({ symbol });
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
    "getBatchQuotes",
    "Retrieve multiple real-time stock quotes in a single request with the FMP Stock Batch Quote API. Access current prices, volume, and detailed data for multiple companies at once, making it easier to track large portfolios or monitor multiple stocks simultaneously.",
    {
      symbols: z.string().describe("Comma-separated list of stock symbols"),
    },
    async ({ symbols }) => {
      try {
        const results = await quotesClient.getBatchQuotes({ symbols });
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
    "getBatchQuotesShort",
    "Access real-time, short-form quotes for multiple stocks with the FMP Stock Batch Quote Short API. Get a quick snapshot of key stock data such as current price, change, and volume for several companies in one streamlined request.",
    {
      symbols: z.string().describe("Comma-separated list of stock symbols"),
    },
    async ({ symbols }) => {
      try {
        const results = await quotesClient.getBatchQuotesShort({ symbols });
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
    "getBatchAftermarketTrade",
    "Retrieve real-time aftermarket trading data for multiple stocks with the FMP Batch Aftermarket Trade API. Track post-market trade prices, volumes, and timestamps across several companies simultaneously.",
    {
      symbols: z.string().describe("Comma-separated list of stock symbols"),
    },
    async ({ symbols }) => {
      try {
        const results = await quotesClient.getBatchAftermarketTrade({
          symbols,
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
    "getBatchAftermarketQuote",
    "Retrieve real-time aftermarket quotes for multiple stocks with the FMP Batch Aftermarket Quote API. Access bid and ask prices, volume, and other relevant data for several companies during post-market trading.",
    {
      symbols: z.string().describe("Comma-separated list of stock symbols"),
    },
    async ({ symbols }) => {
      try {
        const results = await quotesClient.getBatchAftermarketQuote({
          symbols,
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
    "getExchangeQuotes",
    "Retrieve real-time stock quotes for all listed stocks on a specific exchange with the FMP Exchange Stock Quotes API. Track price changes and trading activity across the entire exchange.",
    {
      exchange: z.string().describe("Exchange name (e.g., NASDAQ, NYSE)"),
      short: z.boolean().optional().describe("Whether to use short format"),
    },
    async ({ exchange, short }) => {
      try {
        const results = await quotesClient.getExchangeQuotes({
          exchange,
          short,
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
    "getMutualFundQuotes",
    "Access real-time quotes for mutual funds with the FMP Mutual Fund Price Quotes API. Track current prices, performance changes, and key data for various mutual funds.",
    {
      short: z.boolean().optional().describe("Whether to use short format"),
    },
    async ({ short }) => {
      try {
        const results = await quotesClient.getMutualFundQuotes({ short });
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
    "getETFQuotes",
    "Get real-time price quotes for exchange-traded funds (ETFs) with the FMP ETF Price Quotes API. Track current prices, performance changes, and key data for a wide variety of ETFs.",
    {
      short: z.boolean().optional().describe("Whether to use short format"),
    },
    async ({ short }) => {
      try {
        const results = await quotesClient.getETFQuotes({ short });
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
    "getCommodityQuotes",
    "Get up-to-the-minute quotes for commodities with the FMP Real-Time Commodities Quotes API. Track the latest prices, changes, and volumes for a wide range of commodities, including oil, gold, and agricultural products.",
    {
      short: z.boolean().optional().describe("Whether to use short format"),
    },
    async ({ short }) => {
      try {
        const results = await quotesClient.getCommodityQuotes({ short });
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
    "getCryptoQuotes",
    "Access real-time cryptocurrency quotes with the FMP Full Cryptocurrency Quotes API. Track live prices, trading volumes, and price changes for a wide range of digital assets.",
    {
      short: z.boolean().optional().describe("Whether to use short format"),
    },
    async ({ short }) => {
      try {
        const results = await quotesClient.getCryptoQuotes({ short });
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
    "getForexQuotes",
    "Retrieve real-time quotes for multiple forex currency pairs with the FMP Batch Forex Quote API. Get real-time price changes and updates for a variety of forex pairs in a single request.",
    {
      short: z.boolean().optional().describe("Whether to use short format"),
    },
    async ({ short }) => {
      try {
        const results = await quotesClient.getForexQuotes({ short });
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
    "getIndexQuotes",
    "Track real-time movements of major stock market indexes with the FMP Stock Market Index Quotes API. Access live quotes for global indexes and monitor changes in their performance.",
    {
      short: z.boolean().optional().describe("Whether to use short format"),
    },
    async ({ short }) => {
      try {
        const results = await quotesClient.getIndexQuotes({ short });
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
