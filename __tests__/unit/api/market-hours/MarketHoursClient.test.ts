import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MarketHoursClient } from '../../../../src/api/market-hours/MarketHoursClient.js';
import { FMPClient } from '../../../../src/api/FMPClient.js';
import type {
  ExchangeMarketHours,
  HolidayByExchange,
} from '../../../../src/api/market-hours/types.js';

// Mock the FMPClient
vi.mock('../FMPClient.js');

describe('MarketHoursClient', () => {
  let marketHoursClient: MarketHoursClient;
  let mockGet: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Create mock for the get method
    mockGet = vi.fn();
    
    // Mock FMPClient prototype get method using any to bypass protected access
    (FMPClient.prototype as any).get = mockGet;
    
    // Create MarketHoursClient instance
    marketHoursClient = new MarketHoursClient('test-api-key');
  });

  describe('getExchangeMarketHours', () => {
    it('should call get with correct parameters', async () => {
      const mockData: ExchangeMarketHours[] = [
        {
          exchange: 'NASDAQ',
          name: 'NASDAQ Stock Market',
          openingHour: '09:30',
          closingHour: '16:00',
          timezone: 'America/New_York',
          isMarketOpen: true
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await marketHoursClient.getExchangeMarketHours('NASDAQ');

      expect(mockGet).toHaveBeenCalledWith('/exchange-market-hours', {
        exchange: 'NASDAQ'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with correct parameters and options', async () => {
      const mockData: ExchangeMarketHours[] = [
        {
          exchange: 'NYSE',
          name: 'New York Stock Exchange',
          openingHour: '09:30',
          closingHour: '16:00',
          timezone: 'America/New_York',
          isMarketOpen: false
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const mockSignal = new AbortController().signal;
      const mockContext = { config: { FMP_ACCESS_TOKEN: 'test-token-123' } };
      const options = { signal: mockSignal, context: mockContext };

      const result = await marketHoursClient.getExchangeMarketHours('NYSE', options);

      expect(mockGet).toHaveBeenCalledWith('/exchange-market-hours', {
        exchange: 'NYSE'
      }, options);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(marketHoursClient.getExchangeMarketHours('NASDAQ'))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getHolidaysByExchange', () => {
    it('should call get with correct parameters for exchange only', async () => {
      const mockData: HolidayByExchange[] = [
        {
          exchange: 'NASDAQ',
          date: '2024-12-25',
          name: 'Christmas Day',
          isClosed: true,
          adjOpenTime: null,
          adjCloseTime: null
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await marketHoursClient.getHolidaysByExchange('NASDAQ');

      expect(mockGet).toHaveBeenCalledWith('/holidays-by-exchange', {
        exchange: 'NASDAQ',
        from: undefined,
        to: undefined
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with correct parameters including date range', async () => {
      const mockData: HolidayByExchange[] = [
        {
          exchange: 'NYSE',
          date: '2024-07-04',
          name: 'Independence Day',
          isClosed: true,
          adjOpenTime: null,
          adjCloseTime: null
        },
        {
          exchange: 'NYSE',
          date: '2024-11-28',
          name: 'Thanksgiving Day',
          isClosed: true,
          adjOpenTime: null,
          adjCloseTime: null
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await marketHoursClient.getHolidaysByExchange(
        'NYSE', 
        '2024-01-01', 
        '2024-12-31'
      );

      expect(mockGet).toHaveBeenCalledWith('/holidays-by-exchange', {
        exchange: 'NYSE',
        from: '2024-01-01',
        to: '2024-12-31'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with correct parameters including from date only', async () => {
      const mockData: HolidayByExchange[] = [
        {
          exchange: 'NASDAQ',
          date: '2024-12-25',
          name: 'Christmas Day',
          isClosed: true,
          adjOpenTime: null,
          adjCloseTime: null
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await marketHoursClient.getHolidaysByExchange(
        'NASDAQ', 
        '2024-12-01'
      );

      expect(mockGet).toHaveBeenCalledWith('/holidays-by-exchange', {
        exchange: 'NASDAQ',
        from: '2024-12-01',
        to: undefined
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with correct parameters including options', async () => {
      const mockData: HolidayByExchange[] = [
        {
          exchange: 'LSE',
          date: '2024-12-26',
          name: 'Boxing Day',
          isClosed: false,
          adjOpenTime: '10:00',
          adjCloseTime: '14:00'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const mockSignal = new AbortController().signal;
      const mockContext = { config: { FMP_ACCESS_TOKEN: 'test-token-456' } };
      const options = { signal: mockSignal, context: mockContext };

      const result = await marketHoursClient.getHolidaysByExchange(
        'LSE', 
        '2024-12-01', 
        '2024-12-31',
        options
      );

      expect(mockGet).toHaveBeenCalledWith('/holidays-by-exchange', {
        exchange: 'LSE',
        from: '2024-12-01',
        to: '2024-12-31'
      }, options);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'Holiday API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(marketHoursClient.getHolidaysByExchange('NASDAQ'))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getAllExchangeMarketHours', () => {
    it('should call get with correct parameters without options', async () => {
      const mockData: ExchangeMarketHours[] = [
        {
          exchange: 'NASDAQ',
          name: 'NASDAQ Stock Market',
          openingHour: '09:30',
          closingHour: '16:00',
          timezone: 'America/New_York',
          isMarketOpen: true
        },
        {
          exchange: 'NYSE',
          name: 'New York Stock Exchange',
          openingHour: '09:30',
          closingHour: '16:00',
          timezone: 'America/New_York',
          isMarketOpen: true
        },
        {
          exchange: 'LSE',
          name: 'London Stock Exchange',
          openingHour: '08:00',
          closingHour: '16:30',
          timezone: 'Europe/London',
          isMarketOpen: false
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await marketHoursClient.getAllExchangeMarketHours();

      expect(mockGet).toHaveBeenCalledWith('/all-exchange-market-hours', {}, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with correct parameters including options', async () => {
      const mockData: ExchangeMarketHours[] = [
        {
          exchange: 'TSX',
          name: 'Toronto Stock Exchange',
          openingHour: '09:30',
          closingHour: '16:00',
          timezone: 'America/Toronto',
          isMarketOpen: true
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const mockSignal = new AbortController().signal;
      const mockContext = { config: { FMP_ACCESS_TOKEN: 'test-token-789' } };
      const options = { signal: mockSignal, context: mockContext };

      const result = await marketHoursClient.getAllExchangeMarketHours(options);

      expect(mockGet).toHaveBeenCalledWith('/all-exchange-market-hours', {}, options);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'All Market Hours API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(marketHoursClient.getAllExchangeMarketHours())
        .rejects.toThrow(errorMessage);
    });

    it('should return empty array when no data available', async () => {
      const mockData: ExchangeMarketHours[] = [];
      mockGet.mockResolvedValue(mockData);

      const result = await marketHoursClient.getAllExchangeMarketHours();

      expect(mockGet).toHaveBeenCalledWith('/all-exchange-market-hours', {}, undefined);
      expect(result).toEqual([]);
    });
  });

  describe('constructor', () => {
    it('should create instance with API key', () => {
      const client = new MarketHoursClient('my-api-key');
      expect(client).toBeInstanceOf(MarketHoursClient);
    });

    it('should create instance without API key', () => {
      const client = new MarketHoursClient();
      expect(client).toBeInstanceOf(MarketHoursClient);
    });
  });
}); 