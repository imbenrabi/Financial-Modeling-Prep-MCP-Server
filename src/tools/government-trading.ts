import { z } from "zod";
import { GovernmentTradingClient } from "../api/government-trading/GovernmentTradingClient.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

/**
 * Register all government trading-related tools with the MCP server
 * @param server The MCP server instance
 * @param accessToken The Financial Modeling Prep API access token (optional when using lazy loading)
 */
export function registerGovernmentTradingTools(
  server: McpServer,
  accessToken?: string
): void {
  const governmentTradingClient = new GovernmentTradingClient(accessToken);

  server.tool(
    "getLatestSenateDisclosures",
    "Access the latest financial disclosures from U.S. Senate members with the FMP Latest Senate Financial Disclosures API. Track recent trades, asset ownership, and transaction details for enhanced transparency in government financial activities.",
    {
      page: z.number().optional().describe("Page number for pagination"),
      limit: z.number().optional().describe("Limit the number of results"),
    },
    async ({ page, limit }) => {
      try {
        const results =
          await governmentTradingClient.getLatestSenateDisclosures({
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
    "getLatestHouseDisclosures",
    "Access real-time financial disclosures from U.S. House members with the FMP Latest House Financial Disclosures API. Track recent trades, asset ownership, and financial holdings for enhanced visibility into political figures' financial activities.",
    {
      page: z.number().optional().describe("Page number for pagination"),
      limit: z.number().optional().describe("Limit the number of results"),
    },
    async ({ page, limit }) => {
      try {
        const results = await governmentTradingClient.getLatestHouseDisclosures(
          {
            page,
            limit,
          }
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
    "getSenateTrades",
    "Monitor the trading activity of US Senators with the FMP Senate Trading Activity API. Access detailed information on trades made by Senators, including trade dates, assets, amounts, and potential conflicts of interest.",
    {
      symbol: z.string().describe("Stock symbol"),
    },
    async ({ symbol }) => {
      try {
        const results = await governmentTradingClient.getSenateTrades({
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
    "getSenateTradesByName",
    "Search for Senate trading activity by Senator name with the FMP Senate Trades by Name API. Access detailed information on trades made by specific Senators, including trade dates, assets, amounts, and potential conflicts of interest.",
    {
      name: z.string().describe("Senator name (first or last name)"),
    },
    async ({ name }) => {
      try {
        const results = await governmentTradingClient.getSenateTradesByName({
          name,
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
    "getHouseTrades",
    "Track the financial trades made by U.S. House members and their families with the FMP U.S. House Trades API. Access real-time information on stock sales, purchases, and other investment activities to gain insight into their financial decisions.",
    {
      symbol: z.string().describe("Stock symbol"),
    },
    async ({ symbol }) => {
      try {
        const results = await governmentTradingClient.getHouseTrades({
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
    "getHouseTradesByName",
    "Search for House trading activity by Representative name with the FMP House Trades by Name API. Access detailed information on trades made by specific Representatives, including trade dates, assets, amounts, and potential conflicts of interest.",
    {
      name: z.string().describe("Representative name (first or last name)"),
    },
    async ({ name }) => {
      try {
        const results = await governmentTradingClient.getHouseTradesByName({
          name,
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
    "getSenateTradesById",
    "Retrieve the Senate trading history of a single member by ID with the FMP Senate Trades By ID API. Use it after finding a member's ID through the Senate profile tools to see every disclosed trade for that member.",
    {
      senateID: z.string().describe("Congress member ID as used by FMP (e.g., P000197)"),
      page: z.number().optional().describe("Page number for pagination"),
      limit: z.number().optional().describe("Limit the number of results"),
    },
    async ({ senateID, page, limit }) => {
      try {
        const results = await governmentTradingClient.getSenateTradesById({
          senateID, page, limit
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
    "getHouseTradesById",
    "Retrieve the House trading history of a single member by ID with the FMP House Trades By ID API. Use it after finding a member's ID through the profile tools to see every disclosed trade for that member.",
    {
      senateID: z.string().describe("Congress member ID as used by FMP (e.g., P000197)"),
      page: z.number().optional().describe("Page number for pagination"),
      limit: z.number().optional().describe("Limit the number of results"),
    },
    async ({ senateID, page, limit }) => {
      try {
        const results = await governmentTradingClient.getHouseTradesById({
          senateID, page, limit
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
    "getSenatePositions",
    "List the positions held by members of Congress, with term dates, party and state, using the FMP Senate Positions API. Filter by member ID, party or position.",
    {
      senateID: z.string().optional().describe("Filter by congress member ID (e.g., P000197)"),
      party: z.string().optional().describe("Filter by party, case-sensitive (e.g., Republican, Democrat)"),
      position: z.string().optional().describe("Filter by position, case-sensitive (e.g., Senator, Representative)"),
      limit: z.number().optional().describe("Limit the number of results"),
    },
    async ({ senateID, party, position, limit }) => {
      try {
        const results = await governmentTradingClient.getSenatePositions({
          senateID, party, position, limit
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
    "getSenateProfile",
    "Look up profiles of members of Congress, including party, state, position and years active, with the FMP Senate Profiles API. Use it to find a member's ID for the trade and net worth tools.",
    {
      senateID: z.string().optional().describe("Filter by congress member ID (e.g., P000197)"),
      active: z.boolean().optional().describe("Only active members when true"),
      latestParty: z.string().optional().describe("Filter by most recent party"),
      latestPosition: z.string().optional().describe("Filter by most recent position"),
      page: z.number().optional().describe("Page number for pagination"),
      limit: z.number().optional().describe("Limit the number of results"),
    },
    async ({ senateID, active, latestParty, latestPosition, page, limit }) => {
      try {
        const results = await governmentTradingClient.getSenateProfile({
          senateID, active, latestParty, latestPosition, page, limit
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
    "getSenateNetWorth",
    "Retrieve the reported net worth records of a member of Congress with the FMP Senate Net Worth API.",
    {
      senateID: z.string().describe("Congress member ID as used by FMP (e.g., P000197)"),
      page: z.number().optional().describe("Page number for pagination"),
      limit: z.number().optional().describe("Limit the number of results"),
    },
    async ({ senateID, page, limit }) => {
      try {
        const results = await governmentTradingClient.getSenateNetWorth({
          senateID, page, limit
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
    "getSenateNetWorthAggregated",
    "Retrieve aggregated net worth figures of a member of Congress with the FMP Senate Net Worth Aggregated API.",
    {
      senateID: z.string().describe("Congress member ID as used by FMP (e.g., P000197)"),
    },
    async ({ senateID }) => {
      try {
        const results = await governmentTradingClient.getSenateNetWorthAggregated({
          senateID
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
