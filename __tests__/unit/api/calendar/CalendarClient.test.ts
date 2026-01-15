import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CalendarClient } from '../../../../src/api/calendar/CalendarClient.js';
import { FMPClient } from '../../../../src/api/FMPClient.js';
import type {
  Dividend,
  EarningsReport,
  IPO,
  IPODisclosure,
  IPOProspectus,
  StockSplit,
} from '../../../../src/api/calendar/types.js';

// Mock the FMPClient
vi.mock('../FMPClient.js');

describe('CalendarClient', () => {
  let calendarClient: CalendarClient;
  let mockGet: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Create mock for the get method
    mockGet = vi.fn();
    
    // Mock FMPClient prototype get method using any to bypass protected access
    (FMPClient.prototype as any).get = mockGet;
    
    // Create CalendarClient instance
    calendarClient = new CalendarClient('test-api-key');
  });

  describe('getDividends', () => {
    it('should call get with correct parameters with all options', async () => {
      const mockData: Dividend[] = [
        {
          symbol: 'AAPL',
          date: '2024-01-15',
          recordDate: '2024-01-12',
          paymentDate: '2024-01-16',
          declarationDate: '2024-01-01',
          adjDividend: 0.24,
          dividend: 0.24,
          yield: 0.52,
          frequency: 'Quarterly'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await calendarClient.getDividends('AAPL', 100);

      expect(mockGet).toHaveBeenCalledWith('/dividends', {
        symbol: 'AAPL',
        limit: 100
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle optional limit parameter', async () => {
      const mockData: Dividend[] = [];
      mockGet.mockResolvedValue(mockData);

      await calendarClient.getDividends('AAPL');

      expect(mockGet).toHaveBeenCalledWith('/dividends', {
        symbol: 'AAPL',
        limit: undefined
      }, undefined);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(calendarClient.getDividends('AAPL'))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getDividendsCalendar', () => {
    it('should call get with correct parameters with date range', async () => {
      const mockData: Dividend[] = [
        {
          symbol: 'MSFT',
          date: '2024-02-15',
          recordDate: '2024-02-12',
          paymentDate: '2024-02-16',
          declarationDate: '2024-02-01',
          adjDividend: 0.75,
          dividend: 0.75,
          yield: 0.68,
          frequency: 'Quarterly'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await calendarClient.getDividendsCalendar('2024-01-01', '2024-12-31');

      expect(mockGet).toHaveBeenCalledWith('/dividends-calendar', {
        from: '2024-01-01',
        to: '2024-12-31'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle optional date parameters', async () => {
      const mockData: Dividend[] = [];
      mockGet.mockResolvedValue(mockData);

      await calendarClient.getDividendsCalendar();

      expect(mockGet).toHaveBeenCalledWith('/dividends-calendar', {
        from: undefined,
        to: undefined
      }, undefined);
    });
  });

  describe('getEarningsReports', () => {
    it('should call get with correct parameters with all options', async () => {
      const mockData: EarningsReport[] = [
        {
          symbol: 'AAPL',
          date: '2024-01-25',
          epsActual: 2.18,
          epsEstimated: 2.10,
          revenueActual: 119625000000,
          revenueEstimated: 118000000000,
          lastUpdated: '2024-01-25T20:00:00Z'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await calendarClient.getEarningsReports('AAPL', 50);

      expect(mockGet).toHaveBeenCalledWith('/earnings', {
        symbol: 'AAPL',
        limit: 50
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle optional limit parameter', async () => {
      const mockData: EarningsReport[] = [];
      mockGet.mockResolvedValue(mockData);

      await calendarClient.getEarningsReports('AAPL');

      expect(mockGet).toHaveBeenCalledWith('/earnings', {
        symbol: 'AAPL',
        limit: undefined
      }, undefined);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(calendarClient.getEarningsReports('AAPL'))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getEarningsCalendar', () => {
    it('should call get with correct parameters with date range', async () => {
      const mockData: EarningsReport[] = [
        {
          symbol: 'GOOGL',
          date: '2024-01-30',
          epsActual: null,
          epsEstimated: 1.32,
          revenueActual: null,
          revenueEstimated: 76000000000,
          lastUpdated: '2024-01-30T10:00:00Z'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await calendarClient.getEarningsCalendar('2024-01-01', '2024-03-31');

      expect(mockGet).toHaveBeenCalledWith('/earnings-calendar', {
        from: '2024-01-01',
        to: '2024-03-31'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle optional date parameters', async () => {
      const mockData: EarningsReport[] = [];
      mockGet.mockResolvedValue(mockData);

      await calendarClient.getEarningsCalendar();

      expect(mockGet).toHaveBeenCalledWith('/earnings-calendar', {
        from: undefined,
        to: undefined
      }, undefined);
    });
  });

  describe('getIPOCalendar', () => {
    it('should call get with correct parameters with date range', async () => {
      const mockData: IPO[] = [
        {
          symbol: 'NEWCO',
          date: '2024-03-15',
          daa: '2024-03-15',
          company: 'New Company Inc.',
          exchange: 'NASDAQ',
          actions: 'Initial Public Offering',
          shares: 10000000,
          priceRange: '$15.00 - $18.00',
          marketCap: 170000000
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await calendarClient.getIPOCalendar('2024-03-01', '2024-03-31');

      expect(mockGet).toHaveBeenCalledWith('/ipos-calendar', {
        from: '2024-03-01',
        to: '2024-03-31'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle optional date parameters', async () => {
      const mockData: IPO[] = [];
      mockGet.mockResolvedValue(mockData);

      await calendarClient.getIPOCalendar();

      expect(mockGet).toHaveBeenCalledWith('/ipos-calendar', {
        from: undefined,
        to: undefined
      }, undefined);
    });
  });

  describe('getIPODisclosures', () => {
    it('should call get with correct parameters with date range', async () => {
      const mockData: IPODisclosure[] = [
        {
          symbol: 'NEWCO',
          filingDate: '2024-02-15',
          acceptedDate: '2024-02-16',
          effectivenessDate: '2024-03-01',
          cik: '0001234567',
          form: 'S-1',
          url: 'https://www.sec.gov/Archives/edgar/data/1234567/000123456724000001/s1.htm'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await calendarClient.getIPODisclosures('2024-02-01', '2024-02-29');

      expect(mockGet).toHaveBeenCalledWith('/ipos-disclosure', {
        from: '2024-02-01',
        to: '2024-02-29'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle optional date parameters', async () => {
      const mockData: IPODisclosure[] = [];
      mockGet.mockResolvedValue(mockData);

      await calendarClient.getIPODisclosures();

      expect(mockGet).toHaveBeenCalledWith('/ipos-disclosure', {
        from: undefined,
        to: undefined
      }, undefined);
    });
  });

  describe('getIPOProspectuses', () => {
    it('should call get with correct parameters with date range', async () => {
      const mockData: IPOProspectus[] = [
        {
          symbol: 'NEWCO',
          acceptedDate: '2024-02-16',
          filingDate: '2024-02-15',
          ipoDate: '2024-03-15',
          cik: '0001234567',
          pricePublicPerShare: 16.50,
          pricePublicTotal: 165000000,
          discountsAndCommissionsPerShare: 1.15,
          discountsAndCommissionsTotal: 11500000,
          proceedsBeforeExpensesPerShare: 15.35,
          proceedsBeforeExpensesTotal: 153500000,
          form: 'S-1',
          url: 'https://www.sec.gov/Archives/edgar/data/1234567/000123456724000001/s1.htm'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await calendarClient.getIPOProspectuses('2024-02-01', '2024-02-29');

      expect(mockGet).toHaveBeenCalledWith('/ipos-prospectus', {
        from: '2024-02-01',
        to: '2024-02-29'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle optional date parameters', async () => {
      const mockData: IPOProspectus[] = [];
      mockGet.mockResolvedValue(mockData);

      await calendarClient.getIPOProspectuses();

      expect(mockGet).toHaveBeenCalledWith('/ipos-prospectus', {
        from: undefined,
        to: undefined
      }, undefined);
    });
  });

  describe('getStockSplits', () => {
    it('should call get with correct parameters with all options', async () => {
      const mockData: StockSplit[] = [
        {
          symbol: 'AAPL',
          date: '2020-08-31',
          numerator: 4,
          denominator: 1
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await calendarClient.getStockSplits('AAPL', 25);

      expect(mockGet).toHaveBeenCalledWith('/splits', {
        symbol: 'AAPL',
        limit: 25
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle optional limit parameter', async () => {
      const mockData: StockSplit[] = [];
      mockGet.mockResolvedValue(mockData);

      await calendarClient.getStockSplits('AAPL');

      expect(mockGet).toHaveBeenCalledWith('/splits', {
        symbol: 'AAPL',
        limit: undefined
      }, undefined);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(calendarClient.getStockSplits('AAPL'))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getStockSplitsCalendar', () => {
    it('should call get with correct parameters with date range', async () => {
      const mockData: StockSplit[] = [
        {
          symbol: 'TSLA',
          date: '2022-08-25',
          numerator: 3,
          denominator: 1
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await calendarClient.getStockSplitsCalendar('2022-08-01', '2022-08-31');

      expect(mockGet).toHaveBeenCalledWith('/splits-calendar', {
        from: '2022-08-01',
        to: '2022-08-31'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle optional date parameters', async () => {
      const mockData: StockSplit[] = [];
      mockGet.mockResolvedValue(mockData);

      await calendarClient.getStockSplitsCalendar();

      expect(mockGet).toHaveBeenCalledWith('/splits-calendar', {
        from: undefined,
        to: undefined
      }, undefined);
    });
  });

  describe('constructor', () => {
    it('should create instance with API key', () => {
      const client = new CalendarClient('my-api-key');
      expect(client).toBeInstanceOf(CalendarClient);
    });

    it('should create instance without API key', () => {
      const client = new CalendarClient();
      expect(client).toBeInstanceOf(CalendarClient);
    });
  });
});
