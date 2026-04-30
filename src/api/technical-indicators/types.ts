// Base interface for all technical indicators
interface TechnicalIndicatorBase {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Simple Moving Average (SMA)
export interface SMAIndicator extends TechnicalIndicatorBase {
  sma: number;
}

// Exponential Moving Average (EMA)
export interface EMAIndicator extends TechnicalIndicatorBase {
  ema: number;
}

// Weighted Moving Average (WMA)
export interface WMAIndicator extends TechnicalIndicatorBase {
  wma: number;
}

// Double Exponential Moving Average (DEMA)
export interface DEMAIndicator extends TechnicalIndicatorBase {
  dema: number;
}

// Triple Exponential Moving Average (TEMA)
export interface TEMAIndicator extends TechnicalIndicatorBase {
  tema: number;
}

// Relative Strength Index (RSI)
export interface RSIIndicator extends TechnicalIndicatorBase {
  rsi: number;
}

// Standard Deviation
export interface StandardDeviationIndicator extends TechnicalIndicatorBase {
  standardDeviation: number;
}

// Williams %R
export interface WilliamsIndicator extends TechnicalIndicatorBase {
  williams: number;
}

// Average Directional Index (ADX)
export interface ADXIndicator extends TechnicalIndicatorBase {
  adx: number;
}

// Common parameters for technical indicator requests
export interface TechnicalIndicatorParams {
  symbol: string;
  periodLength: number;
  timeframe: string;
  from?: string;
  to?: string;
}
