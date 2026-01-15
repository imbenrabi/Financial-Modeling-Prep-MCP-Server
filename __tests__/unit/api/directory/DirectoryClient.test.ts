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

      expect(mockGet).toHaveBeenCalledWith('/stock-list', {}, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle options parameter', async () => {
      const mockData: CompanySymbol[] = [];
      mockGet.mockResolvedValue(mockData);

      const options = { signal: new AbortController().signal };
      await directoryClient.getCompanySymbols(options);

      expect(mockGet).toHaveBeenCalledWith('/stock-list', {}, options);
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

      expect(mockGet).toHaveBeenCalledWith('/financial-statement-symbol-list', {}, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle options parameter', async () => {
      const mockData: FinancialStatementSymbol[] = [];
      mockGet.mockResolvedValue(mockData);

      const options = { signal: new AbortController().signal };
      await directoryClient.getFinancialStatementSymbols(options);

      expect(mockGet).toHaveBeenCalledWith('/financial-statement-symbol-list', {}, options);
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

      expect(mockGet).toHaveBeenCalledWith('/cik-list', { limit: 500 }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle optional limit parameter', async () => {
      const mockData: CIKEntry[] = [];
      mockGet.mockResolvedValue(mockData);

      await directoryClient.getCIKList();

      expect(mockGet).toHaveBeenCalledWith('/cik-list', { limit: undefined }, undefined);
    });

    it('should handle options parameter', async () => {
      const mockData: CIKEntry[] = [];
      mockGet.mockResolvedValue(mockData);

      const options = { signal: new AbortController().signal };
      await directoryClient.getCIKList(1000, options);

      expect(mockGet).toHaveBeenCalledWith('/cik-list', { limit: 1000 }, options);
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
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle optional parameters', async () => {
      const mockData: SymbolChange[] = [];
      mockGet.mockResolvedValue(mockData);

      await directoryClient.getSymbolChanges();

      expect(mockGet).toHaveBeenCalledWith('/symbol-change', {
        invalid: undefined,
        limit: undefined
      }, undefined);
    });

    it('should handle options parameter', async () => {
      const mockData: SymbolChange[] = [];
      mockGet.mockResolvedValue(mockData);

      const options = { signal: new AbortController().signal };
      await directoryClient.getSymbolChanges(false, 25, options);

      expect(mockGet).toHaveBeenCalledWith('/symbol-change', {
        invalid: false,
        limit: 25
      }, options);
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

      expect(mockGet).toHaveBeenCalledWith('/etf-list', {}, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle options parameter', async () => {
      const mockData: ETFEntry[] = [];
      mockGet.mockResolvedValue(mockData);

      const options = { signal: new AbortController().signal };
      await directoryClient.getETFList(options);

      expect(mockGet).toHaveBeenCalledWith('/etf-list', {}, options);
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

      expect(mockGet).toHaveBeenCalledWith('/actively-trading-list', {}, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle options parameter', async () => {
      const mockData: ActivelyTradingEntry[] = [];
      mockGet.mockResolvedValue(mockData);

      const options = { signal: new AbortController().signal };
      await directoryClient.getActivelyTradingList(options);

      expect(mockGet).toHaveBeenCalledWith('/actively-trading-list', {}, options);
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

      expect(mockGet).toHaveBeenCalledWith('/earnings-transcript-list', {}, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle options parameter', async () => {
      const mockData: EarningsTranscriptEntry[] = [];
      mockGet.mockResolvedValue(mockData);

      const options = { signal: new AbortController().signal };
      await directoryClient.getEarningsTranscriptList(options);

      expect(mockGet).toHaveBeenCalledWith('/earnings-transcript-list', {}, options);
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

      expect(mockGet).toHaveBeenCalledWith('/available-exchanges', {}, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle options parameter', async () => {
      const mockData: ExchangeEntry[] = [];
      mockGet.mockResolvedValue(mockData);

      const options = { signal: new AbortController().signal };
      await directoryClient.getAvailableExchanges(options);

      expect(mockGet).toHaveBeenCalledWith('/available-exchanges', {}, options);
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

      expect(mockGet).toHaveBeenCalledWith('/available-sectors', {}, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle options parameter', async () => {
      const mockData: SectorEntry[] = [];
      mockGet.mockResolvedValue(mockData);

      const options = { signal: new AbortController().signal };
      await directoryClient.getAvailableSectors(options);

      expect(mockGet).toHaveBeenCalledWith('/available-sectors', {}, options);
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

      expect(mockGet).toHaveBeenCalledWith('/available-industries', {}, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle options parameter', async () => {
      const mockData: IndustryEntry[] = [];
      mockGet.mockResolvedValue(mockData);

      const options = { signal: new AbortController().signal };
      await directoryClient.getAvailableIndustries(options);

      expect(mockGet).toHaveBeenCalledWith('/available-industries', {}, options);
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

      expect(mockGet).toHaveBeenCalledWith('/available-countries', {}, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle options parameter', async () => {
      const mockData: CountryEntry[] = [];
      mockGet.mockResolvedValue(mockData);

      const options = { signal: new AbortController().signal };
      await directoryClient.getAvailableCountries(options);

      expect(mockGet).toHaveBeenCalledWith('/available-countries', {}, options);
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