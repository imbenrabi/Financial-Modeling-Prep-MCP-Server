import { FMPClient } from "../FMPClient.js";
import type { FMPContext } from "../../types.js";
import type {
  CompanySymbol,
  FinancialStatementSymbol,
  CIKEntry,
  SymbolChange,
  ETFEntry,
  ActivelyTradingEntry,
  EarningsTranscriptEntry,
  ExchangeEntry,
  SectorEntry,
  IndustryEntry,
  CountryEntry,
} from "./types.js";



export class DirectoryClient extends FMPClient {

  /**
   * Get a list of all company symbols
   * @param options Optional parameters including abort signal and context
   * @returns Array of company symbols
   */
  async getCompanySymbols(options?: {
    signal?: AbortSignal;
    context?: FMPContext;
  }): Promise<CompanySymbol[]> {
    return super.get<CompanySymbol[]>("/stock-list", {}, options);
  }

  /**
   * Get a list of companies with available financial statements
   * @param options Optional parameters including abort signal and context
   * @returns Array of companies with financial statements
   */
  async getFinancialStatementSymbols(options?: {
    signal?: AbortSignal;
    context?: FMPContext;
  }): Promise<FinancialStatementSymbol[]> {
    return super.get<FinancialStatementSymbol[]>(
      "/financial-statement-symbol-list",
      {},
      options
    );
  }

  /**
   * Get a list of CIK numbers for SEC-registered entities
   * @param limit Optional limit on number of results (default: 1000)
   * @param options Optional parameters including abort signal and context
   * @returns Array of CIK entries
   */
  async getCIKList(
    limit?: number,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<CIKEntry[]> {
    return super.get<CIKEntry[]>("/cik-list", { limit }, options);
  }

  /**
   * Get a list of stock symbol changes
   * @param invalid Optional filter for invalid symbols (default: false)
   * @param limit Optional limit on number of results (default: 100)
   * @param options Optional parameters including abort signal and context
   * @returns Array of symbol changes
   */
  async getSymbolChanges(
    invalid?: boolean,
    limit?: number,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<SymbolChange[]> {
    return super.get<SymbolChange[]>(
      "/symbol-change",
      { invalid, limit },
      options
    );
  }

  /**
   * Get a list of ETFs
   * @param options Optional parameters including abort signal and context
   * @returns Array of ETF entries
   */
  async getETFList(options?: {
    signal?: AbortSignal;
    context?: FMPContext;
  }): Promise<ETFEntry[]> {
    return super.get<ETFEntry[]>("/etf-list", {}, options);
  }

  /**
   * Get a list of actively trading companies
   * @param options Optional parameters including abort signal and context
   * @returns Array of actively trading companies
   */
  async getActivelyTradingList(options?: {
    signal?: AbortSignal;
    context?: FMPContext;
  }): Promise<ActivelyTradingEntry[]> {
    return super.get<ActivelyTradingEntry[]>(
      "/actively-trading-list",
      {},
      options
    );
  }

  /**
   * Get a list of companies with earnings transcripts
   * @param options Optional parameters including abort signal and context
   * @returns Array of companies with earnings transcripts
   */
  async getEarningsTranscriptList(options?: {
    signal?: AbortSignal;
    context?: FMPContext;
  }): Promise<EarningsTranscriptEntry[]> {
    return super.get<EarningsTranscriptEntry[]>(
      "/earnings-transcript-list",
      {},
      options
    );
  }

  /**
   * Get a list of available exchanges
   * @param options Optional parameters including abort signal and context
   * @returns Array of available exchanges
   */
  async getAvailableExchanges(options?: {
    signal?: AbortSignal;
    context?: FMPContext;
  }): Promise<ExchangeEntry[]> {
    return super.get<ExchangeEntry[]>("/available-exchanges", {}, options);
  }

  /**
   * Get a list of available sectors
   * @param options Optional parameters including abort signal and context
   * @returns Array of available sectors
   */
  async getAvailableSectors(options?: {
    signal?: AbortSignal;
    context?: FMPContext;
  }): Promise<SectorEntry[]> {
    return super.get<SectorEntry[]>("/available-sectors", {}, options);
  }

  /**
   * Get a list of available industries
   * @param options Optional parameters including abort signal and context
   * @returns Array of available industries
   */
  async getAvailableIndustries(options?: {
    signal?: AbortSignal;
    context?: FMPContext;
  }): Promise<IndustryEntry[]> {
    return super.get<IndustryEntry[]>("/available-industries", {}, options);
  }

  /**
   * Get a list of available countries
   * @param options Optional parameters including abort signal and context
   * @returns Array of available countries
   */
  async getAvailableCountries(options?: {
    signal?: AbortSignal;
    context?: FMPContext;
  }): Promise<CountryEntry[]> {
    return super.get<CountryEntry[]>("/available-countries", {}, options);
  }
}
