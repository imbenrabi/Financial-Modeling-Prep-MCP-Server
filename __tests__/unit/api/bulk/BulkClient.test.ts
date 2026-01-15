import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BulkClient } from '../../../../src/api/bulk/BulkClient.js';
import { FMPClient } from '../../../../src/api/FMPClient.js';
import type {
  PartParams,
  YearPeriodParams,
  EarningsSurpriseParams,
  EODParams,
} from '../../../../src/api/bulk/types.js';

// Mock the FMPClient
vi.mock('../FMPClient.js');

describe('BulkClient', () => {
  let bulkClient: BulkClient;
  let mockGetCSV: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Create mock for the getCSV method
    mockGetCSV = vi.fn();
    
    // Mock FMPClient prototype getCSV method using any to bypass protected access
    (FMPClient.prototype as any).getCSV = mockGetCSV;
    
    // Create BulkClient instance
    bulkClient = new BulkClient('test-api-key');
  });

  describe('getCompanyProfilesBulk', () => {
    it('should call getCSV with correct parameters', async () => {
      const mockCSVData = `symbol,price,marketCap,beta,companyName,sector,industry
AAPL,150.25,2500000000000,1.2,Apple Inc.,Technology,Consumer Electronics
MSFT,300.50,2200000000000,0.9,Microsoft Corporation,Technology,Software`;
      mockGetCSV.mockResolvedValue(mockCSVData);

      const params: PartParams = { part: '1' };
      const result = await bulkClient.getCompanyProfilesBulk(params);

      expect(mockGetCSV).toHaveBeenCalledWith(
        `/profile-bulk`,
        {
          part: '1',
        },
        undefined
      );
      expect(result).toEqual(mockCSVData);
    });

    it('should handle options parameter', async () => {
      const mockCSVData = 'symbol,companyName\nAAPL,Apple Inc.';
      mockGetCSV.mockResolvedValue(mockCSVData);

      const params: PartParams = { part: '2' };
      const options = {
        signal: new AbortController().signal,
        context: { config: { FMP_ACCESS_TOKEN: 'test-token' } }
      };

      await bulkClient.getCompanyProfilesBulk(params, options);

      expect(mockGetCSV).toHaveBeenCalledWith(
        `/profile-bulk`,
        { part: '2' },
        options
      );
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGetCSV.mockRejectedValue(new Error(errorMessage));

      const params: PartParams = { part: '1' };
      await expect(bulkClient.getCompanyProfilesBulk(params))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getStockRatingsBulk', () => {
    it('should call getCSV with correct parameters', async () => {
      const mockCSVData = `symbol,date,rating,ratingRecommendation
AAPL,2024-01-01,4.5,Buy
MSFT,2024-01-01,4.2,Buy`;
      mockGetCSV.mockResolvedValue(mockCSVData);

      const result = await bulkClient.getStockRatingsBulk();

      expect(mockGetCSV).toHaveBeenCalledWith(`/rating-bulk`, {}, undefined);
      expect(result).toEqual(mockCSVData);
    });

    it('should handle options parameter', async () => {
      const mockCSVData = 'symbol,rating\nAAPL,4.5';
      mockGetCSV.mockResolvedValue(mockCSVData);

      const options = { signal: new AbortController().signal };
      await bulkClient.getStockRatingsBulk(options);

      expect(mockGetCSV).toHaveBeenCalledWith(`/rating-bulk`, {}, options);
    });
  });

  describe('getDCFValuationsBulk', () => {
    it('should call getCSV with correct parameters', async () => {
      const mockCSVData = `symbol,date,discountedCashFlow,dcfPercentDiff
AAPL,2024-01-01,175.50,15.2
MSFT,2024-01-01,285.75,-5.1`;
      mockGetCSV.mockResolvedValue(mockCSVData);

      const result = await bulkClient.getDCFValuationsBulk();

      expect(mockGetCSV).toHaveBeenCalledWith(`/dcf-bulk`, {}, undefined);
      expect(result).toEqual(mockCSVData);
    });
  });

  describe('getFinancialScoresBulk', () => {
    it('should call getCSV with correct parameters', async () => {
      const mockCSVData = `symbol,altmanZScore,piotroskiScore,workingCapital
AAPL,3.2,8,50000000
MSFT,2.8,7,75000000`;
      mockGetCSV.mockResolvedValue(mockCSVData);

      const result = await bulkClient.getFinancialScoresBulk();

      expect(mockGetCSV).toHaveBeenCalledWith(`/scores-bulk`, {}, undefined);
      expect(result).toEqual(mockCSVData);
    });
  });

  describe('getPriceTargetSummariesBulk', () => {
    it('should call getCSV with correct parameters', async () => {
      const mockCSVData = `symbol,lastMonth,lastMonthAvgPT,lastQuarter,lastQuarterAvgPT
AAPL,10,175.50,25,170.25
MSFT,8,285.75,20,280.50`;
      mockGetCSV.mockResolvedValue(mockCSVData);

      const result = await bulkClient.getPriceTargetSummariesBulk();

      expect(mockGetCSV).toHaveBeenCalledWith(
        `/price-target-summary-bulk`,
        {},
        undefined
      );
      expect(result).toEqual(mockCSVData);
    });
  });

  describe('getETFHoldersBulk', () => {
    it('should call getCSV with correct parameters', async () => {
      const mockCSVData = `symbol,sharesNumber,asset,weightPercentage,name
SPY,1000000,AAPL,6.5,Apple Inc.
QQQ,800000,MSFT,10.2,Microsoft Corporation`;
      mockGetCSV.mockResolvedValue(mockCSVData);

      const params: PartParams = { part: '1' };
      const result = await bulkClient.getETFHoldersBulk(params);

      expect(mockGetCSV).toHaveBeenCalledWith(
        `/etf-holder-bulk`,
        {
          part: '1',
        },
        undefined
      );
      expect(result).toEqual(mockCSVData);
    });
  });

  describe('getUpgradesDowngradesConsensusBulk', () => {
    it('should call getCSV with correct parameters', async () => {
      const mockCSVData = `symbol,strongBuy,buy,hold,sell,strongSell,consensus
AAPL,10,15,5,2,0,Buy
MSFT,8,12,8,1,1,Buy`;
      mockGetCSV.mockResolvedValue(mockCSVData);

      const result = await bulkClient.getUpgradesDowngradesConsensusBulk();

      expect(mockGetCSV).toHaveBeenCalledWith(
        `/upgrades-downgrades-consensus-bulk`,
        {},
        undefined
      );
      expect(result).toEqual(mockCSVData);
    });
  });

  describe('getKeyMetricsTTMBulk', () => {
    it('should call getCSV with correct parameters', async () => {
      const mockCSVData = `symbol,marketCapTTM,enterpriseValueTTM,evToSalesTTM
AAPL,2500000000000,2450000000000,6.8
MSFT,2200000000000,2180000000000,12.5`;
      mockGetCSV.mockResolvedValue(mockCSVData);

      const result = await bulkClient.getKeyMetricsTTMBulk();

      expect(mockGetCSV).toHaveBeenCalledWith(`/key-metrics-ttm-bulk`, {}, undefined);
      expect(result).toEqual(mockCSVData);
    });
  });

  describe('getRatiosTTMBulk', () => {
    it('should call getCSV with correct parameters', async () => {
      const mockCSVData = `symbol,grossProfitMarginTTM,operatingProfitMarginTTM,netProfitMarginTTM
AAPL,0.38,0.30,0.25
MSFT,0.69,0.42,0.36`;
      mockGetCSV.mockResolvedValue(mockCSVData);

      const result = await bulkClient.getRatiosTTMBulk();

      expect(mockGetCSV).toHaveBeenCalledWith(`/ratios-ttm-bulk`, {}, undefined);
      expect(result).toEqual(mockCSVData);
    });
  });

  describe('getStockPeersBulk', () => {
    it('should call getCSV with correct parameters', async () => {
      const mockCSVData = `symbol,peers
AAPL,"MSFT,GOOGL,AMZN,TSLA"
MSFT,"AAPL,GOOGL,ORCL,CRM"`;
      mockGetCSV.mockResolvedValue(mockCSVData);

      const result = await bulkClient.getStockPeersBulk();

      expect(mockGetCSV).toHaveBeenCalledWith(`/peers-bulk`, {}, undefined);
      expect(result).toEqual(mockCSVData);
    });
  });

  describe('getEarningsSurprisesBulk', () => {
    it('should call getCSV with correct parameters', async () => {
      const mockCSVData = `symbol,date,epsActual,epsEstimated,lastUpdated
AAPL,2024-01-01,1.89,1.85,2024-01-02
MSFT,2024-01-01,2.95,2.87,2024-01-02`;
      mockGetCSV.mockResolvedValue(mockCSVData);

      const params: EarningsSurpriseParams = { year: '2024' };
      const result = await bulkClient.getEarningsSurprisesBulk(params);

      expect(mockGetCSV).toHaveBeenCalledWith(
        `/earnings-surprises-bulk`,
        {
          year: '2024',
        },
        undefined
      );
      expect(result).toEqual(mockCSVData);
    });
  });

  describe('getIncomeStatementsBulk', () => {
    it('should call getCSV with correct parameters', async () => {
      const mockCSVData = `symbol,date,revenue,costOfRevenue,grossProfit,netIncome
AAPL,2024-01-01,394328000000,223546000000,170782000000,99803000000
MSFT,2024-01-01,211915000000,65525000000,146390000000,72361000000`;
      mockGetCSV.mockResolvedValue(mockCSVData);

      const params: YearPeriodParams = { year: '2024', period: 'annual' };
      const result = await bulkClient.getIncomeStatementsBulk(params);

      expect(mockGetCSV).toHaveBeenCalledWith(
        `/income-statement-bulk`,
        {
          year: '2024',
          period: 'annual',
        },
        undefined
      );
      expect(result).toEqual(mockCSVData);
    });
  });

  describe('getIncomeStatementGrowthBulk', () => {
    it('should call getCSV with correct parameters', async () => {
      const mockCSVData = `symbol,date,growthRevenue,growthCostOfRevenue,growthGrossProfit
AAPL,2024-01-01,0.08,0.05,0.12
MSFT,2024-01-01,0.15,0.08,0.18`;
      mockGetCSV.mockResolvedValue(mockCSVData);

      const params: YearPeriodParams = { year: '2024', period: 'quarter' };
      const result = await bulkClient.getIncomeStatementGrowthBulk(params);

      expect(mockGetCSV).toHaveBeenCalledWith(
        `/income-statement-growth-bulk`,
        {
          year: '2024',
          period: 'quarter',
        },
        undefined
      );
      expect(result).toEqual(mockCSVData);
    });
  });

  describe('getBalanceSheetStatementsBulk', () => {
    it('should call getCSV with correct parameters', async () => {
      const mockCSVData = `symbol,date,totalCurrentAssets,totalAssets,totalCurrentLiabilities,totalLiabilities
AAPL,2024-01-01,143566000000,352755000000,133973000000,290437000000
MSFT,2024-01-01,169684000000,411976000000,95082000000,205753000000`;
      mockGetCSV.mockResolvedValue(mockCSVData);

      const params: YearPeriodParams = { year: '2024', period: 'annual' };
      const result = await bulkClient.getBalanceSheetStatementsBulk(params);

      expect(mockGetCSV).toHaveBeenCalledWith(
        `/balance-sheet-statement-bulk`,
        {
          year: '2024',
          period: 'annual',
        },
        undefined
      );
      expect(result).toEqual(mockCSVData);
    });
  });

  describe('getBalanceSheetGrowthBulk', () => {
    it('should call getCSV with correct parameters', async () => {
      const mockCSVData = `symbol,date,growthTotalCurrentAssets,growthTotalAssets,growthTotalLiabilities
AAPL,2024-01-01,0.02,0.05,0.03
MSFT,2024-01-01,0.08,0.12,0.06`;
      mockGetCSV.mockResolvedValue(mockCSVData);

      const params: YearPeriodParams = { year: '2024', period: 'annual' };
      const result = await bulkClient.getBalanceSheetGrowthBulk(params);

      expect(mockGetCSV).toHaveBeenCalledWith(
        `/balance-sheet-statement-growth-bulk`,
        {
          year: '2024',
          period: 'annual',
        },
        undefined
      );
      expect(result).toEqual(mockCSVData);
    });
  });

  describe('getCashFlowStatementsBulk', () => {
    it('should call getCSV with correct parameters', async () => {
      const mockCSVData = `symbol,date,netIncome,operatingCashFlow,capitalExpenditure,freeCashFlow
AAPL,2024-01-01,99803000000,110543000000,-10959000000,99584000000
MSFT,2024-01-01,72361000000,87582000000,-28107000000,59475000000`;
      mockGetCSV.mockResolvedValue(mockCSVData);

      const params: YearPeriodParams = { year: '2024', period: 'annual' };
      const result = await bulkClient.getCashFlowStatementsBulk(params);

      expect(mockGetCSV).toHaveBeenCalledWith(
        `/cash-flow-statement-bulk`,
        {
          year: '2024',
          period: 'annual',
        },
        undefined
      );
      expect(result).toEqual(mockCSVData);
    });
  });

  describe('getCashFlowGrowthBulk', () => {
    it('should call getCSV with correct parameters', async () => {
      const mockCSVData = `symbol,date,growthNetIncome,growthOperatingCashFlow,growthFreeCashFlow
AAPL,2024-01-01,-0.03,0.05,0.08
MSFT,2024-01-01,0.15,0.12,0.20`;
      mockGetCSV.mockResolvedValue(mockCSVData);

      const params: YearPeriodParams = { year: '2024', period: 'annual' };
      const result = await bulkClient.getCashFlowGrowthBulk(params);

      expect(mockGetCSV).toHaveBeenCalledWith(
        `/cash-flow-statement-growth-bulk`,
        {
          year: '2024',
          period: 'annual',
        },
        undefined
      );
      expect(result).toEqual(mockCSVData);
    });
  });

  describe('getEODDataBulk', () => {
    it('should call getCSV with correct parameters', async () => {
      const mockCSVData = `symbol,date,open,low,high,close,adjClose,volume
AAPL,2024-01-01,150.25,148.50,152.75,151.80,151.80,45698200
MSFT,2024-01-01,300.50,298.25,305.10,303.75,303.75,28456300`;
      mockGetCSV.mockResolvedValue(mockCSVData);

      const params: EODParams = { date: '2024-01-01' };
      const result = await bulkClient.getEODDataBulk(params);

      expect(mockGetCSV).toHaveBeenCalledWith(
        `/eod-bulk`,
        {
          date: '2024-01-01',
        },
        undefined
      );
      expect(result).toEqual(mockCSVData);
    });

    it('should handle options parameter', async () => {
      const mockCSVData = 'symbol,date,close\nAAPL,2024-01-01,151.80';
      mockGetCSV.mockResolvedValue(mockCSVData);

      const params: EODParams = { date: '2024-01-01' };
      const options = {
        signal: new AbortController().signal,
        context: { config: { FMP_ACCESS_TOKEN: 'test-token' } }
      };

      await bulkClient.getEODDataBulk(params, options);

      expect(mockGetCSV).toHaveBeenCalledWith(
        `/eod-bulk`,
        { date: '2024-01-01' },
        options
      );
    });
  });

  describe('constructor', () => {
    it('should create instance with API key', () => {
      const client = new BulkClient('my-api-key');
      expect(client).toBeInstanceOf(BulkClient);
    });

    it('should create instance without API key', () => {
      const client = new BulkClient();
      expect(client).toBeInstanceOf(BulkClient);
    });
  });

  describe('error handling', () => {
    it('should propagate API errors from getCSV', async () => {
      const errorMessage = 'Network Error';
      mockGetCSV.mockRejectedValue(new Error(errorMessage));

      await expect(bulkClient.getStockRatingsBulk())
        .rejects.toThrow(errorMessage);
    });

    it('should handle CSV parsing errors gracefully', async () => {
      const malformedCSV = 'symbol,price\nAAPL'; // Missing price value
      mockGetCSV.mockResolvedValue(malformedCSV);

      const result = await bulkClient.getStockRatingsBulk();
      expect(result).toEqual(malformedCSV); // Should return raw CSV as-is
    });
  });
}); 
