import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DCFClient } from '../../../../src/api/dcf/DCFClient.js';
import { FMPClient } from '../../../../src/api/FMPClient.js';
import type {
  DCFValuation,
  CustomDCFInput,
  CustomDCFOutput,
} from '../../../../src/api/dcf/types.js';

// Mock the FMPClient
vi.mock('../FMPClient.js');

describe('DCFClient', () => {
  let dcfClient: DCFClient;
  let mockGet: ReturnType<typeof vi.fn>;
  let mockPost: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Create mocks for the get and post methods
    mockGet = vi.fn();
    mockPost = vi.fn();
    
    // Mock FMPClient prototype methods using any to bypass protected access
    (FMPClient.prototype as any).get = mockGet;
    (FMPClient.prototype as any).post = mockPost;
    
    // Create DCFClient instance
    dcfClient = new DCFClient('test-api-key');
  });

  describe('getValuation', () => {
    it('should call get with correct parameters', async () => {
      const mockData: DCFValuation = {
        symbol: 'AAPL',
        date: '2024-01-01',
        ["Stock Price"]: 175.50,
        dcf: 180.25
      };
      mockGet.mockResolvedValue(mockData);

      const result = await dcfClient.getValuation('AAPL');

      expect(mockGet).toHaveBeenCalledWith('/discounted-cash-flow', {
        symbol: 'AAPL'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with options', async () => {
      const mockData: DCFValuation = {
        symbol: 'MSFT',
        date: '2024-01-01',
        ["Stock Price"]: 420.75,
        dcf: 425.50
      };
      mockGet.mockResolvedValue(mockData);

      const options = {
        signal: new AbortController().signal,
        context: { config: { FMP_ACCESS_TOKEN: 'test-token' } }
      };

      const result = await dcfClient.getValuation('MSFT', options);

      expect(mockGet).toHaveBeenCalledWith('/discounted-cash-flow', {
        symbol: 'MSFT'
      }, options);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(dcfClient.getValuation('AAPL'))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getLeveredValuation', () => {
    it('should call get with correct parameters', async () => {
      const mockData: DCFValuation[] = [
        {
          symbol: 'AAPL',
          date: '2024-01-01',
          ["Stock Price"]: 175.50,
          dcf: 180.25
        },
        {
          symbol: 'AAPL',
          date: '2023-01-01',
          ["Stock Price"]: 150.30,
          dcf: 155.75
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await dcfClient.getLeveredValuation('AAPL');

      expect(mockGet).toHaveBeenCalledWith('/levered-discounted-cash-flow', {
        symbol: 'AAPL'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with options', async () => {
      const mockData: DCFValuation[] = [];
      mockGet.mockResolvedValue(mockData);

      const options = {
        signal: new AbortController().signal,
        context: { config: { FMP_ACCESS_TOKEN: 'test-token' } }
      };

      const result = await dcfClient.getLeveredValuation('GOOGL', options);

      expect(mockGet).toHaveBeenCalledWith('/levered-discounted-cash-flow', {
        symbol: 'GOOGL'
      }, options);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'Levered DCF API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(dcfClient.getLeveredValuation('AAPL'))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('calculateCustomLeveredDCF', () => {
    it('should call post with correct parameters', async () => {
      const input: CustomDCFInput = {
        symbol: 'AAPL',
        revenueGrowthPct: 10.5,
        ebitdaPct: 25.0,
        taxRate: 21.0,
        longTermGrowthRate: 3.0,
        beta: 1.2,
        riskFreeRate: 4.5,
        marketRiskPremium: 6.0
      };

      const mockData: CustomDCFOutput = {
        symbol: 'AAPL',
        revenue: 394328000000,
        revenuePercentage: 10.5,
        ebitda: 98582000000,
        ebitdaPercentage: 25.0,
        ebit: 90000000000,
        ebitPercentage: 22.8,
        depreciation: 8582000000,
        depreciationPercentage: 2.2,
        totalCash: 50000000000,
        totalCashPercentage: 12.7,
        receivables: 25000000000,
        receivablesPercentage: 6.3,
        inventories: 5000000000,
        inventoriesPercentage: 1.3,
        payable: 15000000000,
        payablePercentage: 3.8,
        capitalExpenditure: 12000000000,
        capitalExpenditurePercentage: 3.0,
        price: 175.50,
        beta: 1.2,
        dilutedSharesOutstanding: 15500000000,
        costofDebt: 3.5,
        taxRate: 21.0,
        afterTaxCostOfDebt: 2.765,
        riskFreeRate: 4.5,
        marketRiskPremium: 6.0,
        costOfEquity: 11.7,
        totalDebt: 120000000000,
        totalEquity: 60000000000,
        totalCapital: 180000000000,
        debtWeighting: 0.667,
        equityWeighting: 0.333,
        wacc: 6.8,
        taxRateCash: 21.0,
        ebiat: 71100000000,
        ufcf: 65000000000,
        sumPvUfcf: 850000000000,
        longTermGrowthRate: 3.0,
        terminalValue: 2170000000000,
        presentTerminalValue: 1200000000000,
        enterpriseValue: 2050000000000,
        netDebt: 70000000000,
        equityValue: 1980000000000,
        equityValuePerShare: 127.74,
        freeCashFlowT1: 68000000000
      };
      mockPost.mockResolvedValue(mockData);

      const result = await dcfClient.calculateCustomLeveredDCF(input);

      expect(mockPost).toHaveBeenCalledWith('/custom-levered-discounted-cash-flow', {
        ...input
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call post with options', async () => {
      const input: CustomDCFInput = {
        symbol: 'TSLA'
      };

      const mockData: CustomDCFOutput = {
        symbol: 'TSLA'
      };
      mockPost.mockResolvedValue(mockData);

      const options = {
        signal: new AbortController().signal,
        context: { config: { FMP_ACCESS_TOKEN: 'test-token' } }
      };

      const result = await dcfClient.calculateCustomLeveredDCF(input, options);

      expect(mockPost).toHaveBeenCalledWith('/custom-levered-discounted-cash-flow', {
        ...input
      }, options);
      expect(result).toEqual(mockData);
    });

    it('should handle minimal input parameters', async () => {
      const input: CustomDCFInput = {
        symbol: 'MSFT',
        taxRate: 25.0
      };

      const mockData: CustomDCFOutput = {
        symbol: 'MSFT',
        taxRate: 25.0
      };
      mockPost.mockResolvedValue(mockData);

      const result = await dcfClient.calculateCustomLeveredDCF(input);

      expect(mockPost).toHaveBeenCalledWith('/custom-levered-discounted-cash-flow', {
        symbol: 'MSFT',
        taxRate: 25.0
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const input: CustomDCFInput = {
        symbol: 'INVALID'
      };
      const errorMessage = 'Custom Levered DCF API Error';
      mockPost.mockRejectedValue(new Error(errorMessage));

      await expect(dcfClient.calculateCustomLeveredDCF(input))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('calculateCustomDCF', () => {
    it('should call post with correct parameters', async () => {
      const input: CustomDCFInput = {
        symbol: 'GOOGL',
        revenueGrowthPct: 15.0,
        ebitdaPct: 30.0,
        depreciationAndAmortizationPct: 5.0,
        capitalExpenditurePct: 8.0,
        taxRate: 20.0,
        longTermGrowthRate: 2.5,
        costOfDebt: 4.0,
        costOfEquity: 12.0,
        beta: 1.1,
        riskFreeRate: 4.0,
        marketRiskPremium: 7.0
      };

      const mockData: CustomDCFOutput = {
        symbol: 'GOOGL',
        revenue: 307400000000,
        revenuePercentage: 15.0,
        ebitda: 92220000000,
        ebitdaPercentage: 30.0,
        ebit: 76850000000,
        ebitPercentage: 25.0,
        depreciation: 15370000000,
        depreciationPercentage: 5.0,
        totalCash: 118000000000,
        totalCashPercentage: 38.4,
        receivables: 40000000000,
        receivablesPercentage: 13.0,
        inventories: 2000000000,
        inventoriesPercentage: 0.7,
        payable: 12000000000,
        payablePercentage: 3.9,
        capitalExpenditure: 24592000000,
        capitalExpenditurePercentage: 8.0,
        price: 138.75,
        beta: 1.1,
        dilutedSharesOutstanding: 12800000000,
        costofDebt: 4.0,
        taxRate: 20.0,
        afterTaxCostOfDebt: 3.2,
        riskFreeRate: 4.0,
        marketRiskPremium: 7.0,
        costOfEquity: 12.0,
        totalDebt: 29000000000,
        totalEquity: 251000000000,
        totalCapital: 280000000000,
        debtWeighting: 0.104,
        equityWeighting: 0.896,
        wacc: 11.08,
        taxRateCash: 20.0,
        ebiat: 61480000000,
        ufcf: 52258000000,
        sumPvUfcf: 680000000000,
        longTermGrowthRate: 2.5,
        terminalValue: 1900000000000,
        presentTerminalValue: 950000000000,
        enterpriseValue: 1630000000000,
        netDebt: -89000000000,
        equityValue: 1719000000000,
        equityValuePerShare: 134.30,
        freeCashFlowT1: 55000000000
      };
      mockPost.mockResolvedValue(mockData);

      const result = await dcfClient.calculateCustomDCF(input);

      expect(mockPost).toHaveBeenCalledWith('/custom-discounted-cash-flow', {
        ...input
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call post with options', async () => {
      const input: CustomDCFInput = {
        symbol: 'AMZN',
        revenueGrowthPct: 12.0
      };

      const mockData: CustomDCFOutput = {
        symbol: 'AMZN',
        revenuePercentage: 12.0
      };
      mockPost.mockResolvedValue(mockData);

      const options = {
        signal: new AbortController().signal,
        context: { config: { FMP_ACCESS_TOKEN: 'test-token' } }
      };

      const result = await dcfClient.calculateCustomDCF(input, options);

      expect(mockPost).toHaveBeenCalledWith('/custom-discounted-cash-flow', {
        symbol: 'AMZN',
        revenueGrowthPct: 12.0
      }, options);
      expect(result).toEqual(mockData);
    });

    it('should handle full parameter set', async () => {
      const input: CustomDCFInput = {
        symbol: 'META',
        revenueGrowthPct: 18.0,
        ebitdaPct: 35.0,
        depreciationAndAmortizationPct: 6.0,
        cashAndShortTermInvestmentsPct: 15.0,
        receivablesPct: 8.0,
        inventoriesPct: 1.0,
        payablePct: 4.0,
        ebitPct: 29.0,
        capitalExpenditurePct: 10.0,
        operatingCashFlowPct: 32.0,
        sellingGeneralAndAdministrativeExpensesPct: 12.0,
        taxRate: 23.0,
        longTermGrowthRate: 3.5,
        costOfDebt: 3.8,
        costOfEquity: 11.5,
        marketRiskPremium: 6.5,
        beta: 1.3,
        riskFreeRate: 4.2
      };

      const mockData: CustomDCFOutput = {
        symbol: 'META',
        revenue: 134902000000,
        revenuePercentage: 18.0,
        ebitda: 47216000000,
        ebitdaPercentage: 35.0,
        ebit: 39121000000,
        ebitPercentage: 29.0,
        depreciation: 8095000000,
        depreciationPercentage: 6.0,
        totalCash: 20235000000,
        totalCashPercentage: 15.0,
        receivables: 10792000000,
        receivablesPercentage: 8.0,
        inventories: 1349000000,
        inventoriesPercentage: 1.0,
        payable: 5396000000,
        payablePercentage: 4.0,
        capitalExpenditure: 13490000000,
        capitalExpenditurePercentage: 10.0
      };
      mockPost.mockResolvedValue(mockData);

      const result = await dcfClient.calculateCustomDCF(input);

      expect(mockPost).toHaveBeenCalledWith('/custom-discounted-cash-flow', {
        ...input
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const input: CustomDCFInput = {
        symbol: 'ERROR_SYMBOL'
      };
      const errorMessage = 'Custom DCF API Error';
      mockPost.mockRejectedValue(new Error(errorMessage));

      await expect(dcfClient.calculateCustomDCF(input))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('constructor', () => {
    it('should create instance with API key', () => {
      const client = new DCFClient('my-api-key');
      expect(client).toBeInstanceOf(DCFClient);
    });

    it('should create instance without API key', () => {
      const client = new DCFClient();
      expect(client).toBeInstanceOf(DCFClient);
    });
  });
}); 