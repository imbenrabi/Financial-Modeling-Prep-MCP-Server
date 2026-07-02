import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DirectoryClient } from '../../../../src/api/directory/DirectoryClient.js';
import { FMPClient } from '../../../../src/api/FMPClient.js';
import type {
  CompanySymbol,
  FinancialStatementSymbol,
  CIKEntry,
  SymbolChange,
  ETFEntry,
  ActivelyTradingEntry,
  EarningsTranscriptEntry,
  ExchangeEntry,
  SectorEntry,
  IndustryEntry,
  CountryEntry,
} from '../../../../src/api/directory/types.js';

// Mock the FMPClient
vi.mock('../FMPClient.js');

describe('DirectoryClient', () => {
  let directoryClient: DirectoryClient;
  let mockGet: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Create mock for the get method
    mockGet = vi.fn();
    
    // Mock FMPClient prototype get method using any to bypass protected access
    (FMPClient.prototype as any).get = mockGet;
    
    // Create DirectoryClient instance
    directoryClient = new DirectoryClient('test-api-key');
  });

  describe('getCompanySymbols', () => {
    it('should call get with correct parameters', async () => {
      const mockData: CompanySymbol[] = [
        {
          symbol: 'AAPL',
          companyName: 'Apple Inc.'
        },
        {
          symbol: 'MSFT',
          companyName: 'Microsoft Corporation'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await directoryClient.getCompanySymbols();

      expect(mockGet).toHaveBeenCalledWith('/stock-list', {});
      expect(result).toEqual(mockData);
    });
    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(directoryClient.getCompanySymbols())
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getFinancialStatementSymbols', () => {
    it('should call get with correct parameters', async () => {
      const mockData: FinancialStatementSymbol[] = [
        {
          symbol: 'AAPL',
          companyName: 'Apple Inc.',
          tradingCurrency: 'USD',
          reportingCurrency: 'USD'
        },
        {
          symbol: 'NESN',
          companyName: 'Nestle SA',
          tradingCurrency: 'CHF',
          reportingCurrency: 'CHF'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await directoryClient.getFinancialStatementSymbols();

      expect(mockGet).toHaveBeenCalledWith('/financial-statement-symbol-list', {});
      expect(result).toEqual(mockData);
    });

  });

  describe('getCIKList', () => {
    it('should call get with correct parameters with limit', async () => {
      const mockData: CIKEntry[] = [
        {
          cik: '0000320193',
          companyName: 'Apple Inc.'
        },
        {
          cik: '0000789019',
          companyName: 'Microsoft Corporation'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await directoryClient.getCIKList(500);

      expect(mockGet).toHaveBeenCalledWith('/cik-list', { limit: 500 });
      expect(result).toEqual(mockData);
    });

    it('should handle optional limit parameter', async () => {
      const mockData: CIKEntry[] = [];
      mockGet.mockResolvedValue(mockData);

      await directoryClient.getCIKList();

      expect(mockGet).toHaveBeenCalledWith('/cik-list', { limit: undefined });
    });

  });

  describe('getSymbolChanges', () => {
    it('should call get with correct parameters with all options', async () => {
      const mockData: SymbolChange[] = [
        {
          date: '2024-01-15',
          companyName: 'Example Corp',
          oldSymbol: 'EXMP',
          newSymbol: 'EXC'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await directoryClient.getSymbolChanges(true, 50);

      expect(mockGet).toHaveBeenCalledWith('/symbol-change', {
        invalid: true,
        limit: 50
      });
      expect(result).toEqual(mockData);
    });

    it('should handle optional parameters', async () => {
      const mockData: SymbolChange[] = [];
      mockGet.mockResolvedValue(mockData);

      await directoryClient.getSymbolChanges();

      expect(mockGet).toHaveBeenCalledWith('/symbol-change', {
        invalid: undefined,
        limit: undefined
      });
    });

  });

  describe('getETFList', () => {
    it('should call get with correct parameters', async () => {
      const mockData: ETFEntry[] = [
        {
          symbol: 'SPY',
          name: 'SPDR S&P 500 ETF Trust'
        },
        {
          symbol: 'QQQ',
          name: 'Invesco QQQ Trust'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await directoryClient.getETFList();

      expect(mockGet).toHaveBeenCalledWith('/etf-list', {});
      expect(result).toEqual(mockData);
    });

  });

  describe('getActivelyTradingList', () => {
    it('should call get with correct parameters', async () => {
      const mockData: ActivelyTradingEntry[] = [
        {
          symbol: 'AAPL',
          name: 'Apple Inc.'
        },
        {
          symbol: 'TSLA',
          name: 'Tesla, Inc.'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await directoryClient.getActivelyTradingList();

      expect(mockGet).toHaveBeenCalledWith('/actively-trading-list', {});
      expect(result).toEqual(mockData);
    });

  });

  describe('getEarningsTranscriptList', () => {
    it('should call get with correct parameters', async () => {
      const mockData: EarningsTranscriptEntry[] = [
        {
          symbol: 'AAPL',
          companyName: 'Apple Inc.',
          noOfTranscripts: '45'
        },
        {
          symbol: 'MSFT',
          companyName: 'Microsoft Corporation',
          noOfTranscripts: '38'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await directoryClient.getEarningsTranscriptList();

      expect(mockGet).toHaveBeenCalledWith('/earnings-transcript-list', {});
      expect(result).toEqual(mockData);
    });

  });

  describe('getAvailableExchanges', () => {
    it('should call get with correct parameters', async () => {
      const mockData: ExchangeEntry[] = [
        {
          exchange: 'NASDAQ',
          name: 'NASDAQ Global Market',
          countryName: 'United States',
          countryCode: 'US',
          symbolSuffix: '',
          delay: '0'
        },
        {
          exchange: 'NYSE',
          name: 'New York Stock Exchange',
          countryName: 'United States',
          countryCode: 'US',
          symbolSuffix: '',
          delay: '0'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await directoryClient.getAvailableExchanges();

      expect(mockGet).toHaveBeenCalledWith('/available-exchanges', {});
      expect(result).toEqual(mockData);
    });

  });

  describe('getAvailableSectors', () => {
    it('should call get with correct parameters', async () => {
      const mockData: SectorEntry[] = [
        {
          sector: 'Technology'
        },
        {
          sector: 'Healthcare'
        },
        {
          sector: 'Financial Services'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await directoryClient.getAvailableSectors();

      expect(mockGet).toHaveBeenCalledWith('/available-sectors', {});
      expect(result).toEqual(mockData);
    });

  });

  describe('getAvailableIndustries', () => {
    it('should call get with correct parameters', async () => {
      const mockData: IndustryEntry[] = [
        {
          industry: 'Consumer Electronics'
        },
        {
          industry: 'Software—Infrastructure'
        },
        {
          industry: 'Biotechnology'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await directoryClient.getAvailableIndustries();

      expect(mockGet).toHaveBeenCalledWith('/available-industries', {});
      expect(result).toEqual(mockData);
    });

  });

  describe('getAvailableCountries', () => {
    it('should call get with correct parameters', async () => {
      const mockData: CountryEntry[] = [
        {
          country: 'United States'
        },
        {
          country: 'Canada'
        },
        {
          country: 'United Kingdom'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await directoryClient.getAvailableCountries();

      expect(mockGet).toHaveBeenCalledWith('/available-countries', {});
      expect(result).toEqual(mockData);
    });

  });

  describe('constructor', () => {
    it('should create instance with API key', () => {
      const client = new DirectoryClient('my-api-key');
      expect(client).toBeInstanceOf(DirectoryClient);
    });

    it('should create instance without API key', () => {
      const client = new DirectoryClient();
      expect(client).toBeInstanceOf(DirectoryClient);
    });
  });
}); 