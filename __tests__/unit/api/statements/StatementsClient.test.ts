import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StatementsClient } from '../../../../src/api/statements/StatementsClient.js';
import { FMPClient } from '../../../../src/api/FMPClient.js';
import type {
  IncomeStatement,
  BalanceSheetStatement,
  CashFlowStatement,
  LatestFinancialStatement,
  IncomeStatementGrowth,
  BalanceSheetStatementGrowth,
  CashFlowStatementGrowth,
  FinancialStatementGrowth,
  FinancialReportDate,
  FinancialReport10K,
  RevenueProductSegmentation,
  RevenueGeographicSegmentation,
  AsReportedIncomeStatement,
  AsReportedBalanceSheet,
  AsReportedCashFlowStatement,
  AsReportedFinancialStatement,
  KeyMetrics,
  Ratios,
  KeyMetricsTTM,
  FinancialRatiosTTM,
  FinancialScores,
  OwnerEarnings,
} from '../../../../src/api/statements/types.js';

// Mock the FMPClient
vi.mock('../FMPClient.js');

describe('StatementsClient', () => {
  let statementsClient: StatementsClient;
  let mockGet: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Create mock for the get method
    mockGet = vi.fn();
    
    // Mock FMPClient prototype get method using any to bypass protected access
    (FMPClient.prototype as any).get = mockGet;
    
    // Create StatementsClient instance
    statementsClient = new StatementsClient('test-api-key');
  });

  describe('getIncomeStatement', () => {
    it('should call get with correct parameters', async () => {
      const mockData: IncomeStatement[] = [
        {
          date: '2023-12-31',
          symbol: 'AAPL',
          reportedCurrency: 'USD',
          cik: '0000320193',
          filingDate: '2024-01-26',
          acceptedDate: '2024-01-26T16:30:14.000Z',
          fiscalYear: '2023',
          period: 'FY',
          revenue: 383285000000,
          costOfRevenue: 214137000000,
          grossProfit: 169148000000,
          researchAndDevelopmentExpenses: 29915000000,
          generalAndAdministrativeExpenses: 6496000000,
          sellingAndMarketingExpenses: 0,
          sellingGeneralAndAdministrativeExpenses: 24932000000,
          otherExpenses: 0,
          operatingExpenses: 54847000000,
          costAndExpenses: 268984000000,
          netInterestIncome: 3750000000,
          interestIncome: 4020000000,
          interestExpense: 3933000000,
          depreciationAndAmortization: 11519000000,
          ebitda: 125820000000,
          ebit: 114301000000,
          nonOperatingIncomeExcludingInterest: 382000000,
          operatingIncome: 114301000000,
          totalOtherIncomeExpensesNet: 269000000,
          incomeBeforeTax: 114570000000,
          incomeTaxExpense: 16741000000,
          netIncomeFromContinuingOperations: 97829000000,
          netIncomeFromDiscontinuedOperations: 0,
          otherAdjustmentsToNetIncome: 0,
          netIncome: 97829000000,
          netIncomeDeductions: 0,
          bottomLineNetIncome: 97829000000,
          eps: 6.13,
          epsDiluted: 6.13,
          weightedAverageShsOut: 15956000000,
          weightedAverageShsOutDil: 15956000000
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await statementsClient.getIncomeStatement('AAPL', {
        limit: 10,
        period: 'FY'
      });

      expect(mockGet).toHaveBeenCalledWith('/income-statement', {
        symbol: 'AAPL',
        limit: 10,
        period: 'FY'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle optional parameters', async () => {
      const mockData: IncomeStatement[] = [];
      mockGet.mockResolvedValue(mockData);

      await statementsClient.getIncomeStatement('AAPL');

      expect(mockGet).toHaveBeenCalledWith('/income-statement', {
        symbol: 'AAPL'
      }, undefined);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(statementsClient.getIncomeStatement('AAPL'))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getBalanceSheetStatement', () => {
    it('should call get with correct parameters', async () => {
      const mockData: BalanceSheetStatement[] = [
        {
          date: '2023-12-31',
          symbol: 'AAPL',
          reportedCurrency: 'USD',
          cik: '0000320193',
          filingDate: '2024-01-26',
          acceptedDate: '2024-01-26T16:30:14.000Z',
          fiscalYear: '2023',
          period: 'FY',
          cashAndCashEquivalents: 29965000000,
          shortTermInvestments: 31590000000,
          cashAndShortTermInvestments: 61555000000,
          netReceivables: 29508000000,
          accountsReceivables: 18508000000,
          otherReceivables: 11000000000,
          inventory: 6331000000,
          prepaids: 0,
          otherCurrentAssets: 14695000000,
          totalCurrentAssets: 143566000000,
          propertyPlantEquipmentNet: 43715000000,
          goodwill: 0,
          intangibleAssets: 0,
          goodwillAndIntangibleAssets: 0,
          longTermInvestments: 100544000000,
          taxAssets: 0,
          otherNonCurrentAssets: 64758000000,
          totalNonCurrentAssets: 208672000000,
          otherAssets: 0,
          totalAssets: 352755000000,
          totalPayables: 0,
          accountPayables: 62611000000,
          otherPayables: 0,
          accruedExpenses: 0,
          shortTermDebt: 9822000000,
          capitalLeaseObligationsCurrent: 0,
          taxPayables: 0,
          deferredRevenue: 8061000000,
          otherCurrentLiabilities: 58829000000,
          totalCurrentLiabilities: 139323000000,
          longTermDebt: 106550000000,
          deferredRevenueNonCurrent: 0,
          deferredTaxLiabilitiesNonCurrent: 0,
          otherNonCurrentLiabilities: 39441000000,
          totalNonCurrentLiabilities: 145991000000,
          otherLiabilities: 0,
          capitalLeaseObligations: 0,
          totalLiabilities: 285314000000,
          treasuryStock: 0,
          preferredStock: 0,
          commonStock: 73812000000,
          retainedEarnings: -6371000000,
          additionalPaidInCapital: 0,
          accumulatedOtherComprehensiveIncomeLoss: 0,
          otherTotalStockholdersEquity: 0,
          totalStockholdersEquity: 67441000000,
          totalEquity: 67441000000,
          minorityInterest: 0,
          totalLiabilitiesAndTotalEquity: 352755000000,
          totalInvestments: 132134000000,
          totalDebt: 116372000000,
          netDebt: 86407000000
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await statementsClient.getBalanceSheetStatement('AAPL', {
        limit: 5,
        period: 'Q4'
      });

      expect(mockGet).toHaveBeenCalledWith('/balance-sheet-statement', {
        symbol: 'AAPL',
        limit: 5,
        period: 'Q4'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle optional parameters', async () => {
      const mockData: BalanceSheetStatement[] = [];
      mockGet.mockResolvedValue(mockData);

      await statementsClient.getBalanceSheetStatement('MSFT');

      expect(mockGet).toHaveBeenCalledWith('/balance-sheet-statement', {
        symbol: 'MSFT'
      }, undefined);
    });
  });

  describe('getCashFlowStatement', () => {
    it('should call get with correct parameters', async () => {
      const mockData: CashFlowStatement[] = [
        {
          date: '2023-12-31',
          symbol: 'AAPL',
          reportedCurrency: 'USD',
          cik: '0000320193',
          filingDate: '2024-01-26',
          acceptedDate: '2024-01-26T16:30:14.000Z',
          fiscalYear: '2023',
          period: 'FY',
          netIncome: 97829000000,
          depreciationAndAmortization: 11519000000,
          deferredIncomeTax: 0,
          stockBasedCompensation: 10833000000,
          changeInWorkingCapital: -1688000000,
          accountsReceivables: -1688000000,
          inventory: -1618000000,
          accountsPayables: 1889000000,
          otherWorkingCapital: -1271000000,
          otherNonCashItems: 0,
          netCashProvidedByOperatingActivities: 110563000000,
          investmentsInPropertyPlantAndEquipment: -10959000000,
          acquisitionsNet: -33000000,
          purchasesOfInvestments: -29513000000,
          salesMaturitiesOfInvestments: 39686000000,
          otherInvestingActivities: 1337000000,
          netCashProvidedByInvestingActivities: 518000000,
          netDebtIssuance: 0,
          longTermNetDebtIssuance: 0,
          shortTermNetDebtIssuance: 0,
          netStockIssuance: 0,
          netCommonStockIssuance: 0,
          commonStockIssuance: 0,
          commonStockRepurchased: -77550000000,
          netPreferredStockIssuance: 0,
          netDividendsPaid: -15025000000,
          commonDividendsPaid: -15025000000,
          preferredDividendsPaid: 0,
          otherFinancingActivities: 3037000000,
          netCashProvidedByFinancingActivities: -89538000000,
          effectOfForexChangesOnCash: 0,
          netChangeInCash: 21543000000,
          cashAtEndOfPeriod: 29965000000,
          cashAtBeginningOfPeriod: 8422000000,
          operatingCashFlow: 110563000000,
          capitalExpenditure: -10959000000,
          freeCashFlow: 99604000000,
          incomeTaxesPaid: 18679000000,
          interestPaid: 3933000000
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await statementsClient.getCashFlowStatement('AAPL', {
        limit: 3,
        period: 'Q1'
      });

      expect(mockGet).toHaveBeenCalledWith('/cash-flow-statement', {
        symbol: 'AAPL',
        limit: 3,
        period: 'Q1'
      }, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('getLatestFinancialStatements', () => {
    it('should call get with correct parameters', async () => {
      const mockData: LatestFinancialStatement[] = [
        {
          symbol: 'AAPL',
          calendarYear: 2023,
          period: 'FY',
          date: '2023-12-31',
          dateAdded: '2024-01-26'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await statementsClient.getLatestFinancialStatements({
        page: 0,
        limit: 100
      });

      expect(mockGet).toHaveBeenCalledWith('/latest-financial-statements', {
        page: 0,
        limit: 100
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle optional parameters', async () => {
      const mockData: LatestFinancialStatement[] = [];
      mockGet.mockResolvedValue(mockData);

      await statementsClient.getLatestFinancialStatements();

      expect(mockGet).toHaveBeenCalledWith('/latest-financial-statements', {}, undefined);
    });
  });

  describe('getKeyMetrics', () => {
    it('should call get with correct parameters', async () => {
      const mockData: KeyMetrics[] = [
        {
          symbol: 'AAPL',
          date: '2023-12-31',
          fiscalYear: '2023',
          period: 'FY',
          reportedCurrency: 'USD',
          marketCap: 3000000000000,
          enterpriseValue: 2950000000000,
          evToSales: 7.7,
          evToOperatingCashFlow: 26.7,
          evToFreeCashFlow: 29.6,
          evToEBITDA: 23.4,
          netDebtToEBITDA: 0.69,
          currentRatio: 1.03,
          incomeQuality: 1.13,
          grahamNumber: 0,
          grahamNetNet: 0,
          taxBurden: 0.85,
          interestBurden: 1.0,
          workingCapital: 4243000000,
          investedCapital: 183813000000,
          returnOnAssets: 0.277,
          operatingReturnOnAssets: 0.324,
          returnOnTangibleAssets: 0.277,
          returnOnEquity: 1.45,
          returnOnInvestedCapital: 0.532,
          returnOnCapitalEmployed: 0.532,
          earningsYield: 0.033,
          freeCashFlowYield: 0.033,
          capexToOperatingCashFlow: 0.099,
          capexToDepreciation: 0.951,
          capexToRevenue: 0.029,
          salesGeneralAndAdministrativeToRevenue: 0.065,
          researchAndDevelopementToRevenue: 0.078,
          stockBasedCompensationToRevenue: 0.028,
          intangiblesToTotalAssets: 0,
          averageReceivables: 28184000000,
          averagePayables: 64115000000,
          averageInventory: 6820000000,
          daysOfSalesOutstanding: 26.87,
          daysOfPayablesOutstanding: 109.15,
          daysOfInventoryOutstanding: 11.61,
          operatingCycle: 38.48,
          cashConversionCycle: -70.67,
          freeCashFlowToEquity: 99604000000,
          freeCashFlowToFirm: 99604000000,
          tangibleAssetValue: 67441000000,
          netCurrentAssetValue: 4243000000
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await statementsClient.getKeyMetrics('AAPL', {
        limit: 10,
        period: 'annual'
      });

      expect(mockGet).toHaveBeenCalledWith('/key-metrics', {
        symbol: 'AAPL',
        limit: 10,
        period: 'annual'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle optional parameters', async () => {
      const mockData: KeyMetrics[] = [];
      mockGet.mockResolvedValue(mockData);

      await statementsClient.getKeyMetrics('AAPL');

      expect(mockGet).toHaveBeenCalledWith('/key-metrics', {
        symbol: 'AAPL'
      }, undefined);
    });
  });

  describe('getRatios', () => {
    it('should call get with correct parameters', async () => {
      const mockData: Ratios[] = [
        {
          symbol: 'AAPL',
          date: '2023-12-31',
          fiscalYear: '2023',
          period: 'FY',
          reportedCurrency: 'USD',
          grossProfitMargin: 0.441,
          ebitMargin: 0.298,
          ebitdaMargin: 0.328,
          operatingProfitMargin: 0.298,
          pretaxProfitMargin: 0.299,
          continuousOperationsProfitMargin: 0.255,
          netProfitMargin: 0.255,
          bottomLineProfitMargin: 0.255,
          receivablesTurnover: 13.6,
          payablesTurnover: 3.34,
          inventoryTurnover: 31.46,
          fixedAssetTurnover: 8.77,
          assetTurnover: 1.09,
          currentRatio: 1.03,
          quickRatio: 0.99,
          solvencyRatio: 0.191,
          cashRatio: 0.174,
          priceToEarningsRatio: 29.15,
          priceToEarningsGrowthRatio: 2.3,
          forwardPriceToEarningsGrowthRatio: 0,
          priceToBookRatio: 39.74,
          priceToSalesRatio: 7.42,
          priceToFreeCashFlowRatio: 28.6,
          priceToOperatingCashFlowRatio: 25.74,
          debtToAssetsRatio: 0.33,
          debtToEquityRatio: 1.73,
          debtToCapitalRatio: 0.63,
          longTermDebtToCapitalRatio: 0.61,
          financialLeverageRatio: 5.23,
          workingCapitalTurnoverRatio: 90.33,
          operatingCashFlowRatio: 0.794,
          operatingCashFlowSalesRatio: 0.288,
          freeCashFlowOperatingCashFlowRatio: 0.901,
          debtServiceCoverageRatio: 28.11,
          interestCoverageRatio: 29.06,
          shortTermOperatingCashFlowCoverageRatio: 0.794,
          operatingCashFlowCoverageRatio: 0.794,
          capitalExpenditureCoverageRatio: 10.09,
          dividendPaidAndCapexCoverageRatio: 4.31,
          dividendPayoutRatio: 0.154,
          dividendYield: 0.005,
          dividendYieldPercentage: 0.5,
          revenuePerShare: 24.03,
          netIncomePerShare: 6.13,
          interestDebtPerShare: 7.29,
          cashPerShare: 1.88,
          bookValuePerShare: 4.23,
          tangibleBookValuePerShare: 4.23,
          shareholdersEquityPerShare: 4.23,
          operatingCashFlowPerShare: 6.93,
          capexPerShare: 0.69,
          freeCashFlowPerShare: 6.24,
          netIncomePerEBT: 0.854,
          ebtPerEbit: 1.002,
          priceToFairValue: 1.0,
          debtToMarketCap: 0.041,
          effectiveTaxRate: 0.146,
          enterpriseValueMultiple: 25.8
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await statementsClient.getRatios('AAPL', {
        limit: 5,
        period: 'quarter'
      });

      expect(mockGet).toHaveBeenCalledWith('/ratios', {
        symbol: 'AAPL',
        limit: 5,
        period: 'quarter'
      }, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('getKeyMetricsTTM', () => {
    it('should call get with correct parameters', async () => {
      const mockData: KeyMetricsTTM[] = [
        {
          symbol: 'AAPL',
          marketCap: 3000000000000,
          enterpriseValueTTM: 2950000000000,
          evToSalesTTM: 7.7,
          evToOperatingCashFlowTTM: 26.7,
          evToFreeCashFlowTTM: 29.6,
          evToEBITDATTM: 23.4,
          netDebtToEBITDATTM: 0.69,
          currentRatioTTM: 1.03,
          incomeQualityTTM: 1.13,
          grahamNumberTTM: 0,
          grahamNetNetTTM: 0,
          taxBurdenTTM: 0.85,
          interestBurdenTTM: 1.0,
          workingCapitalTTM: 4243000000,
          investedCapitalTTM: 183813000000,
          returnOnAssetsTTM: 0.277,
          operatingReturnOnAssetsTTM: 0.324,
          returnOnTangibleAssetsTTM: 0.277,
          returnOnEquityTTM: 1.45,
          returnOnInvestedCapitalTTM: 0.532,
          returnOnCapitalEmployedTTM: 0.532,
          earningsYieldTTM: 0.033,
          freeCashFlowYieldTTM: 0.033,
          capexToOperatingCashFlowTTM: 0.099,
          capexToDepreciationTTM: 0.951,
          capexToRevenueTTM: 0.029,
          salesGeneralAndAdministrativeToRevenueTTM: 0.065,
          researchAndDevelopementToRevenueTTM: 0.078,
          stockBasedCompensationToRevenueTTM: 0.028,
          intangiblesToTotalAssetsTTM: 0,
          averageReceivablesTTM: 28184000000,
          averagePayablesTTM: 64115000000,
          averageInventoryTTM: 6820000000,
          daysOfSalesOutstandingTTM: 26.87,
          daysOfPayablesOutstandingTTM: 109.15,
          daysOfInventoryOutstandingTTM: 11.61,
          operatingCycleTTM: 38.48,
          cashConversionCycleTTM: -70.67,
          freeCashFlowToEquityTTM: 99604000000,
          freeCashFlowToFirmTTM: 99604000000,
          tangibleAssetValueTTM: 67441000000,
          netCurrentAssetValueTTM: 4243000000
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await statementsClient.getKeyMetricsTTM('AAPL');

      expect(mockGet).toHaveBeenCalledWith('/key-metrics-ttm', {
        symbol: 'AAPL'
      }, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('getFinancialRatiosTTM', () => {
    it('should call get with correct parameters', async () => {
      const mockData: FinancialRatiosTTM[] = [
        {
          symbol: 'AAPL',
          date: '2023-12-31',
          fiscalYear: '2023',
          period: 'FY',
          reportedCurrency: 'USD',
          grossProfitMarginTTM: 0.441,
          ebitMarginTTM: 0.298,
          ebitdaMarginTTM: 0.328,
          operatingProfitMarginTTM: 0.298,
          pretaxProfitMarginTTM: 0.299,
          continuousOperationsProfitMarginTTM: 0.255,
          netProfitMarginTTM: 0.255,
          bottomLineProfitMarginTTM: 0.255,
          receivablesTurnoverTTM: 13.6,
          payablesTurnoverTTM: 3.34,
          inventoryTurnoverTTM: 31.46,
          fixedAssetTurnoverTTM: 8.77,
          assetTurnoverTTM: 1.09,
          currentRatioTTM: 1.03,
          quickRatioTTM: 0.99,
          solvencyRatioTTM: 0.191,
          cashRatioTTM: 0.174,
          priceToEarningsRatioTTM: 29.15,
          priceToEarningsGrowthRatioTTM: 2.3,
          forwardPriceToEarningsGrowthRatioTTM: 0,
          priceToBookRatioTTM: 39.74,
          priceToSalesRatioTTM: 7.42,
          priceToFreeCashFlowRatioTTM: 28.6,
          priceToOperatingCashFlowRatioTTM: 25.74,
          debtToAssetsRatioTTM: 0.33,
          debtToEquityRatioTTM: 1.73,
          debtToCapitalRatioTTM: 0.63,
          longTermDebtToCapitalRatioTTM: 0.61,
          financialLeverageRatioTTM: 5.23,
          workingCapitalTurnoverRatioTTM: 90.33,
          operatingCashFlowRatioTTM: 0.794,
          operatingCashFlowSalesRatioTTM: 0.288,
          freeCashFlowOperatingCashFlowRatioTTM: 0.901,
          debtServiceCoverageRatioTTM: 28.11,
          interestCoverageRatioTTM: 29.06,
          shortTermOperatingCashFlowCoverageRatioTTM: 0.794,
          operatingCashFlowCoverageRatioTTM: 0.794,
          capitalExpenditureCoverageRatioTTM: 10.09,
          dividendPaidAndCapexCoverageRatioTTM: 4.31,
          dividendPayoutRatioTTM: 0.154,
          dividendYieldTTM: 0.005,
          enterpriseValueTTM: 2950000000000,
          revenuePerShareTTM: 24.03,
          netIncomePerShareTTM: 6.13,
          interestDebtPerShareTTM: 7.29,
          cashPerShareTTM: 1.88,
          bookValuePerShareTTM: 4.23,
          tangibleBookValuePerShareTTM: 4.23,
          shareholdersEquityPerShareTTM: 4.23,
          operatingCashFlowPerShareTTM: 6.93,
          capexPerShareTTM: 0.69,
          freeCashFlowPerShareTTM: 6.24,
          netIncomePerEBTTTM: 0.854,
          ebtPerEbitTTM: 1.002,
          priceToFairValueTTM: 1.0,
          debtToMarketCapTTM: 0.041,
          effectiveTaxRateTTM: 0.146,
          enterpriseValueMultipleTTM: 25.8
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await statementsClient.getFinancialRatiosTTM('AAPL');

      expect(mockGet).toHaveBeenCalledWith('/ratios-ttm', {
        symbol: 'AAPL'
      }, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('getFinancialScores', () => {
    it('should call get with correct parameters', async () => {
      const mockData: FinancialScores[] = [
        {
          symbol: 'AAPL',
          reportedCurrency: 'USD',
          altmanZScore: 8.31,
          piotroskiScore: 6,
          workingCapital: 4243000000,
          totalAssets: 352755000000,
          retainedEarnings: -6371000000,
          ebit: 114301000000,
          marketCap: 3000000000000,
          totalLiabilities: 285314000000,
          revenue: 383285000000
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await statementsClient.getFinancialScores('AAPL', {
        limit: 5
      });

      expect(mockGet).toHaveBeenCalledWith('/financial-scores', {
        symbol: 'AAPL',
        limit: 5
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle optional parameters', async () => {
      const mockData: FinancialScores[] = [];
      mockGet.mockResolvedValue(mockData);

      await statementsClient.getFinancialScores('AAPL');

      expect(mockGet).toHaveBeenCalledWith('/financial-scores', {
        symbol: 'AAPL'
      }, undefined);
    });
  });

  describe('getOwnerEarnings', () => {
    it('should call get with correct parameters', async () => {
      const mockData: OwnerEarnings[] = [
        {
          symbol: 'AAPL',
          reportedCurrency: 'USD',
          fiscalYear: '2023',
          period: 'FY',
          date: '2023-12-31',
          averagePPE: 43715000000,
          maintenanceCapex: 5479500000,
          ownersEarnings: 105083500000,
          growthCapex: 5479500000,
          ownersEarningsPerShare: 6.59
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await statementsClient.getOwnerEarnings('AAPL');

      expect(mockGet).toHaveBeenCalledWith('/owner-earnings', {
        symbol: 'AAPL'
      }, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('getFinancialReportsDates', () => {
    it('should call get with correct parameters', async () => {
      const mockData: FinancialReportDate[] = [
        {
          symbol: 'AAPL',
          fiscalYear: 2023,
          period: 'FY',
          linkXlsx: 'https://financialmodelingprep.com/financial-reports-xlsx/AAPL/2023/FY',
          linkJson: 'https://financialmodelingprep.com/financial-reports-json/AAPL/2023/FY'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await statementsClient.getFinancialReportsDates('AAPL');

      expect(mockGet).toHaveBeenCalledWith('/financial-reports-dates', {
        symbol: 'AAPL'
      }, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('getFinancialReportJSON', () => {
    it('should call get with correct parameters', async () => {
      const mockData: FinancialReport10K[] = [
        {
          symbol: 'AAPL',
          period: 'FY',
          year: '2023'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await statementsClient.getFinancialReportJSON('AAPL', 2023, 'FY');

      expect(mockGet).toHaveBeenCalledWith('/financial-reports-json', {
        symbol: 'AAPL',
        year: 2023,
        period: 'FY'
      }, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('getRevenueProductSegmentation', () => {
    it('should call get with correct parameters', async () => {
      const mockData: RevenueProductSegmentation[] = [
        {
          symbol: 'AAPL',
          fiscalYear: 2023,
          period: 'annual',
          reportedCurrency: 'USD',
          date: '2023-12-31',
          data: {
            'iPhone': 200583000000,
            'Mac': 29357000000,
            'iPad': 28300000000,
            'Services': 85200000000
          }
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await statementsClient.getRevenueProductSegmentation('AAPL', {
        period: 'annual',
        structure: 'flat'
      });

      expect(mockGet).toHaveBeenCalledWith('/revenue-product-segmentation', {
        symbol: 'AAPL',
        period: 'annual',
        structure: 'flat'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle optional parameters', async () => {
      const mockData: RevenueProductSegmentation[] = [];
      mockGet.mockResolvedValue(mockData);

      await statementsClient.getRevenueProductSegmentation('AAPL');

      expect(mockGet).toHaveBeenCalledWith('/revenue-product-segmentation', {
        symbol: 'AAPL'
      }, undefined);
    });
  });

  describe('getRevenueGeographicSegmentation', () => {
    it('should call get with correct parameters', async () => {
      const mockData: RevenueGeographicSegmentation[] = [
        {
          symbol: 'AAPL',
          fiscalYear: 2023,
          period: 'annual',
          reportedCurrency: 'USD',
          date: '2023-12-31',
          data: {
            'Americas': 162560000000,
            'Europe': 94294000000,
            'Greater China': 72559000000,
            'Japan': 24872000000,
            'Rest of Asia Pacific': 29000000000
          }
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await statementsClient.getRevenueGeographicSegmentation('AAPL', {
        period: 'quarter'
      });

      expect(mockGet).toHaveBeenCalledWith('/revenue-geographic-segmentation', {
        symbol: 'AAPL',
        period: 'quarter'
      }, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('getIncomeStatementTTM', () => {
    it('should call get with correct parameters', async () => {
      const mockData: IncomeStatement[] = [
        {
          date: '2023-12-31',
          symbol: 'AAPL',
          reportedCurrency: 'USD',
          cik: '0000320193',
          filingDate: '2024-01-26',
          acceptedDate: '2024-01-26T16:30:14.000Z',
          fiscalYear: '2023',
          period: 'FY',
          revenue: 383285000000,
          costOfRevenue: 214137000000,
          grossProfit: 169148000000,
          researchAndDevelopmentExpenses: 29915000000,
          generalAndAdministrativeExpenses: 6496000000,
          sellingAndMarketingExpenses: 0,
          sellingGeneralAndAdministrativeExpenses: 24932000000,
          otherExpenses: 0,
          operatingExpenses: 54847000000,
          costAndExpenses: 268984000000,
          netInterestIncome: 3750000000,
          interestIncome: 4020000000,
          interestExpense: 3933000000,
          depreciationAndAmortization: 11519000000,
          ebitda: 125820000000,
          ebit: 114301000000,
          nonOperatingIncomeExcludingInterest: 382000000,
          operatingIncome: 114301000000,
          totalOtherIncomeExpensesNet: 269000000,
          incomeBeforeTax: 114570000000,
          incomeTaxExpense: 16741000000,
          netIncomeFromContinuingOperations: 97829000000,
          netIncomeFromDiscontinuedOperations: 0,
          otherAdjustmentsToNetIncome: 0,
          netIncome: 97829000000,
          netIncomeDeductions: 0,
          bottomLineNetIncome: 97829000000,
          eps: 6.13,
          epsDiluted: 6.13,
          weightedAverageShsOut: 15956000000,
          weightedAverageShsOutDil: 15956000000
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await statementsClient.getIncomeStatementTTM('AAPL', {
        limit: 5
      });

      expect(mockGet).toHaveBeenCalledWith('/income-statement-ttm', {
        symbol: 'AAPL',
        limit: 5
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle optional parameters', async () => {
      const mockData: IncomeStatement[] = [];
      mockGet.mockResolvedValue(mockData);

      await statementsClient.getIncomeStatementTTM('MSFT');

      expect(mockGet).toHaveBeenCalledWith('/income-statement-ttm', {
        symbol: 'MSFT'
      }, undefined);
    });
  });

  describe('getBalanceSheetStatementTTM', () => {
    it('should call get with correct parameters', async () => {
      const mockData: BalanceSheetStatement[] = [
        {
          date: '2023-12-31',
          symbol: 'AAPL',
          reportedCurrency: 'USD',
          cik: '0000320193',
          filingDate: '2024-01-26',
          acceptedDate: '2024-01-26T16:30:14.000Z',
          fiscalYear: '2023',
          period: 'FY',
          cashAndCashEquivalents: 29965000000,
          shortTermInvestments: 31590000000,
          cashAndShortTermInvestments: 61555000000,
          netReceivables: 29508000000,
          accountsReceivables: 18508000000,
          otherReceivables: 11000000000,
          inventory: 6331000000,
          prepaids: 0,
          otherCurrentAssets: 14695000000,
          totalCurrentAssets: 143566000000,
          propertyPlantEquipmentNet: 43715000000,
          goodwill: 0,
          intangibleAssets: 0,
          goodwillAndIntangibleAssets: 0,
          longTermInvestments: 100544000000,
          taxAssets: 0,
          otherNonCurrentAssets: 64758000000,
          totalNonCurrentAssets: 208672000000,
          otherAssets: 0,
          totalAssets: 352755000000,
          totalPayables: 0,
          accountPayables: 62611000000,
          otherPayables: 0,
          accruedExpenses: 0,
          shortTermDebt: 9822000000,
          capitalLeaseObligationsCurrent: 0,
          taxPayables: 0,
          deferredRevenue: 8061000000,
          otherCurrentLiabilities: 58829000000,
          totalCurrentLiabilities: 139323000000,
          longTermDebt: 106550000000,
          deferredRevenueNonCurrent: 0,
          deferredTaxLiabilitiesNonCurrent: 0,
          otherNonCurrentLiabilities: 39441000000,
          totalNonCurrentLiabilities: 145991000000,
          otherLiabilities: 0,
          capitalLeaseObligations: 0,
          totalLiabilities: 285314000000,
          treasuryStock: 0,
          preferredStock: 0,
          commonStock: 73812000000,
          retainedEarnings: -6371000000,
          additionalPaidInCapital: 0,
          accumulatedOtherComprehensiveIncomeLoss: 0,
          otherTotalStockholdersEquity: 0,
          totalStockholdersEquity: 67441000000,
          totalEquity: 67441000000,
          minorityInterest: 0,
          totalLiabilitiesAndTotalEquity: 352755000000,
          totalInvestments: 132134000000,
          totalDebt: 116372000000,
          netDebt: 86407000000
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await statementsClient.getBalanceSheetStatementTTM('AAPL', {
        limit: 3
      });

      expect(mockGet).toHaveBeenCalledWith('/balance-sheet-statement-ttm', {
        symbol: 'AAPL',
        limit: 3
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle optional parameters', async () => {
      const mockData: BalanceSheetStatement[] = [];
      mockGet.mockResolvedValue(mockData);

      await statementsClient.getBalanceSheetStatementTTM('GOOGL');

      expect(mockGet).toHaveBeenCalledWith('/balance-sheet-statement-ttm', {
        symbol: 'GOOGL'
      }, undefined);
    });
  });

  describe('getCashFlowStatementTTM', () => {
    it('should call get with correct parameters', async () => {
      const mockData: CashFlowStatement[] = [
        {
          date: '2023-12-31',
          symbol: 'AAPL',
          reportedCurrency: 'USD',
          cik: '0000320193',
          filingDate: '2024-01-26',
          acceptedDate: '2024-01-26T16:30:14.000Z',
          fiscalYear: '2023',
          period: 'FY',
          netIncome: 97829000000,
          depreciationAndAmortization: 11519000000,
          deferredIncomeTax: 0,
          stockBasedCompensation: 10833000000,
          changeInWorkingCapital: -1688000000,
          accountsReceivables: -1688000000,
          inventory: -1618000000,
          accountsPayables: 1889000000,
          otherWorkingCapital: -1271000000,
          otherNonCashItems: 0,
          netCashProvidedByOperatingActivities: 110563000000,
          investmentsInPropertyPlantAndEquipment: -10959000000,
          acquisitionsNet: -33000000,
          purchasesOfInvestments: -29513000000,
          salesMaturitiesOfInvestments: 39686000000,
          otherInvestingActivities: 1337000000,
          netCashProvidedByInvestingActivities: 518000000,
          netDebtIssuance: 0,
          longTermNetDebtIssuance: 0,
          shortTermNetDebtIssuance: 0,
          netStockIssuance: 0,
          netCommonStockIssuance: 0,
          commonStockIssuance: 0,
          commonStockRepurchased: -77550000000,
          netPreferredStockIssuance: 0,
          netDividendsPaid: -15025000000,
          commonDividendsPaid: -15025000000,
          preferredDividendsPaid: 0,
          otherFinancingActivities: 3037000000,
          netCashProvidedByFinancingActivities: -89538000000,
          effectOfForexChangesOnCash: 0,
          netChangeInCash: 21543000000,
          cashAtEndOfPeriod: 29965000000,
          cashAtBeginningOfPeriod: 8422000000,
          operatingCashFlow: 110563000000,
          capitalExpenditure: -10959000000,
          freeCashFlow: 99604000000,
          incomeTaxesPaid: 18679000000,
          interestPaid: 3933000000
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await statementsClient.getCashFlowStatementTTM('AAPL', {
        limit: 8
      });

      expect(mockGet).toHaveBeenCalledWith('/cash-flow-statement-ttm', {
        symbol: 'AAPL',
        limit: 8
      }, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('getIncomeStatementGrowth', () => {
    it('should call get with correct parameters', async () => {
      const mockData: IncomeStatementGrowth[] = [
        {
          date: '2023-12-31',
          symbol: 'AAPL',
          reportedCurrency: 'USD',
          cik: '0000320193',
          filingDate: '2024-01-26',
          acceptedDate: '2024-01-26T16:30:14.000Z',
          fiscalYear: '2023',
          period: 'FY',
          growthRevenue: 0.025,
          growthCostOfRevenue: 0.015,
          growthGrossProfit: 0.035,
          growthGrossProfitRatio: 0.020,
          growthEBIT: 0.045,
          growthEBITDA: 0.040,
          growthOperatingIncome: 0.045,
          growthNetIncome: 0.055,
          growthEPS: 0.060,
          growthEPSDiluted: 0.060,
          growthResearchAndDevelopmentExpenses: 0.12,
          growthGeneralAndAdministrativeExpenses: 0.08,
          growthSellingAndMarketingExpenses: 0.0,
          growthOtherExpenses: 0.02,
          growthOperatingExpenses: 0.095,
          growthCostAndExpenses: 0.025,
          growthDepreciationAndAmortization: -0.02,
          growthInterestIncome: 0.15,
          growthInterestExpense: -0.05,
          growthTotalOtherIncomeExpensesNet: 0.25,
          growthIncomeBeforeTax: 0.05,
          growthIncomeTaxExpense: 0.12,
          growthWeightedAverageShsOut: -0.05,
          growthWeightedAverageShsOutDil: -0.05,
          growthNonOperatingIncomeExcludingInterest: 0.1,
          growthNetInterestIncome: 0.08,
          growthNetIncomeFromContinuingOperations: 0.055,
          growthOtherAdjustmentsToNetIncome: 0.0,
          growthNetIncomeDeductions: 0.0
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await statementsClient.getIncomeStatementGrowth('AAPL', {
        limit: 5,
        period: 'FY'
      });

      expect(mockGet).toHaveBeenCalledWith('/income-statement-growth', {
        symbol: 'AAPL',
        limit: 5,
        period: 'FY'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle optional parameters', async () => {
      const mockData: IncomeStatementGrowth[] = [];
      mockGet.mockResolvedValue(mockData);

      await statementsClient.getIncomeStatementGrowth('TSLA');

      expect(mockGet).toHaveBeenCalledWith('/income-statement-growth', {
        symbol: 'TSLA'
      }, undefined);
    });
  });

  describe('getBalanceSheetStatementGrowth', () => {
    it('should call get with correct parameters', async () => {
      const mockData: BalanceSheetStatementGrowth[] = [
        {
          date: '2023-12-31',
          symbol: 'AAPL',
          reportedCurrency: 'USD',
          cik: '0000320193',
          filingDate: '2024-01-26',
          acceptedDate: '2024-01-26T16:30:14.000Z',
          fiscalYear: '2023',
          period: 'FY',
          growthCashAndCashEquivalents: 0.12,
          growthShortTermInvestments: -0.05,
          growthCashAndShortTermInvestments: 0.05,
          growthNetReceivables: 0.08,
          growthInventory: 0.15,
          growthOtherCurrentAssets: 0.04,
          growthTotalCurrentAssets: 0.06,
          growthPropertyPlantEquipmentNet: 0.03,
          growthGoodwill: 0.0,
          growthIntangibleAssets: 0.0,
          growthGoodwillAndIntangibleAssets: 0.0,
          growthLongTermInvestments: 0.02,
          growthTaxAssets: 0.0,
          growthOtherNonCurrentAssets: 0.03,
          growthTotalNonCurrentAssets: 0.025,
          growthOtherAssets: 0.0,
          growthTotalAssets: 0.04,
          growthAccountPayables: 0.09,
          growthShortTermDebt: -0.12,
          growthTaxPayables: 0.0,
          growthDeferredRevenue: 0.05,
          growthOtherCurrentLiabilities: 0.08,
          growthTotalCurrentLiabilities: 0.05,
          growthLongTermDebt: -0.08,
          growthDeferredRevenueNonCurrent: 0.0,
          growthDeferredTaxLiabilitiesNonCurrent: 0.0,
          growthOtherNonCurrentLiabilities: 0.02,
          growthTotalNonCurrentLiabilities: -0.02,
          growthOtherLiabilities: 0.0,
          growthTotalLiabilities: 0.02,
          growthPreferredStock: 0.0,
          growthCommonStock: 0.01,
          growthRetainedEarnings: 1.25,
          growthAccumulatedOtherComprehensiveIncomeLoss: 0.0,
          growthOthertotalStockholdersEquity: 0.0,
          growthTotalStockholdersEquity: 0.08,
          growthMinorityInterest: 0.0,
          growthTotalEquity: 0.08,
          growthTotalLiabilitiesAndStockholdersEquity: 0.04,
          growthTotalInvestments: 0.02,
          growthTotalDebt: -0.07,
          growthNetDebt: -0.15,
          growthAccountsReceivables: 0.06,
          growthOtherReceivables: 0.10,
          growthPrepaids: 0.0,
          growthTotalPayables: 0.07,
          growthOtherPayables: 0.0,
          growthAccruedExpenses: 0.0,
          growthCapitalLeaseObligationsCurrent: 0.0,
          growthAdditionalPaidInCapital: 0.0,
          growthTreasuryStock: 0.0
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await statementsClient.getBalanceSheetStatementGrowth('AAPL', {
        limit: 10,
        period: 'Q4'
      });

      expect(mockGet).toHaveBeenCalledWith('/balance-sheet-statement-growth', {
        symbol: 'AAPL',
        limit: 10,
        period: 'Q4'
      }, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('getCashFlowStatementGrowth', () => {
    it('should call get with correct parameters', async () => {
      const mockData: CashFlowStatementGrowth[] = [
        {
          date: '2023-12-31',
          symbol: 'AAPL',
          reportedCurrency: 'USD',
          cik: '0000320193',
          filingDate: '2024-01-26',
          acceptedDate: '2024-01-26T16:30:14.000Z',
          fiscalYear: '2023',
          period: 'FY',
          growthNetIncome: 0.055,
          growthDepreciationAndAmortization: -0.02,
          growthDeferredIncomeTax: 0.0,
          growthStockBasedCompensation: 0.08,
          growthChangeInWorkingCapital: -0.25,
          growthAccountsReceivables: -0.10,
          growthInventory: 0.05,
          growthAccountsPayables: 0.15,
          growthOtherWorkingCapital: -0.05,
          growthOtherNonCashItems: 0.0,
          growthNetCashProvidedByOperatingActivites: 0.04,
          growthInvestmentsInPropertyPlantAndEquipment: 0.12,
          growthAcquisitionsNet: -0.20,
          growthPurchasesOfInvestments: 0.08,
          growthSalesMaturitiesOfInvestments: 0.15,
          growthOtherInvestingActivites: 0.50,
          growthNetCashUsedForInvestingActivites: 0.85,
          growthDebtRepayment: 0.0,
          growthCommonStockIssued: 0.0,
          growthCommonStockRepurchased: 0.25,
          growthDividendsPaid: 0.08,
          growthOtherFinancingActivites: 0.10,
          growthNetCashUsedProvidedByFinancingActivities: -0.15,
          growthEffectOfForexChangesOnCash: 0.0,
          growthNetChangeInCash: 0.35,
          growthCashAtEndOfPeriod: 0.12,
          growthCashAtBeginningOfPeriod: -0.05,
          growthOperatingCashFlow: 0.04,
          growthCapitalExpenditure: 0.12,
          growthFreeCashFlow: 0.02,
          growthNetDebtIssuance: 0.0,
          growthLongTermNetDebtIssuance: 0.0,
          growthShortTermNetDebtIssuance: 0.0,
          growthNetStockIssuance: 0.0,
          growthPreferredDividendsPaid: 0.0,
          growthIncomeTaxesPaid: 0.18,
          growthInterestPaid: -0.05
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await statementsClient.getCashFlowStatementGrowth('AAPL', {
        limit: 7,
        period: 'Q1'
      });

      expect(mockGet).toHaveBeenCalledWith('/cash-flow-statement-growth', {
        symbol: 'AAPL',
        limit: 7,
        period: 'Q1'
      }, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('getFinancialStatementGrowth', () => {
    it('should call get with correct parameters', async () => {
      const mockData: FinancialStatementGrowth[] = [
        {
          date: '2023-12-31',
          symbol: 'AAPL',
          reportedCurrency: 'USD',
          cik: '0000320193',
          filingDate: '2024-01-26',
          acceptedDate: '2024-01-26T16:30:14.000Z',
          fiscalYear: '2023',
          period: 'FY',
          revenueGrowth: 0.025,
          grossProfitGrowth: 0.035,
          ebitgrowth: 0.045,
          operatingIncomeGrowth: 0.045,
          netIncomeGrowth: 0.055,
          epsgrowth: 0.060,
          epsdilutedGrowth: 0.060,
          weightedAverageSharesGrowth: -0.05,
          weightedAverageSharesDilutedGrowth: -0.05,
          dividendsPerShareGrowth: 0.08,
          operatingCashFlowGrowth: 0.04,
          receivablesGrowth: 0.08,
          inventoryGrowth: 0.15,
          assetGrowth: 0.04,
          bookValueperShareGrowth: 0.08,
          debtGrowth: -0.07,
          rdexpenseGrowth: 0.12,
          sgaexpensesGrowth: 0.09,
          freeCashFlowGrowth: 0.02,
          tenYRevenueGrowthPerShare: 0.15,
          fiveYRevenueGrowthPerShare: 0.12,
          threeYRevenueGrowthPerShare: 0.10,
          tenYOperatingCFGrowthPerShare: 0.08,
          fiveYOperatingCFGrowthPerShare: 0.06,
          threeYOperatingCFGrowthPerShare: 0.05,
          tenYNetIncomeGrowthPerShare: 0.12,
          fiveYNetIncomeGrowthPerShare: 0.10,
          threeYNetIncomeGrowthPerShare: 0.08,
          tenYShareholdersEquityGrowthPerShare: 0.07,
          fiveYShareholdersEquityGrowthPerShare: 0.06,
          threeYShareholdersEquityGrowthPerShare: 0.05,
          tenYDividendperShareGrowthPerShare: 0.08,
          fiveYDividendperShareGrowthPerShare: 0.07,
          threeYDividendperShareGrowthPerShare: 0.06,
          ebitdaGrowth: 0.040,
          growthCapitalExpenditure: 0.12,
          tenYBottomLineNetIncomeGrowthPerShare: 0.11,
          fiveYBottomLineNetIncomeGrowthPerShare: 0.09,
          threeYBottomLineNetIncomeGrowthPerShare: 0.07
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await statementsClient.getFinancialStatementGrowth('AAPL', {
        limit: 15,
        period: 'Q2'
      });

      expect(mockGet).toHaveBeenCalledWith('/financial-growth', {
        symbol: 'AAPL',
        limit: 15,
        period: 'Q2'
      }, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('getFinancialReportXLSX', () => {
    it('should call get with correct parameters', async () => {
      const mockData = {
        data: 'xlsx-binary-data'
      };
      mockGet.mockResolvedValue(mockData);

      const result = await statementsClient.getFinancialReportXLSX('AAPL', 2023, 'FY');

      expect(mockGet).toHaveBeenCalledWith('/financial-reports-xlsx', {
        symbol: 'AAPL',
        year: 2023,
        period: 'FY'
      }, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('getBalanceSheetStatementAsReported', () => {
    it('should call get with correct parameters', async () => {
      const mockData: AsReportedBalanceSheet[] = [
        {
          symbol: 'AAPL',
          fiscalYear: 2023,
          period: 'annual',
          reportedCurrency: 'USD',
          date: '2023-12-31',
          data: {
            'Cash and cash equivalents': 29965000000,
            'Short-term marketable securities': 31590000000,
            'Accounts receivable, net': 29508000000,
            'Total current assets': 143566000000
          }
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await statementsClient.getBalanceSheetStatementAsReported('AAPL', {
        limit: 5,
        period: 'annual'
      });

      expect(mockGet).toHaveBeenCalledWith('/balance-sheet-statement-as-reported', {
        symbol: 'AAPL',
        limit: 5,
        period: 'annual'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle optional parameters', async () => {
      const mockData: AsReportedBalanceSheet[] = [];
      mockGet.mockResolvedValue(mockData);

      await statementsClient.getBalanceSheetStatementAsReported('MSFT');

      expect(mockGet).toHaveBeenCalledWith('/balance-sheet-statement-as-reported', {
        symbol: 'MSFT'
      }, undefined);
    });
  });

  describe('getCashFlowStatementAsReported', () => {
    it('should call get with correct parameters', async () => {
      const mockData: AsReportedCashFlowStatement[] = [
        {
          symbol: 'AAPL',
          fiscalYear: 2023,
          period: 'annual',
          reportedCurrency: 'USD',
          date: '2023-12-31',
          data: {
            'Net income': 97829000000,
            'Cash generated by operating activities': 110563000000,
            'Free cash flow': 99604000000,
            'Cash used in investing activities': -518000000
          }
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await statementsClient.getCashFlowStatementAsReported('AAPL', {
        limit: 8,
        period: 'quarter'
      });

      expect(mockGet).toHaveBeenCalledWith('/cash-flow-statement-as-reported', {
        symbol: 'AAPL',
        limit: 8,
        period: 'quarter'
      }, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('getFinancialStatementFullAsReported', () => {
    it('should call get with correct parameters', async () => {
      const mockData: AsReportedFinancialStatement[] = [
        {
          symbol: 'AAPL',
          fiscalYear: 2023,
          period: 'annual',
          reportedCurrency: 'USD',
          date: '2023-12-31',
          data: {
            'Total net sales': 383285000000,
            'Total operating expenses': 54847000000,
            'Operating income': 114301000000,
            'Net income': 97829000000,
            'Total assets': 352755000000,
            'Total shareholders\' equity': 67441000000
          }
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await statementsClient.getFinancialStatementFullAsReported('AAPL', {
        limit: 3,
        period: 'annual'
      });

      expect(mockGet).toHaveBeenCalledWith('/financial-statement-full-as-reported', {
        symbol: 'AAPL',
        limit: 3,
        period: 'annual'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle optional parameters', async () => {
      const mockData: AsReportedFinancialStatement[] = [];
      mockGet.mockResolvedValue(mockData);

      await statementsClient.getFinancialStatementFullAsReported('NVDA');

      expect(mockGet).toHaveBeenCalledWith('/financial-statement-full-as-reported', {
        symbol: 'NVDA'
      }, undefined);
    });
  });

  describe('getIncomeStatementAsReported', () => {
    it('should call get with correct parameters', async () => {
      const mockData: AsReportedIncomeStatement[] = [
        {
          symbol: 'AAPL',
          fiscalYear: 2023,
          period: 'annual',
          reportedCurrency: 'USD',
          date: '2023-12-31',
          data: {
            'Total net sales': 383285000000,
            'Cost of sales': 214137000000,
            'Gross margin': 169148000000
          }
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await statementsClient.getIncomeStatementAsReported('AAPL', {
        limit: 10,
        period: 'annual'
      });

      expect(mockGet).toHaveBeenCalledWith('/income-statement-as-reported', {
        symbol: 'AAPL',
        limit: 10,
        period: 'annual'
      }, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('constructor', () => {
    it('should create instance with API key', () => {
      const client = new StatementsClient('my-api-key');
      expect(client).toBeInstanceOf(StatementsClient);
    });

    it('should create instance without API key', () => {
      const client = new StatementsClient();
      expect(client).toBeInstanceOf(StatementsClient);
    });
  });
}); 
