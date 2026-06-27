import { FMPClient } from "../FMPClient.js";
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
   * @returns Array of fund holdings
   */
  async getHoldings(
    symbol: string
  ): Promise<FundHolding[]> {
    return super.get<FundHolding[]>(
      "/etf/holdings",
      { symbol }
    );
  }

  /**
   * Get fund(ETF and Mutual Funds) information for a symbol
   * @param symbol The fund symbol
   * @returns Fund information
   */
  async getInfo(
    symbol: string
  ): Promise<FundInfo> {
    return super.get<FundInfo>("/etf/info", { symbol });
  }

  /**
   * Get fund(ETF and Mutual Funds) country allocation for a symbol
   * @param symbol The fund symbol
   * @returns Array of country allocations
   */
  async getCountryAllocation(
    symbol: string
  ): Promise<FundCountryAllocation[]> {
    return super.get<FundCountryAllocation[]>(
      "/etf/country-weightings",
      {
        symbol,
      }
    );
  }

  /**
   * Get fund(ETF and Mutual Funds) asset exposure for a symbol
   * @param symbol The fund symbol
   * @returns Array of asset exposures
   */
  async getAssetExposure(
    symbol: string
  ): Promise<FundAssetExposure[]> {
    return super.get<FundAssetExposure[]>(
      "/etf/asset-exposure",
      { symbol }
    );
  }

  /**
   * Get fund(ETF and Mutual Funds) sector weighting for a symbol
   * @param symbol The fund symbol
   * @returns Array of sector weightings
   */
  async getSectorWeighting(
    symbol: string
  ): Promise<FundSectorWeighting[]> {
    return super.get<FundSectorWeighting[]>(
      "/etf/sector-weightings",
      {
        symbol,
      }
    );
  }

  /**
   * Get fund(ETF and Mutual Funds) disclosure for a symbol
   * @param symbol The fund symbol
   * @returns Array of fund disclosures
   */
  async getDisclosure(
    symbol: string
  ): Promise<FundDisclosureHolder[]> {
    return super.get<FundDisclosureHolder[]>(
      "/funds/disclosure-holders-latest",
      { symbol }
    );
  }

  /**
   * Search fund(ETF and Mutual Funds) disclosures by holder name
   * @param name Name of the holder
   * @returns Array of fund disclosure search results
   */
  async searchDisclosures(
    name: string
  ): Promise<FundDisclosureSearch[]> {
    return super.get<FundDisclosureSearch[]>(
      "/funds/disclosure-holders-search",
      {
        name,
      }
    );
  }

  /**
   * Get fund(ETF and Mutual Funds) disclosure dates for a symbol and cik
   * @param symbol The fund symbol
   * @param cik Optional CIK number
   * @returns Array of fund disclosure dates
   */
  async getDisclosureDates(
    symbol: string,
    cik?: string
  ): Promise<FundDisclosureDate[]> {
    return super.get<FundDisclosureDate[]>(
      "/funds/disclosure-dates",
      {
        symbol,
        cik,
      }
    );
  }

  /**
   * Get fund(ETF and Mutual Funds) disclosure dates for a symbol and cik
   * @param symbol The fund symbol
   * @param year The year example 2025
   * @param quarter The quarter example 1, 2, 3, 4
   * @param cik Optional CIK number
   * @returns Array of fund disclosure dates
   */
  async getFundDisclosure(
    symbol: string,
    year: number,
    quarter: number,
    cik?: string
  ): Promise<FundDisclosure[]> {
    return super.get<FundDisclosure[]>(
      "/funds/disclosure",
      {
        symbol,
        year,
        quarter,
        cik,
      }
    );
  }
}
