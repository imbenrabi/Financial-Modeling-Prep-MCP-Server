import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EconomicsClient } from '../../../../src/api/economics/EconomicsClient.js';
import { FMPClient } from '../../../../src/api/FMPClient.js';
import type {
  TreasuryRate,
  EconomicIndicator,
  EconomicCalendar,
  MarketRiskPremium,
} from '../../../../src/api/economics/types.js';

// Mock the FMPClient
vi.mock('../FMPClient.js');

describe('EconomicsClient', () => {
  let economicsClient: EconomicsClient;
  let mockGet: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Create mock for the get method
    mockGet = vi.fn();
    
    // Mock FMPClient prototype get method using any to bypass protected access
    (FMPClient.prototype as any).get = mockGet;
    
    // Create EconomicsClient instance
    economicsClient = new EconomicsClient('test-api-key');
  });

  describe('getTreasuryRates', () => {
    it('should call get with correct parameters for date range', async () => {
      const mockData: TreasuryRate[] = [
        {
          date: '2024-01-01',
          month1: 5.25,
          month2: 5.30,
          month3: 5.35,
          month6: 5.40,
          year1: 5.45,
          year2: 5.50,
          year3: 5.55,
          year5: 5.60,
          year7: 5.65,
          year10: 5.70,
          year20: 5.75,
          year30: 5.80
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await economicsClient.getTreasuryRates('2024-01-01', '2024-01-31');

      expect(mockGet).toHaveBeenCalledWith('/treasury-rates', {
        from: '2024-01-01',
        to: '2024-01-31'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with correct parameters without date range', async () => {
      const mockData: TreasuryRate[] = [];
      mockGet.mockResolvedValue(mockData);

      const result = await economicsClient.getTreasuryRates();

      expect(mockGet).toHaveBeenCalledWith('/treasury-rates', {
        from: undefined,
        to: undefined
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with only from date', async () => {
      const mockData: TreasuryRate[] = [];
      mockGet.mockResolvedValue(mockData);

      const result = await economicsClient.getTreasuryRates('2024-01-01');

      expect(mockGet).toHaveBeenCalledWith('/treasury-rates', {
        from: '2024-01-01',
        to: undefined
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(economicsClient.getTreasuryRates('2024-01-01', '2024-01-31'))
        .rejects.toThrow(errorMessage);
    });

    it('should pass options correctly', async () => {
      const mockData: TreasuryRate[] = [];
      mockGet.mockResolvedValue(mockData);
      const abortSignal = new AbortController().signal;
      const context = { config: { FMP_ACCESS_TOKEN: 'test-token' } };

      await economicsClient.getTreasuryRates('2024-01-01', '2024-01-31', {
        signal: abortSignal,
        context
      });

      expect(mockGet).toHaveBeenCalledWith('/treasury-rates', {
        from: '2024-01-01',
        to: '2024-01-31'
      }, {
        signal: abortSignal,
        context
      });
    });
  });

  describe('getEconomicIndicators', () => {
    it('should call get with correct parameters for indicator with date range', async () => {
      const mockData: EconomicIndicator[] = [
        {
          date: '2024-01-01',
          name: 'GDP',
          value: 25000000000
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await economicsClient.getEconomicIndicators('GDP', '2024-01-01', '2024-01-31');

      expect(mockGet).toHaveBeenCalledWith('/economic-indicator', {
        name: 'GDP',
        from: '2024-01-01',
        to: '2024-01-31'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with correct parameters for indicator without date range', async () => {
      const mockData: EconomicIndicator[] = [
        {
          date: '2024-01-01',
          name: 'CPI',
          value: 310.5
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await economicsClient.getEconomicIndicators('CPI');

      expect(mockGet).toHaveBeenCalledWith('/economic-indicator', {
        name: 'CPI',
        from: undefined,
        to: undefined
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with indicator and only from date', async () => {
      const mockData: EconomicIndicator[] = [];
      mockGet.mockResolvedValue(mockData);

      const result = await economicsClient.getEconomicIndicators('Unemployment Rate', '2024-01-01');

      expect(mockGet).toHaveBeenCalledWith('/economic-indicator', {
        name: 'Unemployment Rate',
        from: '2024-01-01',
        to: undefined
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(economicsClient.getEconomicIndicators('GDP', '2024-01-01', '2024-01-31'))
        .rejects.toThrow(errorMessage);
    });

    it('should pass options correctly', async () => {
      const mockData: EconomicIndicator[] = [];
      mockGet.mockResolvedValue(mockData);
      const abortSignal = new AbortController().signal;
      const context = { config: { FMP_ACCESS_TOKEN: 'test-token' } };

      await economicsClient.getEconomicIndicators('GDP', '2024-01-01', '2024-01-31', {
        signal: abortSignal,
        context
      });

      expect(mockGet).toHaveBeenCalledWith('/economic-indicator', {
        name: 'GDP',
        from: '2024-01-01',
        to: '2024-01-31'
      }, {
        signal: abortSignal,
        context
      });
    });
  });

  describe('getEconomicCalendar', () => {
    it('should call get with correct parameters for date range', async () => {
      const mockData: EconomicCalendar[] = [
        {
          date: '2024-01-15',
          country: 'US',
          event: 'CPI Release',
          currency: 'USD',
          previous: 3.2,
          estimate: 3.1,
          actual: 3.0,
          change: -0.1,
          impact: 'High',
          changePercentage: -3.13
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await economicsClient.getEconomicCalendar('2024-01-01', '2024-01-31');

      expect(mockGet).toHaveBeenCalledWith('/economic-calendar', {
        from: '2024-01-01',
        to: '2024-01-31'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with correct parameters without date range', async () => {
      const mockData: EconomicCalendar[] = [];
      mockGet.mockResolvedValue(mockData);

      const result = await economicsClient.getEconomicCalendar();

      expect(mockGet).toHaveBeenCalledWith('/economic-calendar', {
        from: undefined,
        to: undefined
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with only from date', async () => {
      const mockData: EconomicCalendar[] = [];
      mockGet.mockResolvedValue(mockData);

      const result = await economicsClient.getEconomicCalendar('2024-01-01');

      expect(mockGet).toHaveBeenCalledWith('/economic-calendar', {
        from: '2024-01-01',
        to: undefined
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(economicsClient.getEconomicCalendar('2024-01-01', '2024-01-31'))
        .rejects.toThrow(errorMessage);
    });

    it('should pass options correctly', async () => {
      const mockData: EconomicCalendar[] = [];
      mockGet.mockResolvedValue(mockData);
      const abortSignal = new AbortController().signal;
      const context = { config: { FMP_ACCESS_TOKEN: 'test-token' } };

      await economicsClient.getEconomicCalendar('2024-01-01', '2024-01-31', {
        signal: abortSignal,
        context
      });

      expect(mockGet).toHaveBeenCalledWith('/economic-calendar', {
        from: '2024-01-01',
        to: '2024-01-31'
      }, {
        signal: abortSignal,
        context
      });
    });
  });

  describe('getMarketRiskPremium', () => {
    it('should call get with correct parameters', async () => {
      const mockData: MarketRiskPremium[] = [
        {
          country: 'United States',
          continent: 'North America',
          countryRiskPremium: 0.0,
          totalEquityRiskPremium: 5.2
        },
        {
          country: 'Germany',
          continent: 'Europe',
          countryRiskPremium: 0.5,
          totalEquityRiskPremium: 5.7
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await economicsClient.getMarketRiskPremium();

      expect(mockGet).toHaveBeenCalledWith('/market-risk-premium', {}, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(economicsClient.getMarketRiskPremium())
        .rejects.toThrow(errorMessage);
    });

    it('should pass options correctly', async () => {
      const mockData: MarketRiskPremium[] = [];
      mockGet.mockResolvedValue(mockData);
      const abortSignal = new AbortController().signal;
      const context = { config: { FMP_ACCESS_TOKEN: 'test-token' } };

      await economicsClient.getMarketRiskPremium({
        signal: abortSignal,
        context
      });

      expect(mockGet).toHaveBeenCalledWith('/market-risk-premium', {}, {
        signal: abortSignal,
        context
      });
    });
  });

  describe('constructor', () => {
    it('should create instance with API key', () => {
      const client = new EconomicsClient('my-api-key');
      expect(client).toBeInstanceOf(EconomicsClient);
    });

    it('should create instance without API key', () => {
      const client = new EconomicsClient();
      expect(client).toBeInstanceOf(EconomicsClient);
    });
  });
}); 