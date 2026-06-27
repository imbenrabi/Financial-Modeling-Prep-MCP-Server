import { FMPClient } from "../FMPClient.js";
import type {
  ChartData,
  LightChartData,
  UnadjustedChartData,
  Interval,
  IntradayChartData,
} from "./types.js";



export class ChartClient extends FMPClient {

  /**
   * Get light chart data for a stock symbol
   * @param symbol Stock symbol
   * @param from Optional start date (YYYY-MM-DD)
   * @param to Optional end date (YYYY-MM-DD)
   * @returns Array of light chart data
   */
  async getLightChart(
    symbol: string,
    from?: string,
    to?: string
  ): Promise<LightChartData[]> {
    return super.get<LightChartData[]>(
      "/historical-price-eod/light",
      { symbol, from, to }
    );
  }

  /**
   * Get full chart data for a stock symbol
   * @param symbol Stock symbol
   * @param from Optional start date (YYYY-MM-DD)
   * @param to Optional end date (YYYY-MM-DD)
   * @returns Array of chart data
   */
  async getFullChart(
    symbol: string,
    from?: string,
    to?: string
  ): Promise<ChartData[]> {
    return super.get<ChartData[]>(
      "/historical-price-eod/full",
      { symbol, from, to }
    );
  }

  /**
   * Get unadjusted chart data for a stock symbol
   * @param symbol Stock symbol
   * @param from Optional start date (YYYY-MM-DD)
   * @param to Optional end date (YYYY-MM-DD)
   * @returns Array of unadjusted chart data
   */
  async getUnadjustedChart(
    symbol: string,
    from?: string,
    to?: string
  ): Promise<UnadjustedChartData[]> {
    return super.get<UnadjustedChartData[]>(
      "/historical-price-eod/non-split-adjusted",
      { symbol, from, to }
    );
  }

  /**
   * Get dividend-adjusted chart data for a stock symbol
   * @param symbol Stock symbol
   * @param from Optional start date (YYYY-MM-DD)
   * @param to Optional end date (YYYY-MM-DD)
   * @returns Array of dividend-adjusted chart data
   */
  async getDividendAdjustedChart(
    symbol: string,
    from?: string,
    to?: string
  ): Promise<UnadjustedChartData[]> {
    return super.get<UnadjustedChartData[]>(
      "/historical-price-eod/dividend-adjusted",
      { symbol, from, to }
    );
  }

  /**
   * Get intraday chart data for a stock symbol
   * @param symbol Stock symbol
   * @param interval Time interval (1min, 5min, 15min, 30min, 1hour, 4hour)
   * @param from Optional start date (YYYY-MM-DD)
   * @param to Optional end date (YYYY-MM-DD)
   * @returns Array of chart data
   */
  async getIntradayChart(
    symbol: string,
    interval: Interval,
    from?: string,
    to?: string
  ): Promise<IntradayChartData[]> {
    return super.get<IntradayChartData[]>(
      `/historical-chart/${interval}`,
      { symbol, from, to }
    );
  }
}
