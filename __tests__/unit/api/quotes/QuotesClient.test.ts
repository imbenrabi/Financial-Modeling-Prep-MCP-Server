import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QuotesClient } from '../../../../src/api/quotes/QuotesClient.js';
import { FMPClient } from '../../../../src/api/FMPClient.js';
import type {
  StockQuote,
  StockQuoteShort,
  AftermarketTrade,
  AftermarketQuote,
  StockPriceChange,
} from '../../../../src/api/quotes/types.js';

// Mock the FMPClient
vi.mock('../FMPClient.js');

describe('QuotesClient', () => {
  let quotesClient: QuotesClient;
  let mockGet: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Create mock for the get method
    mockGet = vi.fn();
    
    // Mock FMPClient prototype get method using any to bypass protected access
    (FMPClient.prototype as any).get = mockGet;
    
    // Create QuotesClient instance
    quotesClient = new QuotesClient('test-api-key');
  });

  describe('getQuote', () => {
    it('should call get with correct parameters', async () => {
      const mockData: StockQuote[] = [
        {
          symbol: 'AAPL',
          name: 'Apple Inc.',
          price: 175.50,
          changePercentage: 2.5,
          change: 4.25,
          volume: 50000000,
          dayLow: 172.00,
          dayHigh: 176.00,
          yearHigh: 200.00,
          yearLow: 150.00,
          marketCap: 2800000000000,
          priceAvg50: 170.00,
          priceAvg200: 165.00,
          exchange: 'NASDAQ',
          open: 173.00,
          previousClose: 171.25,
          timestamp: 1640995200
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await quotesClient.getQuote({ symbol: 'AAPL' });

      expect(mockGet).toHaveBeenCalledWith('/quote', {
        symbol: 'AAPL'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(quotesClient.getQuote({ symbol: 'AAPL' }))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getQuoteShort', () => {
    it('should call get with correct parameters', async () => {
      const mockData: StockQuoteShort[] = [
        {
          symbol: 'AAPL',
          price: 175.50,
          change: 4.25,
          volume: 50000000
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await quotesClient.getQuoteShort({ symbol: 'AAPL' });

      expect(mockGet).toHaveBeenCalledWith('/quote-short', {
        symbol: 'AAPL'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(quotesClient.getQuoteShort({ symbol: 'AAPL' }))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getAftermarketTrade', () => {
    it('should call get with correct parameters', async () => {
      const mockData: AftermarketTrade[] = [
        {
          symbol: 'AAPL',
          price: 176.00,
          tradeSize: 100,
          timestamp: 1640995200
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await quotesClient.getAftermarketTrade({ symbol: 'AAPL' });

      expect(mockGet).toHaveBeenCalledWith('/aftermarket-trade', {
        symbol: 'AAPL'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(quotesClient.getAftermarketTrade({ symbol: 'AAPL' }))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getAftermarketQuote', () => {
    it('should call get with correct parameters', async () => {
      const mockData: AftermarketQuote[] = [
        {
          symbol: 'AAPL',
          bidSize: 500,
          bidPrice: 175.80,
          askSize: 300,
          askPrice: 176.20,
          volume: 10000,
          timestamp: 1640995200
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await quotesClient.getAftermarketQuote({ symbol: 'AAPL' });

      expect(mockGet).toHaveBeenCalledWith('/aftermarket-quote', {
        symbol: 'AAPL'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(quotesClient.getAftermarketQuote({ symbol: 'AAPL' }))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getStockPriceChange', () => {
    it('should call get with correct parameters', async () => {
      const mockData: StockPriceChange[] = [
        {
          symbol: 'AAPL',
          "1D": 2.5,
          "5D": 5.2,
          "1M": 8.1,
          "3M": 12.5,
          "6M": 18.3,
          ytd: 25.4,
          "1Y": 35.2,
          "3Y": 75.8,
          "5Y": 125.3,
          "10Y": 285.7,
          max: 450.2
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await quotesClient.getStockPriceChange({ symbol: 'AAPL' });

      expect(mockGet).toHaveBeenCalledWith('/stock-price-change', {
        symbol: 'AAPL'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(quotesClient.getStockPriceChange({ symbol: 'AAPL' }))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getBatchQuotes', () => {
    it('should call get with correct parameters', async () => {
      const mockData: StockQuote[] = [
        {
          symbol: 'AAPL',
          name: 'Apple Inc.',
          price: 175.50,
          changePercentage: 2.5,
          change: 4.25,
          volume: 50000000,
          dayLow: 172.00,
          dayHigh: 176.00,
          yearHigh: 200.00,
          yearLow: 150.00,
          marketCap: 2800000000000,
          priceAvg50: 170.00,
          priceAvg200: 165.00,
          exchange: 'NASDAQ',
          open: 173.00,
          previousClose: 171.25,
          timestamp: 1640995200
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await quotesClient.getBatchQuotes({ symbols: 'AAPL,MSFT,GOOGL' });

      expect(mockGet).toHaveBeenCalledWith('/batch-quote', {
        symbols: 'AAPL,MSFT,GOOGL'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(quotesClient.getBatchQuotes({ symbols: 'AAPL,MSFT' }))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getBatchQuotesShort', () => {
    it('should call get with correct parameters', async () => {
      const mockData: StockQuoteShort[] = [
        {
          symbol: 'AAPL',
          price: 175.50,
          change: 4.25,
          volume: 50000000
        },
        {
          symbol: 'MSFT',
          price: 325.80,
          change: -2.15,
          volume: 25000000
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await quotesClient.getBatchQuotesShort({ symbols: 'AAPL,MSFT' });

      expect(mockGet).toHaveBeenCalledWith('/batch-quote-short', {
        symbols: 'AAPL,MSFT'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(quotesClient.getBatchQuotesShort({ symbols: 'AAPL,MSFT' }))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getBatchAftermarketTrade', () => {
    it('should call get with correct parameters', async () => {
      const mockData: AftermarketTrade[] = [
        {
          symbol: 'AAPL',
          price: 176.00,
          tradeSize: 100,
          timestamp: 1640995200
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await quotesClient.getBatchAftermarketTrade({ symbols: 'AAPL,MSFT' });

      expect(mockGet).toHaveBeenCalledWith('/batch-aftermarket-trade', {
        symbols: 'AAPL,MSFT'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(quotesClient.getBatchAftermarketTrade({ symbols: 'AAPL,MSFT' }))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getBatchAftermarketQuote', () => {
    it('should call get with correct parameters', async () => {
      const mockData: AftermarketQuote[] = [
        {
          symbol: 'AAPL',
          bidSize: 500,
          bidPrice: 175.80,
          askSize: 300,
          askPrice: 176.20,
          volume: 10000,
          timestamp: 1640995200
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await quotesClient.getBatchAftermarketQuote({ symbols: 'AAPL,MSFT' });

      expect(mockGet).toHaveBeenCalledWith('/batch-aftermarket-quote', {
        symbols: 'AAPL,MSFT'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(quotesClient.getBatchAftermarketQuote({ symbols: 'AAPL,MSFT' }))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getExchangeQuotes', () => {
    it('should call get with correct parameters with short option', async () => {
      const mockData: StockQuoteShort[] = [
        {
          symbol: 'AAPL',
          price: 175.50,
          change: 4.25,
          volume: 50000000
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await quotesClient.getExchangeQuotes({ 
        exchange: 'NASDAQ', 
        short: true 
      });

      expect(mockGet).toHaveBeenCalledWith('/batch-exchange-quote', {
        exchange: 'NASDAQ',
        short: true
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with correct parameters without short option', async () => {
      const mockData: StockQuoteShort[] = [];
      mockGet.mockResolvedValue(mockData);

      await quotesClient.getExchangeQuotes({ exchange: 'NYSE' });

      expect(mockGet).toHaveBeenCalledWith('/batch-exchange-quote', {
        exchange: 'NYSE',
        short: undefined
      }, undefined);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(quotesClient.getExchangeQuotes({ exchange: 'NASDAQ' }))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getMutualFundQuotes', () => {
    it('should call get with correct parameters with short option', async () => {
      const mockData: StockQuoteShort[] = [
        {
          symbol: 'VTSAX',
          price: 105.25,
          change: 1.15,
          volume: 500000
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await quotesClient.getMutualFundQuotes({ short: true });

      expect(mockGet).toHaveBeenCalledWith('/batch-mutualfund-quotes', {
        short: true
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with default parameters', async () => {
      const mockData: StockQuoteShort[] = [];
      mockGet.mockResolvedValue(mockData);

      await quotesClient.getMutualFundQuotes();

      expect(mockGet).toHaveBeenCalledWith('/batch-mutualfund-quotes', {
        short: undefined
      }, undefined);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(quotesClient.getMutualFundQuotes())
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getETFQuotes', () => {
    it('should call get with correct parameters with short option', async () => {
      const mockData: StockQuoteShort[] = [
        {
          symbol: 'SPY',
          price: 425.50,
          change: 8.25,
          volume: 75000000
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await quotesClient.getETFQuotes({ short: true });

      expect(mockGet).toHaveBeenCalledWith('/batch-etf-quotes', {
        short: true
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with default parameters', async () => {
      const mockData: StockQuoteShort[] = [];
      mockGet.mockResolvedValue(mockData);

      await quotesClient.getETFQuotes();

      expect(mockGet).toHaveBeenCalledWith('/batch-etf-quotes', {
        short: undefined
      }, undefined);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(quotesClient.getETFQuotes())
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getCommodityQuotes', () => {
    it('should call get with correct parameters with short option', async () => {
      const mockData: StockQuoteShort[] = [
        {
          symbol: 'GCUSD',
          price: 2050.25,
          change: 15.50,
          volume: 150000
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await quotesClient.getCommodityQuotes({ short: false });

      expect(mockGet).toHaveBeenCalledWith('/batch-commodity-quotes', {
        short: false
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with default parameters', async () => {
      const mockData: StockQuoteShort[] = [];
      mockGet.mockResolvedValue(mockData);

      await quotesClient.getCommodityQuotes();

      expect(mockGet).toHaveBeenCalledWith('/batch-commodity-quotes', {
        short: undefined
      }, undefined);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(quotesClient.getCommodityQuotes())
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getCryptoQuotes', () => {
    it('should call get with correct parameters with short option', async () => {
      const mockData: StockQuoteShort[] = [
        {
          symbol: 'BTCUSD',
          price: 42500.00,
          change: 1250.75,
          volume: 25000000
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await quotesClient.getCryptoQuotes({ short: true });

      expect(mockGet).toHaveBeenCalledWith('/batch-crypto-quotes', {
        short: true
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with default parameters', async () => {
      const mockData: StockQuoteShort[] = [];
      mockGet.mockResolvedValue(mockData);

      await quotesClient.getCryptoQuotes();

      expect(mockGet).toHaveBeenCalledWith('/batch-crypto-quotes', {
        short: undefined
      }, undefined);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(quotesClient.getCryptoQuotes())
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getForexQuotes', () => {
    it('should call get with correct parameters with short option', async () => {
      const mockData: StockQuoteShort[] = [
        {
          symbol: 'EURUSD',
          price: 1.0850,
          change: 0.0025,
          volume: 5000000
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await quotesClient.getForexQuotes({ short: false });

      expect(mockGet).toHaveBeenCalledWith('/batch-forex-quotes', {
        short: false
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with default parameters', async () => {
      const mockData: StockQuoteShort[] = [];
      mockGet.mockResolvedValue(mockData);

      await quotesClient.getForexQuotes();

      expect(mockGet).toHaveBeenCalledWith('/batch-forex-quotes', {
        short: undefined
      }, undefined);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(quotesClient.getForexQuotes())
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getIndexQuotes', () => {
    it('should call get with correct parameters with short option', async () => {
      const mockData: StockQuoteShort[] = [
        {
          symbol: '^GSPC',
          price: 4750.25,
          change: 25.75,
          volume: 3500000000
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await quotesClient.getIndexQuotes({ short: true });

      expect(mockGet).toHaveBeenCalledWith('/batch-index-quotes', {
        short: true
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with default parameters', async () => {
      const mockData: StockQuoteShort[] = [];
      mockGet.mockResolvedValue(mockData);

      await quotesClient.getIndexQuotes();

      expect(mockGet).toHaveBeenCalledWith('/batch-index-quotes', {
        short: undefined
      }, undefined);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(quotesClient.getIndexQuotes())
        .rejects.toThrow(errorMessage);
    });
  });

  describe('constructor', () => {
    it('should create instance with API key', () => {
      const client = new QuotesClient('my-api-key');
      expect(client).toBeInstanceOf(QuotesClient);
    });

    it('should create instance without API key', () => {
      const client = new QuotesClient();
      expect(client).toBeInstanceOf(QuotesClient);
    });
  });
}); 