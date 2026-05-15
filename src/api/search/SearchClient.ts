import { FMPClient } from "../FMPClient.js";
import type { FMPContext } from "../../types/index.js";
import type {
  SymbolSearchResult,
  NameSearchResult,
  CIKSearchResult,
  CUSIPSearchResult,
  ISINSearchResult,
  StockScreenerResult,
  ExchangeVariantResult,
} from "./types.js";

type RequestOptions = {
  signal?: AbortSignal;
  context?: FMPContext;
};

export class SearchClient extends FMPClient {
  constructor(apiKey?: string) {
    super(apiKey);
  }

  /**
   * Search for stock symbols by query
   * @param query The search query
   * @param limit Optional limit on number of results (default: 50)
   * @param exchange Optional exchange filter
   * @param options Optional parameters including abort signal and context
   * @returns Array of matching symbols
   */
  async searchSymbol(
    query: string,
    limit?: number,
    exchange?: string,
    options?: RequestOptions
  ): Promise<SymbolSearchResult[]> {
    return super.get<SymbolSearchResult[]>(
      "/search-symbol",
      { query, limit, exchange },
      options
    );
  }

  /**
   * Search for company names by query
   * @param query The search query
   * @param limit Optional limit on number of results (default: 50)
   * @param exchange Optional exchange filter
   * @param options Optional parameters including abort signal and context
   * @returns Array of matching companies
   */
  async searchName(
    query: string,
    limit?: number,
    exchange?: string,
    options?: RequestOptions
  ): Promise<NameSearchResult[]> {
    return super.get<NameSearchResult[]>(
      "/search-name",
      { query, limit, exchange },
      options
    );
  }

  /**
   * Search for companies by CIK number
   * @param cik The CIK number to search for
   * @param limit Optional limit on number of results (default: 50)
   * @param options Optional parameters including abort signal and context
   * @returns Array of matching companies
   */
  async searchCIK(
    cik: string,
    limit?: number,
    options?: RequestOptions
  ): Promise<CIKSearchResult[]> {
    return super.get<CIKSearchResult[]>(
      "/search-cik",
      { cik, limit },
      options
    );
  }

  /**
   * Search for securities by CUSIP number
   * @param cusip The CUSIP number to search for
   * @param options Optional parameters including abort signal and context
   * @returns Array of matching securities
   */
  async searchCUSIP(
    cusip: string,
    options?: RequestOptions
  ): Promise<CUSIPSearchResult[]> {
    return super.get<CUSIPSearchResult[]>(
      "/search-cusip",
      { cusip },
      options
    );
  }

  /**
   * Search for securities by ISIN number
   * @param isin The ISIN number to search for
   * @param options Optional parameters including abort signal and context
   * @returns Array of matching securities
   */
  async searchISIN(
    isin: string,
    options?: RequestOptions
  ): Promise<ISINSearchResult[]> {
    return super.get<ISINSearchResult[]>(
      "/search-isin",
      { isin },
      options
    );
  }

  /**
   * Search for stocks using various criteria
   * @param params Search criteria
   * @param options Optional parameters including abort signal and context
   * @returns Array of matching stocks
   */
  async stockScreener(
    params: {
      marketCapMoreThan?: number;
      marketCapLowerThan?: number;
      sector?: string;
      industry?: string;
      betaMoreThan?: number;
      betaLowerThan?: number;
      priceMoreThan?: number;
      priceLowerThan?: number;
      dividendMoreThan?: number;
      dividendLowerThan?: number;
      volumeMoreThan?: number;
      volumeLowerThan?: number;
      exchange?: string;
      country?: string;
      isEtf?: boolean;
      isFund?: boolean;
      isActivelyTrading?: boolean;
      limit?: number;
      includeAllShareClasses?: boolean;
    },
    options?: RequestOptions
  ): Promise<StockScreenerResult[]> {
    return super.get<StockScreenerResult[]>(
      "/company-screener",
      params,
      options
    );
  }

  /**
   * Search for exchange variants of a symbol
   * @param symbol The stock symbol to search for
   * @param options Optional parameters including abort signal and context
   * @returns Array of exchange variants
   */
  async searchExchangeVariants(
    symbol: string,
    options?: RequestOptions
  ): Promise<ExchangeVariantResult[]> {
    return super.get<ExchangeVariantResult[]>(
      "/search-exchange-variants",
      { symbol },
      options
    );
  }
}