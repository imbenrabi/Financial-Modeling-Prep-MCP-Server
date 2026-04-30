import { FMPClient } from "../FMPClient.js";
import type { FMPContext } from "../../types/index.js";
import type {
  ForexPair,
  ForexQuote,
  ForexShortQuote,
  ForexLightChart,
  ForexHistoricalChart,
  ForexIntradayChart,
} from "./types.js";



export class ForexClient extends FMPClient {

  /**
   * Get a list of all forex currency pairs
   * @param options Optional parameters including abort signal and context
   * @returns Array of forex pair information
   */
  async getList(options?: {
    signal?: AbortSignal;
    context?: FMPContext;
  }): Promise<ForexPair[]> {
    return super.get<ForexPair[]>("/forex-list", {}, options);
  }

  /**
   * Get full quote for a forex pair
   * @param symbol The forex pair symbol (e.g., EURUSD)
   * @param options Optional parameters including abort signal and context
   * @returns Array of forex quotes
   */
  async getQuote(
    symbol: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<ForexQuote[]> {
    return super.get<ForexQuote[]>("/quote", { symbol }, options);
  }

  /**
   * Get short quote for a forex pair
   * @param symbol The forex pair symbol (e.g., EURUSD)
   * @param options Optional parameters including abort signal and context
   * @returns Array of forex short quotes
   */
  async getShortQuote(
    symbol: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<ForexShortQuote[]> {
    return super.get<ForexShortQuote[]>("/quote-short", { symbol }, options);
  }

  /**
   * Get batch quotes for all forex pairs
   * @param short Optional boolean to get short quotes
   * @param options Optional parameters including abort signal and context
   * @returns Array of forex short quotes
   */
  async getBatchQuotes(
    short?: boolean,
    options?: {
    signal?: AbortSignal;
    context?: FMPContext;
  }): Promise<ForexShortQuote[]> {
    return super.get<ForexShortQuote[]>(
      "/batch-forex-quotes",
      { short },
      options
    );
  }

  /**
   * Get historical light chart data for a forex pair
   * @param symbol The forex pair symbol (e.g., EURUSD)
   * @param from Optional start date (YYYY-MM-DD)
   * @param to Optional end date (YYYY-MM-DD)
   * @param options Optional parameters including abort signal and context
   * @returns Array of forex light prices
   */
  async getHistoricalLightChart(
    symbol: string,
    from?: string,
    to?: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<ForexLightChart[]> {
    return super.get<ForexLightChart[]>(
      "/historical-price-eod/light",
      { symbol, from, to },
      options
    );
  }

  /**
   * Get historical full chart data for a forex pair
   * @param symbol The forex pair symbol (e.g., EURUSD)
   * @param from Optional start date (YYYY-MM-DD)
   * @param to Optional end date (YYYY-MM-DD)
   * @param options Optional parameters including abort signal and context
   * @returns Array of forex historical prices
   */
  async getHistoricalFullChart(
    symbol: string,
    from?: string,
    to?: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<ForexHistoricalChart[]> {
    return super.get<ForexHistoricalChart[]>(
      "/historical-price-eod/full",
      { symbol, from, to },
      options
    );
  }

  /**
   * Get 1-minute interval data for a forex pair
   * @param symbol The forex pair symbol (e.g., EURUSD)
   * @param from Optional start date (YYYY-MM-DD)
   * @param to Optional end date (YYYY-MM-DD)
   * @param options Optional parameters including abort signal and context
   * @returns Array of forex intraday prices
   */
  async get1MinuteData(
    symbol: string,
    from?: string,
    to?: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<ForexIntradayChart[]> {
    return super.get<ForexIntradayChart[]>(
      "/historical-chart/1min",
      { symbol, from, to },
      options
    );
  }

  /**
   * Get 5-minute interval data for a forex pair
   * @param symbol The forex pair symbol (e.g., EURUSD)
   * @param from Optional start date (YYYY-MM-DD)
   * @param to Optional end date (YYYY-MM-DD)
   * @param options Optional parameters including abort signal and context
   * @returns Array of forex intraday prices
   */
  async get5MinuteData(
    symbol: string,
    from?: string,
    to?: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<ForexIntradayChart[]> {
    return super.get<ForexIntradayChart[]>(
      "/historical-chart/5min",
      { symbol, from, to },
      options
    );
  }

  /**
   * Get 1-hour interval data for a forex pair
   * @param symbol The forex pair symbol (e.g., EURUSD)
   * @param from Optional start date (YYYY-MM-DD)
   * @param to Optional end date (YYYY-MM-DD)
   * @param options Optional parameters including abort signal and context
   * @returns Array of forex intraday prices
   */
  async get1HourData(
    symbol: string,
    from?: string,
    to?: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<ForexIntradayChart[]> {
    return super.get<ForexIntradayChart[]>(
      "/historical-chart/1hour",
      { symbol, from, to },
      options
    );
  }
}
