import { FMPClient } from "../FMPClient.js";
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
   * @returns Raw CSV data as string
   */
  async getCompanyProfilesBulk(
    params: PartParams
  ): Promise<string> {
    return this.getCSV(
      `/profile-bulk`,
      {
        part: params.part,
      }
    );
  }

  /**
   * Get stock ratings in bulk (CSV format)
   * @returns Raw CSV data as string
   */
  async getStockRatingsBulk(): Promise<string> {
    return this.getCSV(`/rating-bulk`, {});
  }

  /**
   * Get DCF valuations in bulk (CSV format)
   * @returns Raw CSV data as string
   */
  async getDCFValuationsBulk(): Promise<string> {
    return this.getCSV(`/dcf-bulk`, {});
  }

  /**
   * Get financial scores in bulk (CSV format)
   * @returns Raw CSV data as string
   */
  async getFinancialScoresBulk(): Promise<string> {
    return this.getCSV(`/scores-bulk`, {});
  }

  /**
   * Get price target summaries in bulk (CSV format)
   * @returns Raw CSV data as string
   */
  async getPriceTargetSummariesBulk(): Promise<string> {
    return this.getCSV(
      `/price-target-summary-bulk`,
      {}
    );
  }

  /**
   * Get ETF holders in bulk (CSV format)
   * @param params Part parameters
   * @returns Raw CSV data as string
   */
  async getETFHoldersBulk(
    params: PartParams
  ): Promise<string> {
    return this.getCSV(
      `/etf-holder-bulk`,
      {
        part: params.part,
      }
    );
  }

  /**
   * Get upgrades/downgrades consensus in bulk (CSV format)
   * @returns Raw CSV data as string
   */
  async getUpgradesDowngradesConsensusBulk(): Promise<string> {
    return this.getCSV(
      `/upgrades-downgrades-consensus-bulk`,
      {}
    );
  }

  /**
   * Get key metrics TTM in bulk (CSV format)
   * @returns Raw CSV data as string
   */
  async getKeyMetricsTTMBulk(): Promise<string> {
    return this.getCSV(`/key-metrics-ttm-bulk`, {});
  }

  /**
   * Get ratios TTM in bulk (CSV format)
   * @returns Raw CSV data as string
   */
  async getRatiosTTMBulk(): Promise<string> {
    return this.getCSV(`/ratios-ttm-bulk`, {});
  }

  /**
   * Get stock peers in bulk (CSV format)
   * @returns Raw CSV data as string
   */
  async getStockPeersBulk(): Promise<string> {
    return this.getCSV(`/peers-bulk`, {});
  }

  /**
   * Get earnings surprises in bulk (CSV format)
   * @param params Earnings surprise parameters
   * @returns Raw CSV data as string
   */
  async getEarningsSurprisesBulk(
    params: EarningsSurpriseParams
  ): Promise<string> {
    return this.getCSV(
      `/earnings-surprises-bulk`,
      {
        year: params.year,
      }
    );
  }

  /**
   * Get income statements in bulk (CSV format)
   * @param params Year and period parameters
   * @returns Raw CSV data as string
   */
  async getIncomeStatementsBulk(
    params: YearPeriodParams
  ): Promise<string> {
    return this.getCSV(
      `/income-statement-bulk`,
      {
        year: params.year,
        period: params.period,
      }
    );
  }

  /**
   * Get income statement growth in bulk (CSV format)
   * @param params Year and period parameters
   * @returns Raw CSV data as string
   */
  async getIncomeStatementGrowthBulk(
    params: YearPeriodParams
  ): Promise<string> {
    return this.getCSV(
      `/income-statement-growth-bulk`,
      {
        year: params.year,
        period: params.period,
      }
    );
  }

  /**
   * Get balance sheet statements in bulk (CSV format)
   * @param params Year and period parameters
   * @returns Raw CSV data as string
   */
  async getBalanceSheetStatementsBulk(
    params: YearPeriodParams
  ): Promise<string> {
    return this.getCSV(
      `/balance-sheet-statement-bulk`,
      {
        year: params.year,
        period: params.period,
      }
    );
  }

  /**
   * Get balance sheet growth in bulk (CSV format)
   * @param params Year and period parameters
   * @returns Raw CSV data as string
   */
  async getBalanceSheetGrowthBulk(
    params: YearPeriodParams
  ): Promise<string> {
    return this.getCSV(
      `/balance-sheet-statement-growth-bulk`,
      {
        year: params.year,
        period: params.period,
      }
    );
  }

  /**
   * Get cash flow statements in bulk (CSV format)
   * @param params Year and period parameters
   * @returns Raw CSV data as string
   */
  async getCashFlowStatementsBulk(
    params: YearPeriodParams
  ): Promise<string> {
    return this.getCSV(
      `/cash-flow-statement-bulk`,
      {
        year: params.year,
        period: params.period,
      }
    );
  }

  /**
   * Get cash flow growth in bulk (CSV format)
   * @param params Year and period parameters
   * @returns Raw CSV data as string
   */
  async getCashFlowGrowthBulk(
    params: YearPeriodParams
  ): Promise<string> {
    return this.getCSV(
      `/cash-flow-statement-growth-bulk`,
      {
        year: params.year,
        period: params.period,
      }
    );
  }

  /**
   * Get EOD data in bulk (CSV format)
   * @param params EOD parameters
   * @returns Raw CSV data as string
   */
  async getEODDataBulk(
    params: EODParams
  ): Promise<string> {
    return this.getCSV(
      `/eod-bulk`,
      {
        date: params.date,
      }
    );
  }
}
