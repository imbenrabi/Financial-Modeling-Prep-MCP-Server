import { z } from "zod";
import { ESGClient } from "../api/esg/ESGClient.js";
import type { ToolRegistrar } from "../toolception-adapters/ToolCollector.js";

/**
 * Register all ESG-related tools with the MCP server
 * @param server The MCP server instance
 * @param accessToken The Financial Modeling Prep API access token (optional when using lazy loading)
 */
export function registerESGTools(server: ToolRegistrar, accessToken?: string): void {
  const esgClient = new ESGClient(accessToken);

  server.tool(
    "getESGDisclosures",
    "Align your investments with your values using the FMP ESG Investment Search API. Discover companies and funds based on Environmental, Social, and Governance (ESG) scores, performance, controversies, and business involvement criteria.",
    {
      symbol: z.string().describe("Stock symbol"),
    },
    async ({ symbol }) => {
      try {
        const results = await esgClient.getDisclosures(symbol);
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
    "getESGRatings",
    "Access comprehensive ESG ratings for companies and funds with the FMP ESG Ratings API. Make informed investment decisions based on environmental, social, and governance (ESG) performance data.",
    {
      symbol: z.string().describe("Stock symbol"),
    },
    async ({ symbol }) => {
      try {
        const results = await esgClient.getRatings(symbol);
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
    "getESGBenchmarks",
    "Evaluate the ESG performance of companies and funds with the FMP ESG Benchmark Comparison API. Compare ESG leaders and laggards within industries to make informed and responsible investment decisions.",
    {
      year: z
        .string()
        .optional()
        .describe("Optional year to get benchmarks for"),
    },
    async ({ year }) => {
      try {
        const results = await esgClient.getBenchmarks(year);
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
