import { FMPClient } from "../FMPClient.js";
import type { FMPContext } from "../../types.js";
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
   * @param options Optional parameters including abort signal and context
   */
  async getIncomeStatement(
    symbol: string,
    params: { limit?: number; period?: Period } = {},
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<IncomeStatement[]> {
    return super.get<IncomeStatement[]>(
      "/income-statement",
      {
        symbol,
        ...params,
      },
      options
    );
  }

  /**
   * Get balance sheet statements for a symbol
   * @param symbol The stock symbol
   * @param params Optional parameters for limit and period
   * @param options Optional parameters including abort signal and context
   */
  async getBalanceSheetStatement(
    symbol: string,
    params: { limit?: number; period?: Period } = {},
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<BalanceSheetStatement[]> {
    return super.get<BalanceSheetStatement[]>(
      "/balance-sheet-statement",
      {
        symbol,
        ...params,
      },
      options
    );
  }

  /**
   * Get cash flow statements for a symbol
   * @param symbol The stock symbol
   * @param params Optional parameters for limit and period
   * @param options Optional parameters including abort signal and context
   */
  async getCashFlowStatement(
    symbol: string,
    params: { limit?: number; period?: Period } = {},
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<CashFlowStatement[]> {
    return super.get<CashFlowStatement[]>(
      "/cash-flow-statement",
      {
        symbol,
        ...params,
      },
      options
    );
  }

  /**
   * Get latest financial statements
   * @param params Optional parameters for pagination
   * @param options Optional parameters including abort signal and context
   */
  async getLatestFinancialStatements(
    params: { page?: number; limit?: number } = {},
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<LatestFinancialStatement[]> {
    return super.get<LatestFinancialStatement[]>(
      "/latest-financial-statements",
      params,
      options
    );
  }

  /**
   * Get trailing twelve months income statements for a symbol
   * @param symbol The stock symbol
   * @param params Optional parameters for limit
   * @param options Optional parameters including abort signal and context
   */
  async getIncomeStatementTTM(
    symbol: string,
    params: { limit?: number } = {},
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<IncomeStatement[]> {
    return super.get<IncomeStatement[]>(
      "/income-statement-ttm",
      {
        symbol,
        ...params,
      },
      options
    );
  }

  /**
   * Get trailing twelve months balance sheet statements for a symbol
   * @param symbol The stock symbol
   * @param params Optional parameters for limit
   * @param options Optional parameters including abort signal and context
   */
  async getBalanceSheetStatementTTM(
    symbol: string,
    params: { limit?: number } = {},
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<BalanceSheetStatement[]> {
    return super.get<BalanceSheetStatement[]>(
      "/balance-sheet-statement-ttm",
      {
        symbol,
        ...params,
      },
      options
    );
  }

  /**
   * Get trailing twelve months cash flow statements for a symbol
   * @param symbol The stock symbol
   * @param params Optional parameters for limit
   * @param options Optional parameters including abort signal and context
   */
  async getCashFlowStatementTTM(
    symbol: string,
    params: { limit?: number } = {},
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<CashFlowStatement[]> {
    return super.get<CashFlowStatement[]>(
      "/cash-flow-statement-ttm",
      {
        symbol,
        ...params,
      },
      options
    );
  }

  /**
   * Get income statement growth metrics for a symbol
   * @param symbol The stock symbol
   * @param params Optional parameters for limit and period
   * @param options Optional parameters including abort signal and context
   */
  async getIncomeStatementGrowth(
    symbol: string,
    params: { limit?: number; period?: Period } = {},
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<IncomeStatementGrowth[]> {
    return super.get<IncomeStatementGrowth[]>(
      "/income-statement-growth",
      {
        symbol,
        ...params,
      },
      options
    );
  }

  /**
   * Get balance sheet statement growth metrics for a symbol
   * @param symbol The stock symbol
   * @param params Optional parameters for limit and period
   * @param options Optional parameters including abort signal and context
   */
  async getBalanceSheetStatementGrowth(
    symbol: string,
    params: { limit?: number; period?: Period } = {},
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<BalanceSheetStatementGrowth[]> {
    return super.get<BalanceSheetStatementGrowth[]>(
      "/balance-sheet-statement-growth",
      {
        symbol,
        ...params,
      },
      options
    );
  }

  /**
   * Get cash flow statement growth metrics for a symbol
   * @param symbol The stock symbol
   * @param params Optional parameters for limit and period
   * @param options Optional parameters including abort signal and context
   */
  async getCashFlowStatementGrowth(
    symbol: string,
    params: { limit?: number; period?: Period } = {},
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<CashFlowStatementGrowth[]> {
    return super.get<CashFlowStatementGrowth[]>(
      "/cash-flow-statement-growth",
      {
        symbol,
        ...params,
      },
      options
    );
  }

  /**
   * Get financial statement growth metrics for a symbol
   * @param symbol The stock symbol
   * @param params Optional parameters for limit and period
   * @param options Optional parameters including abort signal and context
   */
  async getFinancialStatementGrowth(
    symbol: string,
    params: { limit?: number; period?: Period } = {},
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<FinancialStatementGrowth[]> {
    return super.get<FinancialStatementGrowth[]>(
      "/financial-growth",
      {
        symbol,
        ...params,
      },
      options
    );
  }

  /**
   * Get financial report dates for a symbol
   * @param symbol The stock symbol
   * @param options Optional parameters including abort signal and context
   */
  async getFinancialReportsDates(
    symbol: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<FinancialReportDate[]> {
    return super.get<FinancialReportDate[]>(
      "/financial-reports-dates",
      {
        symbol,
      },
      options
    );
  }

  /**
   * Get financial report JSON for a symbol
   * @param symbol The stock symbol
   * @param year Year of the report
   * @param period Period of the report
   * @param options Optional parameters including abort signal and context
   */
  async getFinancialReportJSON(
    symbol: string,
    year: number,
    period: Period,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<FinancialReport10K[]> {
    return super.get<FinancialReport10K[]>(
      "/financial-reports-json",
      {
        symbol,
        year,
        period,
      },
      options
    );
  }

  /**
   * Get financial report XLSX for a symbol
   * @param symbol The stock symbol
   * @param year Year of the report
   * @param period Period of the report
   * @param options Optional parameters including abort signal and context
   */
  async getFinancialReportXLSX(
    symbol: string,
    year: number,
    period: Period,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<any> {
    return super.get<any>(
      "/financial-reports-xlsx",
      {
        symbol,
        year,
        period,
      },
      options
    );
  }

  /**
   * Get revenue product segmentation for a symbol
   * @param symbol The stock symbol
   * @param params Optional parameters for period and structure
   * @param options Optional parameters including abort signal and context
   */
  async getRevenueProductSegmentation(
    symbol: string,
    params: { period?: "annual" | "quarter"; structure?: "flat" } = {},
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<RevenueProductSegmentation[]> {
    return super.get<RevenueProductSegmentation[]>(
      "/revenue-product-segmentation",
      {
        symbol,
        ...params,
      },
      options
    );
  }

  /**
   * Get revenue geographic segmentation for a symbol
   * @param symbol The stock symbol
   * @param params Optional parameters for period and structure
   * @param options Optional parameters including abort signal and context
   */
  async getRevenueGeographicSegmentation(
    symbol: string,
    params: { period?: "annual" | "quarter"; structure?: "flat" } = {},
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<RevenueGeographicSegmentation[]> {
    return super.get<RevenueGeographicSegmentation[]>(
      "/revenue-geographic-segmentation",
      {
        symbol,
        ...params,
      },
      options
    );
  }

  /**
   * Get as-reported income statements for a symbol
   * @param symbol The stock symbol
   * @param params Optional parameters for limit and period
   * @param options Optional parameters including abort signal and context
   */
  async getIncomeStatementAsReported(
    symbol: string,
    params: { limit?: number; period?: "annual" | "quarter" } = {},
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<AsReportedIncomeStatement[]> {
    return super.get<AsReportedIncomeStatement[]>(
      "/income-statement-as-reported",
      {
        symbol,
        ...params,
      },
      options
    );
  }

  /**
   * Get as-reported balance sheet statements for a symbol
   * @param symbol The stock symbol
   * @param params Optional parameters for limit and period
   * @param options Optional parameters including abort signal and context
   */
  async getBalanceSheetStatementAsReported(
    symbol: string,
    params: { limit?: number; period?: "annual" | "quarter" } = {},
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<AsReportedBalanceSheet[]> {
    return super.get<AsReportedBalanceSheet[]>(
      "/balance-sheet-statement-as-reported",
      {
        symbol,
        ...params,
      },
      options
    );
  }

  /**
   * Get as-reported cash flow statements for a symbol
   * @param symbol The stock symbol
   * @param params Optional parameters for limit and period
   * @param options Optional parameters including abort signal and context
   */
  async getCashFlowStatementAsReported(
    symbol: string,
    params: { limit?: number; period?: "annual" | "quarter" } = {},
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<AsReportedCashFlowStatement[]> {
    return super.get<AsReportedCashFlowStatement[]>(
      "/cash-flow-statement-as-reported",
      {
        symbol,
        ...params,
      },
      options
    );
  }

  /**
   * Get full as-reported financial statements for a symbol
   * @param symbol The stock symbol
   * @param params Optional parameters for limit and period
   * @param options Optional parameters including abort signal and context
   */
  async getFinancialStatementFullAsReported(
    symbol: string,
    params: { limit?: number; period?: "annual" | "quarter" } = {},
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<AsReportedFinancialStatement[]> {
    return super.get<AsReportedFinancialStatement[]>(
      "/financial-statement-full-as-reported",
      {
        symbol,
        ...params,
      },
      options
    );
  }


  /**
     * Get 
     * @param symbol The stock symbol
     * @param limit Optional limit for the number of key metrics to return
     * @param period Optional period for the key metrics
     * @param options Optional parameters including abort signal and context
     */
  async getKeyMetrics(
    symbol: string,
    params: { limit?: number; period?: "Q1" | "Q2" | "Q3" | "Q4" | "FY" | "annual" | "quarter" } = {},
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<KeyMetrics[]> {
    return super.get<KeyMetrics[]>(
      "/key-metrics",
      {
        symbol,
        ...params,
      },
      options
    );
  }

  /**
     * Get Average Directional Index (ADX) indicator
     * @param symbol The stock symbol
     * @param limit Optional limit for the number of key metrics to return
     * @param period Optional period for the key metrics
     * @param options Optional parameters including abort signal and context
     */
  async getRatios(
    symbol: string,
    params: { limit?: number; period?: "Q1" | "Q2" | "Q3" | "Q4" | "FY" | "annual" | "quarter" } = {},
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<Ratios[]> {  
    return super.get<Ratios[]>(
      "/ratios",
      {
        symbol,
        ...params,
      },
      options
    );
  }

  /**
     * Get Average Directional Index (ADX) indicator
     * @param symbol The stock symbol
     * @param options Optional parameters including abort signal and context
     */
  async getKeyMetricsTTM(
    symbol: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<KeyMetricsTTM[]> {
    return super.get<KeyMetricsTTM[]>(
      "/key-metrics-ttm",
      {
        symbol,
      },
      options
    );
  }

  /**
     * Get Average Directional Index (ADX) indicator
     * @param symbol The stock symbol
     * @param options Optional parameters including abort signal and context
     */
  async getFinancialRatiosTTM(
    symbol: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<FinancialRatiosTTM[]> {
    return super.get<FinancialRatiosTTM[]>(
      "/ratios-ttm",
      {
        symbol,
      },
      options
    );
  }

  /**
     * Get Average Directional Index (ADX) indicator
     * @param symbol The stock symbol
     * @param limit Optional limit for the number of financial scores to return
     * @param options Optional parameters including abort signal and context
     */
  async getFinancialScores(
    symbol: string,
    params: { limit?: number } = {},
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<FinancialScores[]> {
    return super.get<FinancialScores[]>(
      "/financial-scores",
      {
        symbol,
        ...params,
      },
      options
    );
  }

  /**
     * Get Average Directional Index (ADX) indicator
     * @param symbol The stock symbol
     * @param options Optional parameters including abort signal and context
     */
  async getOwnerEarnings(
    symbol: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<OwnerEarnings[]> {
    return super.get<OwnerEarnings[]>(
      "/owner-earnings",
      {
        symbol,
      },
      options
    );
  }

}
