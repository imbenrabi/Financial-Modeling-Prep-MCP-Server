import { FMPClient } from "../FMPClient.js";
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
   * @returns Array of company symbols
   */
  async getCompanySymbols(): Promise<CompanySymbol[]> {
    return super.get<CompanySymbol[]>("/stock-list", {});
  }

  /**
   * Get a list of companies with available financial statements
   * @returns Array of companies with financial statements
   */
  async getFinancialStatementSymbols(): Promise<FinancialStatementSymbol[]> {
    return super.get<FinancialStatementSymbol[]>(
      "/financial-statement-symbol-list",
      {}
    );
  }

  /**
   * Get a list of CIK numbers for SEC-registered entities
   * @param limit Optional limit on number of results (default: 1000)
   * @returns Array of CIK entries
   */
  async getCIKList(limit?: number): Promise<CIKEntry[]> {
    return super.get<CIKEntry[]>("/cik-list", { limit });
  }

  /**
   * Get a list of stock symbol changes
   * @param invalid Optional filter for invalid symbols (default: false)
   * @param limit Optional limit on number of results (default: 100)
   * @returns Array of symbol changes
   */
  async getSymbolChanges(
    invalid?: boolean,
    limit?: number
  ): Promise<SymbolChange[]> {
    return super.get<SymbolChange[]>(
      "/symbol-change",
      { invalid, limit }
    );
  }

  /**
   * Get a list of ETFs
   * @returns Array of ETF entries
   */
  async getETFList(): Promise<ETFEntry[]> {
    return super.get<ETFEntry[]>("/etf-list", {});
  }

  /**
   * Get a list of actively trading companies
   * @returns Array of actively trading companies
   */
  async getActivelyTradingList(): Promise<ActivelyTradingEntry[]> {
    return super.get<ActivelyTradingEntry[]>(
      "/actively-trading-list",
      {}
    );
  }

  /**
   * Get a list of companies with earnings transcripts
   * @returns Array of companies with earnings transcripts
   */
  async getEarningsTranscriptList(): Promise<EarningsTranscriptEntry[]> {
    return super.get<EarningsTranscriptEntry[]>(
      "/earnings-transcript-list",
      {}
    );
  }

  /**
   * Get a list of available exchanges
   * @returns Array of available exchanges
   */
  async getAvailableExchanges(): Promise<ExchangeEntry[]> {
    return super.get<ExchangeEntry[]>("/available-exchanges", {});
  }

  /**
   * Get a list of available sectors
   * @returns Array of available sectors
   */
  async getAvailableSectors(): Promise<SectorEntry[]> {
    return super.get<SectorEntry[]>("/available-sectors", {});
  }

  /**
   * Get a list of available industries
   * @returns Array of available industries
   */
  async getAvailableIndustries(): Promise<IndustryEntry[]> {
    return super.get<IndustryEntry[]>("/available-industries", {});
  }

  /**
   * Get a list of available countries
   * @returns Array of available countries
   */
  async getAvailableCountries(): Promise<CountryEntry[]> {
    return super.get<CountryEntry[]>("/available-countries", {});
  }
}
