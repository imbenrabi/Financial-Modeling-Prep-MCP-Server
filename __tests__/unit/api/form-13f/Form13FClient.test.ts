import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Form13FClient } from '../../../../src/api/form-13f/Form13FClient.js';
import { FMPClient } from '../../../../src/api/FMPClient.js';
import type {
  InstitutionalOwnershipFiling,
  SecFilingExtract,
  Form13FFilingDate,
  FilingExtractAnalytics,
  HolderPerformanceSummary,
  HolderIndustryBreakdown,
  PositionsSummary,
  IndustryPerformanceSummary,
} from '../../../../src/api/form-13f/types.js';

// Mock the FMPClient
vi.mock('../FMPClient.js');

describe('Form13FClient', () => {
  let form13fClient: Form13FClient;
  let mockGet: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Create mock for the get method
    mockGet = vi.fn();
    
    // Mock FMPClient prototype get method using any to bypass protected access
    (FMPClient.prototype as any).get = mockGet;
    
    // Create Form13FClient instance
    form13fClient = new Form13FClient('test-api-key');
  });

  describe('getLatestFilings', () => {
    it('should call get with correct parameters with pagination', async () => {
      const mockData: InstitutionalOwnershipFiling[] = [
        {
          cik: '0001067983',
          name: 'Berkshire Hathaway Inc',
          date: '2024-02-14',
          filingDate: '2024-02-14',
          acceptedDate: '2024-02-14T16:30:15-05:00',
          formType: '13F-HR',
          link: 'https://www.sec.gov/Archives/edgar/data/1067983/000095017024018263/0000950170-24-018263-index.htm',
          finalLink: 'https://www.sec.gov/Archives/edgar/data/1067983/000095017024018263/xslForm13F_X01/0000950170-24-018263.xml'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await form13fClient.getLatestFilings({ page: 0, limit: 50 });

      expect(mockGet).toHaveBeenCalledWith('/institutional-ownership/latest', {
        page: 0,
        limit: 50
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with correct parameters without pagination', async () => {
      const mockData: InstitutionalOwnershipFiling[] = [];
      mockGet.mockResolvedValue(mockData);

      const result = await form13fClient.getLatestFilings();

      expect(mockGet).toHaveBeenCalledWith('/institutional-ownership/latest', {}, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(form13fClient.getLatestFilings({ page: 0, limit: 10 }))
        .rejects.toThrow(errorMessage);
    });

    it('should pass options correctly', async () => {
      const mockData: InstitutionalOwnershipFiling[] = [];
      mockGet.mockResolvedValue(mockData);
      const abortSignal = new AbortController().signal;
      const context = { config: { FMP_ACCESS_TOKEN: 'test-token' } };

      await form13fClient.getLatestFilings({ page: 0, limit: 10 }, {
        signal: abortSignal,
        context
      });

      expect(mockGet).toHaveBeenCalledWith('/institutional-ownership/latest', {
        page: 0,
        limit: 10
      }, {
        signal: abortSignal,
        context
      });
    });
  });

  describe('getFilingExtract', () => {
    it('should call get with correct parameters', async () => {
      const mockData: SecFilingExtract[] = [
        {
          date: '2023-12-31',
          filingDate: '2024-02-14',
          acceptedDate: '2024-02-14T16:30:15-05:00',
          cik: '0001067983',
          securityCusip: '037833100',
          symbol: 'AAPL',
          nameOfIssuer: 'Apple Inc',
          shares: 915560000,
          titleOfClass: 'COM',
          sharesType: 'SH',
          putCallShare: '',
          value: 174300000000,
          link: 'https://www.sec.gov/Archives/edgar/data/1067983/000095017024018263/0000950170-24-018263-index.htm',
          finalLink: 'https://www.sec.gov/Archives/edgar/data/1067983/000095017024018263/xslForm13F_X01/0000950170-24-018263.xml'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await form13fClient.getFilingExtract('0001067983', 2023, 4);

      expect(mockGet).toHaveBeenCalledWith('/institutional-ownership/extract', {
        cik: '0001067983',
        year: 2023,
        quarter: 4
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle string parameters', async () => {
      const mockData: SecFilingExtract[] = [];
      mockGet.mockResolvedValue(mockData);

      await form13fClient.getFilingExtract('0001067983', '2023', '4');

      expect(mockGet).toHaveBeenCalledWith('/institutional-ownership/extract', {
        cik: '0001067983',
        year: '2023',
        quarter: '4'
      }, undefined);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(form13fClient.getFilingExtract('0001067983', 2023, 4))
        .rejects.toThrow(errorMessage);
    });

    it('should pass options correctly', async () => {
      const mockData: SecFilingExtract[] = [];
      mockGet.mockResolvedValue(mockData);
      const abortSignal = new AbortController().signal;
      const context = { config: { FMP_ACCESS_TOKEN: 'test-token' } };

      await form13fClient.getFilingExtract('0001067983', 2023, 4, {
        signal: abortSignal,
        context
      });

      expect(mockGet).toHaveBeenCalledWith('/institutional-ownership/extract', {
        cik: '0001067983',
        year: 2023,
        quarter: 4
      }, {
        signal: abortSignal,
        context
      });
    });
  });

  describe('getFilingDates', () => {
    it('should call get with correct parameters', async () => {
      const mockData: Form13FFilingDate[] = [
        {
          date: '2023-12-31',
          year: 2023,
          quarter: 4
        },
        {
          date: '2023-09-30',
          year: 2023,
          quarter: 3
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await form13fClient.getFilingDates('0001067983');

      expect(mockGet).toHaveBeenCalledWith('/institutional-ownership/dates', {
        cik: '0001067983'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(form13fClient.getFilingDates('0001067983'))
        .rejects.toThrow(errorMessage);
    });

    it('should pass options correctly', async () => {
      const mockData: Form13FFilingDate[] = [];
      mockGet.mockResolvedValue(mockData);
      const abortSignal = new AbortController().signal;
      const context = { config: { FMP_ACCESS_TOKEN: 'test-token' } };

      await form13fClient.getFilingDates('0001067983', {
        signal: abortSignal,
        context
      });

      expect(mockGet).toHaveBeenCalledWith('/institutional-ownership/dates', {
        cik: '0001067983'
      }, {
        signal: abortSignal,
        context
      });
    });
  });

  describe('getFilingExtractAnalyticsByHolder', () => {
    it('should call get with correct parameters with pagination', async () => {
      const mockData: FilingExtractAnalytics[] = [
        {
          date: '2023-12-31',
          cik: '0001067983',
          filingDate: '2024-02-14',
          investorName: 'Berkshire Hathaway Inc',
          symbol: 'AAPL',
          securityName: 'Apple Inc',
          typeOfSecurity: 'COM',
          securityCusip: '037833100',
          sharesType: 'SH',
          putCallShare: '',
          investmentDiscretion: 'SOLE',
          industryTitle: 'Technology',
          weight: 42.5,
          lastWeight: 41.8,
          changeInWeight: 0.7,
          changeInWeightPercentage: 1.67,
          marketValue: 174300000000,
          lastMarketValue: 157000000000,
          changeInMarketValue: 17300000000,
          changeInMarketValuePercentage: 11.02,
          sharesNumber: 915560000,
          lastSharesNumber: 895136000,
          changeInSharesNumber: 20424000,
          changeInSharesNumberPercentage: 2.28,
          quarterEndPrice: 190.40,
          avgPricePaid: 175.25,
          isNew: false,
          isSoldOut: false,
          ownership: 5.64,
          lastOwnership: 5.89,
          changeInOwnership: -0.25,
          changeInOwnershipPercentage: -4.24,
          holdingPeriod: 32,
          firstAdded: '2016-05-16',
          performance: 8.65,
          performancePercentage: 5.18,
          lastPerformance: 7.89,
          changeInPerformance: 0.76,
          isCountedForPerformance: true
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await form13fClient.getFilingExtractAnalyticsByHolder('AAPL', 2023, 4, { page: 0, limit: 10 });

      expect(mockGet).toHaveBeenCalledWith('/institutional-ownership/extract-analytics/holder', {
        symbol: 'AAPL',
        year: 2023,
        quarter: 4,
        page: 0,
        limit: 10
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with correct parameters without pagination', async () => {
      const mockData: FilingExtractAnalytics[] = [];
      mockGet.mockResolvedValue(mockData);

      const result = await form13fClient.getFilingExtractAnalyticsByHolder('AAPL', 2023, 4);

      expect(mockGet).toHaveBeenCalledWith('/institutional-ownership/extract-analytics/holder', {
        symbol: 'AAPL',
        year: 2023,
        quarter: 4
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(form13fClient.getFilingExtractAnalyticsByHolder('AAPL', 2023, 4, { page: 0, limit: 10 }))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getHolderPerformanceSummary', () => {
    it('should call get with correct parameters with page', async () => {
      const mockData: HolderPerformanceSummary[] = [
        {
          date: '2023-12-31',
          cik: '0001067983',
          investorName: 'Berkshire Hathaway Inc',
          portfolioSize: 352,
          securitiesAdded: 5,
          securitiesRemoved: 3,
          marketValue: 347000000000,
          previousMarketValue: 325000000000,
          changeInMarketValue: 22000000000,
          changeInMarketValuePercentage: 6.77,
          averageHoldingPeriod: 8.5,
          averageHoldingPeriodTop10: 12.3,
          averageHoldingPeriodTop20: 10.7,
          turnover: 12.5,
          turnoverAlternateSell: 8.2,
          turnoverAlternateBuy: 15.3,
          performance: 18.5,
          performancePercentage: 5.33,
          lastPerformance: 16.2,
          changeInPerformance: 2.3,
          performance1year: 18.5,
          performancePercentage1year: 5.33,
          performance3year: 45.2,
          performancePercentage3year: 13.0,
          performance5year: 98.7,
          performancePercentage5year: 15.2,
          performanceSinceInception: 2845.6,
          performanceSinceInceptionPercentage: 9.8,
          performanceRelativeToSP500Percentage: 3.2,
          performance1yearRelativeToSP500Percentage: 2.8,
          performance3yearRelativeToSP500Percentage: 4.1,
          performance5yearRelativeToSP500Percentage: 3.9,
          performanceSinceInceptionRelativeToSP500Percentage: 5.2
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await form13fClient.getHolderPerformanceSummary('0001067983', { page: 0 });

      expect(mockGet).toHaveBeenCalledWith('/institutional-ownership/holder-performance-summary', {
        cik: '0001067983',
        page: 0
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with correct parameters without page', async () => {
      const mockData: HolderPerformanceSummary[] = [];
      mockGet.mockResolvedValue(mockData);

      const result = await form13fClient.getHolderPerformanceSummary('0001067983');

      expect(mockGet).toHaveBeenCalledWith('/institutional-ownership/holder-performance-summary', {
        cik: '0001067983'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(form13fClient.getHolderPerformanceSummary('0001067983', { page: 0 }))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getHolderIndustryBreakdown', () => {
    it('should call get with correct parameters', async () => {
      const mockData: HolderIndustryBreakdown[] = [
        {
          date: '2023-12-31',
          cik: '0001067983',
          investorName: 'Berkshire Hathaway Inc',
          industryTitle: 'Technology',
          weight: 42.5,
          lastWeight: 41.8,
          changeInWeight: 0.7,
          changeInWeightPercentage: 1.67,
          performance: 18.5,
          performancePercentage: 5.33,
          lastPerformance: 16.2,
          changeInPerformance: 2.3
        },
        {
          date: '2023-12-31',
          cik: '0001067983',
          investorName: 'Berkshire Hathaway Inc',
          industryTitle: 'Financial Services',
          weight: 28.3,
          lastWeight: 29.1,
          changeInWeight: -0.8,
          changeInWeightPercentage: -2.75,
          performance: 12.4,
          performancePercentage: 4.38,
          lastPerformance: 11.8,
          changeInPerformance: 0.6
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await form13fClient.getHolderIndustryBreakdown('0001067983', 2023, 4);

      expect(mockGet).toHaveBeenCalledWith('/institutional-ownership/holder-industry-breakdown', {
        cik: '0001067983',
        year: 2023,
        quarter: 4
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle string parameters', async () => {
      const mockData: HolderIndustryBreakdown[] = [];
      mockGet.mockResolvedValue(mockData);

      await form13fClient.getHolderIndustryBreakdown('0001067983', '2023', '4');

      expect(mockGet).toHaveBeenCalledWith('/institutional-ownership/holder-industry-breakdown', {
        cik: '0001067983',
        year: '2023',
        quarter: '4'
      }, undefined);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(form13fClient.getHolderIndustryBreakdown('0001067983', 2023, 4))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getPositionsSummary', () => {
    it('should call get with correct parameters', async () => {
      const mockData: PositionsSummary[] = [
        {
          symbol: 'AAPL',
          cik: '0000320193',
          date: '2023-12-31',
          investorsHolding: 2456,
          lastInvestorsHolding: 2398,
          investorsHoldingChange: 58,
          numberOf13Fshares: 8952456000,
          lastNumberOf13Fshares: 8745123000,
          numberOf13FsharesChange: 207333000,
          totalInvested: 1704500000000,
          lastTotalInvested: 1585600000000,
          totalInvestedChange: 118900000000,
          ownershipPercent: 58.2,
          lastOwnershipPercent: 57.8,
          ownershipPercentChange: 0.4,
          newPositions: 45,
          lastNewPositions: 38,
          newPositionsChange: 7,
          increasedPositions: 756,
          lastIncreasedPositions: 689,
          increasedPositionsChange: 67,
          closedPositions: 23,
          lastClosedPositions: 31,
          closedPositionsChange: -8,
          reducedPositions: 412,
          lastReducedPositions: 445,
          reducedPositionsChange: -33,
          totalCalls: 125600000,
          lastTotalCalls: 118900000,
          totalCallsChange: 6700000,
          totalPuts: 89500000,
          lastTotalPuts: 95200000,
          totalPutsChange: -5700000,
          putCallRatio: 0.71,
          lastPutCallRatio: 0.80,
          putCallRatioChange: -0.09
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await form13fClient.getPositionsSummary('AAPL', 2023, 4);

      expect(mockGet).toHaveBeenCalledWith('/institutional-ownership/symbol-positions-summary', {
        symbol: 'AAPL',
        year: 2023,
        quarter: 4
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle string parameters', async () => {
      const mockData: PositionsSummary[] = [];
      mockGet.mockResolvedValue(mockData);

      await form13fClient.getPositionsSummary('AAPL', '2023', '4');

      expect(mockGet).toHaveBeenCalledWith('/institutional-ownership/symbol-positions-summary', {
        symbol: 'AAPL',
        year: '2023',
        quarter: '4'
      }, undefined);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(form13fClient.getPositionsSummary('AAPL', 2023, 4))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getIndustryPerformanceSummary', () => {
    it('should call get with correct parameters', async () => {
      const mockData: IndustryPerformanceSummary[] = [
        {
          industryTitle: 'Technology',
          industryValue: 2450000000000,
          date: '2023-12-31'
        },
        {
          industryTitle: 'Financial Services',
          industryValue: 1875000000000,
          date: '2023-12-31'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await form13fClient.getIndustryPerformanceSummary(2023, 4);

      expect(mockGet).toHaveBeenCalledWith('/institutional-ownership/industry-summary', {
        year: 2023,
        quarter: 4
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle string parameters', async () => {
      const mockData: IndustryPerformanceSummary[] = [];
      mockGet.mockResolvedValue(mockData);

      await form13fClient.getIndustryPerformanceSummary('2023', '4');

      expect(mockGet).toHaveBeenCalledWith('/institutional-ownership/industry-summary', {
        year: '2023',
        quarter: '4'
      }, undefined);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(form13fClient.getIndustryPerformanceSummary(2023, 4))
        .rejects.toThrow(errorMessage);
    });

    it('should pass options correctly', async () => {
      const mockData: IndustryPerformanceSummary[] = [];
      mockGet.mockResolvedValue(mockData);
      const abortSignal = new AbortController().signal;
      const context = { config: { FMP_ACCESS_TOKEN: 'test-token' } };

      await form13fClient.getIndustryPerformanceSummary(2023, 4, {
        signal: abortSignal,
        context
      });

      expect(mockGet).toHaveBeenCalledWith('/institutional-ownership/industry-summary', {
        year: 2023,
        quarter: 4
      }, {
        signal: abortSignal,
        context
      });
    });
  });

  describe('constructor', () => {
    it('should create instance with API key', () => {
      const client = new Form13FClient('my-api-key');
      expect(client).toBeInstanceOf(Form13FClient);
    });

    it('should create instance without API key', () => {
      const client = new Form13FClient();
      expect(client).toBeInstanceOf(Form13FClient);
    });
  });
});
