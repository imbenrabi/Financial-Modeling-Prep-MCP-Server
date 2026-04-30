import { FMPClient } from "../FMPClient.js";
import type { FMPContext } from "../../types/index.js";
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
   * @param options Optional parameters including abort signal and context
   */
  async getLatestFilings(
    params: { page?: number; limit?: number } = {},
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<InstitutionalOwnershipFiling[]> {
    return super.get<InstitutionalOwnershipFiling[]>(
      "/institutional-ownership/latest",
      params,
      options
    );
  }

  /**
   * Extract data from SEC filings
   * @param cik CIK number
   * @param year Year of filing
   * @param quarter Quarter of filing
   * @param options Optional parameters including abort signal and context
   */
  async getFilingExtract(
    cik: string,
    year: string | number,
    quarter: string | number,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<SecFilingExtract[]> {
    return super.get<SecFilingExtract[]>(
      "/institutional-ownership/extract",
      {
        cik,
        year,
        quarter,
      },
      options
    );
  }

  /**
   * Get filing dates for a CIK
   * @param cik CIK number
   * @param options Optional parameters including abort signal and context
   */
  async getFilingDates(
    cik: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<Form13FFilingDate[]> {
    return super.get<Form13FFilingDate[]>(
      "/institutional-ownership/dates",
      {
        cik,
      },
      options
    );
  }

  /**
   * Get filings extract with analytics by holder
   * @param symbol Stock symbol
   * @param year Year of filing
   * @param quarter Quarter of filing
   * @param params Optional pagination parameters
   * @param options Optional parameters including abort signal and context
   */
  async getFilingExtractAnalyticsByHolder(
    symbol: string,
    year: string | number,
    quarter: string | number,
    params: { page?: number; limit?: number } = {},
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<FilingExtractAnalytics[]> {
    return super.get<FilingExtractAnalytics[]>(
      "/institutional-ownership/extract-analytics/holder",
      {
        symbol,
        year,
        quarter,
        ...params,
      },
      options
    );
  }

  /**
   * Get holder performance summary
   * @param cik CIK number
   * @param params Optional pagination parameters
   * @param options Optional parameters including abort signal and context
   */
  async getHolderPerformanceSummary(
    cik: string,
    params: { page?: number } = {},
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<HolderPerformanceSummary[]> {
    return super.get<HolderPerformanceSummary[]>(
      "/institutional-ownership/holder-performance-summary",
      {
        cik,
        ...params,
      },
      options
    );
  }

  /**
   * Get holder industry breakdown
   * @param cik CIK number
   * @param year Year of filing
   * @param quarter Quarter of filing
   * @param options Optional parameters including abort signal and context
   */
  async getHolderIndustryBreakdown(
    cik: string,
    year: string | number,
    quarter: string | number,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<HolderIndustryBreakdown[]> {
    return super.get<HolderIndustryBreakdown[]>(
      "/institutional-ownership/holder-industry-breakdown",
      {
        cik,
        year,
        quarter,
      },
      options
    );
  }

  /**
   * Get positions summary for a symbol
   * @param symbol Stock symbol
   * @param year Year of filing
   * @param quarter Quarter of filing
   * @param options Optional parameters including abort signal and context
   */
  async getPositionsSummary(
    symbol: string,
    year: string | number,
    quarter: string | number,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<PositionsSummary[]> {
    return super.get<PositionsSummary[]>(
      "/institutional-ownership/symbol-positions-summary",
      {
        symbol,
        year,
        quarter,
      },
      options
    );
  }

  /**
   * Get industry performance summary
   * @param year Year of filing
   * @param quarter Quarter of filing
   * @param options Optional parameters including abort signal and context
   */
  async getIndustryPerformanceSummary(
    year: string | number,
    quarter: string | number,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<IndustryPerformanceSummary[]> {
    return super.get<IndustryPerformanceSummary[]>(
      "/institutional-ownership/industry-summary",
      {
        year,
        quarter,
      },
      options
    );
  }
}
