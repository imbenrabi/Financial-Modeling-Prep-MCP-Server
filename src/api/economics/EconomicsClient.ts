import { FMPClient } from "../FMPClient.js";
import type {
  TreasuryRate,
  EconomicIndicator,
  EconomicCalendar,
  MarketRiskPremium,
} from "./types.js";

export class EconomicsClient extends FMPClient {

  /**
   * Get treasury rates
   * @param from Optional start date (YYYY-MM-DD)
   * @param to Optional end date (YYYY-MM-DD)
   * @returns Array of treasury rates
   */
  async getTreasuryRates(
    from?: string,
    to?: string
  ): Promise<TreasuryRate[]> {
    return super.get<TreasuryRate[]>("/treasury-rates", { from, to });
  }

  /**
   * Get economic indicators
   * @param name Name of the indicator
   * @param from Optional start date (YYYY-MM-DD)
   * @param to Optional end date (YYYY-MM-DD)
   * @returns Array of economic indicators
   */
  async getEconomicIndicators(
    name: string,
    from?: string,
    to?: string
  ): Promise<EconomicIndicator[]> {
    return super.get<EconomicIndicator[]>(
      "/economic-indicator",
      {
        name,
        from,
        to,
      }
    );
  }

  /**
   * Get economic calendar
   * @param from Optional start date (YYYY-MM-DD)
   * @param to Optional end date (YYYY-MM-DD)
   * @returns Array of economic calendar events
   */
  async getEconomicCalendar(
    from?: string,
    to?: string
  ): Promise<EconomicCalendar[]> {
    return super.get<EconomicCalendar[]>(
      "/economic-calendar",
      { from, to }
    );
  }

  /**
   * Get market risk premium
   * @returns Array of market risk premiums
   */
  async getMarketRiskPremium(): Promise<MarketRiskPremium[]> {
    return super.get<MarketRiskPremium[]>(
      "/market-risk-premium",
      {}
    );
  }
}
