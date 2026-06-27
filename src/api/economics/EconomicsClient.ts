import { FMPClient } from "../FMPClient.js";
import type { FMPContext } from "../../types.js";
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
   * @param options Optional parameters including abort signal and context
   * @returns Array of treasury rates
   */
  async getTreasuryRates(
    from?: string,
    to?: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<TreasuryRate[]> {
    return super.get<TreasuryRate[]>("/treasury-rates", { from, to }, options);
  }

  /**
   * Get economic indicators
   * @param name Name of the indicator
   * @param from Optional start date (YYYY-MM-DD)
   * @param to Optional end date (YYYY-MM-DD)
   * @param options Optional parameters including abort signal and context
   * @returns Array of economic indicators
   */
  async getEconomicIndicators(
    name: string,
    from?: string,
    to?: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<EconomicIndicator[]> {
    return super.get<EconomicIndicator[]>(
      "/economic-indicator",
      {
        name,
        from,
        to,
      },
      options
    );
  }

  /**
   * Get economic calendar
   * @param from Optional start date (YYYY-MM-DD)
   * @param to Optional end date (YYYY-MM-DD)
   * @param options Optional parameters including abort signal and context
   * @returns Array of economic calendar events
   */
  async getEconomicCalendar(
    from?: string,
    to?: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<EconomicCalendar[]> {
    return super.get<EconomicCalendar[]>(
      "/economic-calendar",
      { from, to },
      options
    );
  }

  /**
   * Get market risk premium
   * @param options Optional parameters including abort signal and context
   * @returns Array of market risk premiums
   */
  async getMarketRiskPremium(
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<MarketRiskPremium[]> {
    return super.get<MarketRiskPremium[]>(
      "/market-risk-premium", 
      {},
      options
    );
  }
}
