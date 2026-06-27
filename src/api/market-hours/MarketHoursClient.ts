import { FMPClient } from "../FMPClient.js";
import type { ExchangeMarketHours, HolidayByExchange } from "./types.js";

export class MarketHoursClient extends FMPClient {

  /**
   * Get market hours for a specific exchange
   * @param exchange Exchange name/code
   */
  async getExchangeMarketHours(
    exchange: string
  ): Promise<ExchangeMarketHours[]> {
    return super.get<ExchangeMarketHours[]>(
      "/exchange-market-hours",
      { exchange }
    );
  }

  /**
   * Get holidays for a specific exchange
   * @param exchange Exchange name/code
   * @param from Optional Start date for the holidays
   * @param to Optional End date for the holidays
   */
  async getHolidaysByExchange(
    exchange: string,
    from?: string,
    to?: string
  ): Promise<HolidayByExchange[]> {
    return super.get<HolidayByExchange[]>(
      "/holidays-by-exchange",
      { exchange, from, to }
    );
  }

  /**
   * Get market hours for all exchanges
   */
  async getAllExchangeMarketHours(): Promise<ExchangeMarketHours[]> {
    return super.get<ExchangeMarketHours[]>(
      "/all-exchange-market-hours",
      {}
    );
  }
}
