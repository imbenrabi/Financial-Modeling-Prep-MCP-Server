import { FMPClient } from "../FMPClient.js";
import {
  IncomeStatement,
  BalanceSheetStatement,
  CashFlowStatement,
  IncomeStatementGrowth,
  BalanceSheetStatementGrowth,
  CashFlowStatementGrowth,
  FinancialStatementGrowth,
  FinancialReportDate,
  LatestFinancialStatement,
  Period,
  FinancialReport10K,
  RevenueProductSegmentation,
  RevenueGeographicSegmentation,
  AsReportedIncomeStatement,
  AsReportedBalanceSheet,
  AsReportedCashFlowStatement,
  AsReportedFinancialStatement,
  FinancialScores,
  FinancialRatiosTTM,
  OwnerEarnings,
  KeyMetrics,
  Ratios,
  KeyMetricsTTM,
} from "./types.js";

export class StatementsClient extends FMPClient {

  /**
   * Get income statements for a symbol
   * @param symbol The stock symbol
   * @param params Optional parameters for limit and period
   */
  async getIncomeStatement(
    symbol: string,
    params: { limit?: number; period?: Period } = {}
  ): Promise<IncomeStatement[]> {
    return super.get<IncomeStatement[]>(
      "/income-statement",
      {
        symbol,
        ...params,
      }
    );
  }

  /**
   * Get balance sheet statements for a symbol
   * @param symbol The stock symbol
   * @param params Optional parameters for limit and period
   */
  async getBalanceSheetStatement(
    symbol: string,
    params: { limit?: number; period?: Period } = {}
  ): Promise<BalanceSheetStatement[]> {
    return super.get<BalanceSheetStatement[]>(
      "/balance-sheet-statement",
      {
        symbol,
        ...params,
      }
    );
  }

  /**
   * Get cash flow statements for a symbol
   * @param symbol The stock symbol
   * @param params Optional parameters for limit and period
   */
  async getCashFlowStatement(
    symbol: string,
    params: { limit?: number; period?: Period } = {}
  ): Promise<CashFlowStatement[]> {
    return super.get<CashFlowStatement[]>(
      "/cash-flow-statement",
      {
        symbol,
        ...params,
      }
    );
  }

  /**
   * Get latest financial statements
   * @param params Optional parameters for pagination
   */
  async getLatestFinancialStatements(
    params: { page?: number; limit?: number } = {}
  ): Promise<LatestFinancialStatement[]> {
    return super.get<LatestFinancialStatement[]>(
      "/latest-financial-statements",
      params
    );
  }

  /**
   * Get trailing twelve months income statements for a symbol
   * @param symbol The stock symbol
   * @param params Optional parameters for limit
   */
  async getIncomeStatementTTM(
    symbol: string,
    params: { limit?: number } = {}
  ): Promise<IncomeStatement[]> {
    return super.get<IncomeStatement[]>(
      "/income-statement-ttm",
      {
        symbol,
        ...params,
      }
    );
  }

  /**
   * Get trailing twelve months balance sheet statements for a symbol
   * @param symbol The stock symbol
   * @param params Optional parameters for limit
   */
  async getBalanceSheetStatementTTM(
    symbol: string,
    params: { limit?: number } = {}
  ): Promise<BalanceSheetStatement[]> {
    return super.get<BalanceSheetStatement[]>(
      "/balance-sheet-statement-ttm",
      {
        symbol,
        ...params,
      }
    );
  }

  /**
   * Get trailing twelve months cash flow statements for a symbol
   * @param symbol The stock symbol
   * @param params Optional parameters for limit
   */
  async getCashFlowStatementTTM(
    symbol: string,
    params: { limit?: number } = {}
  ): Promise<CashFlowStatement[]> {
    return super.get<CashFlowStatement[]>(
      "/cash-flow-statement-ttm",
      {
        symbol,
        ...params,
      }
    );
  }

  /**
   * Get income statement growth metrics for a symbol
   * @param symbol The stock symbol
   * @param params Optional parameters for limit and period
   */
  async getIncomeStatementGrowth(
    symbol: string,
    params: { limit?: number; period?: Period } = {}
  ): Promise<IncomeStatementGrowth[]> {
    return super.get<IncomeStatementGrowth[]>(
      "/income-statement-growth",
      {
        symbol,
        ...params,
      }
    );
  }

  /**
   * Get balance sheet statement growth metrics for a symbol
   * @param symbol The stock symbol
   * @param params Optional parameters for limit and period
   */
  async getBalanceSheetStatementGrowth(
    symbol: string,
    params: { limit?: number; period?: Period } = {}
  ): Promise<BalanceSheetStatementGrowth[]> {
    return super.get<BalanceSheetStatementGrowth[]>(
      "/balance-sheet-statement-growth",
      {
        symbol,
        ...params,
      }
    );
  }

  /**
   * Get cash flow statement growth metrics for a symbol
   * @param symbol The stock symbol
   * @param params Optional parameters for limit and period
   */
  async getCashFlowStatementGrowth(
    symbol: string,
    params: { limit?: number; period?: Period } = {}
  ): Promise<CashFlowStatementGrowth[]> {
    return super.get<CashFlowStatementGrowth[]>(
      "/cash-flow-statement-growth",
      {
        symbol,
        ...params,
      }
    );
  }

  /**
   * Get financial statement growth metrics for a symbol
   * @param symbol The stock symbol
   * @param params Optional parameters for limit and period
   */
  async getFinancialStatementGrowth(
    symbol: string,
    params: { limit?: number; period?: Period } = {}
  ): Promise<FinancialStatementGrowth[]> {
    return super.get<FinancialStatementGrowth[]>(
      "/financial-growth",
      {
        symbol,
        ...params,
      }
    );
  }

  /**
   * Get financial report dates for a symbol
   * @param symbol The stock symbol
   */
  async getFinancialReportsDates(
    symbol: string
  ): Promise<FinancialReportDate[]> {
    return super.get<FinancialReportDate[]>(
      "/financial-reports-dates",
      {
        symbol,
      }
    );
  }

  /**
   * Get financial report JSON for a symbol
   * @param symbol The stock symbol
   * @param year Year of the report
   * @param period Period of the report
   */
  async getFinancialReportJSON(
    symbol: string,
    year: number,
    period: Period
  ): Promise<FinancialReport10K[]> {
    return super.get<FinancialReport10K[]>(
      "/financial-reports-json",
      {
        symbol,
        year,
        period,
      }
    );
  }

  /**
   * Get financial report XLSX for a symbol
   * @param symbol The stock symbol
   * @param year Year of the report
   * @param period Period of the report
   */
  async getFinancialReportXLSX(
    symbol: string,
    year: number,
    period: Period
  ): Promise<any> {
    return super.get<any>(
      "/financial-reports-xlsx",
      {
        symbol,
        year,
        period,
      }
    );
  }

  /**
   * Get revenue product segmentation for a symbol
   * @param symbol The stock symbol
   * @param params Optional parameters for period and structure
   */
  async getRevenueProductSegmentation(
    symbol: string,
    params: { period?: "annual" | "quarter"; structure?: "flat" } = {}
  ): Promise<RevenueProductSegmentation[]> {
    return super.get<RevenueProductSegmentation[]>(
      "/revenue-product-segmentation",
      {
        symbol,
        ...params,
      }
    );
  }

  /**
   * Get revenue geographic segmentation for a symbol
   * @param symbol The stock symbol
   * @param params Optional parameters for period and structure
   */
  async getRevenueGeographicSegmentation(
    symbol: string,
    params: { period?: "annual" | "quarter"; structure?: "flat" } = {}
  ): Promise<RevenueGeographicSegmentation[]> {
    return super.get<RevenueGeographicSegmentation[]>(
      "/revenue-geographic-segmentation",
      {
        symbol,
        ...params,
      }
    );
  }

  /**
   * Get as-reported income statements for a symbol
   * @param symbol The stock symbol
   * @param params Optional parameters for limit and period
   */
  async getIncomeStatementAsReported(
    symbol: string,
    params: { limit?: number; period?: "annual" | "quarter" } = {}
  ): Promise<AsReportedIncomeStatement[]> {
    return super.get<AsReportedIncomeStatement[]>(
      "/income-statement-as-reported",
      {
        symbol,
        ...params,
      }
    );
  }

  /**
   * Get as-reported balance sheet statements for a symbol
   * @param symbol The stock symbol
   * @param params Optional parameters for limit and period
   */
  async getBalanceSheetStatementAsReported(
    symbol: string,
    params: { limit?: number; period?: "annual" | "quarter" } = {}
  ): Promise<AsReportedBalanceSheet[]> {
    return super.get<AsReportedBalanceSheet[]>(
      "/balance-sheet-statement-as-reported",
      {
        symbol,
        ...params,
      }
    );
  }

  /**
   * Get as-reported cash flow statements for a symbol
   * @param symbol The stock symbol
   * @param params Optional parameters for limit and period
   */
  async getCashFlowStatementAsReported(
    symbol: string,
    params: { limit?: number; period?: "annual" | "quarter" } = {}
  ): Promise<AsReportedCashFlowStatement[]> {
    return super.get<AsReportedCashFlowStatement[]>(
      "/cash-flow-statement-as-reported",
      {
        symbol,
        ...params,
      }
    );
  }

  /**
   * Get full as-reported financial statements for a symbol
   * @param symbol The stock symbol
   * @param params Optional parameters for limit and period
   */
  async getFinancialStatementFullAsReported(
    symbol: string,
    params: { limit?: number; period?: "annual" | "quarter" } = {}
  ): Promise<AsReportedFinancialStatement[]> {
    return super.get<AsReportedFinancialStatement[]>(
      "/financial-statement-full-as-reported",
      {
        symbol,
        ...params,
      }
    );
  }


  /**
     * Get 
     * @param symbol The stock symbol
     * @param limit Optional limit for the number of key metrics to return
     * @param period Optional period for the key metrics
     */
  async getKeyMetrics(
    symbol: string,
    params: { limit?: number; period?: "Q1" | "Q2" | "Q3" | "Q4" | "FY" | "annual" | "quarter" } = {}
  ): Promise<KeyMetrics[]> {
    return super.get<KeyMetrics[]>(
      "/key-metrics",
      {
        symbol,
        ...params,
      }
    );
  }

  /**
     * Get Average Directional Index (ADX) indicator
     * @param symbol The stock symbol
     * @param limit Optional limit for the number of key metrics to return
     * @param period Optional period for the key metrics
     */
  async getRatios(
    symbol: string,
    params: { limit?: number; period?: "Q1" | "Q2" | "Q3" | "Q4" | "FY" | "annual" | "quarter" } = {}
  ): Promise<Ratios[]> {  
    return super.get<Ratios[]>(
      "/ratios",
      {
        symbol,
        ...params,
      }
    );
  }

  /**
     * Get Average Directional Index (ADX) indicator
     * @param symbol The stock symbol
     */
  async getKeyMetricsTTM(
    symbol: string
  ): Promise<KeyMetricsTTM[]> {
    return super.get<KeyMetricsTTM[]>(
      "/key-metrics-ttm",
      {
        symbol,
      }
    );
  }

  /**
     * Get Average Directional Index (ADX) indicator
     * @param symbol The stock symbol
     */
  async getFinancialRatiosTTM(
    symbol: string
  ): Promise<FinancialRatiosTTM[]> {
    return super.get<FinancialRatiosTTM[]>(
      "/ratios-ttm",
      {
        symbol,
      }
    );
  }

  /**
     * Get Average Directional Index (ADX) indicator
     * @param symbol The stock symbol
     * @param limit Optional limit for the number of financial scores to return
     */
  async getFinancialScores(
    symbol: string,
    params: { limit?: number } = {}
  ): Promise<FinancialScores[]> {
    return super.get<FinancialScores[]>(
      "/financial-scores",
      {
        symbol,
        ...params,
      }
    );
  }

  /**
     * Get Average Directional Index (ADX) indicator
     * @param symbol The stock symbol
     */
  async getOwnerEarnings(
    symbol: string
  ): Promise<OwnerEarnings[]> {
    return super.get<OwnerEarnings[]>(
      "/owner-earnings",
      {
        symbol,
      }
    );
  }

}
