import { FMPClient } from "../FMPClient.js";
import type { FMPContext } from "../../types.js";
import type {
  SymbolSearchResult,
  NameSearchResult,
  CIKSearchResult,
  CUSIPSearchResult,
  ISINSearchResult,
  StockScreenerResult,
  ExchangeVariantResult,
} from "./types.js";

export class SearchClient extends FMPClient {

  /**
   * Search for stock symbols by query
   * @param query The search query
   * @param limit Optional limit on number of results (default: 50)
   * @param exchange Optional exchange filter
   * @param context Optional context containing configuration
   * @returns Array of matching symbols
   */
  async searchSymbol(
    query: string,
    limit?: number,
    exchange?: string,
    context?: FMPContext
  ): Promise<SymbolSearchResult[]> {
    return super.get<SymbolSearchResult[]>(
      "/search-symbol",
      {
        query,
        limit,
        exchange,
      },
      { context }
    );
  }

  /**
   * Search for company names by query
   * @param query The search query
   * @param limit Optional limit on number of results (default: 50)
   * @param exchange Optional exchange filter
   * @param context Optional context containing configuration
   * @returns Array of matching companies
   */
  async searchName(
    query: string,
    limit?: number,
    exchange?: string,
    context?: FMPContext
  ): Promise<NameSearchResult[]> {
    return super.get<NameSearchResult[]>(
      "/search-name",
      {
        query,
        limit,
        exchange,
      },
      { context }
    );
  }

  /**
   * Search for companies by CIK number
   * @param cik The CIK number to search for
   * @param limit Optional limit on number of results (default: 50)
   * @param context Optional context containing configuration
   * @returns Array of matching companies
   */
  async searchCIK(
    cik: string,
    limit?: number,
    context?: FMPContext
  ): Promise<CIKSearchResult[]> {
    return super.get<CIKSearchResult[]>(
      "/search-cik",
      { cik, limit },
      { context }
    );
  }

  /**
   * Search for securities by CUSIP number
   * @param cusip The CUSIP number to search for
   * @param context Optional context containing configuration
   * @returns Array of matching securities
   */
  async searchCUSIP(
    cusip: string,
    context?: FMPContext
  ): Promise<CUSIPSearchResult[]> {
    return super.get<CUSIPSearchResult[]>(
      "/search-cusip",
      { cusip },
      { context }
    );
  }

  /**
   * Search for securities by ISIN number
   * @param isin The ISIN number to search for
   * @param context Optional context containing configuration
   * @returns Array of matching securities
   */
  async searchISIN(
    isin: string,
    context?: FMPContext
  ): Promise<ISINSearchResult[]> {
    return super.get<ISINSearchResult[]>("/search-isin", { isin }, { context });
  }

  /**
   * Search for stocks using various criteria
   * @param params Search criteria
   * @param context Optional context containing configuration
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
    context?: FMPContext
  ): Promise<StockScreenerResult[]> {
    return super.get<StockScreenerResult[]>("/company-screener", params, {
      context,
    });
  }

  /**
   * Search for exchange variants of a symbol
   * @param symbol The stock symbol to search for
   * @param context Optional context containing configuration
   * @returns Array of exchange variants
   */
  async searchExchangeVariants(
    symbol: string,
    context?: FMPContext
  ): Promise<ExchangeVariantResult[]> {
    return super.get<ExchangeVariantResult[]>(
      "/search-exchange-variants",
      {
        symbol,
      },
      { context }
    );
  }
}
