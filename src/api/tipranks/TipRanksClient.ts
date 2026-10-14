import { FMPClient } from "../FMPClient.js";
import type {
  TipRanksDateWindow,
  TipRanksPointInTimeParams,
  TipRanksRecord,
  TipRanksSearchParams,
} from "./types.js";

export class TipRanksClient extends FMPClient {

  /**
   * Search individual TipRanks analyst ratings
   * @param params Optional symbol, analyst, date range, currency and paging filters
   */
  async searchAnalystRatings(
    params: TipRanksSearchParams = {}
  ): Promise<TipRanksRecord[]> {
    return super.get<TipRanksRecord[]>("/tipranks-search", { ...params });
  }

  /**
   * Get a point-in-time summary of a symbol's analyst ratings
   * @param symbol The stock symbol
   * @param params Optional as-of date, currency and paging
   */
  async getPointInTimeBySymbol(
    symbol: string,
    params: TipRanksPointInTimeParams = {}
  ): Promise<TipRanksRecord[]> {
    return super.get<TipRanksRecord[]>("/tipranks-pit-symbol", { symbol, ...params });
  }

  /**
   * Get a point-in-time summary of a single analyst's ratings
   * @param expertUID The TipRanks analyst identifier
   * @param params Optional as-of date, currency and paging
   */
  async getPointInTimeByAnalyst(
    expertUID: string,
    params: TipRanksPointInTimeParams = {}
  ): Promise<TipRanksRecord[]> {
    return super.get<TipRanksRecord[]>("/tipranks-pit-analyst", { expertUID, ...params });
  }

  /**
   * Get aggregated TipRanks ratings for a symbol over a date window
   * @param symbol The stock symbol
   * @param window Optional date window (defaults to the trailing twelve months)
   */
  async getSymbolSummary(
    symbol: string,
    window: TipRanksDateWindow = {}
  ): Promise<TipRanksRecord[]> {
    return super.get<TipRanksRecord[]>("/tipranks-symbol-summary", { symbol, ...window });
  }

  /**
   * Get aggregated ratings and track record of an analyst over a date window
   * @param expertUID The TipRanks analyst identifier
   * @param window Optional date window (defaults to the trailing twelve months)
   */
  async getAnalystSummary(
    expertUID: string,
    window: TipRanksDateWindow = {}
  ): Promise<TipRanksRecord[]> {
    return super.get<TipRanksRecord[]>("/tipranks-analyst-summary", { expertUID, ...window });
  }

  /**
   * Get aggregated ratings issued by analysts at a firm over a date window
   * @param firmName The firm name, exactly as published (e.g. Morgan Stanley)
   * @param window Optional date window (defaults to the trailing twelve months)
   */
  async getFirmSummary(
    firmName: string,
    window: TipRanksDateWindow = {}
  ): Promise<TipRanksRecord[]> {
    return super.get<TipRanksRecord[]>("/tipranks-firm-summary", { firmName, ...window });
  }

  /**
   * Look up a TipRanks analyst profile by name
   * @param analystName The analyst name, exactly as published
   */
  async lookupAnalyst(analystName: string): Promise<TipRanksRecord[]> {
    return super.get<TipRanksRecord[]>("/tipranks-analysts", { analystName });
  }
}
