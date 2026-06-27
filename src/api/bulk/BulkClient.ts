import { FMPClient } from "../FMPClient.js";
import type { FMPContext } from "../../types.js";
import type {
  PartParams,
  YearPeriodParams,
  EarningsSurpriseParams,
  EODParams,
} from "./types.js";

export class BulkClient extends FMPClient {

  /**
   * Get company profiles in bulk (CSV format)
   * @param params Part parameters
   * @param options Optional parameters including abort signal and context
   * @returns Raw CSV data as string
   */
  async getCompanyProfilesBulk(
    params: PartParams,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<string> {
    return this.getCSV(
      `/profile-bulk`,
      {
        part: params.part,
      },
      options
    );
  }

  /**
   * Get stock ratings in bulk (CSV format)
   * @param options Optional parameters including abort signal and context
   * @returns Raw CSV data as string
   */
  async getStockRatingsBulk(options?: {
    signal?: AbortSignal;
    context?: FMPContext;
  }): Promise<string> {
    return this.getCSV(`/rating-bulk`, {}, options);
  }

  /**
   * Get DCF valuations in bulk (CSV format)
   * @param options Optional parameters including abort signal and context
   * @returns Raw CSV data as string
   */
  async getDCFValuationsBulk(options?: {
    signal?: AbortSignal;
    context?: FMPContext;
  }): Promise<string> {
    return this.getCSV(`/dcf-bulk`, {}, options);
  }

  /**
   * Get financial scores in bulk (CSV format)
   * @param options Optional parameters including abort signal and context
   * @returns Raw CSV data as string
   */
  async getFinancialScoresBulk(options?: {
    signal?: AbortSignal;
    context?: FMPContext;
  }): Promise<string> {
    return this.getCSV(`/scores-bulk`, {}, options);
  }

  /**
   * Get price target summaries in bulk (CSV format)
   * @param options Optional parameters including abort signal and context
   * @returns Raw CSV data as string
   */
  async getPriceTargetSummariesBulk(options?: {
    signal?: AbortSignal;
    context?: FMPContext;
  }): Promise<string> {
    return this.getCSV(
      `/price-target-summary-bulk`,
      {},
      options
    );
  }

  /**
   * Get ETF holders in bulk (CSV format)
   * @param params Part parameters
   * @param options Optional parameters including abort signal and context
   * @returns Raw CSV data as string
   */
  async getETFHoldersBulk(
    params: PartParams,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<string> {
    return this.getCSV(
      `/etf-holder-bulk`,
      {
        part: params.part,
      },
      options
    );
  }

  /**
   * Get upgrades/downgrades consensus in bulk (CSV format)
   * @param options Optional parameters including abort signal and context
   * @returns Raw CSV data as string
   */
  async getUpgradesDowngradesConsensusBulk(options?: {
    signal?: AbortSignal;
    context?: FMPContext;
  }): Promise<string> {
    return this.getCSV(
      `/upgrades-downgrades-consensus-bulk`,
      {},
      options
    );
  }

  /**
   * Get key metrics TTM in bulk (CSV format)
   * @param options Optional parameters including abort signal and context
   * @returns Raw CSV data as string
   */
  async getKeyMetricsTTMBulk(options?: {
    signal?: AbortSignal;
    context?: FMPContext;
  }): Promise<string> {
    return this.getCSV(`/key-metrics-ttm-bulk`, {}, options);
  }

  /**
   * Get ratios TTM in bulk (CSV format)
   * @param options Optional parameters including abort signal and context
   * @returns Raw CSV data as string
   */
  async getRatiosTTMBulk(options?: {
    signal?: AbortSignal;
    context?: FMPContext;
  }): Promise<string> {
    return this.getCSV(`/ratios-ttm-bulk`, {}, options);
  }

  /**
   * Get stock peers in bulk (CSV format)
   * @param options Optional parameters including abort signal and context
   * @returns Raw CSV data as string
   */
  async getStockPeersBulk(options?: {
    signal?: AbortSignal;
    context?: FMPContext;
  }): Promise<string> {
    return this.getCSV(`/peers-bulk`, {}, options);
  }

  /**
   * Get earnings surprises in bulk (CSV format)
   * @param params Earnings surprise parameters
   * @param options Optional parameters including abort signal and context
   * @returns Raw CSV data as string
   */
  async getEarningsSurprisesBulk(
    params: EarningsSurpriseParams,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<string> {
    return this.getCSV(
      `/earnings-surprises-bulk`,
      {
        year: params.year,
      },
      options
    );
  }

  /**
   * Get income statements in bulk (CSV format)
   * @param params Year and period parameters
   * @param options Optional parameters including abort signal and context
   * @returns Raw CSV data as string
   */
  async getIncomeStatementsBulk(
    params: YearPeriodParams,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<string> {
    return this.getCSV(
      `/income-statement-bulk`,
      {
        year: params.year,
        period: params.period,
      },
      options
    );
  }

  /**
   * Get income statement growth in bulk (CSV format)
   * @param params Year and period parameters
   * @param options Optional parameters including abort signal and context
   * @returns Raw CSV data as string
   */
  async getIncomeStatementGrowthBulk(
    params: YearPeriodParams,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<string> {
    return this.getCSV(
      `/income-statement-growth-bulk`,
      {
        year: params.year,
        period: params.period,
      },
      options
    );
  }

  /**
   * Get balance sheet statements in bulk (CSV format)
   * @param params Year and period parameters
   * @param options Optional parameters including abort signal and context
   * @returns Raw CSV data as string
   */
  async getBalanceSheetStatementsBulk(
    params: YearPeriodParams,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<string> {
    return this.getCSV(
      `/balance-sheet-statement-bulk`,
      {
        year: params.year,
        period: params.period,
      },
      options
    );
  }

  /**
   * Get balance sheet growth in bulk (CSV format)
   * @param params Year and period parameters
   * @param options Optional parameters including abort signal and context
   * @returns Raw CSV data as string
   */
  async getBalanceSheetGrowthBulk(
    params: YearPeriodParams,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<string> {
    return this.getCSV(
      `/balance-sheet-statement-growth-bulk`,
      {
        year: params.year,
        period: params.period,
      },
      options
    );
  }

  /**
   * Get cash flow statements in bulk (CSV format)
   * @param params Year and period parameters
   * @param options Optional parameters including abort signal and context
   * @returns Raw CSV data as string
   */
  async getCashFlowStatementsBulk(
    params: YearPeriodParams,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<string> {
    return this.getCSV(
      `/cash-flow-statement-bulk`,
      {
        year: params.year,
        period: params.period,
      },
      options
    );
  }

  /**
   * Get cash flow growth in bulk (CSV format)
   * @param params Year and period parameters
   * @param options Optional parameters including abort signal and context
   * @returns Raw CSV data as string
   */
  async getCashFlowGrowthBulk(
    params: YearPeriodParams,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<string> {
    return this.getCSV(
      `/cash-flow-statement-growth-bulk`,
      {
        year: params.year,
        period: params.period,
      },
      options
    );
  }

  /**
   * Get EOD data in bulk (CSV format)
   * @param params EOD parameters
   * @param options Optional parameters including abort signal and context
   * @returns Raw CSV data as string
   */
  async getEODDataBulk(
    params: EODParams,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<string> {
    return this.getCSV(
      `/eod-bulk`,
      {
        date: params.date,
      },
      options
    );
  }
}
