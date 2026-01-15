import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TechnicalIndicatorsClient } from '../../../../src/api/technical-indicators/TechnicalIndicatorsClient.js';
import { FMPClient } from '../../../../src/api/FMPClient.js';
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
} from '../../../../src/api/technical-indicators/types.js';

// Mock the FMPClient
vi.mock('../FMPClient.js');

describe('TechnicalIndicatorsClient', () => {
  let technicalIndicatorsClient: TechnicalIndicatorsClient;
  let mockGet: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Create mock for the get method
    mockGet = vi.fn();
    
    // Mock FMPClient prototype get method using any to bypass protected access
    (FMPClient.prototype as any).get = mockGet;
    
    // Create TechnicalIndicatorsClient instance
    technicalIndicatorsClient = new TechnicalIndicatorsClient('test-api-key');
  });

  describe('getSMA', () => {
    it('should call get with correct parameters', async () => {
      const mockData: SMAIndicator[] = [
        {
          date: '2024-01-01',
          open: 150.0,
          high: 155.0,
          low: 148.0,
          close: 152.0,
          volume: 1000000,
          sma: 151.5
        },
        {
          date: '2024-01-02',
          open: 152.0,
          high: 157.0,
          low: 150.0,
          close: 156.0,
          volume: 1200000,
          sma: 152.8
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const params: TechnicalIndicatorParams = {
        symbol: 'AAPL',
        periodLength: 20,
        timeframe: '1day',
        from: '2024-01-01',
        to: '2024-01-31'
      };

      const result = await technicalIndicatorsClient.getSMA(params);

      expect(mockGet).toHaveBeenCalledWith('/technical-indicators/sma', params, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle optional parameters', async () => {
      const mockData: SMAIndicator[] = [];
      mockGet.mockResolvedValue(mockData);

      const params: TechnicalIndicatorParams = {
        symbol: 'MSFT',
        periodLength: 50,
        timeframe: '1hour'
      };

      await technicalIndicatorsClient.getSMA(params);

      expect(mockGet).toHaveBeenCalledWith('/technical-indicators/sma', params, undefined);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      const params: TechnicalIndicatorParams = {
        symbol: 'AAPL',
        periodLength: 20,
        timeframe: '1day'
      };

      await expect(technicalIndicatorsClient.getSMA(params))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getEMA', () => {
    it('should call get with correct parameters', async () => {
      const mockData: EMAIndicator[] = [
        {
          date: '2024-01-01',
          open: 150.0,
          high: 155.0,
          low: 148.0,
          close: 152.0,
          volume: 1000000,
          ema: 151.2
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const params: TechnicalIndicatorParams = {
        symbol: 'AAPL',
        periodLength: 12,
        timeframe: '1day'
      };

      const result = await technicalIndicatorsClient.getEMA(params);

      expect(mockGet).toHaveBeenCalledWith('/technical-indicators/ema', params, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle options parameter', async () => {
      const mockData: EMAIndicator[] = [];
      mockGet.mockResolvedValue(mockData);

      const params: TechnicalIndicatorParams = {
        symbol: 'GOOGL',
        periodLength: 26,
        timeframe: '4hour'
      };

      const options = { signal: new AbortController().signal };

      await technicalIndicatorsClient.getEMA(params, options);

      expect(mockGet).toHaveBeenCalledWith('/technical-indicators/ema', params, options);
    });
  });

  describe('getWMA', () => {
    it('should call get with correct parameters', async () => {
      const mockData: WMAIndicator[] = [
        {
          date: '2024-01-01',
          open: 150.0,
          high: 155.0,
          low: 148.0,
          close: 152.0,
          volume: 1000000,
          wma: 151.8
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const params: TechnicalIndicatorParams = {
        symbol: 'TSLA',
        periodLength: 14,
        timeframe: '30min'
      };

      const result = await technicalIndicatorsClient.getWMA(params);

      expect(mockGet).toHaveBeenCalledWith('/technical-indicators/wma', params, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('getDEMA', () => {
    it('should call get with correct parameters', async () => {
      const mockData: DEMAIndicator[] = [
        {
          date: '2024-01-01',
          open: 150.0,
          high: 155.0,
          low: 148.0,
          close: 152.0,
          volume: 1000000,
          dema: 151.0
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const params: TechnicalIndicatorParams = {
        symbol: 'NVDA',
        periodLength: 21,
        timeframe: '15min'
      };

      const result = await technicalIndicatorsClient.getDEMA(params);

      expect(mockGet).toHaveBeenCalledWith('/technical-indicators/dema', params, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('getTEMA', () => {
    it('should call get with correct parameters', async () => {
      const mockData: TEMAIndicator[] = [
        {
          date: '2024-01-01',
          open: 150.0,
          high: 155.0,
          low: 148.0,
          close: 152.0,
          volume: 1000000,
          tema: 151.3
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const params: TechnicalIndicatorParams = {
        symbol: 'AMZN',
        periodLength: 30,
        timeframe: '5min'
      };

      const result = await technicalIndicatorsClient.getTEMA(params);

      expect(mockGet).toHaveBeenCalledWith('/technical-indicators/tema', params, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('getRSI', () => {
    it('should call get with correct parameters', async () => {
      const mockData: RSIIndicator[] = [
        {
          date: '2024-01-01',
          open: 150.0,
          high: 155.0,
          low: 148.0,
          close: 152.0,
          volume: 1000000,
          rsi: 65.4
        },
        {
          date: '2024-01-02',
          open: 152.0,
          high: 157.0,
          low: 150.0,
          close: 156.0,
          volume: 1200000,
          rsi: 72.1
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const params: TechnicalIndicatorParams = {
        symbol: 'META',
        periodLength: 14,
        timeframe: '1day',
        from: '2024-01-01',
        to: '2024-02-01'
      };

      const result = await technicalIndicatorsClient.getRSI(params);

      expect(mockGet).toHaveBeenCalledWith('/technical-indicators/rsi', params, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('getStandardDeviation', () => {
    it('should call get with correct parameters', async () => {
      const mockData: StandardDeviationIndicator[] = [
        {
          date: '2024-01-01',
          open: 150.0,
          high: 155.0,
          low: 148.0,
          close: 152.0,
          volume: 1000000,
          standardDeviation: 2.45
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const params: TechnicalIndicatorParams = {
        symbol: 'NFLX',
        periodLength: 20,
        timeframe: '1hour'
      };

      const result = await technicalIndicatorsClient.getStandardDeviation(params);

      expect(mockGet).toHaveBeenCalledWith('/technical-indicators/standarddeviation', params, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('getWilliams', () => {
    it('should call get with correct parameters', async () => {
      const mockData: WilliamsIndicator[] = [
        {
          date: '2024-01-01',
          open: 150.0,
          high: 155.0,
          low: 148.0,
          close: 152.0,
          volume: 1000000,
          williams: -25.6
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const params: TechnicalIndicatorParams = {
        symbol: 'AMD',
        periodLength: 14,
        timeframe: '1day'
      };

      const result = await technicalIndicatorsClient.getWilliams(params);

      expect(mockGet).toHaveBeenCalledWith('/technical-indicators/williams', params, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('getADX', () => {
    it('should call get with correct parameters', async () => {
      const mockData: ADXIndicator[] = [
        {
          date: '2024-01-01',
          open: 150.0,
          high: 155.0,
          low: 148.0,
          close: 152.0,
          volume: 1000000,
          adx: 28.7
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const params: TechnicalIndicatorParams = {
        symbol: 'INTC',
        periodLength: 14,
        timeframe: '1day'
      };

      const result = await technicalIndicatorsClient.getADX(params);

      expect(mockGet).toHaveBeenCalledWith('/technical-indicators/adx', params, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle context in options', async () => {
      const mockData: ADXIndicator[] = [];
      mockGet.mockResolvedValue(mockData);

      const params: TechnicalIndicatorParams = {
        symbol: 'IBM',
        periodLength: 14,
        timeframe: '1day'
      };

      const options = { 
        context: { 
          config: {
            FMP_ACCESS_TOKEN: 'test-token'
          }
        }
      };

      await technicalIndicatorsClient.getADX(params, options);

      expect(mockGet).toHaveBeenCalledWith('/technical-indicators/adx', params, options);
    });
  });

  describe('constructor', () => {
    it('should create instance with API key', () => {
      const client = new TechnicalIndicatorsClient('my-api-key');
      expect(client).toBeInstanceOf(TechnicalIndicatorsClient);
    });

    it('should create instance without API key', () => {
      const client = new TechnicalIndicatorsClient();
      expect(client).toBeInstanceOf(TechnicalIndicatorsClient);
    });
  });
}); 