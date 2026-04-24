import { z } from "zod";
import { SECFilingsClient } from "../api/sec-filings/SECFilingsClient.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

/**
 * Register all SEC filings-related tools with the MCP server
 * @param server The MCP server instance
 * @param accessToken The Financial Modeling Prep API access token (optional when using lazy loading)
 */
export function registerSECFilingsTools(
  server: McpServer,
  accessToken?: string
): void {
  const secFilingsClient = new SECFilingsClient(accessToken);

  server.tool(
    "getLatest8KFilings",
    "Stay up-to-date with the most recent 8-K filings from publicly traded companies using the FMP Latest 8-K SEC Filings API. Get real-time access to significant company events such as mergers, acquisitions, leadership changes, and other material events that may impact the market.",
    {
      from_date: z.string().describe("Start date (YYYY-MM-DD)"),
      to: z.string().describe("End date (YYYY-MM-DD)"),
      page: z.number().optional().describe("Page number for pagination"),
      limit: z.number().optional().describe("Limit the number of results"),
    },
    async ({ from_date: from, to, page, limit }) => {
      try {
        const results = await secFilingsClient.getLatest8KFilings({
          from,
          to,
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
    "getLatestFinancialFilings",
    "Stay updated with the most recent SEC filings from publicly traded companies using the FMP Latest SEC Filings API. Access essential regulatory documents, including financial statements, annual reports, 8-K, 10-K, and 10-Q forms.",
    {
      from_date: z.string().describe("Start date (YYYY-MM-DD)"),
      to: z.string().describe("End date (YYYY-MM-DD)"),
      page: z.number().optional().describe("Page number for pagination"),
      limit: z.number().optional().describe("Limit the number of results"),
    },
    async ({ from_date: from, to, page, limit }) => {
      try {
        const results = await secFilingsClient.getLatestFinancialFilings({
          from,
          to,
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
    "getFilingsByFormType",
    "Search for specific SEC filings by form type with the FMP SEC Filings By Form Type API. Retrieve filings such as 10-K, 10-Q, 8-K, and others, filtered by the exact type of document you're looking for.",
    {
      formType: z.string().describe("Form type (e.g., 8-K, 10-K, 10-Q)"),
      from_date: z.string().describe("Start date (YYYY-MM-DD)"),
      to: z.string().describe("End date (YYYY-MM-DD)"),
      page: z.number().optional().describe("Page number for pagination"),
      limit: z.number().optional().describe("Limit the number of results"),
    },
    async ({ formType, from_date: from, to, page, limit }) => {
      try {
        const results = await secFilingsClient.getFilingsByFormType({
          formType,
          from,
          to,
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
    "getFilingsBySymbol",
    "Search and retrieve SEC filings by company symbol using the FMP SEC Filings By Symbol API. Gain direct access to regulatory filings such as 8-K, 10-K, and 10-Q reports for publicly traded companies.",
    {
      symbol: z.string().describe("Stock symbol"),
      from_date: z.string().describe("Start date (YYYY-MM-DD)"),
      to: z.string().describe("End date (YYYY-MM-DD)"),
      page: z.number().optional().describe("Page number for pagination"),
      limit: z.number().optional().describe("Limit the number of results"),
    },
    async ({ symbol, from_date: from, to, page, limit }) => {
      try {
        const results = await secFilingsClient.getFilingsBySymbol({
          symbol,
          from,
          to,
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
    "getFilingsByCIK",
    "Search for SEC filings using the FMP SEC Filings By CIK API. Access detailed regulatory filings by Central Index Key (CIK) number, enabling you to track all filings related to a specific company or entity.",
    {
      cik: z.string().describe("Central Index Key (CIK)"),
      from_date: z.string().describe("Start date (YYYY-MM-DD)"),
      to: z.string().describe("End date (YYYY-MM-DD)"),
      page: z.number().optional().describe("Page number for pagination"),
      limit: z.number().optional().describe("Limit the number of results"),
    },
    async ({ cik, from_date: from, to, page, limit }) => {
      try {
        const results = await secFilingsClient.getFilingsByCIK({
          cik,
          from,
          to,
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
    "searchCompaniesByName",
    "Search for SEC filings by company or entity name using the FMP SEC Filings By Name API. Quickly retrieve official filings for any organization based on its name.",
    {
      company: z.string().describe("Company name or partial name"),
    },
    async ({ company }) => {
      try {
        const results = await secFilingsClient.searchCompaniesByName({
          company,
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
    "searchCompaniesBySymbol",
    "Find company information and regulatory filings using a stock symbol with the FMP SEC Filings Company Search By Symbol API. Quickly access essential company details based on stock ticker symbols.",
    {
      symbol: z.string().describe("Stock symbol"),
    },
    async ({ symbol }) => {
      try {
        const results = await secFilingsClient.searchCompaniesBySymbol({
          symbol,
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
    "searchCompaniesByCIK",
    "Easily find company information using a CIK (Central Index Key) with the FMP SEC Filings Company Search By CIK API. Access essential company details and filings linked to a specific CIK number.",
    {
      cik: z.string().describe("Central Index Key (CIK)"),
    },
    async ({ cik }) => {
      try {
        const results = await secFilingsClient.searchCompaniesByCIK({
          cik,
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
    "getCompanySECProfile",
    "Retrieve detailed company profiles, including business descriptions, executive details, contact information, and financial data with the FMP SEC Company Full Profile API.",
    {
      symbol: z.string().optional().describe("Stock symbol"),
      cik: z.string().optional().describe("Central Index Key (CIK)"),
    },
    async ({ symbol, cik }) => {
      try {
        const results = await secFilingsClient.getCompanyProfile({
          symbol,
          cik,
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
    "getIndustryClassificationList",
    "Retrieve a comprehensive list of industry classifications, including Standard Industrial Classification (SIC) codes and industry titles with the FMP Industry Classification List API.",
    {
      industryTitle: z
        .string()
        .optional()
        .describe("Industry title or partial title"),
      sicCode: z.string().optional().describe("SIC code"),
    },
    async ({ industryTitle, sicCode }) => {
      try {
        const results = await secFilingsClient.getIndustryClassificationList({
          industryTitle,
          sicCode,
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
    "searchIndustryClassification",
    "Search and retrieve industry classification details for companies, including SIC codes, industry titles, and business information, with the FMP Industry Classification Search API.",
    {
      symbol: z.string().optional().describe("Stock symbol"),
      cik: z.string().optional().describe("Central Index Key (CIK)"),
      sicCode: z.string().optional().describe("SIC code"),
    },
    async ({ symbol, cik, sicCode }) => {
      try {
        const results = await secFilingsClient.searchIndustryClassification({
          symbol,
          cik,
          sicCode,
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
    "getAllIndustryClassification",
    "Access comprehensive industry classification data for companies across all sectors with the FMP All Industry Classification API. Retrieve key details such as SIC codes, industry titles, and business contact information.",
    {
      page: z.number().optional().describe("Page number for pagination"),
      limit: z.number().optional().describe("Limit the number of results"),
    },
    async ({ page, limit }) => {
      try {
        const results = await secFilingsClient.getAllIndustryClassification({
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
}
