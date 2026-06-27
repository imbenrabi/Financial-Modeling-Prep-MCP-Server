import { FMPClient } from "../FMPClient.js";
import type { FMPContext } from "../../types.js";
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
   * @param options Optional parameters including abort signal and context
   * @returns Company profile data
   */
  async getProfile(
    symbol: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<CompanyProfile[]> {
    return super.get<CompanyProfile[]>("/profile", { symbol }, options);
  }

  /**
   * Get company profile data by CIK
   * @param cik CIK number
   * @param options Optional parameters including abort signal and context
   * @returns Company profile data
   */
  async getProfileByCIK(
    cik: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<CompanyProfile[]> {
    return super.get<CompanyProfile[]>("/profile-cik", { cik }, options);
  }

  /**
   * Get company notes
   * @param symbol Stock symbol
   * @param options Optional parameters including abort signal and context
   * @returns Array of company notes
   */
  async getNotes(
    symbol: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<CompanyNote[]> {
    return super.get<CompanyNote[]>("/company-notes", { symbol }, options);
  }

  /**
   * Get stock peers
   * @param symbol Stock symbol
   * @param options Optional parameters including abort signal and context
   * @returns Array of stock peers
   */
  async getPeers(
    symbol: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<StockPeer[]> {
    return super.get<StockPeer[]>("/stock-peers", { symbol }, options);
  }

  /**
   * Get delisted companies
   * @param page Page number (default: 0)
   * @param limit Limit on number of results (default: 100, max: 100)
   * @param options Optional parameters including abort signal and context
   * @returns Array of delisted companies
   */
  async getDelistedCompanies(
    page?: number,
    limit?: number,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<DelistedCompany[]> {
    return super.get<DelistedCompany[]>(
      "/delisted-companies",
      { page, limit },
      options
    );
  }

  /**
   * Get employee count
   * @param symbol Stock symbol
   * @param limit Limit on number of results (default: 100, max: 10000)
   * @param options Optional parameters including abort signal and context
   * @returns Array of employee count data
   */
  async getEmployeeCount(
    symbol: string,
    limit?: number,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<EmployeeCount[]> {
    return super.get<EmployeeCount[]>(
      "/employee-count",
      { symbol, limit },
      options
    );
  }

  /**
   * Get historical employee count
   * @param symbol Stock symbol
   * @param limit Limit on number of results (default: 100, max: 10000)
   * @param options Optional parameters including abort signal and context
   * @returns Array of historical employee count data
   */
  async getHistoricalEmployeeCount(
    symbol: string,
    limit?: number,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<EmployeeCount[]> {
    return super.get<EmployeeCount[]>(
      "/historical-employee-count",
      {
        symbol,
        limit,
      },
      options
    );
  }

  /**
   * Get market capitalization
   * @param symbol Stock symbol
   * @param options Optional parameters including abort signal and context
   * @returns Market cap data
   */
  async getMarketCap(
    symbol: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<MarketCap[]> {
    return super.get<MarketCap[]>(
      "/market-capitalization",
      { symbol },
      options
    );
  }

  /**
   * Get batch market capitalization
   * @param symbols Comma-separated list of stock symbols
   * @param options Optional parameters including abort signal and context
   * @returns Array of market cap data
   */
  async getBatchMarketCap(
    symbols: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<MarketCap[]> {
    return super.get<MarketCap[]>(
      "/market-capitalization-batch",
      { symbols },
      options
    );
  }

  /**
   * Get historical market capitalization
   * @param symbol Stock symbol
   * @param limit Limit on number of results (default: 100, max: 5000)
   * @param from Start date (YYYY-MM-DD)
   * @param to End date (YYYY-MM-DD)
   * @param options Optional parameters including abort signal and context
   * @returns Array of historical market cap data
   */
  async getHistoricalMarketCap(
    symbol: string,
    limit?: number,
    from?: string,
    to?: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<MarketCap[]> {
    return super.get<MarketCap[]>(
      "/historical-market-capitalization",
      {
        symbol,
        limit,
        from,
        to,
      },
      options
    );
  }

  /**
   * Get share float data
   * @param symbol Stock symbol
   * @param options Optional parameters including abort signal and context
   * @returns Share float data
   */
  async getShareFloat(
    symbol: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<ShareFloat[]> {
    return super.get<ShareFloat[]>("/shares-float", { symbol }, options);
  }

  /**
   * Get all shares float data
   * @param page Page number (default: 0)
   * @param limit Limit on number of results (default: 1000, max: 5000)
   * @param options Optional parameters including abort signal and context
   * @returns Array of share float data
   */
  async getAllShareFloat(
    page?: number,
    limit?: number,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<ShareFloat[]> {
    return super.get<ShareFloat[]>(
      "/shares-float-all",
      { page, limit },
      options
    );
  }

  /**
   * Get latest mergers and acquisitions
   * @param page Page number (default: 0)
   * @param limit Limit on number of results (default: 100, max: 1000)
   * @param options Optional parameters including abort signal and context
   * @returns Array of merger and acquisition data
   */
  async getLatestMergersAcquisitions(
    page?: number,
    limit?: number,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<MergerAcquisition[]> {
    return super.get<MergerAcquisition[]>(
      "/mergers-acquisitions-latest",
      {
        page,
        limit,
      },
      options
    );
  }

  /**
   * Search mergers and acquisitions
   * @param name Company name to search for
   * @param options Optional parameters including abort signal and context
   * @returns Array of merger and acquisition data
   */
  async searchMergersAcquisitions(
    name: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<MergerAcquisition[]> {
    return super.get<MergerAcquisition[]>(
      "/mergers-acquisitions-search",
      {
        name,
      },
      options
    );
  }

  /**
   * Get company executives
   * @param symbol Stock symbol
   * @param active Filter for active executives (optional)
   * @param options Optional parameters including abort signal and context
   * @returns Array of company executive data
   */
  async getExecutives(
    symbol: string,
    active?: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<CompanyExecutive[]> {
    return super.get<CompanyExecutive[]>(
      "/key-executives",
      { symbol, active },
      options
    );
  }

  /**
   * Get executive compensation
   * @param symbol Stock symbol
   * @param options Optional parameters including abort signal and context
   * @returns Array of executive compensation data
   */
  async getExecutiveCompensation(
    symbol: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<ExecutiveCompensation[]> {
    return super.get<ExecutiveCompensation[]>(
      "/governance-executive-compensation",
      { symbol },
      options
    );
  }

  /**
   * Get executive compensation benchmark
   * @param year Year to get benchmark data for
   * @param options Optional parameters including abort signal and context
   * @returns Array of executive compensation benchmark data
   */
  async getExecutiveCompensationBenchmark(
    year?: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<ExecutiveCompensationBenchmark[]> {
    return super.get<ExecutiveCompensationBenchmark[]>(
      "/executive-compensation-benchmark",
      { year },
      options
    );
  }
}
