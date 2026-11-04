import { z } from "zod";
import { FundraisersClient } from "../api/fundraisers/FundraisersClient.js";
import type { ToolRegistrar } from "../toolception-adapters/ToolCollector.js";

/**
 * Register all fundraisers-related tools with the MCP server
 * @param server The MCP server instance
 * @param accessToken The Financial Modeling Prep API access token (optional when using lazy loading)
 */
export function registerFundraisersTools(
  server: ToolRegistrar,
  accessToken?: string
): void {
  const fundraisersClient = new FundraisersClient(accessToken);

  server.tool(
    "getLatestCrowdfundingCampaigns",
    "Discover the most recent crowdfunding campaigns with the FMP Latest Crowdfunding Campaigns API. Stay informed on which companies and projects are actively raising funds, their financial details, and offering terms.",
    {
      page: z.number().optional().describe("Page number (default: 0)"),
      limit: z
        .number()
        .optional()
        .describe("Limit on number of results (default: 100, max: 1000)"),
    },
    async ({ page, limit }) => {
      try {
        const results = await fundraisersClient.getLatestCrowdfundingCampaigns(
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
    "searchCrowdfundingCampaigns",
    "Search for crowdfunding campaigns by company name, campaign name, or platform with the FMP Crowdfunding Campaign Search API. Access detailed information to track and analyze crowdfunding activities.",
    {
      name: z
        .string()
        .describe("Company name, campaign name, or platform to search for"),
    },
    async ({ name }) => {
      try {
        const results = await fundraisersClient.searchCrowdfundingCampaigns(
          name
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
    "getCrowdfundingCampaignsByCIK",
    "Access detailed information on all crowdfunding campaigns launched by a specific company with the FMP Crowdfunding By CIK API.",
    {
      cik: z.string().describe("CIK number to search for"),
    },
    async ({ cik }) => {
      try {
        const results = await fundraisersClient.getCrowdfundingCampaignsByCIK(
          cik
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
    "getLatestEquityOfferings",
    "Stay informed about the latest equity offerings with the FMP Equity Offering Updates API. Track new shares being issued by companies and get insights into exempt offerings and amendments.",
    {
      page: z.number().optional().describe("Page number (default: 0)"),
      limit: z
        .number()
        .optional()
        .describe("Limit on number of results (default: 10, max: 1000)"),
      cik: z.string().optional().describe("Optional CIK number to filter by"),
    },
    async ({ page, limit, cik }) => {
      try {
        const results = await fundraisersClient.getLatestEquityOfferings(
          page,
          limit,
          cik
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
    "searchEquityOfferings",
    "Easily search for equity offerings by company name or stock symbol with the FMP Equity Offering Search API. Access detailed information about recent share issuances to stay informed on company fundraising activities.",
    {
      name: z.string().describe("Company name or stock symbol to search for"),
    },
    async ({ name }) => {
      try {
        const results = await fundraisersClient.searchEquityOfferings(name);
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
    "getEquityOfferingsByCIK",
    "Access detailed information on equity offerings announced by specific companies with the FMP Company Equity Offerings by CIK API. Track offering activity and identify potential investment opportunities.",
    {
      cik: z.string().describe("CIK number to search for"),
    },
    async ({ cik }) => {
      try {
        const results = await fundraisersClient.getEquityOfferingsByCIK(cik);
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
