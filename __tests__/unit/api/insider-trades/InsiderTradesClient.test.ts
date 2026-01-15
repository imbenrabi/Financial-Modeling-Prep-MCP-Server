import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InsiderTradesClient } from '../../../../src/api/insider-trades/InsiderTradesClient.js';
import { FMPClient } from '../../../../src/api/FMPClient.js';
import type {
  InsiderTrading,
  InsiderReportingName,
  InsiderTransactionType,
  InsiderTradeStatistics,
  AcquisitionOwnership,
} from '../../../../src/api/insider-trades/types.js';

// Mock the FMPClient
vi.mock('../FMPClient.js');

describe('InsiderTradesClient', () => {
  let insiderTradesClient: InsiderTradesClient;
  let mockGet: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Create mock for the get method
    mockGet = vi.fn();
    
    // Mock FMPClient prototype get method using any to bypass protected access
    (FMPClient.prototype as any).get = mockGet;
    
    // Create InsiderTradesClient instance
    insiderTradesClient = new InsiderTradesClient('test-api-key');
  });

  describe('getLatestInsiderTrading', () => {
    it('should call get with correct parameters with all options', async () => {
      const mockData: InsiderTrading[] = [
        {
          symbol: 'AAPL',
          filingDate: '2024-01-15',
          transactionDate: '2024-01-10',
          reportingCik: '0001214156',
          companyCik: '0000320193',
          transactionType: 'S-Sale',
          securitiesOwned: 1000000,
          reportingName: 'Cook Timothy D',
          typeOfOwner: 'Officer',
          acquisitionOrDisposition: 'D',
          directOrIndirect: 'D',
          formType: '4',
          securitiesTransacted: 50000,
          price: 185.50,
          securityName: 'Common Stock',
          url: 'https://www.sec.gov/Archives/edgar/data/320193/000032019324000001/form4.xml'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await insiderTradesClient.getLatestInsiderTrading({
        date: '2024-01-15',
        page: 0,
        limit: 10
      });

      expect(mockGet).toHaveBeenCalledWith('/insider-trading/latest', {
        date: '2024-01-15',
        page: 0,
        limit: 10
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with correct parameters without optional params', async () => {
      const mockData: InsiderTrading[] = [];
      mockGet.mockResolvedValue(mockData);

      const result = await insiderTradesClient.getLatestInsiderTrading();

      expect(mockGet).toHaveBeenCalledWith('/insider-trading/latest', {}, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(insiderTradesClient.getLatestInsiderTrading())
        .rejects.toThrow(errorMessage);
    });
  });

  describe('searchInsiderTrades', () => {
    it('should call get with correct parameters with all options', async () => {
      const mockData: InsiderTrading[] = [
        {
          symbol: 'MSFT',
          filingDate: '2024-01-20',
          transactionDate: '2024-01-18',
          reportingCik: '0001214157',
          companyCik: '0000789019',
          transactionType: 'P-Purchase',
          securitiesOwned: 2000000,
          reportingName: 'Nadella Satya',
          typeOfOwner: 'Officer',
          acquisitionOrDisposition: 'A',
          directOrIndirect: 'D',
          formType: '4',
          securitiesTransacted: 100000,
          price: 425.75,
          securityName: 'Common Stock',
          url: 'https://www.sec.gov/Archives/edgar/data/789019/000078901924000001/form4.xml'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await insiderTradesClient.searchInsiderTrades({
        symbol: 'MSFT',
        page: 0,
        limit: 20,
        reportingCik: '0001214157',
        companyCik: '0000789019',
        transactionType: 'P-Purchase'
      });

      expect(mockGet).toHaveBeenCalledWith('/insider-trading/search', {
        symbol: 'MSFT',
        page: 0,
        limit: 20,
        reportingCik: '0001214157',
        companyCik: '0000789019',
        transactionType: 'P-Purchase'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with correct parameters without optional params', async () => {
      const mockData: InsiderTrading[] = [];
      mockGet.mockResolvedValue(mockData);

      const result = await insiderTradesClient.searchInsiderTrades();

      expect(mockGet).toHaveBeenCalledWith('/insider-trading/search', {}, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(insiderTradesClient.searchInsiderTrades({ symbol: 'AAPL' }))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('searchInsiderTradesByReportingName', () => {
    it('should call get with correct parameters', async () => {
      const mockData: InsiderReportingName[] = [
        {
          reportingCik: '0001214156',
          reportingName: 'Cook Timothy D'
        },
        {
          reportingCik: '0001214158',
          reportingName: 'Cook Timothy J'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await insiderTradesClient.searchInsiderTradesByReportingName('Cook Timothy');

      expect(mockGet).toHaveBeenCalledWith('/insider-trading/reporting-name', {
        name: 'Cook Timothy'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(insiderTradesClient.searchInsiderTradesByReportingName('John Smith'))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getInsiderTransactionTypes', () => {
    it('should call get with correct parameters', async () => {
      const mockData: InsiderTransactionType[] = [
        { transactionType: 'S-Sale' },
        { transactionType: 'P-Purchase' },
        { transactionType: 'A-Award' },
        { transactionType: 'G-Gift' },
        { transactionType: 'F-Payment of Exercise Price or Tax Liability' }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await insiderTradesClient.getInsiderTransactionTypes();

      expect(mockGet).toHaveBeenCalledWith('/insider-trading-transaction-type', {}, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(insiderTradesClient.getInsiderTransactionTypes())
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getInsiderTradeStatistics', () => {
    it('should call get with correct parameters', async () => {
      const mockData: InsiderTradeStatistics[] = [
        {
          symbol: 'AAPL',
          cik: '0000320193',
          year: 2024,
          quarter: 1,
          acquiredTransactions: 15,
          disposedTransactions: 35,
          acquiredDisposedRatio: 0.43,
          totalAcquired: 1500000,
          totalDisposed: 3500000,
          averageAcquired: 100000,
          averageDisposed: 100000,
          totalPurchases: 1500000,
          totalSales: 3500000
        },
        {
          symbol: 'AAPL',
          cik: '0000320193',
          year: 2023,
          quarter: 4,
          acquiredTransactions: 12,
          disposedTransactions: 28,
          acquiredDisposedRatio: 0.43,
          totalAcquired: 1200000,
          totalDisposed: 2800000,
          averageAcquired: 100000,
          averageDisposed: 100000,
          totalPurchases: 1200000,
          totalSales: 2800000
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await insiderTradesClient.getInsiderTradeStatistics('AAPL');

      expect(mockGet).toHaveBeenCalledWith('/insider-trading/statistics', {
        symbol: 'AAPL'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(insiderTradesClient.getInsiderTradeStatistics('AAPL'))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getAcquisitionOwnership', () => {
    it('should call get with correct parameters with limit', async () => {
      const mockData: AcquisitionOwnership[] = [
        {
          cik: '0000320193',
          symbol: 'AAPL',
          filingDate: '2024-01-15',
          acceptedDate: '2024-01-16',
          cusip: '037833100',
          nameOfReportingPerson: 'Berkshire Hathaway Inc',
          citizenshipOrPlaceOfOrganization: 'Delaware',
          soleVotingPower: '915560382',
          sharedVotingPower: '0',
          soleDispositivePower: '915560382',
          sharedDispositivePower: '0',
          amountBeneficiallyOwned: '915560382',
          percentOfClass: '5.8',
          typeOfReportingPerson: 'CO',
          url: 'https://www.sec.gov/Archives/edgar/data/1067983/000095012324001234/sc13ga.xml'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await insiderTradesClient.getAcquisitionOwnership('AAPL', 50);

      expect(mockGet).toHaveBeenCalledWith('/acquisition-of-beneficial-ownership', {
        symbol: 'AAPL',
        limit: 50
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with correct parameters without limit', async () => {
      const mockData: AcquisitionOwnership[] = [];
      mockGet.mockResolvedValue(mockData);

      const result = await insiderTradesClient.getAcquisitionOwnership('MSFT');

      expect(mockGet).toHaveBeenCalledWith('/acquisition-of-beneficial-ownership', {
        symbol: 'MSFT'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(insiderTradesClient.getAcquisitionOwnership('AAPL'))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('constructor', () => {
    it('should create instance with API key', () => {
      const client = new InsiderTradesClient('my-api-key');
      expect(client).toBeInstanceOf(InsiderTradesClient);
    });

    it('should create instance without API key', () => {
      const client = new InsiderTradesClient();
      expect(client).toBeInstanceOf(InsiderTradesClient);
    });
  });
}); 