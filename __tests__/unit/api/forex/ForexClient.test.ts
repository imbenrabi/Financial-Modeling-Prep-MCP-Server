import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ForexClient } from '../../../../src/api/forex/ForexClient.js';
import { FMPClient } from '../../../../src/api/FMPClient.js';
import type {
  ForexPair,
  ForexQuote,
  ForexShortQuote,
  ForexLightChart,
  ForexHistoricalChart,
  ForexIntradayChart,
} from '../../../../src/api/forex/types.js';

// Mock the FMPClient
vi.mock('../FMPClient.js');

describe('ForexClient', () => {
  let forexClient: ForexClient;
  let mockGet: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Create mock for the get method
    mockGet = vi.fn();
    
    // Mock FMPClient prototype get method using any to bypass protected access
    (FMPClient.prototype as any).get = mockGet;
    
    // Create ForexClient instance
    forexClient = new ForexClient('test-api-key');
  });

  describe('getList', () => {
    it('should call get with correct parameters', async () => {
      const mockData: ForexPair[] = [
        {
          symbol: 'EURUSD',
          fromCurrency: 'EUR',
          toCurrency: 'USD',
          fromName: 'Euro',
          toName: 'US Dollar'
        },
        {
          symbol: 'GBPUSD',
          fromCurrency: 'GBP',
          toCurrency: 'USD',
          fromName: 'British Pound',
          toName: 'US Dollar'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await forexClient.getList();

      expect(mockGet).toHaveBeenCalledWith('/forex-list', {}, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(forexClient.getList())
        .rejects.toThrow(errorMessage);
    });

    it('should pass options correctly', async () => {
      const mockData: ForexPair[] = [];
      mockGet.mockResolvedValue(mockData);
      const abortSignal = new AbortController().signal;
      const context = { config: { FMP_ACCESS_TOKEN: 'test-token' } };

      await forexClient.getList({
        signal: abortSignal,
        context
      });

      expect(mockGet).toHaveBeenCalledWith('/forex-list', {}, {
        signal: abortSignal,
        context
      });
    });
  });

  describe('getQuote', () => {
    it('should call get with correct parameters', async () => {
      const mockData: ForexQuote[] = [
        {
          symbol: 'EURUSD',
          name: 'EUR/USD',
          price: 1.0850,
          changePercentage: 0.25,
          change: 0.0027,
          volume: 1500000,
          dayLow: 1.0820,
          dayHigh: 1.0880,
          yearHigh: 1.1200,
          yearLow: 1.0500,
          marketCap: null,
          priceAvg50: 1.0900,
          priceAvg200: 1.1000,
          exchange: 'FOREX',
          open: 1.0823,
          previousClose: 1.0823,
          timestamp: 1704067200
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await forexClient.getQuote('EURUSD');

      expect(mockGet).toHaveBeenCalledWith('/quote', {
        symbol: 'EURUSD'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(forexClient.getQuote('EURUSD'))
        .rejects.toThrow(errorMessage);
    });

    it('should pass options correctly', async () => {
      const mockData: ForexQuote[] = [];
      mockGet.mockResolvedValue(mockData);
      const abortSignal = new AbortController().signal;
      const context = { config: { FMP_ACCESS_TOKEN: 'test-token' } };

      await forexClient.getQuote('EURUSD', {
        signal: abortSignal,
        context
      });

      expect(mockGet).toHaveBeenCalledWith('/quote', {
        symbol: 'EURUSD'
      }, {
        signal: abortSignal,
        context
      });
    });
  });

  describe('getShortQuote', () => {
    it('should call get with correct parameters', async () => {
      const mockData: ForexShortQuote[] = [
        {
          symbol: 'GBPUSD',
          price: 1.2650,
          change: -0.0015,
          volume: 980000
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await forexClient.getShortQuote('GBPUSD');

      expect(mockGet).toHaveBeenCalledWith('/quote-short', {
        symbol: 'GBPUSD'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(forexClient.getShortQuote('GBPUSD'))
        .rejects.toThrow(errorMessage);
    });

    it('should pass options correctly', async () => {
      const mockData: ForexShortQuote[] = [];
      mockGet.mockResolvedValue(mockData);
      const abortSignal = new AbortController().signal;
      const context = { config: { FMP_ACCESS_TOKEN: 'test-token' } };

      await forexClient.getShortQuote('GBPUSD', {
        signal: abortSignal,
        context
      });

      expect(mockGet).toHaveBeenCalledWith('/quote-short', {
        symbol: 'GBPUSD'
      }, {
        signal: abortSignal,
        context
      });
    });
  });

  describe('getBatchQuotes', () => {
    it('should call get with correct parameters with short flag', async () => {
      const mockData: ForexShortQuote[] = [
        {
          symbol: 'EURUSD',
          price: 1.0850,
          change: 0.0027,
          volume: 1500000
        },
        {
          symbol: 'GBPUSD',
          price: 1.2650,
          change: -0.0015,
          volume: 980000
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await forexClient.getBatchQuotes(true);

      expect(mockGet).toHaveBeenCalledWith('/batch-forex-quotes', {
        short: true
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with correct parameters without short flag', async () => {
      const mockData: ForexShortQuote[] = [];
      mockGet.mockResolvedValue(mockData);

      const result = await forexClient.getBatchQuotes();

      expect(mockGet).toHaveBeenCalledWith('/batch-forex-quotes', {
        short: undefined
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(forexClient.getBatchQuotes(false))
        .rejects.toThrow(errorMessage);
    });

    it('should pass options correctly', async () => {
      const mockData: ForexShortQuote[] = [];
      mockGet.mockResolvedValue(mockData);
      const abortSignal = new AbortController().signal;
      const context = { config: { FMP_ACCESS_TOKEN: 'test-token' } };

      await forexClient.getBatchQuotes(true, {
        signal: abortSignal,
        context
      });

      expect(mockGet).toHaveBeenCalledWith('/batch-forex-quotes', {
        short: true
      }, {
        signal: abortSignal,
        context
      });
    });
  });

  describe('getHistoricalLightChart', () => {
    it('should call get with correct parameters with date range', async () => {
      const mockData: ForexLightChart[] = [
        {
          symbol: 'EURUSD',
          date: '2024-01-01',
          price: 1.0850,
          volume: 1500000
        },
        {
          symbol: 'EURUSD',
          date: '2024-01-02',
          price: 1.0870,
          volume: 1600000
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await forexClient.getHistoricalLightChart('EURUSD', '2024-01-01', '2024-01-31');

      expect(mockGet).toHaveBeenCalledWith('/historical-price-eod/light', {
        symbol: 'EURUSD',
        from: '2024-01-01',
        to: '2024-01-31'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with correct parameters without date range', async () => {
      const mockData: ForexLightChart[] = [];
      mockGet.mockResolvedValue(mockData);

      const result = await forexClient.getHistoricalLightChart('EURUSD');

      expect(mockGet).toHaveBeenCalledWith('/historical-price-eod/light', {
        symbol: 'EURUSD',
        from: undefined,
        to: undefined
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(forexClient.getHistoricalLightChart('EURUSD', '2024-01-01', '2024-01-31'))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getHistoricalFullChart', () => {
    it('should call get with correct parameters with date range', async () => {
      const mockData: ForexHistoricalChart[] = [
        {
          symbol: 'EURUSD',
          date: '2024-01-01',
          open: 1.0820,
          high: 1.0880,
          low: 1.0815,
          close: 1.0850,
          volume: 1500000,
          change: 0.0030,
          changePercent: 0.28,
          vwap: 1.0845
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await forexClient.getHistoricalFullChart('EURUSD', '2024-01-01', '2024-01-31');

      expect(mockGet).toHaveBeenCalledWith('/historical-price-eod/full', {
        symbol: 'EURUSD',
        from: '2024-01-01',
        to: '2024-01-31'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with correct parameters without date range', async () => {
      const mockData: ForexHistoricalChart[] = [];
      mockGet.mockResolvedValue(mockData);

      const result = await forexClient.getHistoricalFullChart('EURUSD');

      expect(mockGet).toHaveBeenCalledWith('/historical-price-eod/full', {
        symbol: 'EURUSD',
        from: undefined,
        to: undefined
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(forexClient.getHistoricalFullChart('EURUSD', '2024-01-01', '2024-01-31'))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('get1MinuteData', () => {
    it('should call get with correct parameters with date range', async () => {
      const mockData: ForexIntradayChart[] = [
        {
          date: '2024-01-01 09:00:00',
          open: 1.0820,
          high: 1.0825,
          low: 1.0818,
          close: 1.0822,
          volume: 50000
        },
        {
          date: '2024-01-01 09:01:00',
          open: 1.0822,
          high: 1.0828,
          low: 1.0821,
          close: 1.0825,
          volume: 52000
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await forexClient.get1MinuteData('EURUSD', '2024-01-01', '2024-01-01');

      expect(mockGet).toHaveBeenCalledWith('/historical-chart/1min', {
        symbol: 'EURUSD',
        from: '2024-01-01',
        to: '2024-01-01'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with correct parameters without date range', async () => {
      const mockData: ForexIntradayChart[] = [];
      mockGet.mockResolvedValue(mockData);

      const result = await forexClient.get1MinuteData('EURUSD');

      expect(mockGet).toHaveBeenCalledWith('/historical-chart/1min', {
        symbol: 'EURUSD',
        from: undefined,
        to: undefined
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(forexClient.get1MinuteData('EURUSD', '2024-01-01', '2024-01-01'))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('get5MinuteData', () => {
    it('should call get with correct parameters with date range', async () => {
      const mockData: ForexIntradayChart[] = [
        {
          date: '2024-01-01 09:00:00',
          open: 1.0820,
          high: 1.0835,
          low: 1.0815,
          close: 1.0830,
          volume: 250000
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await forexClient.get5MinuteData('EURUSD', '2024-01-01', '2024-01-01');

      expect(mockGet).toHaveBeenCalledWith('/historical-chart/5min', {
        symbol: 'EURUSD',
        from: '2024-01-01',
        to: '2024-01-01'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with correct parameters without date range', async () => {
      const mockData: ForexIntradayChart[] = [];
      mockGet.mockResolvedValue(mockData);

      const result = await forexClient.get5MinuteData('EURUSD');

      expect(mockGet).toHaveBeenCalledWith('/historical-chart/5min', {
        symbol: 'EURUSD',
        from: undefined,
        to: undefined
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(forexClient.get5MinuteData('EURUSD', '2024-01-01', '2024-01-01'))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('get1HourData', () => {
    it('should call get with correct parameters with date range', async () => {
      const mockData: ForexIntradayChart[] = [
        {
          date: '2024-01-01 09:00:00',
          open: 1.0820,
          high: 1.0880,
          low: 1.0810,
          close: 1.0850,
          volume: 3000000
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await forexClient.get1HourData('EURUSD', '2024-01-01', '2024-01-02');

      expect(mockGet).toHaveBeenCalledWith('/historical-chart/1hour', {
        symbol: 'EURUSD',
        from: '2024-01-01',
        to: '2024-01-02'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with correct parameters without date range', async () => {
      const mockData: ForexIntradayChart[] = [];
      mockGet.mockResolvedValue(mockData);

      const result = await forexClient.get1HourData('EURUSD');

      expect(mockGet).toHaveBeenCalledWith('/historical-chart/1hour', {
        symbol: 'EURUSD',
        from: undefined,
        to: undefined
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(forexClient.get1HourData('EURUSD', '2024-01-01', '2024-01-02'))
        .rejects.toThrow(errorMessage);
    });

    it('should pass options correctly', async () => {
      const mockData: ForexIntradayChart[] = [];
      mockGet.mockResolvedValue(mockData);
      const abortSignal = new AbortController().signal;
      const context = { config: { FMP_ACCESS_TOKEN: 'test-token' } };

      await forexClient.get1HourData('EURUSD', '2024-01-01', '2024-01-02', {
        signal: abortSignal,
        context
      });

      expect(mockGet).toHaveBeenCalledWith('/historical-chart/1hour', {
        symbol: 'EURUSD',
        from: '2024-01-01',
        to: '2024-01-02'
      }, {
        signal: abortSignal,
        context
      });
    });
  });

  describe('constructor', () => {
    it('should create instance with API key', () => {
      const client = new ForexClient('my-api-key');
      expect(client).toBeInstanceOf(ForexClient);
    });

    it('should create instance without API key', () => {
      const client = new ForexClient();
      expect(client).toBeInstanceOf(ForexClient);
    });
  });
}); 