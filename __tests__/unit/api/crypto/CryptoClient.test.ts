import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CryptoClient } from '../../../../src/api/crypto/CryptoClient.js';
import { FMPClient } from '../../../../src/api/FMPClient.js';
import type {
  Cryptocurrency,
  CryptocurrencyQuote,
  CryptocurrencyShortQuote,
  CryptocurrencyLightChart,
  CryptocurrencyHistoricalChart,
  CryptocurrencyIntradayPrice,
} from '../../../../src/api/crypto/types.js';

// Mock the FMPClient
vi.mock('../FMPClient.js');

describe('CryptoClient', () => {
  let cryptoClient: CryptoClient;
  let mockGet: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Create mock for the get method
    mockGet = vi.fn();
    
    // Mock FMPClient prototype get method using any to bypass protected access
    (FMPClient.prototype as any).get = mockGet;
    
    // Create CryptoClient instance
    cryptoClient = new CryptoClient('test-api-key');
  });

  describe('getList', () => {
    it('should call get with correct parameters', async () => {
      const mockData: Cryptocurrency[] = [
        {
          symbol: 'BTCUSD',
          name: 'Bitcoin',
          exchange: 'Crypto',
          icoDate: '2009-01-03',
          circulatingSupply: 19500000,
          totalSupply: 21000000
        },
        {
          symbol: 'ETHUSD',
          name: 'Ethereum',
          exchange: 'Crypto',
          icoDate: '2015-07-30',
          circulatingSupply: 120000000,
          totalSupply: null
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await cryptoClient.getList();

      expect(mockGet).toHaveBeenCalledWith('/cryptocurrency-list', {}, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(cryptoClient.getList())
        .rejects.toThrow(errorMessage);
    });

    it('should call get with options', async () => {
      const mockData: Cryptocurrency[] = [];
      mockGet.mockResolvedValue(mockData);

      const options = { signal: new AbortController().signal };
      await cryptoClient.getList(options);

      expect(mockGet).toHaveBeenCalledWith('/cryptocurrency-list', {}, options);
    });
  });

  describe('getQuote', () => {
    it('should call get with correct parameters', async () => {
      const mockData: CryptocurrencyQuote[] = [
        {
          symbol: 'BTCUSD',
          name: 'Bitcoin',
          price: 45000.50,
          changePercentage: 2.5,
          change: 1098.50,
          volume: 28000000000,
          dayLow: 44000.00,
          dayHigh: 46000.00,
          yearHigh: 69000.00,
          yearLow: 15500.00,
          marketCap: 877500000000,
          priceAvg50: 42000.00,
          priceAvg200: 38000.00,
          exchange: 'Crypto',
          open: 44500.00,
          previousClose: 43902.00,
          timestamp: 1640995200
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await cryptoClient.getQuote('BTCUSD');

      expect(mockGet).toHaveBeenCalledWith('/quote', { symbol: 'BTCUSD' }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(cryptoClient.getQuote('BTCUSD'))
        .rejects.toThrow(errorMessage);
    });

    it('should call get with options', async () => {
      const mockData: CryptocurrencyQuote[] = [];
      mockGet.mockResolvedValue(mockData);

      const options = { signal: new AbortController().signal };
      await cryptoClient.getQuote('BTCUSD', options);

      expect(mockGet).toHaveBeenCalledWith('/quote', { symbol: 'BTCUSD' }, options);
    });
  });

  describe('getShortQuote', () => {
    it('should call get with correct parameters', async () => {
      const mockData: CryptocurrencyShortQuote[] = [
        {
          symbol: 'BTCUSD',
          price: 45000.50,
          change: 1098.50,
          volume: 28000000000
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await cryptoClient.getShortQuote('BTCUSD');

      expect(mockGet).toHaveBeenCalledWith('/quote-short', { symbol: 'BTCUSD' }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(cryptoClient.getShortQuote('BTCUSD'))
        .rejects.toThrow(errorMessage);
    });

    it('should call get with options', async () => {
      const mockData: CryptocurrencyShortQuote[] = [];
      mockGet.mockResolvedValue(mockData);

      const options = { signal: new AbortController().signal };
      await cryptoClient.getShortQuote('ETHUSD', options);

      expect(mockGet).toHaveBeenCalledWith('/quote-short', { symbol: 'ETHUSD' }, options);
    });
  });

  describe('getBatchQuotes', () => {
    it('should call get with correct parameters without short parameter', async () => {
      const mockData: CryptocurrencyShortQuote[] = [
        {
          symbol: 'BTCUSD',
          price: 45000.50,
          change: 1098.50,
          volume: 28000000000
        },
        {
          symbol: 'ETHUSD',
          price: 3200.75,
          change: 150.25,
          volume: 15000000000
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await cryptoClient.getBatchQuotes();

      expect(mockGet).toHaveBeenCalledWith('/batch-crypto-quotes', { short: undefined }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with short parameter set to true', async () => {
      const mockData: CryptocurrencyShortQuote[] = [];
      mockGet.mockResolvedValue(mockData);

      const result = await cryptoClient.getBatchQuotes(true);

      expect(mockGet).toHaveBeenCalledWith('/batch-crypto-quotes', { short: true }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with short parameter set to false', async () => {
      const mockData: CryptocurrencyShortQuote[] = [];
      mockGet.mockResolvedValue(mockData);

      const result = await cryptoClient.getBatchQuotes(false);

      expect(mockGet).toHaveBeenCalledWith('/batch-crypto-quotes', { short: false }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(cryptoClient.getBatchQuotes())
        .rejects.toThrow(errorMessage);
    });

    it('should call get with options', async () => {
      const mockData: CryptocurrencyShortQuote[] = [];
      mockGet.mockResolvedValue(mockData);

      const options = { signal: new AbortController().signal };
      await cryptoClient.getBatchQuotes(true, options);

      expect(mockGet).toHaveBeenCalledWith('/batch-crypto-quotes', { short: true }, options);
    });
  });

  describe('getHistoricalLightChart', () => {
    it('should call get with correct parameters with all options', async () => {
      const mockData: CryptocurrencyLightChart[] = [
        {
          symbol: 'BTCUSD',
          date: '2024-01-01',
          price: 45000.50,
          volume: 28000000000
        },
        {
          symbol: 'BTCUSD',
          date: '2024-01-02',
          price: 45500.25,
          volume: 29000000000
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await cryptoClient.getHistoricalLightChart('BTCUSD', '2024-01-01', '2024-01-02');

      expect(mockGet).toHaveBeenCalledWith('/historical-price-eod/light', {
        symbol: 'BTCUSD',
        from: '2024-01-01',
        to: '2024-01-02'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get without optional date parameters', async () => {
      const mockData: CryptocurrencyLightChart[] = [];
      mockGet.mockResolvedValue(mockData);

      await cryptoClient.getHistoricalLightChart('BTCUSD');

      expect(mockGet).toHaveBeenCalledWith('/historical-price-eod/light', {
        symbol: 'BTCUSD',
        from: undefined,
        to: undefined
      }, undefined);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(cryptoClient.getHistoricalLightChart('BTCUSD'))
        .rejects.toThrow(errorMessage);
    });

    it('should call get with options', async () => {
      const mockData: CryptocurrencyLightChart[] = [];
      mockGet.mockResolvedValue(mockData);

      const options = { signal: new AbortController().signal };
      await cryptoClient.getHistoricalLightChart('BTCUSD', undefined, undefined, options);

      expect(mockGet).toHaveBeenCalledWith('/historical-price-eod/light', {
        symbol: 'BTCUSD',
        from: undefined,
        to: undefined
      }, options);
    });
  });

  describe('getHistoricalFullChart', () => {
    it('should call get with correct parameters with all options', async () => {
      const mockData: CryptocurrencyHistoricalChart[] = [
        {
          symbol: 'BTCUSD',
          date: '2024-01-01',
          open: 44500.00,
          high: 46000.00,
          low: 44000.00,
          close: 45000.50,
          volume: 28000000000,
          change: 500.50,
          changePercent: 1.12,
          vwap: 45125.25
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await cryptoClient.getHistoricalFullChart('BTCUSD', '2024-01-01', '2024-01-02');

      expect(mockGet).toHaveBeenCalledWith('/historical-price-eod/full', {
        symbol: 'BTCUSD',
        from: '2024-01-01',
        to: '2024-01-02'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get without optional date parameters', async () => {
      const mockData: CryptocurrencyHistoricalChart[] = [];
      mockGet.mockResolvedValue(mockData);

      await cryptoClient.getHistoricalFullChart('BTCUSD');

      expect(mockGet).toHaveBeenCalledWith('/historical-price-eod/full', {
        symbol: 'BTCUSD',
        from: undefined,
        to: undefined
      }, undefined);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(cryptoClient.getHistoricalFullChart('BTCUSD'))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('get1MinuteData', () => {
    it('should call get with correct parameters with all options', async () => {
      const mockData: CryptocurrencyIntradayPrice[] = [
        {
          date: '2024-01-01 09:00:00',
          open: 44500.00,
          high: 44600.00,
          low: 44450.00,
          close: 44550.00,
          volume: 1000000
        },
        {
          date: '2024-01-01 09:01:00',
          open: 44550.00,
          high: 44650.00,
          low: 44500.00,
          close: 44600.00,
          volume: 1100000
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await cryptoClient.get1MinuteData('BTCUSD', '2024-01-01', '2024-01-02');

      expect(mockGet).toHaveBeenCalledWith('/historical-chart/1min', {
        symbol: 'BTCUSD',
        from: '2024-01-01',
        to: '2024-01-02'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get without optional date parameters', async () => {
      const mockData: CryptocurrencyIntradayPrice[] = [];
      mockGet.mockResolvedValue(mockData);

      await cryptoClient.get1MinuteData('BTCUSD');

      expect(mockGet).toHaveBeenCalledWith('/historical-chart/1min', {
        symbol: 'BTCUSD',
        from: undefined,
        to: undefined
      }, undefined);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(cryptoClient.get1MinuteData('BTCUSD'))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('get5MinuteData', () => {
    it('should call get with correct parameters with all options', async () => {
      const mockData: CryptocurrencyIntradayPrice[] = [
        {
          date: '2024-01-01 09:00:00',
          open: 44500.00,
          high: 44700.00,
          low: 44400.00,
          close: 44650.00,
          volume: 5000000
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await cryptoClient.get5MinuteData('ETHUSD', '2024-01-01', '2024-01-02');

      expect(mockGet).toHaveBeenCalledWith('/historical-chart/5min', {
        symbol: 'ETHUSD',
        from: '2024-01-01',
        to: '2024-01-02'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get without optional date parameters', async () => {
      const mockData: CryptocurrencyIntradayPrice[] = [];
      mockGet.mockResolvedValue(mockData);

      await cryptoClient.get5MinuteData('ETHUSD');

      expect(mockGet).toHaveBeenCalledWith('/historical-chart/5min', {
        symbol: 'ETHUSD',
        from: undefined,
        to: undefined
      }, undefined);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(cryptoClient.get5MinuteData('ETHUSD'))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('get1HourData', () => {
    it('should call get with correct parameters with all options', async () => {
      const mockData: CryptocurrencyIntradayPrice[] = [
        {
          date: '2024-01-01 09:00:00',
          open: 44500.00,
          high: 45000.00,
          low: 44200.00,
          close: 44800.00,
          volume: 60000000
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await cryptoClient.get1HourData('BTCUSD', '2024-01-01', '2024-01-02');

      expect(mockGet).toHaveBeenCalledWith('/historical-chart/1hour', {
        symbol: 'BTCUSD',
        from: '2024-01-01',
        to: '2024-01-02'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get without optional date parameters', async () => {
      const mockData: CryptocurrencyIntradayPrice[] = [];
      mockGet.mockResolvedValue(mockData);

      await cryptoClient.get1HourData('BTCUSD');

      expect(mockGet).toHaveBeenCalledWith('/historical-chart/1hour', {
        symbol: 'BTCUSD',
        from: undefined,
        to: undefined
      }, undefined);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(cryptoClient.get1HourData('BTCUSD'))
        .rejects.toThrow(errorMessage);
    });

    it('should call get with options', async () => {
      const mockData: CryptocurrencyIntradayPrice[] = [];
      mockGet.mockResolvedValue(mockData);

      const options = { signal: new AbortController().signal };
      await cryptoClient.get1HourData('BTCUSD', '2024-01-01', '2024-01-02', options);

      expect(mockGet).toHaveBeenCalledWith('/historical-chart/1hour', {
        symbol: 'BTCUSD',
        from: '2024-01-01',
        to: '2024-01-02'
      }, options);
    });
  });

  describe('constructor', () => {
    it('should create instance with API key', () => {
      const client = new CryptoClient('my-api-key');
      expect(client).toBeInstanceOf(CryptoClient);
    });

    it('should create instance without API key', () => {
      const client = new CryptoClient();
      expect(client).toBeInstanceOf(CryptoClient);
    });
  });
}); 