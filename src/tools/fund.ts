import { z } from "zod";
import { FundClient } from "../api/fund/FundClient.js";
import type { ToolRegistrar } from "../toolception-adapters/ToolCollector.js";

/**
 * Register all fund-related tools with the MCP server
 * @param server The MCP server instance
 * @param accessToken The Financial Modeling Prep API access token (optional when using lazy loading)
 */
export function registerFundTools(
  server: ToolRegistrar,
  accessToken?: string
): void {
  const fundClient = new FundClient(accessToken);

  server.tool(
    "getFundHoldings",
    "Get a detailed breakdown of the assets held within ETFs and mutual funds using the FMP ETF & Fund Holdings API. Access real-time data on the specific securities and their weights in the portfolio, providing insights into asset composition and fund strategies.",
    {
      symbol: z.string().describe("Fund symbol"),
    },
    async ({ symbol }) => {
      try {
        const results = await fundClient.getHoldings(symbol);
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
    "getFundInfo",
    "Access comprehensive data on ETFs and mutual funds with the FMP ETF & Mutual Fund Information API. Retrieve essential details such as ticker symbol, fund name, expense ratio, assets under management, and more.",
    {
      symbol: z.string().describe("Fund symbol"),
    },
    async ({ symbol }) => {
      try {
        const results = await fundClient.getInfo(symbol);
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
    "getFundCountryAllocation",
    "Gain insight into how ETFs and mutual funds distribute assets across different countries with the FMP ETF & Fund Country Allocation API. This tool provides detailed information on the percentage of assets allocated to various regions, helping you make informed investment decisions.",
    {
      symbol: z.string().describe("Fund symbol"),
    },
    async ({ symbol }) => {
      try {
        const results = await fundClient.getCountryAllocation(symbol);
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
    "getFundAssetExposure",
    "Discover which ETFs hold specific stocks with the FMP ETF Asset Exposure API. Access detailed information on market value, share numbers, and weight percentages for assets within ETFs.",
    {
      symbol: z.string().describe("Fund symbol"),
    },
    async ({ symbol }) => {
      try {
        const results = await fundClient.getAssetExposure(symbol);
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
    "getFundSectorWeighting",
    "The FMP ETF Sector Weighting API provides a breakdown of the percentage of an ETF's assets that are invested in each sector. For example, an investor may want to invest in an ETF that has a high exposure to the technology sector if they believe that the technology sector is poised for growth.",
    {
      symbol: z.string().describe("Fund symbol"),
    },
    async ({ symbol }) => {
      try {
        const results = await fundClient.getSectorWeighting(symbol);
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
    "getDisclosure",
    "Access the latest disclosures from mutual funds and ETFs with the FMP Mutual Fund & ETF Disclosure API. This API provides updates on filings, changes in holdings, and other critical disclosure data for mutual funds and ETFs.",
    {
      symbol: z.string().describe("Fund symbol"),
    },
    async ({ symbol }) => {
      try {
        const results = await fundClient.getDisclosure(symbol);
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
    "getFundDisclosure",
    "Access comprehensive disclosure data for mutual funds with the FMP Mutual Fund Disclosures API. Analyze recent filings, balance sheets, and financial reports to gain insights into mutual fund portfolios.",
    {
      symbol: z.string().describe("Fund symbol"),
      year: z.number().describe("Year"),
      quarter: z.number().describe("Quarter"),
      cik: z.string().optional().describe("Optional CIK number"),
    },
    async ({ symbol, year, quarter, cik }) => {
      try {
        const results = await fundClient.getFundDisclosure(symbol, year, quarter, cik);
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
    "searchFundDisclosures",
    "Easily search for mutual fund and ETF disclosures by name using the Mutual Fund & ETF Disclosure Name Search API. This API allows you to find specific reports and filings based on the fund or ETF name, providing essential details like CIK number, entity information, and reporting file number.",
    {
      name: z.string().describe("Name of the holder to search for"),
    },
    async ({ name }) => {
      try {
        const results = await fundClient.searchDisclosures(name);
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
    "getFundDisclosureDates",
    "Retrieve detailed disclosures for mutual funds and ETFs based on filing dates with the FMP Fund & ETF Disclosures by Date API. Stay current with the latest filings and track regulatory updates effectively.",
    {
      symbol: z.string().describe("Fund symbol"),
      cik: z.string().optional().describe("Optional CIK number"),
    },
    async ({ symbol, cik }) => {
      try {
        const results = await fundClient.getDisclosureDates(symbol, cik);
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
