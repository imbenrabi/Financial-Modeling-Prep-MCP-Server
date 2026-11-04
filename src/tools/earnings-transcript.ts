import { z } from "zod";
import { EarningsTranscriptClient } from "../api/earnings-transcript/EarningsTranscriptClient.js";
import type { ToolRegistrar } from "../toolception-adapters/ToolCollector.js";

/**
 * Register all earnings transcript-related tools with the MCP server
 * @param server The MCP server instance
 * @param accessToken The Financial Modeling Prep API access token (optional when using lazy loading)
 */
export function registerEarningsTranscriptTools(
  server: ToolRegistrar,
  accessToken?: string
): void {
  const earningsTranscriptClient = new EarningsTranscriptClient(accessToken);

  server.tool(
    "getLatestEarningsTranscripts",
    "Access available earnings transcripts for companies with the FMP Latest Earning Transcripts API. Retrieve a list of companies with earnings transcripts, along with the total number of transcripts available for each company.",
    {
      limit: z.number().optional().describe("Limit the number of results"),
      page: z.number().optional().describe("Page number for pagination"),
    },
    async ({ limit, page }) => {
      try {
        const results = await earningsTranscriptClient.getLatestTranscripts({
          limit,
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
    "getEarningsTranscript",
    "Access the full transcript of a company’s earnings call with the FMP Earnings Transcript API. Stay informed about a company’s financial performance, future plans, and overall strategy by analyzing management's communication.",
    {
      symbol: z.string().describe("Stock symbol"),
      year: z.string().describe("Year of the earnings call"),
      quarter: z
        .string()
        .describe("Quarter of the earnings call (e.g., 1, 2, 3, 4)"),
      limit: z.number().optional().describe("Limit the number of results"),
    },
    async ({ symbol, year, quarter, limit }) => {
      try {
        const results = await earningsTranscriptClient.getTranscript({
          symbol,
          year,
          quarter,
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
    "getEarningsTranscriptDates",
    "Access earnings call transcript dates for specific companies with the FMP Transcripts Dates By Symbol API. Get a comprehensive overview of earnings call schedules based on fiscal year and quarter.",
    {
      symbol: z.string().describe("Stock symbol"),
    },
    async ({ symbol }) => {
      try {
        const results = await earningsTranscriptClient.getTranscriptDates({
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
    "getAvailableTranscriptSymbols",
    "Access a complete list of stock symbols with available earnings call transcripts using the FMP Available Earnings Transcript Symbols API. Retrieve information on which companies have earnings transcripts and how many are accessible for detailed financial analysis.",
    {},
    async () => {
      try {
        const results =
          await earningsTranscriptClient.getAvailableTranscriptSymbols();
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
