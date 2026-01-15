import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FundClient } from '../../../../src/api/fund/FundClient.js';
import { FMPClient } from '../../../../src/api/FMPClient.js';
import type {
  FundHolding,
  FundInfo,
  FundCountryAllocation,
  FundAssetExposure,
  FundSectorWeighting,
  FundDisclosure,
  FundDisclosureSearch,
  FundDisclosureDate,
  FundDisclosureHolder,
} from '../../../../src/api/fund/types.js';

// Mock the FMPClient
vi.mock('../FMPClient.js');

describe('FundClient', () => {
  let fundClient: FundClient;
  let mockGet: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Create mock for the get method
    mockGet = vi.fn();
    
    // Mock FMPClient prototype get method using any to bypass protected access
    (FMPClient.prototype as any).get = mockGet;
    
    // Create FundClient instance
    fundClient = new FundClient('test-api-key');
  });

  describe('getHoldings', () => {
    it('should call get with correct parameters', async () => {
      const mockData: FundHolding[] = [
        {
          symbol: 'SPY',
          asset: 'AAPL',
          name: 'Apple Inc.',
          isin: 'US0378331005',
          securityCusip: '037833100',
          sharesNumber: 178800000,
          weightPercentage: 7.2,
          marketValue: 31500000000,
          updatedAt: '2024-01-15T10:00:00Z',
          updated: '2024-01-15'
        },
        {
          symbol: 'SPY',
          asset: 'MSFT',
          name: 'Microsoft Corporation',
          isin: 'US5949181045',
          securityCusip: '594918104',
          sharesNumber: 85600000,
          weightPercentage: 6.8,
          marketValue: 29800000000,
          updatedAt: '2024-01-15T10:00:00Z',
          updated: '2024-01-15'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await fundClient.getHoldings('SPY');

      expect(mockGet).toHaveBeenCalledWith('/etf/holdings', { symbol: 'SPY' }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle options parameter', async () => {
      const mockData: FundHolding[] = [];
      mockGet.mockResolvedValue(mockData);

      const options = { 
        signal: new AbortController().signal,
        context: { config: { FMP_ACCESS_TOKEN: 'test-token' } }
      };

      await fundClient.getHoldings('VTI', options);

      expect(mockGet).toHaveBeenCalledWith('/etf/holdings', { symbol: 'VTI' }, options);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(fundClient.getHoldings('SPY'))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getInfo', () => {
    it('should call get with correct parameters', async () => {
      const mockData: FundInfo = {
        symbol: 'SPY',
        name: 'SPDR S&P 500 ETF Trust',
        description: 'The SPDR S&P 500 ETF Trust seeks to provide investment results that correspond to the price and yield performance of the S&P 500® Index.',
        isin: 'US78462F1030',
        assetClass: 'Equity',
        securityCusip: '78462F103',
        domicile: 'US',
        website: 'https://www.ssga.com/us/en/individual/etfs/funds/spdr-sp-500-etf-trust-spy',
        etfCompany: 'State Street Global Advisors',
        expenseRatio: 0.0945,
        assetsUnderManagement: 420000000000,
        avgVolume: 75000000,
        inceptionDate: '1993-01-22',
        nav: 442.50,
        navCurrency: 'USD',
        holdingsCount: 503,
        updatedAt: '2024-01-15T16:00:00Z',
        sectorsList: [
          { industry: 'Technology', exposure: 28.5 },
          { industry: 'Healthcare', exposure: 12.8 },
          { industry: 'Financial Services', exposure: 11.2 }
        ]
      };
      mockGet.mockResolvedValue(mockData);

      const result = await fundClient.getInfo('SPY');

      expect(mockGet).toHaveBeenCalledWith('/etf/info', { symbol: 'SPY' }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle options parameter', async () => {
      const mockData: FundInfo = {} as FundInfo;
      mockGet.mockResolvedValue(mockData);

      const options = { 
        signal: new AbortController().signal,
        context: { config: { FMP_ACCESS_TOKEN: 'test-token' } }
      };

      await fundClient.getInfo('VTI', options);

      expect(mockGet).toHaveBeenCalledWith('/etf/info', { symbol: 'VTI' }, options);
    });
  });

  describe('getCountryAllocation', () => {
    it('should call get with correct parameters', async () => {
      const mockData: FundCountryAllocation[] = [
        { country: 'United States', weightPercentage: '89.5' },
        { country: 'Canada', weightPercentage: '3.2' },
        { country: 'United Kingdom', weightPercentage: '2.8' },
        { country: 'Germany', weightPercentage: '1.9' },
        { country: 'Switzerland', weightPercentage: '1.4' }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await fundClient.getCountryAllocation('VEA');

      expect(mockGet).toHaveBeenCalledWith('/etf/country-weightings', { symbol: 'VEA' }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle options parameter', async () => {
      const mockData: FundCountryAllocation[] = [];
      mockGet.mockResolvedValue(mockData);

      const options = { 
        signal: new AbortController().signal,
        context: { config: { FMP_ACCESS_TOKEN: 'test-token' } }
      };

      await fundClient.getCountryAllocation('VEA', options);

      expect(mockGet).toHaveBeenCalledWith('/etf/country-weightings', { symbol: 'VEA' }, options);
    });
  });

  describe('getAssetExposure', () => {
    it('should call get with correct parameters', async () => {
      const mockData: FundAssetExposure[] = [
        {
          symbol: 'QQQ',
          asset: 'AAPL',
          sharesNumber: 45600000,
          weightPercentage: 12.5,
          marketValue: 8900000000
        },
        {
          symbol: 'QQQ',
          asset: 'MSFT',
          sharesNumber: 29800000,
          weightPercentage: 11.8,
          marketValue: 8400000000
        },
        {
          symbol: 'QQQ',
          asset: 'GOOGL',
          sharesNumber: 15200000,
          weightPercentage: 4.2,
          marketValue: 3000000000
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await fundClient.getAssetExposure('QQQ');

      expect(mockGet).toHaveBeenCalledWith('/etf/asset-exposure', { symbol: 'QQQ' }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle options parameter', async () => {
      const mockData: FundAssetExposure[] = [];
      mockGet.mockResolvedValue(mockData);

      const options = { 
        signal: new AbortController().signal,
        context: { config: { FMP_ACCESS_TOKEN: 'test-token' } }
      };

      await fundClient.getAssetExposure('QQQ', options);

      expect(mockGet).toHaveBeenCalledWith('/etf/asset-exposure', { symbol: 'QQQ' }, options);
    });
  });

  describe('getSectorWeighting', () => {
    it('should call get with correct parameters', async () => {
      const mockData: FundSectorWeighting[] = [
        { symbol: 'XLK', sector: 'Information Technology', weightPercentage: 25.8 },
        { symbol: 'XLK', sector: 'Software', weightPercentage: 22.4 },
        { symbol: 'XLK', sector: 'Semiconductors', weightPercentage: 18.9 },
        { symbol: 'XLK', sector: 'Hardware', weightPercentage: 15.2 },
        { symbol: 'XLK', sector: 'Communications Equipment', weightPercentage: 12.1 }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await fundClient.getSectorWeighting('XLK');

      expect(mockGet).toHaveBeenCalledWith('/etf/sector-weightings', { symbol: 'XLK' }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle options parameter', async () => {
      const mockData: FundSectorWeighting[] = [];
      mockGet.mockResolvedValue(mockData);

      const options = { 
        signal: new AbortController().signal,
        context: { config: { FMP_ACCESS_TOKEN: 'test-token' } }
      };

      await fundClient.getSectorWeighting('XLK', options);

      expect(mockGet).toHaveBeenCalledWith('/etf/sector-weightings', { symbol: 'XLK' }, options);
    });
  });

  describe('getDisclosure', () => {
    it('should call get with correct parameters', async () => {
      const mockData: FundDisclosureHolder[] = [
        {
          cik: '0001100663',
          holder: 'Vanguard Group Inc',
          shares: 425600000,
          dateReported: '2024-01-31',
          change: 12500000,
          weightPercent: 8.5
        },
        {
          cik: '0000950123',
          holder: 'BlackRock Inc',
          shares: 385200000,
          dateReported: '2024-01-31',
          change: -5800000,
          weightPercent: 7.7
        },
        {
          cik: '0000315066',
          holder: 'State Street Corp',
          shares: 298400000,
          dateReported: '2024-01-31',
          change: 8900000,
          weightPercent: 6.0
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await fundClient.getDisclosure('SPY');

      expect(mockGet).toHaveBeenCalledWith('/funds/disclosure-holders-latest', { symbol: 'SPY' }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle options parameter', async () => {
      const mockData: FundDisclosureHolder[] = [];
      mockGet.mockResolvedValue(mockData);

      const options = { 
        signal: new AbortController().signal,
        context: { config: { FMP_ACCESS_TOKEN: 'test-token' } }
      };

      await fundClient.getDisclosure('SPY', options);

      expect(mockGet).toHaveBeenCalledWith('/funds/disclosure-holders-latest', { symbol: 'SPY' }, options);
    });
  });

  describe('searchDisclosures', () => {
    it('should call get with correct parameters', async () => {
      const mockData: FundDisclosureSearch[] = [
        {
          symbol: 'FXAIX',
          cik: '0000315066',
          classId: 'C000127994',
          seriesId: 'S000016033',
          entityName: 'Fidelity 500 Index Fund',
          entityOrgType: 'Investment Company',
          seriesName: 'Fidelity 500 Index Fund',
          className: 'Fidelity 500 Index Fund',
          reportingFileNumber: '033-39918',
          address: '245 Summer Street',
          city: 'Boston',
          zipCode: '02210',
          state: 'MA'
        },
        {
          symbol: 'VFIAX',
          cik: '0001100663',
          classId: 'C000027791',
          seriesId: 'S000002635',
          entityName: 'Vanguard 500 Index Fund Admiral Shares',
          entityOrgType: 'Investment Company',
          seriesName: 'Vanguard 500 Index Fund',
          className: 'Admiral Shares',
          reportingFileNumber: '811-05497',
          address: '100 Vanguard Blvd',
          city: 'Malvern',
          zipCode: '19355',
          state: 'PA'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await fundClient.searchDisclosures('Vanguard');

      expect(mockGet).toHaveBeenCalledWith('/funds/disclosure-holders-search', { name: 'Vanguard' }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle options parameter', async () => {
      const mockData: FundDisclosureSearch[] = [];
      mockGet.mockResolvedValue(mockData);

      const options = { 
        signal: new AbortController().signal,
        context: { config: { FMP_ACCESS_TOKEN: 'test-token' } }
      };

      await fundClient.searchDisclosures('Fidelity', options);

      expect(mockGet).toHaveBeenCalledWith('/funds/disclosure-holders-search', { name: 'Fidelity' }, options);
    });
  });

  describe('getDisclosureDates', () => {
    it('should call get with correct parameters without CIK', async () => {
      const mockData: FundDisclosureDate[] = [
        { date: '2024-01-31', year: 2024, quarter: 1 },
        { date: '2023-10-31', year: 2023, quarter: 4 },
        { date: '2023-07-31', year: 2023, quarter: 3 },
        { date: '2023-04-30', year: 2023, quarter: 2 }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await fundClient.getDisclosureDates('SPY');

      expect(mockGet).toHaveBeenCalledWith('/funds/disclosure-dates', { symbol: 'SPY', cik: undefined }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with correct parameters with CIK', async () => {
      const mockData: FundDisclosureDate[] = [
        { date: '2024-01-31', year: 2024, quarter: 1 },
        { date: '2023-10-31', year: 2023, quarter: 4 }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await fundClient.getDisclosureDates('SPY', '0000315066');

      expect(mockGet).toHaveBeenCalledWith('/funds/disclosure-dates', { symbol: 'SPY', cik: '0000315066' }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle options parameter', async () => {
      const mockData: FundDisclosureDate[] = [];
      mockGet.mockResolvedValue(mockData);

      const options = { 
        signal: new AbortController().signal,
        context: { config: { FMP_ACCESS_TOKEN: 'test-token' } }
      };

      await fundClient.getDisclosureDates('SPY', '0000315066', options);

      expect(mockGet).toHaveBeenCalledWith('/funds/disclosure-dates', { symbol: 'SPY', cik: '0000315066' }, options);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(fundClient.getDisclosureDates('SPY'))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getFundDisclosure', () => {
    it('should call get with correct parameters', async () => {
      const mockData: FundDisclosure[] = [
        {
          cik: '0001100663',
          date: '2024-01-31',
          acceptedDate: '2024-02-01',
          symbol: 'SPY',
          name: 'SPDR S&P 500 ETF Trust',
          lei: '549300XRAQ1TX5Z7MM70',
          title: 'SPDR S&P 500 ETF Trust',
          cusip: '78462F103',
          isin: 'US78462F1030',
          balance: 425600000,
          units: 'NS',
          cur_cd: 'USD',
          valUsd: 31500000000,
          pctVal: 8.5,
          payoffProfile: 'Long',
          assetCat: 'EC',
          issuerCat: 'CORP',
          invCountry: 'US',
          isRestrictedSec: 'N',
          fairValLevel: '1',
          isCashCollateral: 'N',
          isNonCashCollateral: 'N',
          isLoanByFund: 'N'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await fundClient.getFundDisclosure('SPY', 2024, 1);

      expect(mockGet).toHaveBeenCalledWith('/funds/disclosure', { symbol: 'SPY', year: 2024, quarter: 1, cik: undefined }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with correct parameters including CIK', async () => {
      const mockData: FundDisclosure[] = [];
      mockGet.mockResolvedValue(mockData);

      const result = await fundClient.getFundDisclosure('SPY', 2024, 1, '0000315066');

      expect(mockGet).toHaveBeenCalledWith('/funds/disclosure', { symbol: 'SPY', year: 2024, quarter: 1, cik: '0000315066' }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle options parameter', async () => {
      const mockData: FundDisclosure[] = [];
      mockGet.mockResolvedValue(mockData);

      const options = { 
        signal: new AbortController().signal,
        context: { config: { FMP_ACCESS_TOKEN: 'test-token' } }
      };

      await fundClient.getFundDisclosure('SPY', 2024, 1, '0000315066', options);

      expect(mockGet).toHaveBeenCalledWith('/funds/disclosure', { symbol: 'SPY', year: 2024, quarter: 1, cik: '0000315066' }, options);
    });
  });

  describe('constructor', () => {
    it('should create instance with API key', () => {
      const client = new FundClient('my-api-key');
      expect(client).toBeInstanceOf(FundClient);
    });

    it('should create instance without API key', () => {
      const client = new FundClient();
      expect(client).toBeInstanceOf(FundClient);
    });
  });
}); 