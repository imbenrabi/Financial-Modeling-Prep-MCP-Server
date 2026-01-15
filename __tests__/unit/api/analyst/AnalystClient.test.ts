import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AnalystClient } from '../../../../src/api/analyst/AnalystClient.js';
import { FMPClient } from '../../../../src/api/FMPClient.js';
import type {
  AnalystEstimate,
  RatingsSnapshot,
  HistoricalRating,
  PriceTargetSummary,
  PriceTargetConsensus,
  PriceTargetNews,
  StockGrade,
  HistoricalStockGrade,
  StockGradeSummary,
  StockGradeNews,
} from '../../../../src/api/analyst/types.js';

// Mock the FMPClient
vi.mock('../FMPClient.js');

describe('AnalystClient', () => {
  let analystClient: AnalystClient;
  let mockGet: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Create mock for the get method
    mockGet = vi.fn();
    
    // Mock FMPClient prototype get method using any to bypass protected access
    (FMPClient.prototype as any).get = mockGet;
    
    // Create AnalystClient instance
    analystClient = new AnalystClient('test-api-key');
  });

  describe('getAnalystEstimates', () => {
    it('should call get with correct parameters for annual period', async () => {
      const mockData: AnalystEstimate[] = [
        {
          symbol: 'AAPL',
          date: '2024-01-01',
          revenueLow: 90000000,
          revenueHigh: 110000000,
          revenueAvg: 100000000,
          ebitdaLow: 25000000,
          ebitdaHigh: 30000000,
          ebitdaAvg: 27500000,
          ebitLow: 20000000,
          ebitHigh: 25000000,
          ebitAvg: 22500000,
          netIncomeLow: 18000000,
          netIncomeHigh: 22000000,
          netIncomeAvg: 20000000,
          sgaExpenseLow: 8000000,
          sgaExpenseHigh: 10000000,
          sgaExpenseAvg: 9000000,
          epsAvg: 2.5,
          epsHigh: 2.8,
          epsLow: 2.2,
          numAnalystsRevenue: 15,
          numAnalystsEps: 18
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await analystClient.getAnalystEstimates('AAPL', 'annual', 0, 10);

      expect(mockGet).toHaveBeenCalledWith('/analyst-estimates', {
        symbol: 'AAPL',
        period: 'annual',
        page: 0,
        limit: 10
      });
      expect(result).toEqual(mockData);
    });

         it('should call get with correct parameters for quarterly period without optional params', async () => {
       const mockData: AnalystEstimate[] = [];
       mockGet.mockResolvedValue(mockData);

      const result = await analystClient.getAnalystEstimates('MSFT', 'quarter');

      expect(mockGet).toHaveBeenCalledWith('/analyst-estimates', {
        symbol: 'MSFT',
        period: 'quarter',
        page: undefined,
        limit: undefined
      });
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(analystClient.getAnalystEstimates('AAPL', 'annual'))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getRatingsSnapshot', () => {
    it('should call get with correct parameters', async () => {
      const mockData: RatingsSnapshot[] = [
        {
          symbol: 'AAPL',
          rating: 'Buy',
          overallScore: 5,
          discountedCashFlowScore: 4.5,
          returnOnEquityScore: 4.2,
          returnOnAssetsScore: 4.0,
          debtToEquityScore: 3.8,
          priceToEarningsScore: 4.1,
          priceToBookScore: 3.9
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await analystClient.getRatingsSnapshot('AAPL', 1);

      expect(mockGet).toHaveBeenCalledWith('/ratings-snapshot', {
        symbol: 'AAPL',
        limit: 1
      });
      expect(result).toEqual(mockData);
    });

    it('should handle optional limit parameter', async () => {
      const mockData: RatingsSnapshot[] = [];
      mockGet.mockResolvedValue(mockData);

      await analystClient.getRatingsSnapshot('AAPL');

      expect(mockGet).toHaveBeenCalledWith('/ratings-snapshot', {
        symbol: 'AAPL',
        limit: undefined
      });
    });
  });

  describe('getHistoricalRatings', () => {
    it('should call get with correct parameters', async () => {
      const mockData: HistoricalRating[] = [
        {
          symbol: 'AAPL',
          date: '2024-01-01',
          rating: 'Buy',
          overallScore: 5,
          discountedCashFlowScore: 4.5,
          returnOnEquityScore: 4.2,
          returnOnAssetsScore: 4.0,
          debtToEquityScore: 3.8,
          priceToEarningsScore: 4.1,
          priceToBookScore: 3.9
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await analystClient.getHistoricalRatings('AAPL', 100);

      expect(mockGet).toHaveBeenCalledWith('/ratings-historical', {
        symbol: 'AAPL',
        limit: 100
      });
      expect(result).toEqual(mockData);
    });

    it('should handle optional limit parameter', async () => {
      const mockData: HistoricalRating[] = [];
      mockGet.mockResolvedValue(mockData);

      await analystClient.getHistoricalRatings('AAPL');

      expect(mockGet).toHaveBeenCalledWith('/ratings-historical', {
        symbol: 'AAPL',
        limit: undefined
      });
    });
  });

  describe('getPriceTargetSummary', () => {
    it('should call get with correct parameters', async () => {
      const mockData: PriceTargetSummary[] = [
        {
          symbol: 'AAPL',
          lastMonthCount: 5,
          lastMonthAvgPriceTarget: 185.0,
          lastQuarterCount: 15,
          lastQuarterAvgPriceTarget: 180.0,
          lastYearCount: 50,
          lastYearAvgPriceTarget: 170.0,
          allTimeCount: 200,
          allTimeAvgPriceTarget: 165.0,
          publishers: 'Goldman Sachs, Morgan Stanley, JP Morgan'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await analystClient.getPriceTargetSummary('AAPL');

      expect(mockGet).toHaveBeenCalledWith('/price-target-summary', {
        symbol: 'AAPL'
      });
      expect(result).toEqual(mockData);
    });
  });

  describe('getPriceTargetConsensus', () => {
    it('should call get with correct parameters', async () => {
      const mockData: PriceTargetConsensus[] = [
        {
          symbol: 'AAPL',
          targetHigh: 200.0,
          targetLow: 150.0,
          targetConsensus: 175.0,
          targetMedian: 170.0
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await analystClient.getPriceTargetConsensus('AAPL');

      expect(mockGet).toHaveBeenCalledWith('/price-target-consensus', {
        symbol: 'AAPL'
      });
      expect(result).toEqual(mockData);
    });
  });

  describe('getPriceTargetNews', () => {
    it('should call get with correct parameters with all options', async () => {
      const mockData: PriceTargetNews[] = [
        {
          symbol: 'AAPL',
          publishedDate: '2024-01-01T10:00:00Z',
          newsURL: 'https://example.com/news/apple-price-target',
          newsTitle: 'Apple Price Target Raised',
          analystName: 'John Smith',
          priceTarget: 185.0,
          adjPriceTarget: 180.0,
          priceWhenPosted: 175.0,
          newsPublisher: 'Financial News',
          newsBaseURL: 'https://example.com',
          analystCompany: 'Goldman Sachs'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await analystClient.getPriceTargetNews('AAPL', 0, 10);

      expect(mockGet).toHaveBeenCalledWith('/price-target-news', {
        symbol: 'AAPL',
        page: 0,
        limit: 10
      });
      expect(result).toEqual(mockData);
    });

    it('should handle optional parameters', async () => {
      const mockData: PriceTargetNews[] = [];
      mockGet.mockResolvedValue(mockData);

      await analystClient.getPriceTargetNews('AAPL');

      expect(mockGet).toHaveBeenCalledWith('/price-target-news', {
        symbol: 'AAPL',
        page: undefined,
        limit: undefined
      });
    });
  });

  describe('getPriceTargetLatestNews', () => {
    it('should call get with correct parameters', async () => {
      const mockData: PriceTargetNews[] = [
        {
          symbol: 'AAPL',
          publishedDate: '2024-01-01T10:00:00Z',
          newsURL: 'https://example.com/news/latest',
          newsTitle: 'Latest Price Target News',
          analystName: 'Jane Doe',
          priceTarget: 190.0,
          adjPriceTarget: 185.0,
          priceWhenPosted: 180.0,
          newsPublisher: 'Financial News',
          newsBaseURL: 'https://example.com',
          analystCompany: 'Morgan Stanley'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await analystClient.getPriceTargetLatestNews(0, 10);

      expect(mockGet).toHaveBeenCalledWith('/price-target-latest-news', {
        page: 0,
        limit: 10
      });
      expect(result).toEqual(mockData);
    });

    it('should handle optional parameters', async () => {
      const mockData: PriceTargetNews[] = [];
      mockGet.mockResolvedValue(mockData);

      await analystClient.getPriceTargetLatestNews();

      expect(mockGet).toHaveBeenCalledWith('/price-target-latest-news', {
        page: undefined,
        limit: undefined
      });
    });
  });

  describe('getStockGrades', () => {
    it('should call get with correct parameters', async () => {
      const mockData: StockGrade[] = [
        {
          symbol: 'AAPL',
          date: '2024-01-01',
          gradingCompany: 'Goldman Sachs',
          previousGrade: 'Hold',
          newGrade: 'Buy',
          action: 'Upgrade'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await analystClient.getStockGrades('AAPL');

      expect(mockGet).toHaveBeenCalledWith('/grades', {
        symbol: 'AAPL'
      });
      expect(result).toEqual(mockData);
    });
  });

  describe('getHistoricalStockGrades', () => {
    it('should call get with correct parameters', async () => {
      const mockData: HistoricalStockGrade[] = [
        {
          symbol: 'AAPL',
          date: '2024-01-01',
          analystRatingsBuy: 15,
          analystRatingsHold: 8,
          analystRatingsSell: 2,
          analystRatingsStrongSell: 1
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await analystClient.getHistoricalStockGrades('AAPL', 100);

      expect(mockGet).toHaveBeenCalledWith('/grades-historical', {
        symbol: 'AAPL',
        limit: 100
      });
      expect(result).toEqual(mockData);
    });

    it('should handle optional limit parameter', async () => {
      const mockData: HistoricalStockGrade[] = [];
      mockGet.mockResolvedValue(mockData);

      await analystClient.getHistoricalStockGrades('AAPL');

      expect(mockGet).toHaveBeenCalledWith('/grades-historical', {
        symbol: 'AAPL',
        limit: undefined
      });
    });
  });

  describe('getStockGradeSummary', () => {
    it('should call get with correct parameters', async () => {
      const mockData: StockGradeSummary[] = [
        {
          symbol: 'AAPL',
          strongBuy: 10,
          buy: 15,
          hold: 8,
          sell: 2,
          strongSell: 1,
          consensus: 'Buy'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await analystClient.getStockGradeSummary('AAPL');

      expect(mockGet).toHaveBeenCalledWith('/grades-consensus', {
        symbol: 'AAPL'
      });
      expect(result).toEqual(mockData);
    });
  });

  describe('getStockGradeNews', () => {
    it('should call get with correct parameters with all options', async () => {
      const mockData: StockGradeNews[] = [
        {
          symbol: 'AAPL',
          publishedDate: '2024-01-01T10:00:00Z',
          newsURL: 'https://example.com/news/apple-grade',
          newsTitle: 'Apple Stock Grade News',
          newsBaseURL: 'https://example.com',
          newsPublisher: 'Financial News',
          newGrade: 'Buy',
          previousGrade: 'Hold',
          gradingCompany: 'Goldman Sachs',
          action: 'Upgrade',
          priceWhenPosted: 175.0
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await analystClient.getStockGradeNews('AAPL', 0, 10);

      expect(mockGet).toHaveBeenCalledWith('/grades-news', {
        symbol: 'AAPL',
        page: 0,
        limit: 10
      });
      expect(result).toEqual(mockData);
    });

    it('should handle optional parameters', async () => {
      const mockData: StockGradeNews[] = [];
      mockGet.mockResolvedValue(mockData);

      await analystClient.getStockGradeNews('AAPL');

      expect(mockGet).toHaveBeenCalledWith('/grades-news', {
        symbol: 'AAPL',
        page: undefined,
        limit: undefined
      });
    });
  });

  describe('getStockGradeLatestNews', () => {
    it('should call get with correct parameters', async () => {
      const mockData: StockGradeNews[] = [
        {
          symbol: 'AAPL',
          publishedDate: '2024-01-01T10:00:00Z',
          newsURL: 'https://example.com/news/latest-grade',
          newsTitle: 'Latest Stock Grade News',
          newsBaseURL: 'https://example.com',
          newsPublisher: 'Financial News',
          newGrade: 'Strong Buy',
          previousGrade: 'Buy',
          gradingCompany: 'Morgan Stanley',
          action: 'Upgrade',
          priceWhenPosted: 180.0
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await analystClient.getStockGradeLatestNews(0, 10);

      expect(mockGet).toHaveBeenCalledWith('/grades-latest-news', {
        page: 0,
        limit: 10
      });
      expect(result).toEqual(mockData);
    });

    it('should handle optional parameters', async () => {
      const mockData: StockGradeNews[] = [];
      mockGet.mockResolvedValue(mockData);

      await analystClient.getStockGradeLatestNews();

      expect(mockGet).toHaveBeenCalledWith('/grades-latest-news', {
        page: undefined,
        limit: undefined
      });
    });
  });

  describe('constructor', () => {
    it('should create instance with API key', () => {
      const client = new AnalystClient('my-api-key');
      expect(client).toBeInstanceOf(AnalystClient);
    });

    it('should create instance without API key', () => {
      const client = new AnalystClient();
      expect(client).toBeInstanceOf(AnalystClient);
    });
  });
}); 
