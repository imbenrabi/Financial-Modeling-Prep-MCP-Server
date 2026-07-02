import { FMPClient } from "../FMPClient.js";
import type {
  CompanyProfile,
  CompanyNote,
  StockPeer,
  DelistedCompany,
  EmployeeCount,
  MarketCap,
  ShareFloat,
  MergerAcquisition,
  CompanyExecutive,
  ExecutiveCompensation,
  ExecutiveCompensationBenchmark,
} from "./types.js";

export class CompanyClient extends FMPClient {

  /**
   * Get company profile data
   * @param symbol Stock symbol
   * @returns Company profile data
   */
  async getProfile(
    symbol: string
  ): Promise<CompanyProfile[]> {
    return super.get<CompanyProfile[]>("/profile", { symbol });
  }

  /**
   * Get company profile data by CIK
   * @param cik CIK number
   * @returns Company profile data
   */
  async getProfileByCIK(
    cik: string
  ): Promise<CompanyProfile[]> {
    return super.get<CompanyProfile[]>("/profile-cik", { cik });
  }

  /**
   * Get company notes
   * @param symbol Stock symbol
   * @returns Array of company notes
   */
  async getNotes(
    symbol: string
  ): Promise<CompanyNote[]> {
    return super.get<CompanyNote[]>("/company-notes", { symbol });
  }

  /**
   * Get stock peers
   * @param symbol Stock symbol
   * @returns Array of stock peers
   */
  async getPeers(
    symbol: string
  ): Promise<StockPeer[]> {
    return super.get<StockPeer[]>("/stock-peers", { symbol });
  }

  /**
   * Get delisted companies
   * @param page Page number (default: 0)
   * @param limit Limit on number of results (default: 100, max: 100)
   * @returns Array of delisted companies
   */
  async getDelistedCompanies(
    page?: number,
    limit?: number
  ): Promise<DelistedCompany[]> {
    return super.get<DelistedCompany[]>(
      "/delisted-companies",
      { page, limit }
    );
  }

  /**
   * Get employee count
   * @param symbol Stock symbol
   * @param limit Limit on number of results (default: 100, max: 10000)
   * @returns Array of employee count data
   */
  async getEmployeeCount(
    symbol: string,
    limit?: number
  ): Promise<EmployeeCount[]> {
    return super.get<EmployeeCount[]>(
      "/employee-count",
      { symbol, limit }
    );
  }

  /**
   * Get historical employee count
   * @param symbol Stock symbol
   * @param limit Limit on number of results (default: 100, max: 10000)
   * @returns Array of historical employee count data
   */
  async getHistoricalEmployeeCount(
    symbol: string,
    limit?: number
  ): Promise<EmployeeCount[]> {
    return super.get<EmployeeCount[]>(
      "/historical-employee-count",
      {
        symbol,
        limit,
      }
    );
  }

  /**
   * Get market capitalization
   * @param symbol Stock symbol
   * @returns Market cap data
   */
  async getMarketCap(
    symbol: string
  ): Promise<MarketCap[]> {
    return super.get<MarketCap[]>(
      "/market-capitalization",
      { symbol }
    );
  }

  /**
   * Get batch market capitalization
   * @param symbols Comma-separated list of stock symbols
   * @returns Array of market cap data
   */
  async getBatchMarketCap(
    symbols: string
  ): Promise<MarketCap[]> {
    return super.get<MarketCap[]>(
      "/market-capitalization-batch",
      { symbols }
    );
  }

  /**
   * Get historical market capitalization
   * @param symbol Stock symbol
   * @param limit Limit on number of results (default: 100, max: 5000)
   * @param from Start date (YYYY-MM-DD)
   * @param to End date (YYYY-MM-DD)
   * @returns Array of historical market cap data
   */
  async getHistoricalMarketCap(
    symbol: string,
    limit?: number,
    from?: string,
    to?: string
  ): Promise<MarketCap[]> {
    return super.get<MarketCap[]>(
      "/historical-market-capitalization",
      {
        symbol,
        limit,
        from,
        to,
      }
    );
  }

  /**
   * Get share float data
   * @param symbol Stock symbol
   * @returns Share float data
   */
  async getShareFloat(
    symbol: string
  ): Promise<ShareFloat[]> {
    return super.get<ShareFloat[]>("/shares-float", { symbol });
  }

  /**
   * Get all shares float data
   * @param page Page number (default: 0)
   * @param limit Limit on number of results (default: 1000, max: 5000)
   * @returns Array of share float data
   */
  async getAllShareFloat(
    page?: number,
    limit?: number
  ): Promise<ShareFloat[]> {
    return super.get<ShareFloat[]>(
      "/shares-float-all",
      { page, limit }
    );
  }

  /**
   * Get latest mergers and acquisitions
   * @param page Page number (default: 0)
   * @param limit Limit on number of results (default: 100, max: 1000)
   * @returns Array of merger and acquisition data
   */
  async getLatestMergersAcquisitions(
    page?: number,
    limit?: number
  ): Promise<MergerAcquisition[]> {
    return super.get<MergerAcquisition[]>(
      "/mergers-acquisitions-latest",
      {
        page,
        limit,
      }
    );
  }

  /**
   * Search mergers and acquisitions
   * @param name Company name to search for
   * @returns Array of merger and acquisition data
   */
  async searchMergersAcquisitions(
    name: string
  ): Promise<MergerAcquisition[]> {
    return super.get<MergerAcquisition[]>(
      "/mergers-acquisitions-search",
      {
        name,
      }
    );
  }

  /**
   * Get company executives
   * @param symbol Stock symbol
   * @param active Filter for active executives (optional)
   * @returns Array of company executive data
   */
  async getExecutives(
    symbol: string,
    active?: string
  ): Promise<CompanyExecutive[]> {
    return super.get<CompanyExecutive[]>(
      "/key-executives",
      { symbol, active }
    );
  }

  /**
   * Get executive compensation
   * @param symbol Stock symbol
   * @returns Array of executive compensation data
   */
  async getExecutiveCompensation(
    symbol: string
  ): Promise<ExecutiveCompensation[]> {
    return super.get<ExecutiveCompensation[]>(
      "/governance-executive-compensation",
      { symbol }
    );
  }

  /**
   * Get executive compensation benchmark
   * @param year Year to get benchmark data for
   * @returns Array of executive compensation benchmark data
   */
  async getExecutiveCompensationBenchmark(
    year?: string
  ): Promise<ExecutiveCompensationBenchmark[]> {
    return super.get<ExecutiveCompensationBenchmark[]>(
      "/executive-compensation-benchmark",
      { year }
    );
  }
}
