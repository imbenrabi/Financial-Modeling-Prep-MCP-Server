import { FMPClient } from "../FMPClient.js";
import type { FMPContext } from "../../types.js";
import type {
  FundHolding,
  FundInfo,
  FundCountryAllocation,
  FundAssetExposure,
  FundSectorWeighting,
  FundDisclosure,
  FundDisclosureSearch,
  FundDisclosureDate,
  FundDisclosureHolder,
} from "./types.js";

export class FundClient extends FMPClient {

  /**
   * Get fund(ETF and Mutual Funds) holdings for a symbol
   * @param symbol The fund symbol
   * @param options Optional parameters including abort signal and context
   * @returns Array of fund holdings
   */
  async getHoldings(
    symbol: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<FundHolding[]> {
    return super.get<FundHolding[]>(
      "/etf/holdings",
      { symbol },
      options
    );
  }

  /**
   * Get fund(ETF and Mutual Funds) information for a symbol
   * @param symbol The fund symbol
   * @param options Optional parameters including abort signal and context
   * @returns Fund information
   */
  async getInfo(
    symbol: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<FundInfo> {
    return super.get<FundInfo>("/etf/info", { symbol }, options);
  }

  /**
   * Get fund(ETF and Mutual Funds) country allocation for a symbol
   * @param symbol The fund symbol
   * @param options Optional parameters including abort signal and context
   * @returns Array of country allocations
   */
  async getCountryAllocation(
    symbol: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<FundCountryAllocation[]> {
    return super.get<FundCountryAllocation[]>(
      "/etf/country-weightings",
      {
        symbol,
      },
      options
    );
  }

  /**
   * Get fund(ETF and Mutual Funds) asset exposure for a symbol
   * @param symbol The fund symbol
   * @param options Optional parameters including abort signal and context
   * @returns Array of asset exposures
   */
  async getAssetExposure(
    symbol: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<FundAssetExposure[]> {
    return super.get<FundAssetExposure[]>(
      "/etf/asset-exposure",
      { symbol },
      options
    );
  }

  /**
   * Get fund(ETF and Mutual Funds) sector weighting for a symbol
   * @param symbol The fund symbol
   * @param options Optional parameters including abort signal and context
   * @returns Array of sector weightings
   */
  async getSectorWeighting(
    symbol: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<FundSectorWeighting[]> {
    return super.get<FundSectorWeighting[]>(
      "/etf/sector-weightings",
      {
        symbol,
      },
      options
    );
  }

  /**
   * Get fund(ETF and Mutual Funds) disclosure for a symbol
   * @param symbol The fund symbol
   * @param options Optional parameters including abort signal and context
   * @returns Array of fund disclosures
   */
  async getDisclosure(
    symbol: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<FundDisclosureHolder[]> {
    return super.get<FundDisclosureHolder[]>(
      "/funds/disclosure-holders-latest",
      { symbol },
      options
    );
  }

  /**
   * Search fund(ETF and Mutual Funds) disclosures by holder name
   * @param name Name of the holder
   * @param options Optional parameters including abort signal and context
   * @returns Array of fund disclosure search results
   */
  async searchDisclosures(
    name: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<FundDisclosureSearch[]> {
    return super.get<FundDisclosureSearch[]>(
      "/funds/disclosure-holders-search",
      {
        name,
      },
      options
    );
  }

  /**
   * Get fund(ETF and Mutual Funds) disclosure dates for a symbol and cik
   * @param symbol The fund symbol
   * @param cik Optional CIK number
   * @param options Optional parameters including abort signal and context
   * @returns Array of fund disclosure dates
   */
  async getDisclosureDates( 
    symbol: string,
    cik?: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<FundDisclosureDate[]> {
    return super.get<FundDisclosureDate[]>(
      "/funds/disclosure-dates",
      {
        symbol,
        cik,
      },
      options
    );
  }

  /**
   * Get fund(ETF and Mutual Funds) disclosure dates for a symbol and cik
   * @param symbol The fund symbol
   * @param year The year example 2025
   * @param quarter The quarter example 1, 2, 3, 4
   * @param cik Optional CIK number
   * @param options Optional parameters including abort signal and context
   * @returns Array of fund disclosure dates
   */
  async getFundDisclosure( 
    symbol: string,
    year: number,
    quarter: number,
    cik?: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<FundDisclosure[]> {
    return super.get<FundDisclosure[]>(
      "/funds/disclosure",
      {
        symbol,
        year,
        quarter,
        cik,
      },
      options
    );
  }
}
