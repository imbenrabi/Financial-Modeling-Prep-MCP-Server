import { FMPClient } from "../FMPClient.js";
import type { FMPContext } from "../../types/index.js";
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
   * @param options Optional parameters including abort signal and context
   */
  async getSMA(
    params: TechnicalIndicatorParams,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<SMAIndicator[]> {
    return super.get<SMAIndicator[]>(
      "/technical-indicators/sma",
      params,
      options
    );
  }

  /**
   * Get Exponential Moving Average (EMA) indicator
   * @param params Technical indicator parameters
   * @param options Optional parameters including abort signal and context
   */
  async getEMA(
    params: TechnicalIndicatorParams,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<EMAIndicator[]> {
    return super.get<EMAIndicator[]>(
      "/technical-indicators/ema",
      params,
      options
    );
  }

  /**
   * Get Weighted Moving Average (WMA) indicator
   * @param params Technical indicator parameters
   * @param options Optional parameters including abort signal and context
   */
  async getWMA(
    params: TechnicalIndicatorParams,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<WMAIndicator[]> {
    return super.get<WMAIndicator[]>(
      "/technical-indicators/wma",
      params,
      options
    );
  }

  /**
   * Get Double Exponential Moving Average (DEMA) indicator
   * @param params Technical indicator parameters
   * @param options Optional parameters including abort signal and context
   */
  async getDEMA(
    params: TechnicalIndicatorParams,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<DEMAIndicator[]> {
    return super.get<DEMAIndicator[]>(
      "/technical-indicators/dema",
      params,
      options
    );
  }

  /**
   * Get Triple Exponential Moving Average (TEMA) indicator
   * @param params Technical indicator parameters
   * @param options Optional parameters including abort signal and context
   */
  async getTEMA(
    params: TechnicalIndicatorParams,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<TEMAIndicator[]> {
    return super.get<TEMAIndicator[]>(
      "/technical-indicators/tema",
      params,
      options
    );
  }

  /**
   * Get Relative Strength Index (RSI) indicator
   * @param params Technical indicator parameters
   * @param options Optional parameters including abort signal and context
   */
  async getRSI(
    params: TechnicalIndicatorParams,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<RSIIndicator[]> {
    return super.get<RSIIndicator[]>(
      "/technical-indicators/rsi",
      params,
      options
    );
  }

  /**
   * Get Standard Deviation indicator
   * @param params Technical indicator parameters
   * @param options Optional parameters including abort signal and context
   */
  async getStandardDeviation(
    params: TechnicalIndicatorParams,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<StandardDeviationIndicator[]> {
    return super.get<StandardDeviationIndicator[]>(
      "/technical-indicators/standarddeviation",
      params,
      options
    );
  }

  /**
   * Get Williams %R indicator
   * @param params Technical indicator parameters
   * @param options Optional parameters including abort signal and context
   */
  async getWilliams(
    params: TechnicalIndicatorParams,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<WilliamsIndicator[]> {
    return super.get<WilliamsIndicator[]>(
      "/technical-indicators/williams",
      params,
      options
    );
  }

  /**
   * Get Average Directional Index (ADX) indicator
   * @param params Technical indicator parameters
   * @param options Optional parameters including abort signal and context
   */
  async getADX(
    params: TechnicalIndicatorParams,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<ADXIndicator[]> {
    return super.get<ADXIndicator[]>(
      "/technical-indicators/adx",
      params,
      options
    );
  }
}
