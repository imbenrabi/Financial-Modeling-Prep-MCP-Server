import { z } from "zod";
import { Form13FClient } from "../api/form-13f/Form13FClient.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

/**
 * Register all Form 13F-related tools with the MCP server
 * @param server The MCP server instance
 * @param accessToken The Financial Modeling Prep API access token (optional when using lazy loading)
 */
export function registerForm13FTools(
  server: McpServer,
  accessToken?: string
): void {
  const form13fClient = new Form13FClient(accessToken);

  server.tool(
    "getLatestInstitutionalFilings",
    "Stay up to date with the most recent SEC filings related to institutional ownership using the Institutional Ownership Filings API. This tool allows you to track the latest reports and disclosures from institutional investors, giving you a real-time view of major holdings and regulatory submissions.",
    {
      page: z.number().optional().describe("Page number (default: 0)"),
      limit: z
        .number()
        .optional()
        .describe("Limit on number of results (default: 100, max: 100)"),
    },
    async ({ page, limit }) => {
      try {
        const results = await form13fClient.getLatestFilings({ page, limit });
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
    "getSecFilingExtract",
    "The Filings Extract API allows users to extract detailed data directly from official SEC filings. This API provides access to key information such as company shares, security details, and filing links, making it easier to analyze corporate disclosures.",
    {
      cik: z.string().describe("CIK number"),
      year: z.union([z.string(), z.number()]).describe("Year of filing"),
      quarter: z
        .union([z.string(), z.number()])
        .describe("Quarter of filing (1-4)"),
    },
    async ({ cik, year, quarter }) => {
      try {
        const results = await form13fClient.getFilingExtract(
          cik,
          year,
          quarter
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
    "getForm13FFilingDates",
    "The Form 13F Filings Dates API allows you to retrieve dates associated with Form 13F filings by institutional investors. This is crucial for tracking stock holdings of institutional investors at specific points in time, providing valuable insights into their investment strategies.",
    {
      cik: z.string().describe("CIK number"),
    },
    async ({ cik }) => {
      try {
        const results = await form13fClient.getFilingDates(cik);
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
    "getFilingExtractAnalyticsByHolder",
    "The Filings Extract With Analytics By Holder API provides an analytical breakdown of institutional filings. This API offers insight into stock movements, strategies, and portfolio changes by major institutional holders, helping you understand their investment behavior and track significant changes in stock ownership.",
    {
      symbol: z.string().describe("Stock symbol"),
      year: z.union([z.string(), z.number()]).describe("Year of filing"),
      quarter: z
        .union([z.string(), z.number()])
        .describe("Quarter of filing (1-4)"),
      page: z.number().optional().describe("Page number (default: 0)"),
      limit: z
        .number()
        .optional()
        .describe("Limit on number of results (default: 10, max: 100)"),
    },
    async ({ symbol, year, quarter, page, limit }) => {
      try {
        const results = await form13fClient.getFilingExtractAnalyticsByHolder(
          symbol,
          year,
          quarter,
          { page, limit }
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
    "getHolderPerformanceSummary",
    "The Holder Performance Summary API provides insights into the performance of institutional investors based on their stock holdings. This data helps track how well institutional holders are performing, their portfolio changes, and how their performance compares to benchmarks like the S&P 500.",
    {
      cik: z.string().describe("CIK number"),
      page: z.number().optional().describe("Page number (default: 0)"),
    },
    async ({ cik, page }) => {
      try {
        const results = await form13fClient.getHolderPerformanceSummary(cik, {
          page,
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
    "getHolderIndustryBreakdown",
    "The Holders Industry Breakdown API provides an overview of the sectors and industries that institutional holders are investing in. This API helps analyze how institutional investors distribute their holdings across different industries and track changes in their investment strategies over time.",
    {
      cik: z.string().describe("CIK number"),
      year: z.union([z.string(), z.number()]).describe("Year of filing"),
      quarter: z
        .union([z.string(), z.number()])
        .describe("Quarter of filing (1-4)"),
    },
    async ({ cik, year, quarter }) => {
      try {
        const results = await form13fClient.getHolderIndustryBreakdown(
          cik,
          year,
          quarter
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
    "getPositionsSummary",
    "The Positions Summary API provides a comprehensive snapshot of institutional holdings for a specific stock symbol. It tracks key metrics like the number of investors holding the stock, changes in the number of shares, total investment value, and ownership percentages over time.",
    {
      symbol: z.string().describe("Stock symbol"),
      year: z.union([z.string(), z.number()]).describe("Year of filing"),
      quarter: z
        .union([z.string(), z.number()])
        .describe("Quarter of filing (1-4)"),
    },
    async ({ symbol, year, quarter }) => {
      try {
        const results = await form13fClient.getPositionsSummary(
          symbol,
          year,
          quarter
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
    "getIndustryPerformanceSummary",
    "The Industry Performance Summary API provides an overview of how various industries are performing financially. By analyzing the value of industries over a specific period, this API helps investors and analysts understand the health of entire sectors and make informed decisions about sector-based investments.",
    {
      year: z.union([z.string(), z.number()]).describe("Year of filing"),
      quarter: z
        .union([z.string(), z.number()])
        .describe("Quarter of filing (1-4)"),
    },
    async ({ year, quarter }) => {
      try {
        const results = await form13fClient.getIndustryPerformanceSummary(
          year,
          quarter
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
