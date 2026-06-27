import { FMPClient } from "../FMPClient.js";
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
   * @returns Array of dividend information
   */
  async getDividends(
    symbol: string,
    limit?: number,
  ): Promise<Dividend[]> {
    return super.get<Dividend[]>("/dividends", { symbol, limit });
  }

  /**
   * Get dividend calendar for a date range
   * @param from Optional start date (YYYY-MM-DD)
   * @param to Optional end date (YYYY-MM-DD)
   * @returns Array of dividend calendar entries
   */
  async getDividendsCalendar(
    from?: string,
    to?: string,
  ): Promise<Dividend[]> {
    return super.get<Dividend[]>("/dividends-calendar", { from, to });
  }

  /**
   * Get earnings reports for a stock symbol
   * @param symbol Stock symbol
   * @param limit Optional limit on number of results (default: 100, max: 1000)
   * @returns Array of earnings reports
   */
  async getEarningsReports(
    symbol: string,
    limit?: number,
  ): Promise<EarningsReport[]> {
    return super.get<EarningsReport[]>("/earnings", { symbol, limit });
  }

  /**
   * Get earnings calendar for a date range
   * @param from Optional start date (YYYY-MM-DD)
   * @param to Optional end date (YYYY-MM-DD)
   * @returns Array of earnings calendar entries
   */
  async getEarningsCalendar(
    from?: string,
    to?: string,
  ): Promise<EarningsReport[]> {
    return super.get<EarningsReport[]>(
      "/earnings-calendar",
      { from, to }
    );
  }

  /**
   * Get IPO calendar for a date range
   * @param from Optional start date (YYYY-MM-DD)
   * @param to Optional end date (YYYY-MM-DD)
   * @returns Array of IPO calendar entries
   */
  async getIPOCalendar(
    from?: string,
    to?: string,
  ): Promise<IPO[]> {
    return super.get<IPO[]>("/ipos-calendar", { from, to });
  }

  /**
   * Get IPO disclosures for a date range
   * @param from Optional start date (YYYY-MM-DD)
   * @param to Optional end date (YYYY-MM-DD)
   * @returns Array of IPO disclosures
   */
  async getIPODisclosures(
    from?: string,
    to?: string,
  ): Promise<IPODisclosure[]> {
    return super.get<IPODisclosure[]>(
      "/ipos-disclosure",
      { from, to }
    );
  }

  /**
   * Get IPO prospectuses for a date range
   * @param from Optional start date (YYYY-MM-DD)
   * @param to Optional end date (YYYY-MM-DD)
   * @returns Array of IPO prospectuses
   */
  async getIPOProspectuses(
    from?: string,
    to?: string,
  ): Promise<IPOProspectus[]> {
    return super.get<IPOProspectus[]>(
      "/ipos-prospectus",
      { from, to }
    );
  }

  /**
   * Get stock splits for a stock symbol
   * @param symbol Stock symbol
   * @param limit Optional limit on number of results (default: 100, max: 1000)
   * @returns Array of stock splits
   */
  async getStockSplits(
    symbol: string,
    limit?: number,
  ): Promise<StockSplit[]> {
    return super.get<StockSplit[]>("/splits", { symbol, limit });
  }

  /**
   * Get stock splits calendar for a date range
   * @param from Optional start date (YYYY-MM-DD)
   * @param to Optional end date (YYYY-MM-DD)
   * @returns Array of stock splits calendar entries
   */
  async getStockSplitsCalendar(
    from?: string,
    to?: string,
  ): Promise<StockSplit[]> {
    return super.get<StockSplit[]>("/splits-calendar", { from, to });
  }
}
