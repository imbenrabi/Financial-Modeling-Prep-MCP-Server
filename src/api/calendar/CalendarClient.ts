import { FMPClient } from "../FMPClient.js";
import type { FMPContext } from "../../types/index.js";
import type {
  Dividend,
  EarningsReport,
  IPO,
  IPODisclosure,
  IPOProspectus,
  StockSplit,
} from "./types.js";

export class CalendarClient extends FMPClient {

  /**
   * Get dividend information for a stock symbol
   * @param symbol Stock symbol
   * @param limit Optional limit on number of results (default: 100, max: 1000)
   * @param options Optional parameters including abort signal and context
   * @returns Array of dividend information
   */
  async getDividends(
    symbol: string,
    limit?: number,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<Dividend[]> {
    return super.get<Dividend[]>("/dividends", { symbol, limit }, options);
  }

  /**
   * Get dividend calendar for a date range
   * @param from Optional start date (YYYY-MM-DD)
   * @param to Optional end date (YYYY-MM-DD)
   * @param options Optional parameters including abort signal and context
   * @returns Array of dividend calendar entries
   */
  async getDividendsCalendar(
    from?: string,
    to?: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<Dividend[]> {
    return super.get<Dividend[]>("/dividends-calendar", { from, to }, options);
  }

  /**
   * Get earnings reports for a stock symbol
   * @param symbol Stock symbol
   * @param limit Optional limit on number of results (default: 100, max: 1000)
   * @param options Optional parameters including abort signal and context
   * @returns Array of earnings reports
   */
  async getEarningsReports(
    symbol: string,
    limit?: number,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<EarningsReport[]> {
    return super.get<EarningsReport[]>("/earnings", { symbol, limit }, options);
  }

  /**
   * Get earnings calendar for a date range
   * @param from Optional start date (YYYY-MM-DD)
   * @param to Optional end date (YYYY-MM-DD)
   * @param options Optional parameters including abort signal and context
   * @returns Array of earnings calendar entries
   */
  async getEarningsCalendar(
    from?: string,
    to?: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<EarningsReport[]> {
    return super.get<EarningsReport[]>(
      "/earnings-calendar",
      { from, to },
      options
    );
  }

  /**
   * Get IPO calendar for a date range
   * @param from Optional start date (YYYY-MM-DD)
   * @param to Optional end date (YYYY-MM-DD)
   * @param options Optional parameters including abort signal and context
   * @returns Array of IPO calendar entries
   */
  async getIPOCalendar(
    from?: string,
    to?: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<IPO[]> {
    return super.get<IPO[]>("/ipos-calendar", { from, to }, options);
  }

  /**
   * Get IPO disclosures for a date range
   * @param from Optional start date (YYYY-MM-DD)
   * @param to Optional end date (YYYY-MM-DD)
   * @param options Optional parameters including abort signal and context
   * @returns Array of IPO disclosures
   */
  async getIPODisclosures(
    from?: string,
    to?: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<IPODisclosure[]> {
    return super.get<IPODisclosure[]>(
      "/ipos-disclosure",
      { from, to },
      options
    );
  }

  /**
   * Get IPO prospectuses for a date range
   * @param from Optional start date (YYYY-MM-DD)
   * @param to Optional end date (YYYY-MM-DD)
   * @param options Optional parameters including abort signal and context
   * @returns Array of IPO prospectuses
   */
  async getIPOProspectuses(
    from?: string,
    to?: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<IPOProspectus[]> {
    return super.get<IPOProspectus[]>(
      "/ipos-prospectus",
      { from, to },
      options
    );
  }

  /**
   * Get stock splits for a stock symbol
   * @param symbol Stock symbol
   * @param limit Optional limit on number of results (default: 100, max: 1000)
   * @param options Optional parameters including abort signal and context
   * @returns Array of stock splits
   */
  async getStockSplits(
    symbol: string,
    limit?: number,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<StockSplit[]> {
    return super.get<StockSplit[]>("/splits", { symbol, limit }, options);
  }

  /**
   * Get stock splits calendar for a date range
   * @param from Optional start date (YYYY-MM-DD)
   * @param to Optional end date (YYYY-MM-DD)
   * @param options Optional parameters including abort signal and context
   * @returns Array of stock splits calendar entries
   */
  async getStockSplitsCalendar(
    from?: string,
    to?: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<StockSplit[]> {
    return super.get<StockSplit[]>("/splits-calendar", { from, to }, options);
  }
}
