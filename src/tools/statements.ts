import { z } from "zod";
import { StatementsClient } from "../api/statements/StatementsClient.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

/**
 * Register all financial statements-related tools with the MCP server
 * @param server The MCP server instance
 * @param accessToken The Financial Modeling Prep API access token (optional when using lazy loading)
 */
export function registerStatementsTools(
  server: McpServer,
  accessToken?: string
): void {
  const statementsClient = new StatementsClient(accessToken);

  server.tool(
    "getIncomeStatement",
    "Access real-time income statement data for public companies, private companies, and ETFs with the FMP Real-Time Income Statements API. Track profitability, compare competitors, and identify business trends with up-to-date financial data.",
    {
      symbol: z.string().describe("Stock symbol"),
      limit: z
        .number()
        .optional()
        .describe("Limit on number of results (default: 100, max: 1000)"),
      period: z
        .enum(["Q1", "Q2", "Q3", "Q4", "FY"])
        .optional()
        .describe("Period (Q1, Q2, Q3, Q4, or FY)"),
    },
    async ({ symbol, limit, period }) => {
      try {
        const results = await statementsClient.getIncomeStatement(symbol, {
          limit,
          period,
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
    "getBalanceSheetStatement",
    "Access detailed balance sheet statements for publicly traded companies with the Balance Sheet Data API. Analyze assets, liabilities, and shareholder equity to gain insights into a company's financial health.",
    {
      symbol: z.string().describe("Stock symbol"),
      limit: z
        .number()
        .optional()
        .describe("Limit on number of results (default: 100, max: 1000)"),
      period: z
        .enum(["Q1", "Q2", "Q3", "Q4", "FY"])
        .optional()
        .describe("Period (Q1, Q2, Q3, Q4, or FY)"),
    },
    async ({ symbol, limit, period }) => {
      try {
        const results = await statementsClient.getBalanceSheetStatement(
          symbol,
          {
            limit,
            period,
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
    "getCashFlowStatement",
    "Gain insights into a company's cash flow activities with the Cash Flow Statements API. Analyze cash generated and used from operations, investments, and financing activities to evaluate the financial health and sustainability of a business.",
    {
      symbol: z.string().describe("Stock symbol"),
      limit: z
        .number()
        .optional()
        .describe("Limit on number of results (default: 100, max: 1000)"),
      period: z
        .enum(["Q1", "Q2", "Q3", "Q4", "FY"])
        .optional()
        .describe("Period (Q1, Q2, Q3, Q4, or FY)"),
    },
    async ({ symbol, limit, period }) => {
      try {
        const results = await statementsClient.getCashFlowStatement(symbol, {
          limit,
          period,
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
    "getLatestFinancialStatements",
    "Access the latest financial statements for publicly traded companies with the FMP Latest Financial Statements API. Track key financial metrics, including revenue, earnings, and cash flow, to stay informed about a company's financial performance.",
    {
      page: z.number().optional().describe("Page number (default: 0)"),
      limit: z
        .number()
        .optional()
        .describe("Limit on number of results (default: 250, max: 250)"),
    },
    async ({ page, limit }) => {
      try {
        const results = await statementsClient.getLatestFinancialStatements({
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
    "getIncomeStatementTTM",
    "Access real-time income statement data for public companies, private companies, and ETFs with the FMP Real-Time Income Statements API. Track profitability, compare competitors, and identify business trends with up-to-date financial data.",
    {
      symbol: z.string().describe("Stock symbol"),
      limit: z
        .number()
        .optional()
        .describe("Limit on number of results (default: 100, max: 1000)"),
    },
    async ({ symbol, limit }) => {
      try {
        const results = await statementsClient.getIncomeStatementTTM(symbol, {
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
    "getBalanceSheetStatementTTM",
    "Access detailed balance sheet statements for publicly traded companies with the Balance Sheet Data API. Analyze assets, liabilities, and shareholder equity to gain insights into a company's financial health.",
    {
      symbol: z.string().describe("Stock symbol"),
      limit: z
        .number()
        .optional()
        .describe("Limit on number of results (default: 100, max: 1000)"),
    },
    async ({ symbol, limit }) => {
      try {
        const results = await statementsClient.getBalanceSheetStatementTTM(
          symbol,
          { limit }
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
    "getCashFlowStatementTTM",
    "Gain insights into a company's cash flow activities with the Cash Flow Statements API. Analyze cash generated and used from operations, investments, and financing activities to evaluate the financial health and sustainability of a business.",
    {
      symbol: z.string().describe("Stock symbol"),
      limit: z
        .number()
        .optional()
        .describe("Limit on number of results (default: 100, max: 1000)"),
    },
    async ({ symbol, limit }) => {
      try {
        const results = await statementsClient.getCashFlowStatementTTM(symbol, {
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
    "getIncomeStatementGrowth",
    "Track key financial growth metrics with the Income Statement Growth API. Analyze how revenue, profits, and expenses have evolved over time, offering insights into a company’s financial health and operational efficiency.",
    {
      symbol: z.string().describe("Stock symbol"),
      limit: z
        .number()
        .optional()
        .describe("Limit on number of results (default: 100, max: 1000)"),
      period: z
        .enum(["Q1", "Q2", "Q3", "Q4", "FY"])
        .optional()
        .describe("Period (Q1, Q2, Q3, Q4, or FY)"),
    },
    async ({ symbol, limit, period }) => {
      try {
        const results = await statementsClient.getIncomeStatementGrowth(
          symbol,
          {
            limit,
            period,
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
    "getBalanceSheetStatementGrowth",
    "Analyze the growth of key balance sheet items over time with the Balance Sheet Statement Growth API. Track changes in assets, liabilities, and equity to understand the financial evolution of a company.",
    {
      symbol: z.string().describe("Stock symbol"),
      limit: z
        .number()
        .optional()
        .describe("Limit on number of results (default: 100, max: 1000)"),
      period: z
        .enum(["Q1", "Q2", "Q3", "Q4", "FY"])
        .optional()
        .describe("Period (Q1, Q2, Q3, Q4, or FY)"),
    },
    async ({ symbol, limit, period }) => {
      try {
        const results = await statementsClient.getBalanceSheetStatementGrowth(
          symbol,
          { limit, period }
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
    "getCashFlowStatementGrowth",
    "Measure the growth rate of a company’s cash flow with the FMP Cashflow Statement Growth API. Determine how quickly a company’s cash flow is increasing or decreasing over time.",
    {
      symbol: z.string().describe("Stock symbol"),
      limit: z
        .number()
        .optional()
        .describe("Limit on number of results (default: 100, max: 1000)"),
      period: z
        .enum(["Q1", "Q2", "Q3", "Q4", "FY"])
        .optional()
        .describe("Period (Q1, Q2, Q3, Q4, or FY)"),
    },
    async ({ symbol, limit, period }) => {
      try {
        const results = await statementsClient.getCashFlowStatementGrowth(
          symbol,
          { limit, period }
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
    "getFinancialStatementGrowth",
    "Analyze the growth of key financial statement items across income, balance sheet, and cash flow statements with the Financial Statement Growth API. Track changes over time to understand trends in financial performance.",
    {
      symbol: z.string().describe("Stock symbol"),
      limit: z
        .number()
        .optional()
        .describe("Limit on number of results (default: 100, max: 1000)"),
      period: z
        .enum(["Q1", "Q2", "Q3", "Q4", "FY"])
        .optional()
        .describe("Period (Q1, Q2, Q3, Q4, or FY)"),
    },
    async ({ symbol, limit, period }) => {
      try {
        const results = await statementsClient.getFinancialStatementGrowth(
          symbol,
          { limit, period }
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
    "getFinancialReportsDates",
    "Access the latest financial reports dates for publicly traded companies with the FMP Financial Reports Dates API. Track key financial metrics, including revenue, earnings, and cash flow, to stay informed about a company's financial performance.",
    {
      symbol: z.string().describe("Stock symbol"),
    },
    async ({ symbol }) => {
      try {
        const results = await statementsClient.getFinancialReportsDates(symbol);
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

  registerStatementsExtendedTools(server, statementsClient);
}

/**
 * Register the second half of statements tools (financial reports, segmentation,
 * as-reported statements, key metrics, ratios, financial scores, and owner earnings).
 * Split out from registerStatementsTools to keep cyclomatic complexity below the
 * sentrux max_cc=25 ceiling.
 */
function registerStatementsExtendedTools(
  server: McpServer,
  statementsClient: StatementsClient
): void {
  server.tool(
    "getFinancialReportJSON",
    "Access comprehensive annual reports with the FMP Annual Reports on Form 10-K API. Obtain detailed information about a company’s financial performance, business operations, and risk factors as reported to the SEC.",
    {
      symbol: z.string().describe("Stock symbol"),
      year: z.number().describe("Year of the report"),
      period: z
        .enum(["Q1", "Q2", "Q3", "Q4", "FY"])
        .describe("Period (Q1, Q2, Q3, Q4, or FY)"),
    },
    async ({ symbol, year, period }) => {
      try {
        const results = await statementsClient.getFinancialReportJSON(
          symbol,
          year,
          period
        );
        return {
          content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
        };
      } catch (error) {
        console.error("Error fetching financial report JSON:", error);
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
    "getFinancialReportXLSX",
    "Download detailed 10-K reports in XLSX format with the Financial Reports Form 10-K XLSX API. Effortlessly access and analyze annual financial data for companies in a spreadsheet-friendly format.",
    {
      symbol: z.string().describe("Stock symbol"),
      year: z.number().describe("Year of the report"),
      period: z
        .enum(["Q1", "Q2", "Q3", "Q4", "FY"])
        .describe("Period (Q1, Q2, Q3, Q4, or FY)"),
    },
    async ({ symbol, year, period }) => {
      try {
        const results = await statementsClient.getFinancialReportXLSX(
          symbol,
          year,
          period
        );
        return {
          content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
        };
      } catch (error) {
        console.error("Error fetching financial report XLSX:", error);
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
    "getRevenueProductSegmentation",
    "Access detailed revenue breakdowns by product line with the Revenue Product Segmentation API. Understand which products drive a company's earnings and get insights into the performance of individual product segments.",
    {
      symbol: z.string().describe("Stock symbol"),
      period: z
        .enum(["annual", "quarter"])
        .optional()
        .describe("Period type (annual or quarter)"),
      structure: z.enum(["flat"]).optional().describe("Response structure"),
    },
    async ({ symbol, period, structure }) => {
      try {
        const results = await statementsClient.getRevenueProductSegmentation(
          symbol,
          { period, structure }
        );
        return {
          content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
        };
      } catch (error) {
        console.error("Error fetching revenue product segmentation:", error);
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
    "getRevenueGeographicSegmentation",
    "Access detailed revenue breakdowns by geographic region with the Revenue Geographic Segments API. Analyze how different regions contribute to a company’s total revenue and identify key markets for growth.",
    {
      symbol: z.string().describe("Stock symbol"),
      period: z
        .enum(["annual", "quarter"])
        .optional()
        .describe("Period type (annual or quarter)"),
      structure: z.enum(["flat"]).optional().describe("Response structure"),
    },
    async ({ symbol, period, structure }) => {
      try {
        const results = await statementsClient.getRevenueGeographicSegmentation(
          symbol,
          { period, structure }
        );
        return {
          content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
        };
      } catch (error) {
        console.error("Error fetching revenue geographic segmentation:", error);
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
    "getIncomeStatementAsReported",
    "Retrieve income statements as they were reported by the company with the As Reported Income Statements API. Access raw financial data directly from official company filings, including revenue, expenses, and net income.",
    {
      symbol: z.string().describe("Stock symbol"),
      limit: z
        .number()
        .optional()
        .describe("Limit on number of results (default: 100, max: 1000)"),
      period: z
        .enum(["annual", "quarter"])
        .optional()
        .describe("Period type (annual or quarter)"),
    },
    async ({ symbol, limit, period }) => {
      try {
        const results = await statementsClient.getIncomeStatementAsReported(
          symbol,
          { limit, period }
        );
        return {
          content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
        };
      } catch (error) {
        console.error("Error fetching income statement as reported:", error);
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
    "getBalanceSheetStatementAsReported",
    "Access balance sheets as reported by the company with the As Reported Balance Statements API. View detailed financial data on assets, liabilities, and equity directly from official filings.",
    {
      symbol: z.string().describe("Stock symbol"),
      limit: z
        .number()
        .optional()
        .describe("Limit on number of results (default: 100, max: 1000)"),
      period: z
        .enum(["annual", "quarter"])
        .optional()
        .describe("Period type (annual or quarter)"),
    },
    async ({ symbol, limit, period }) => {
      try {
        const results =
          await statementsClient.getBalanceSheetStatementAsReported(symbol, {
            limit,
            period,
          });
        return {
          content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
        };
      } catch (error) {
        console.error(
          "Error fetching balance sheet statement as reported:",
          error
        );
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
    "getCashFlowStatementAsReported",
    "View cash flow statements as reported by the company with the As Reported Cash Flow Statements API. Analyze a company's cash flows related to operations, investments, and financing directly from official reports.",
    {
      symbol: z.string().describe("Stock symbol"),
      limit: z
        .number()
        .optional()
        .describe("Limit on number of results (default: 100, max: 1000)"),
      period: z
        .enum(["annual", "quarter"])
        .optional()
        .describe("Period type (annual or quarter)"),
    },
    async ({ symbol, limit, period }) => {
      try {
        const results = await statementsClient.getCashFlowStatementAsReported(
          symbol,
          { limit, period }
        );
        return {
          content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
        };
      } catch (error) {
        console.error("Error fetching cash flow statement as reported:", error);
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
    "getFinancialStatementFullAsReported",
    "Retrieve comprehensive financial statements as reported by companies with FMP As Reported Financial Statements API. Access complete data across income, balance sheet, and cash flow statements in their original form for detailed analysis.",
    {
      symbol: z.string().describe("Stock symbol"),
      limit: z
        .number()
        .optional()
        .describe("Limit on number of results (default: 100, max: 1000)"),
      period: z
        .enum(["annual", "quarter"])
        .optional()
        .describe("Period type (annual or quarter)"),
    },
    async ({ symbol, limit, period }) => {
      try {
        const results =
          await statementsClient.getFinancialStatementFullAsReported(symbol, {
            limit,
            period,
          });
        return {
          content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
        };
      } catch (error) {
        console.error(
          "Error fetching full financial statement as reported:",
          error
        );
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
    "getKeyMetrics",
    "Access essential financial metrics for a company with the FMP Financial Key Metrics API. Evaluate revenue, net income, P/E ratio, and more to assess performance and compare it to competitors.",
    {
      symbol: z.string().describe("Stock symbol"),
      limit: z
        .number()
        .optional()
        .describe("Limit on number of results (default: 100, max: 1000)"),
      period: z
        .enum(["Q1", "Q2", "Q3", "Q4", "FY", "annual", "quarter"])
        .optional()
        .describe("Period (Q1, Q2, Q3, Q4, FY, annual, or quarter)"),
    },
    async ({ symbol, limit, period }) => {
      try {
        const results = await statementsClient.getKeyMetrics(symbol, {
          limit,
          period,
        });
        return {
          content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
        };
      } catch (error) {
        console.error("Error fetching key metrics:", error);
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
    "getRatios",
    "Analyze a company's financial performance using the Financial Ratios API. This API provides detailed profitability, liquidity, and efficiency ratios, enabling users to assess a company's operational and financial health across various metrics.",
    {
      symbol: z.string().describe("Stock symbol"),
      limit: z
        .number()
        .optional()
        .describe("Limit on number of results (default: 100, max: 1000)"),
      period: z
        .enum(["Q1", "Q2", "Q3", "Q4", "FY", "annual", "quarter"])
        .optional()
        .describe("Period (Q1, Q2, Q3, Q4, FY, annual, or quarter)"),
    },
    async ({ symbol, limit, period }) => {
      try {
        const results = await statementsClient.getRatios(symbol, {
          limit,
          period,
        });
        return {
          content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
        };
      } catch (error) {
        console.error("Error fetching ratios:", error);
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
    "getKeyMetricsTTM",
    "Retrieve a comprehensive set of trailing twelve-month (TTM) key performance metrics with the TTM Key Metrics API. Access data related to a company's profitability, capital efficiency, and liquidity, allowing for detailed analysis of its financial health over the past year.",
    {
      symbol: z.string().describe("Stock symbol"),
    },
    async ({ symbol }) => {
      try {
        const results = await statementsClient.getKeyMetricsTTM(symbol);
        return {
          content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
        };
      } catch (error) {
        console.error("Error fetching key metrics TTM:", error);
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
    "getFinancialRatiosTTM",
    "Gain access to trailing twelve-month (TTM) financial ratios with the TTM Ratios API. This API provides key performance metrics over the past year, including profitability, liquidity, and efficiency ratios.",
    {
      symbol: z.string().describe("Stock symbol"),
    },
    async ({ symbol }) => {
      try {
        const results = await statementsClient.getFinancialRatiosTTM(symbol);
        return {
          content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
        };
      } catch (error) {
        console.error("Error fetching financial ratios TTM:", error);
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
    "getFinancialScores",
    "Assess a company's financial strength using the Financial Health Scores API. This API provides key metrics such as the Altman Z-Score and Piotroski Score, giving users insights into a company’s overall financial health and stability.",
    {
      symbol: z.string().describe("Stock symbol"),
      limit: z
        .number()
        .optional()
        .describe("Limit on number of results (default: 100, max: 1000)"),
    },
    async ({ symbol, limit }) => {
      try {
        const results = await statementsClient.getFinancialScores(symbol, {
          limit,
        });
        return {
          content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
        };
      } catch (error) {
        console.error("Error fetching financial scores:", error);
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
    "getOwnerEarnings",
    "Retrieve a company's owner earnings with the Owner Earnings API, which provides a more accurate representation of cash available to shareholders by adjusting net income. This metric is crucial for evaluating a company’s profitability from the perspective of investors.",
    {
      symbol: z.string().describe("Stock symbol"),
    },
    async ({ symbol }) => {
      try {
        const results = await statementsClient.getOwnerEarnings(symbol);
        return {
          content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
        };
      } catch (error) {
        console.error("Error fetching owner earnings:", error);
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
