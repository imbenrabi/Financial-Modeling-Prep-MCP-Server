import { FMPClient } from "../FMPClient.js";
import type { FMPContext } from "../../types/index.js";
import type { ExchangeMarketHours, HolidayByExchange } from "./types.js";

export class MarketHoursClient extends FMPClient {

  /**
   * Get market hours for a specific exchange
   * @param exchange Exchange name/code
   * @param options Optional parameters including abort signal and context
   */
  async getExchangeMarketHours(
    exchange: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<ExchangeMarketHours[]> {
    return super.get<ExchangeMarketHours[]>(
      "/exchange-market-hours",
      { exchange },
      options
    );
  }

  /**
   * Get holidays for a specific exchange
   * @param exchange Exchange name/code
   * @param from Optional Start date for the holidays
   * @param to Optional End date for the holidays
   * @param options Optional parameters including abort signal and context
   */
  async getHolidaysByExchange(
    exchange: string,
    from?: string,
    to?: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<HolidayByExchange[]> {
    return super.get<HolidayByExchange[]>(
      "/holidays-by-exchange",
      { exchange, from, to },
      options
    );
  }

  /**
   * Get market hours for all exchanges
   * @param options Optional parameters including abort signal and context
   */
  async getAllExchangeMarketHours(options?: {
    signal?: AbortSignal;
    context?: FMPContext;
  }): Promise<ExchangeMarketHours[]> {
    return super.get<ExchangeMarketHours[]>(
      "/all-exchange-market-hours",
      {},
      options
    );
  }
}
