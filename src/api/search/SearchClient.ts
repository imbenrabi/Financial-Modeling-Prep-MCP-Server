import { FMPClient } from "../FMPClient.js";
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
   * @returns Array of matching symbols
   */
  async searchSymbol(
    query: string,
    limit?: number,
    exchange?: string
  ): Promise<SymbolSearchResult[]> {
    return super.get<SymbolSearchResult[]>(
      "/search-symbol",
      {
        query,
        limit,
        exchange,
      }
    );
  }

  /**
   * Search for company names by query
   * @param query The search query
   * @param limit Optional limit on number of results (default: 50)
   * @param exchange Optional exchange filter
   * @returns Array of matching companies
   */
  async searchName(
    query: string,
    limit?: number,
    exchange?: string
  ): Promise<NameSearchResult[]> {
    return super.get<NameSearchResult[]>(
      "/search-name",
      {
        query,
        limit,
        exchange,
      }
    );
  }

  /**
   * Search for companies by CIK number
   * @param cik The CIK number to search for
   * @param limit Optional limit on number of results (default: 50)
   * @returns Array of matching companies
   */
  async searchCIK(
    cik: string,
    limit?: number
  ): Promise<CIKSearchResult[]> {
    return super.get<CIKSearchResult[]>(
      "/search-cik",
      { cik, limit }
    );
  }

  /**
   * Search for securities by CUSIP number
   * @param cusip The CUSIP number to search for
   * @returns Array of matching securities
   */
  async searchCUSIP(
    cusip: string
  ): Promise<CUSIPSearchResult[]> {
    return super.get<CUSIPSearchResult[]>(
      "/search-cusip",
      { cusip }
    );
  }

  /**
   * Search for securities by ISIN number
   * @param isin The ISIN number to search for
   * @returns Array of matching securities
   */
  async searchISIN(
    isin: string
  ): Promise<ISINSearchResult[]> {
    return super.get<ISINSearchResult[]>("/search-isin", { isin });
  }

  /**
   * Search for stocks using various criteria
   * @param params Search criteria
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
    }
  ): Promise<StockScreenerResult[]> {
    return super.get<StockScreenerResult[]>("/company-screener", params);
  }

  /**
   * Search for exchange variants of a symbol
   * @param symbol The stock symbol to search for
   * @returns Array of exchange variants
   */
  async searchExchangeVariants(
    symbol: string
  ): Promise<ExchangeVariantResult[]> {
    return super.get<ExchangeVariantResult[]>(
      "/search-exchange-variants",
      {
        symbol,
      }
    );
  }
}
