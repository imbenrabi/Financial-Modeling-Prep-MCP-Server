import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IndexesClient } from '../../../../src/api/indexes/IndexesClient.js';
import { FMPClient } from '../../../../src/api/FMPClient.js';
import type {
  IndexItem,
  IndexQuote,
  IndexShortQuote,
  IndexLightChart,
  IndexFullChart,
  IndexIntradayData,
  IndexConstituent,
  HistoricalIndexChange,
} from '../../../../src/api/indexes/types.js';

// Mock the FMPClient
vi.mock('../FMPClient.js');

describe('IndexesClient', () => {
  let indexesClient: IndexesClient;
  let mockGet: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Create mock for the get method
    mockGet = vi.fn();
    
    // Mock FMPClient prototype get method using any to bypass protected access
    (FMPClient.prototype as any).get = mockGet;
    
    // Create IndexesClient instance
    indexesClient = new IndexesClient('test-api-key');
  });

  describe('getIndexList', () => {
    it('should call get with correct parameters', async () => {
      const mockData: IndexItem[] = [
        {
          symbol: '^GSPC',
          name: 'S&P 500',
          exchange: 'INDEX',
          currency: 'USD'
        },
        {
          symbol: '^DJI',
          name: 'Dow Jones Industrial Average',
          exchange: 'INDEX',
          currency: 'USD'
        },
        {
          symbol: '^IXIC',
          name: 'NASDAQ Composite',
          exchange: 'INDEX',
          currency: 'USD'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await indexesClient.getIndexList();

      expect(mockGet).toHaveBeenCalledWith('/index-list', {}, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'Index list API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(indexesClient.getIndexList())
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getIndexQuote', () => {
    it('should call get with correct parameters', async () => {
      const mockData: IndexQuote[] = [
        {
          symbol: '^GSPC',
          name: 'S&P 500',
          price: 4756.50,
          changePercentage: 0.85,
          change: 40.25,
          volume: 0,
          dayLow: 4710.30,
          dayHigh: 4760.80,
          yearHigh: 4818.62,
          yearLow: 3808.10,
          marketCap: null,
          priceAvg50: 4650.75,
          priceAvg200: 4420.30,
          exchange: 'INDEX',
          open: 4720.15,
          previousClose: 4716.25,
          timestamp: 1704470400
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await indexesClient.getIndexQuote('^GSPC');

      expect(mockGet).toHaveBeenCalledWith('/quote', {
        symbol: '^GSPC'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'Index quote API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(indexesClient.getIndexQuote('^GSPC'))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getIndexShortQuote', () => {
    it('should call get with correct parameters', async () => {
      const mockData: IndexShortQuote[] = [
        {
          symbol: '^DJI',
          price: 37863.80,
          change: 124.75,
          volume: 0
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await indexesClient.getIndexShortQuote('^DJI');

      expect(mockGet).toHaveBeenCalledWith('/quote-short', {
        symbol: '^DJI'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'Index short quote API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(indexesClient.getIndexShortQuote('^DJI'))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getAllIndexQuotes', () => {
    it('should call get with correct parameters with short=true', async () => {
      const mockData: IndexShortQuote[] = [
        {
          symbol: '^GSPC',
          price: 4756.50,
          change: 40.25,
          volume: 0
        },
        {
          symbol: '^DJI',
          price: 37863.80,
          change: 124.75,
          volume: 0
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await indexesClient.getAllIndexQuotes(true);

      expect(mockGet).toHaveBeenCalledWith('/batch-index-quotes', {
        short: true
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with correct parameters without short parameter', async () => {
      const mockData: IndexShortQuote[] = [];
      mockGet.mockResolvedValue(mockData);

      const result = await indexesClient.getAllIndexQuotes();

      expect(mockGet).toHaveBeenCalledWith('/batch-index-quotes', {
        short: undefined
      }, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('getHistoricalIndexLightChart', () => {
    it('should call get with correct parameters with date range', async () => {
      const mockData: IndexLightChart[] = [
        {
          symbol: '^GSPC',
          date: '2024-01-15',
          price: 4723.55,
          volume: 0
        },
        {
          symbol: '^GSPC',
          date: '2024-01-16',
          price: 4739.21,
          volume: 0
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await indexesClient.getHistoricalIndexLightChart('^GSPC', {
        from: '2024-01-15',
        to: '2024-01-16'
      });

      expect(mockGet).toHaveBeenCalledWith('/historical-price-eod/light', {
        symbol: '^GSPC',
        from: '2024-01-15',
        to: '2024-01-16'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with correct parameters without date range', async () => {
      const mockData: IndexLightChart[] = [];
      mockGet.mockResolvedValue(mockData);

      const result = await indexesClient.getHistoricalIndexLightChart('^GSPC');

      expect(mockGet).toHaveBeenCalledWith('/historical-price-eod/light', {
        symbol: '^GSPC'
      }, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('getHistoricalIndexFullChart', () => {
    it('should call get with correct parameters with date range', async () => {
      const mockData: IndexFullChart[] = [
        {
          symbol: '^IXIC',
          date: '2024-01-15',
          open: 14814.40,
          high: 14891.50,
          low: 14780.30,
          close: 14843.77,
          volume: 0,
          change: 29.37,
          changePercent: 0.20,
          vwap: 14836.25
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await indexesClient.getHistoricalIndexFullChart('^IXIC', {
        from: '2024-01-15',
        to: '2024-01-15'
      });

      expect(mockGet).toHaveBeenCalledWith('/historical-price-eod/full', {
        symbol: '^IXIC',
        from: '2024-01-15',
        to: '2024-01-15'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with correct parameters without date range', async () => {
      const mockData: IndexFullChart[] = [];
      mockGet.mockResolvedValue(mockData);

      const result = await indexesClient.getHistoricalIndexFullChart('^IXIC');

      expect(mockGet).toHaveBeenCalledWith('/historical-price-eod/full', {
        symbol: '^IXIC'
      }, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('getIndex1MinuteData', () => {
    it('should call get with correct parameters with date range', async () => {
      const mockData: IndexIntradayData[] = [
        {
          date: '2024-01-15 09:30:00',
          open: 4720.15,
          low: 4718.30,
          high: 4725.80,
          close: 4723.45,
          volume: 0
        },
        {
          date: '2024-01-15 09:31:00',
          open: 4723.45,
          low: 4721.20,
          high: 4728.90,
          close: 4726.75,
          volume: 0
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await indexesClient.getIndex1MinuteData('^GSPC', {
        from: '2024-01-15',
        to: '2024-01-15'
      });

      expect(mockGet).toHaveBeenCalledWith('/historical-chart/1min', {
        symbol: '^GSPC',
        from: '2024-01-15',
        to: '2024-01-15'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with correct parameters without date range', async () => {
      const mockData: IndexIntradayData[] = [];
      mockGet.mockResolvedValue(mockData);

      const result = await indexesClient.getIndex1MinuteData('^GSPC');

      expect(mockGet).toHaveBeenCalledWith('/historical-chart/1min', {
        symbol: '^GSPC'
      }, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('getIndex5MinuteData', () => {
    it('should call get with correct parameters', async () => {
      const mockData: IndexIntradayData[] = [
        {
          date: '2024-01-15 09:30:00',
          open: 37800.25,
          low: 37785.50,
          high: 37820.75,
          close: 37815.30,
          volume: 0
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await indexesClient.getIndex5MinuteData('^DJI', {
        from: '2024-01-15'
      });

      expect(mockGet).toHaveBeenCalledWith('/historical-chart/5min', {
        symbol: '^DJI',
        from: '2024-01-15'
      }, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('getIndex1HourData', () => {
    it('should call get with correct parameters', async () => {
      const mockData: IndexIntradayData[] = [
        {
          date: '2024-01-15 10:00:00',
          open: 14820.40,
          low: 14810.15,
          high: 14845.75,
          close: 14838.22,
          volume: 0
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await indexesClient.getIndex1HourData('^IXIC', {
        to: '2024-01-15'
      });

      expect(mockGet).toHaveBeenCalledWith('/historical-chart/1hour', {
        symbol: '^IXIC',
        to: '2024-01-15'
      }, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('getSP500Constituents', () => {
    it('should call get with correct parameters', async () => {
      const mockData: IndexConstituent[] = [
        {
          symbol: 'AAPL',
          name: 'Apple Inc.',
          sector: 'Technology',
          subSector: 'Consumer Electronics',
          headQuarter: 'Cupertino, CA',
          dateFirstAdded: '1982-11-30',
          cik: '0000320193',
          founded: '1976'
        },
        {
          symbol: 'MSFT',
          name: 'Microsoft Corporation',
          sector: 'Technology',
          subSector: 'Software—Infrastructure',
          headQuarter: 'Redmond, WA',
          dateFirstAdded: '1994-06-01',
          cik: '0000789019',
          founded: '1975'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await indexesClient.getSP500Constituents();

      expect(mockGet).toHaveBeenCalledWith('/sp500-constituent', {}, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'S&P 500 constituents API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(indexesClient.getSP500Constituents())
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getNasdaqConstituents', () => {
    it('should call get with correct parameters', async () => {
      const mockData: IndexConstituent[] = [
        {
          symbol: 'GOOGL',
          name: 'Alphabet Inc.',
          sector: 'Communication Services',
          subSector: 'Internet Content & Information',
          headQuarter: 'Mountain View, CA',
          dateFirstAdded: '2006-04-03',
          cik: '0001652044',
          founded: '1998'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await indexesClient.getNasdaqConstituents();

      expect(mockGet).toHaveBeenCalledWith('/nasdaq-constituent', {}, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('getDowJonesConstituents', () => {
    it('should call get with correct parameters', async () => {
      const mockData: IndexConstituent[] = [
        {
          symbol: 'WMT',
          name: 'Walmart Inc.',
          sector: 'Consumer Staples',
          subSector: 'Discount Stores',
          headQuarter: 'Bentonville, AR',
          dateFirstAdded: '1997-03-17',
          cik: '0000104169',
          founded: '1962'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await indexesClient.getDowJonesConstituents();

      expect(mockGet).toHaveBeenCalledWith('/dowjones-constituent', {}, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('getHistoricalSP500Changes', () => {
    it('should call get with correct parameters', async () => {
      const mockData: HistoricalIndexChange[] = [
        {
          dateAdded: '2023-09-18',
          addedSecurity: 'KenvueInc.',
          removedTicker: 'KKR',
          removedSecurity: 'KKR & Co. Inc.',
          date: '2023-09-18',
          symbol: 'KVUE',
          reason: 'Market-cap change'
        },
        {
          dateAdded: '2023-06-16',
          addedSecurity: 'Solventum Corporation',
          removedTicker: 'ZION',
          removedSecurity: 'Zions Bancorporation',
          date: '2023-06-16',
          symbol: 'SOLV',
          reason: 'Spin-off addition'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await indexesClient.getHistoricalSP500Changes();

      expect(mockGet).toHaveBeenCalledWith('/historical-sp500-constituent', {}, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'Historical S&P 500 changes API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(indexesClient.getHistoricalSP500Changes())
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getHistoricalNasdaqChanges', () => {
    it('should call get with correct parameters', async () => {
      const mockData: HistoricalIndexChange[] = [
        {
          dateAdded: '2023-12-01',
          addedSecurity: 'Tesla Inc.',
          removedTicker: 'NFLX',
          removedSecurity: 'Netflix Inc.',
          date: '2023-12-01',
          symbol: 'TSLA',
          reason: 'Index rebalancing'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await indexesClient.getHistoricalNasdaqChanges();

      expect(mockGet).toHaveBeenCalledWith('/historical-nasdaq-constituent', {}, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('getHistoricalDowJonesChanges', () => {
    it('should call get with correct parameters', async () => {
      const mockData: HistoricalIndexChange[] = [
        {
          dateAdded: '2023-02-21',
          addedSecurity: 'Amazon.com Inc.',
          removedTicker: 'WBA',
          removedSecurity: 'Walgreens Boots Alliance Inc.',
          date: '2023-02-21',
          symbol: 'AMZN',
          reason: 'Better representation of economy'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await indexesClient.getHistoricalDowJonesChanges();

      expect(mockGet).toHaveBeenCalledWith('/historical-dowjones-constituent', {}, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('constructor', () => {
    it('should create instance with API key', () => {
      const client = new IndexesClient('my-api-key');
      expect(client).toBeInstanceOf(IndexesClient);
    });

    it('should create instance without API key', () => {
      const client = new IndexesClient();
      expect(client).toBeInstanceOf(IndexesClient);
    });
  });
}); 