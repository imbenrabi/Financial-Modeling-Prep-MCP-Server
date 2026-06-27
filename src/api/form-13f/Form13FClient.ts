import { FMPClient } from "../FMPClient.js";
import type {
  InstitutionalOwnershipFiling,
  SecFilingExtract,
  Form13FFilingDate,
  FilingExtractAnalytics,
  HolderPerformanceSummary,
  HolderIndustryBreakdown,
  PositionsSummary,
  IndustryPerformanceSummary,
} from "./types.js";



export class Form13FClient extends FMPClient {

  /**
   * Get latest institutional ownership filings
   * @param params Optional pagination parameters
   */
  async getLatestFilings(
    params: { page?: number; limit?: number } = {}
  ): Promise<InstitutionalOwnershipFiling[]> {
    return super.get<InstitutionalOwnershipFiling[]>(
      "/institutional-ownership/latest",
      params
    );
  }

  /**
   * Extract data from SEC filings
   * @param cik CIK number
   * @param year Year of filing
   * @param quarter Quarter of filing
   */
  async getFilingExtract(
    cik: string,
    year: string | number,
    quarter: string | number
  ): Promise<SecFilingExtract[]> {
    return super.get<SecFilingExtract[]>(
      "/institutional-ownership/extract",
      {
        cik,
        year,
        quarter,
      }
    );
  }

  /**
   * Get filing dates for a CIK
   * @param cik CIK number
   */
  async getFilingDates(
    cik: string
  ): Promise<Form13FFilingDate[]> {
    return super.get<Form13FFilingDate[]>(
      "/institutional-ownership/dates",
      {
        cik,
      }
    );
  }

  /**
   * Get filings extract with analytics by holder
   * @param symbol Stock symbol
   * @param year Year of filing
   * @param quarter Quarter of filing
   * @param params Optional pagination parameters
   */
  async getFilingExtractAnalyticsByHolder(
    symbol: string,
    year: string | number,
    quarter: string | number,
    params: { page?: number; limit?: number } = {}
  ): Promise<FilingExtractAnalytics[]> {
    return super.get<FilingExtractAnalytics[]>(
      "/institutional-ownership/extract-analytics/holder",
      {
        symbol,
        year,
        quarter,
        ...params,
      }
    );
  }

  /**
   * Get holder performance summary
   * @param cik CIK number
   * @param params Optional pagination parameters
   */
  async getHolderPerformanceSummary(
    cik: string,
    params: { page?: number } = {}
  ): Promise<HolderPerformanceSummary[]> {
    return super.get<HolderPerformanceSummary[]>(
      "/institutional-ownership/holder-performance-summary",
      {
        cik,
        ...params,
      }
    );
  }

  /**
   * Get holder industry breakdown
   * @param cik CIK number
   * @param year Year of filing
   * @param quarter Quarter of filing
   */
  async getHolderIndustryBreakdown(
    cik: string,
    year: string | number,
    quarter: string | number
  ): Promise<HolderIndustryBreakdown[]> {
    return super.get<HolderIndustryBreakdown[]>(
      "/institutional-ownership/holder-industry-breakdown",
      {
        cik,
        year,
        quarter,
      }
    );
  }

  /**
   * Get positions summary for a symbol
   * @param symbol Stock symbol
   * @param year Year of filing
   * @param quarter Quarter of filing
   */
  async getPositionsSummary(
    symbol: string,
    year: string | number,
    quarter: string | number
  ): Promise<PositionsSummary[]> {
    return super.get<PositionsSummary[]>(
      "/institutional-ownership/symbol-positions-summary",
      {
        symbol,
        year,
        quarter,
      }
    );
  }

  /**
   * Get industry performance summary
   * @param year Year of filing
   * @param quarter Quarter of filing
   */
  async getIndustryPerformanceSummary(
    year: string | number,
    quarter: string | number
  ): Promise<IndustryPerformanceSummary[]> {
    return super.get<IndustryPerformanceSummary[]>(
      "/institutional-ownership/industry-summary",
      {
        year,
        quarter,
      }
    );
  }
}
