import { z } from "zod";
import { DCFClient } from "../api/dcf/DCFClient.js";
import type { ToolRegistrar } from "../types/index.js";

/**
 * Register all DCF-related tools with the MCP server
 * @param server The MCP server instance
 * @param accessToken The Financial Modeling Prep API access token (optional when using lazy loading)
 */
export function registerDCFTools(server: ToolRegistrar, accessToken?: string): void {
  const dcfClient = new DCFClient(accessToken);

  server.tool(
    "getDCFValuation",
    "Estimate the intrinsic value of a company with the FMP Discounted Cash Flow Valuation API. Calculate the DCF valuation based on expected future cash flows and discount rates.",
    {
      symbol: z.string().describe("Stock symbol"),
    },
    async ({ symbol }) => {
      try {
        const results = await dcfClient.getValuation(symbol);
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
    "getLeveredDCFValuation",
    "Analyze a company’s value with the FMP Levered Discounted Cash Flow (DCF) API, which incorporates the impact of debt. This API provides post-debt company valuation, offering investors a more accurate measure of a company's true worth by accounting for its debt obligations.",
    {
      symbol: z.string().describe("Stock symbol"),
    },
    async ({ symbol }) => {
      try {
        const results = await dcfClient.getLeveredValuation(symbol);
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
    "calculateCustomDCF",
    "Run a tailored Discounted Cash Flow (DCF) analysis using the FMP Custom DCF Advanced API. With detailed inputs, this API allows users to fine-tune their assumptions and variables, offering a more personalized and precise valuation for a company.",
    {
      input: z.object({
        symbol: z.string().describe("Stock symbol"),
        revenueGrowthPct: z.number().optional().describe("Revenue growth percentage"),
        ebitdaPct: z.number().optional().describe("EBITDA percentage"),
        depreciationAndAmortizationPct: z.number().optional().describe("Depreciation and amortization percentage"),
        cashAndShortTermInvestmentsPct: z.number().optional().describe("Cash and short term investments percentage"),
        receivablesPct: z.number().optional().describe("Receivables percentage"),
        inventoriesPct: z.number().optional().describe("Inventories percentage"),
        payablePct: z.number().optional().describe("Payable percentage"),
        ebitPct: z.number().optional().describe("EBIT percentage"),
        capitalExpenditurePct: z.number().optional().describe("Capital expenditure percentage"),
        operatingCashFlowPct: z.number().optional().describe("Operating cash flow percentage"),
        sellingGeneralAndAdministrativeExpensesPct: z.number().optional().describe("Selling, general and administrative expenses percentage"),
        taxRate: z.number().optional().describe("Tax rate"),
        longTermGrowthRate: z.number().optional().describe("Long term growth rate"),
        costOfDebt: z.number().optional().describe("Cost of debt"),
        costOfEquity: z.number().optional().describe("Cost of equity"),
        marketRiskPremium: z.number().optional().describe("Market risk premium"),
        beta: z.number().optional().describe("Beta"),
        riskFreeRate: z.number().optional().describe("Risk-free rate"),
      }),
    },
    async ({ input }) => {
      try {
        const results = await dcfClient.calculateCustomDCF(input);
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
    "calculateCustomLeveredDCF",
    "Run a tailored Discounted Cash Flow (DCF) analysis using the FMP Custom DCF Advanced API. With detailed inputs, this API allows users to fine-tune their assumptions and variables, offering a more personalized and precise valuation for a company.",
    {
      input: z.object({
        symbol: z.string().describe("Stock symbol"),
        revenueGrowthPct: z.number().optional().describe("Revenue growth percentage"),
        ebitdaPct: z.number().optional().describe("EBITDA percentage"),
        depreciationAndAmortizationPct: z.number().optional().describe("Depreciation and amortization percentage"),
        cashAndShortTermInvestmentsPct: z.number().optional().describe("Cash and short term investments percentage"),
        receivablesPct: z.number().optional().describe("Receivables percentage"),
        inventoriesPct: z.number().optional().describe("Inventories percentage"),
        payablePct: z.number().optional().describe("Payable percentage"),
        ebitPct: z.number().optional().describe("EBIT percentage"),
        capitalExpenditurePct: z.number().optional().describe("Capital expenditure percentage"),
        operatingCashFlowPct: z.number().optional().describe("Operating cash flow percentage"),
        sellingGeneralAndAdministrativeExpensesPct: z.number().optional().describe("Selling, general and administrative expenses percentage"),
        taxRate: z.number().optional().describe("Tax rate"),
        longTermGrowthRate: z.number().optional().describe("Long term growth rate"),
        costOfDebt: z.number().optional().describe("Cost of debt"),
        costOfEquity: z.number().optional().describe("Cost of equity"),
        marketRiskPremium: z.number().optional().describe("Market risk premium"),
        beta: z.number().optional().describe("Beta"),
        riskFreeRate: z.number().optional().describe("Risk-free rate"),
      }),
    },
    async ({ input }) => {
      try {
        const results = await dcfClient.calculateCustomLeveredDCF(input);
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
