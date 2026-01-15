import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ChartClient } from '../../../../src/api/chart/ChartClient.js';
import { FMPClient } from '../../../../src/api/FMPClient.js';
import type {
  ChartData,
  LightChartData,
  UnadjustedChartData,
  IntradayChartData,
  Interval,
} from '../../../../src/api/chart/types.js';

// Mock the FMPClient
vi.mock('../FMPClient.js');

describe('ChartClient', () => {
  let chartClient: ChartClient;
  let mockGet: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Create mock for the get method
    mockGet = vi.fn();
    
    // Mock FMPClient prototype get method using any to bypass protected access
    (FMPClient.prototype as any).get = mockGet;
    
    // Create ChartClient instance
    chartClient = new ChartClient('test-api-key');
  });

  describe('getLightChart', () => {
    it('should call get with correct parameters with all options', async () => {
      const mockData: LightChartData[] = [
        {
          symbol: 'AAPL',
          date: '2024-01-01',
          close: 185.25,
          volume: 45000000
        },
        {
          symbol: 'AAPL',
          date: '2024-01-02',
          close: 187.50,
          volume: 42000000
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await chartClient.getLightChart('AAPL', '2024-01-01', '2024-01-31');

      expect(mockGet).toHaveBeenCalledWith('/historical-price-eod/light', {
        symbol: 'AAPL',
        from: '2024-01-01',
        to: '2024-01-31'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with correct parameters without optional dates', async () => {
      const mockData: LightChartData[] = [];
      mockGet.mockResolvedValue(mockData);

      const result = await chartClient.getLightChart('MSFT');

      expect(mockGet).toHaveBeenCalledWith('/historical-price-eod/light', {
        symbol: 'MSFT',
        from: undefined,
        to: undefined
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(chartClient.getLightChart('AAPL'))
        .rejects.toThrow(errorMessage);
    });

    it('should pass options to get method', async () => {
      const mockData: LightChartData[] = [];
      mockGet.mockResolvedValue(mockData);
      
      const options = { 
        signal: new AbortController().signal,
        context: { config: { FMP_ACCESS_TOKEN: 'test-token' } }
      };

      await chartClient.getLightChart('AAPL', '2024-01-01', '2024-01-31', options);

      expect(mockGet).toHaveBeenCalledWith('/historical-price-eod/light', {
        symbol: 'AAPL',
        from: '2024-01-01',
        to: '2024-01-31'
      }, options);
    });
  });

  describe('getFullChart', () => {
    it('should call get with correct parameters with all options', async () => {
      const mockData: ChartData[] = [
        {
          symbol: 'AAPL',
          date: '2024-01-01',
          open: 180.00,
          high: 188.00,
          low: 179.50,
          close: 185.25,
          volume: 45000000,
          change: 5.25,
          changePercent: 2.92,
          vwap: 183.50
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await chartClient.getFullChart('AAPL', '2024-01-01', '2024-01-31');

      expect(mockGet).toHaveBeenCalledWith('/historical-price-eod/full', {
        symbol: 'AAPL',
        from: '2024-01-01',
        to: '2024-01-31'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with correct parameters without optional dates', async () => {
      const mockData: ChartData[] = [];
      mockGet.mockResolvedValue(mockData);

      const result = await chartClient.getFullChart('TSLA');

      expect(mockGet).toHaveBeenCalledWith('/historical-price-eod/full', {
        symbol: 'TSLA',
        from: undefined,
        to: undefined
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(chartClient.getFullChart('AAPL'))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getUnadjustedChart', () => {
    it('should call get with correct parameters with all options', async () => {
      const mockData: UnadjustedChartData[] = [
        {
          symbol: 'AAPL',
          date: '2024-01-01',
          adjOpen: 180.00,
          adjHigh: 188.00,
          adjLow: 179.50,
          adjClose: 185.25,
          volume: 45000000
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await chartClient.getUnadjustedChart('AAPL', '2024-01-01', '2024-01-31');

      expect(mockGet).toHaveBeenCalledWith('/historical-price-eod/non-split-adjusted', {
        symbol: 'AAPL',
        from: '2024-01-01',
        to: '2024-01-31'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with correct parameters without optional dates', async () => {
      const mockData: UnadjustedChartData[] = [];
      mockGet.mockResolvedValue(mockData);

      const result = await chartClient.getUnadjustedChart('GOOGL');

      expect(mockGet).toHaveBeenCalledWith('/historical-price-eod/non-split-adjusted', {
        symbol: 'GOOGL',
        from: undefined,
        to: undefined
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(chartClient.getUnadjustedChart('AAPL'))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getDividendAdjustedChart', () => {
    it('should call get with correct parameters with all options', async () => {
      const mockData: UnadjustedChartData[] = [
        {
          symbol: 'AAPL',
          date: '2024-01-01',
          adjOpen: 180.00,
          adjHigh: 188.00,
          adjLow: 179.50,
          adjClose: 185.25,
          volume: 45000000
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await chartClient.getDividendAdjustedChart('AAPL', '2024-01-01', '2024-01-31');

      expect(mockGet).toHaveBeenCalledWith('/historical-price-eod/dividend-adjusted', {
        symbol: 'AAPL',
        from: '2024-01-01',
        to: '2024-01-31'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with correct parameters without optional dates', async () => {
      const mockData: UnadjustedChartData[] = [];
      mockGet.mockResolvedValue(mockData);

      const result = await chartClient.getDividendAdjustedChart('IBM');

      expect(mockGet).toHaveBeenCalledWith('/historical-price-eod/dividend-adjusted', {
        symbol: 'IBM',
        from: undefined,
        to: undefined
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(chartClient.getDividendAdjustedChart('AAPL'))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getIntradayChart', () => {
    it('should call get with correct parameters with all options', async () => {
      const mockData: IntradayChartData[] = [
        {
          date: '2024-01-01 09:30:00',
          adjOpen: 180.00,
          adjHigh: 181.50,
          adjLow: 179.75,
          adjClose: 180.50,
          volume: 1000000
        },
        {
          date: '2024-01-01 09:35:00',
          adjOpen: 180.50,
          adjHigh: 182.00,
          adjLow: 180.25,
          adjClose: 181.75,
          volume: 1200000
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await chartClient.getIntradayChart('AAPL', '5min', '2024-01-01', '2024-01-01');

      expect(mockGet).toHaveBeenCalledWith('/historical-chart/5min', {
        symbol: 'AAPL',
        from: '2024-01-01',
        to: '2024-01-01'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with correct parameters for different intervals', async () => {
      const intervals: Interval[] = ['1min', '5min', '15min', '30min', '1hour', '4hour'];
      
      for (const interval of intervals) {
        const mockData: IntradayChartData[] = [];
        mockGet.mockResolvedValue(mockData);

        await chartClient.getIntradayChart('AAPL', interval);

        expect(mockGet).toHaveBeenCalledWith(`/historical-chart/${interval}`, {
          symbol: 'AAPL',
          from: undefined,
          to: undefined
        }, undefined);
      }
    });

    it('should call get with correct parameters without optional dates', async () => {
      const mockData: IntradayChartData[] = [];
      mockGet.mockResolvedValue(mockData);

      const result = await chartClient.getIntradayChart('NVDA', '1hour');

      expect(mockGet).toHaveBeenCalledWith('/historical-chart/1hour', {
        symbol: 'NVDA',
        from: undefined,
        to: undefined
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(chartClient.getIntradayChart('AAPL', '5min'))
        .rejects.toThrow(errorMessage);
    });

    it('should pass options to get method', async () => {
      const mockData: IntradayChartData[] = [];
      mockGet.mockResolvedValue(mockData);
      
      const options = { 
        signal: new AbortController().signal,
        context: { config: { FMP_ACCESS_TOKEN: 'test-token' } }
      };

      await chartClient.getIntradayChart('AAPL', '15min', '2024-01-01', '2024-01-01', options);

      expect(mockGet).toHaveBeenCalledWith('/historical-chart/15min', {
        symbol: 'AAPL',
        from: '2024-01-01',
        to: '2024-01-01'
      }, options);
    });
  });

  describe('constructor', () => {
    it('should create instance with API key', () => {
      const client = new ChartClient('my-api-key');
      expect(client).toBeInstanceOf(ChartClient);
    });

    it('should create instance without API key', () => {
      const client = new ChartClient();
      expect(client).toBeInstanceOf(ChartClient);
    });
  });
}); 