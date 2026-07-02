import { FMPClient } from "../FMPClient.js";
import type {
  TechnicalIndicatorParams,
  SMAIndicator,
  EMAIndicator,
  WMAIndicator,
  DEMAIndicator,
  TEMAIndicator,
  RSIIndicator,
  StandardDeviationIndicator,
  WilliamsIndicator,
  ADXIndicator,
} from "./types.js";

export class TechnicalIndicatorsClient extends FMPClient {

  /**
   * Get Simple Moving Average (SMA) indicator
   * @param params Technical indicator parameters
   */
  async getSMA(
    params: TechnicalIndicatorParams
  ): Promise<SMAIndicator[]> {
    return super.get<SMAIndicator[]>(
      "/technical-indicators/sma",
      params
    );
  }

  /**
   * Get Exponential Moving Average (EMA) indicator
   * @param params Technical indicator parameters
   */
  async getEMA(
    params: TechnicalIndicatorParams
  ): Promise<EMAIndicator[]> {
    return super.get<EMAIndicator[]>(
      "/technical-indicators/ema",
      params
    );
  }

  /**
   * Get Weighted Moving Average (WMA) indicator
   * @param params Technical indicator parameters
   */
  async getWMA(
    params: TechnicalIndicatorParams
  ): Promise<WMAIndicator[]> {
    return super.get<WMAIndicator[]>(
      "/technical-indicators/wma",
      params
    );
  }

  /**
   * Get Double Exponential Moving Average (DEMA) indicator
   * @param params Technical indicator parameters
   */
  async getDEMA(
    params: TechnicalIndicatorParams
  ): Promise<DEMAIndicator[]> {
    return super.get<DEMAIndicator[]>(
      "/technical-indicators/dema",
      params
    );
  }

  /**
   * Get Triple Exponential Moving Average (TEMA) indicator
   * @param params Technical indicator parameters
   */
  async getTEMA(
    params: TechnicalIndicatorParams
  ): Promise<TEMAIndicator[]> {
    return super.get<TEMAIndicator[]>(
      "/technical-indicators/tema",
      params
    );
  }

  /**
   * Get Relative Strength Index (RSI) indicator
   * @param params Technical indicator parameters
   */
  async getRSI(
    params: TechnicalIndicatorParams
  ): Promise<RSIIndicator[]> {
    return super.get<RSIIndicator[]>(
      "/technical-indicators/rsi",
      params
    );
  }

  /**
   * Get Standard Deviation indicator
   * @param params Technical indicator parameters
   */
  async getStandardDeviation(
    params: TechnicalIndicatorParams
  ): Promise<StandardDeviationIndicator[]> {
    return super.get<StandardDeviationIndicator[]>(
      "/technical-indicators/standarddeviation",
      params
    );
  }

  /**
   * Get Williams %R indicator
   * @param params Technical indicator parameters
   */
  async getWilliams(
    params: TechnicalIndicatorParams
  ): Promise<WilliamsIndicator[]> {
    return super.get<WilliamsIndicator[]>(
      "/technical-indicators/williams",
      params
    );
  }

  /**
   * Get Average Directional Index (ADX) indicator
   * @param params Technical indicator parameters
   */
  async getADX(
    params: TechnicalIndicatorParams
  ): Promise<ADXIndicator[]> {
    return super.get<ADXIndicator[]>(
      "/technical-indicators/adx",
      params
    );
  }
}
