import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SearchClient } from '../../../../src/api/search/SearchClient.js';
import { FMPClient } from '../../../../src/api/FMPClient.js';
import type {
  SymbolSearchResult,
  NameSearchResult,
  CIKSearchResult,
  CUSIPSearchResult,
  ISINSearchResult,
  StockScreenerResult,
  ExchangeVariantResult,
} from '../../../../src/api/search/types.js';

// Mock the FMPClient
vi.mock('../FMPClient.js');

describe('SearchClient', () => {
  let searchClient: SearchClient;
  let mockGet: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Create mock for the get method
    mockGet = vi.fn();
    
    // Mock FMPClient prototype get method using any to bypass protected access
    (FMPClient.prototype as any).get = mockGet;
    
    // Create SearchClient instance
    searchClient = new SearchClient('test-api-key');
  });

  describe('searchSymbol', () => {
    it('should call get with correct parameters with all options', async () => {
      const mockData: SymbolSearchResult[] = [
        {
          symbol: 'AAPL',
          name: 'Apple Inc.',
          currency: 'USD',
          exchangeFullName: 'NASDAQ Global Select',
          exchange: 'NASDAQ'
        },
        {
          symbol: 'MSFT',
          name: 'Microsoft Corporation',
          currency: 'USD',
          exchangeFullName: 'NASDAQ Global Select',
          exchange: 'NASDAQ'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await searchClient.searchSymbol('Apple', 10, 'NASDAQ');

      expect(mockGet).toHaveBeenCalledWith('/search-symbol', {
        query: 'Apple',
        limit: 10,
        exchange: 'NASDAQ'
      }, { context: undefined });
      expect(result).toEqual(mockData);
    });

    it('should call get with correct parameters without optional params', async () => {
      const mockData: SymbolSearchResult[] = [];
      mockGet.mockResolvedValue(mockData);

      const result = await searchClient.searchSymbol('Tesla');

      expect(mockGet).toHaveBeenCalledWith('/search-symbol', {
        query: 'Tesla',
        limit: undefined,
        exchange: undefined
      }, { context: undefined });
      expect(result).toEqual(mockData);
    });

    it('should handle context parameter', async () => {
      const mockData: SymbolSearchResult[] = [];
      mockGet.mockResolvedValue(mockData);
      const context = { config: { FMP_ACCESS_TOKEN: 'custom-token' } };

      await searchClient.searchSymbol('Google', 5, 'NYSE', context);

      expect(mockGet).toHaveBeenCalledWith('/search-symbol', {
        query: 'Google',
        limit: 5,
        exchange: 'NYSE'
      }, { context });
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(searchClient.searchSymbol('INVALID'))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('searchName', () => {
    it('should call get with correct parameters with all options', async () => {
      const mockData: NameSearchResult[] = [
        {
          symbol: 'AAPL',
          name: 'Apple Inc.',
          currency: 'USD',
          exchangeFullName: 'NASDAQ Global Select',
          exchange: 'NASDAQ'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await searchClient.searchName('Apple Inc', 5, 'NASDAQ');

      expect(mockGet).toHaveBeenCalledWith('/search-name', {
        query: 'Apple Inc',
        limit: 5,
        exchange: 'NASDAQ'
      }, { context: undefined });
      expect(result).toEqual(mockData);
    });

    it('should handle optional parameters', async () => {
      const mockData: NameSearchResult[] = [];
      mockGet.mockResolvedValue(mockData);

      await searchClient.searchName('Microsoft');

      expect(mockGet).toHaveBeenCalledWith('/search-name', {
        query: 'Microsoft',
        limit: undefined,
        exchange: undefined
      }, { context: undefined });
    });

    it('should handle context parameter', async () => {
      const mockData: NameSearchResult[] = [];
      mockGet.mockResolvedValue(mockData);
      const context = { config: { FMP_ACCESS_TOKEN: 'name-token' } };

      await searchClient.searchName('Tesla', 10, 'NYSE', context);

      expect(mockGet).toHaveBeenCalledWith('/search-name', {
        query: 'Tesla',
        limit: 10,
        exchange: 'NYSE'
      }, { context });
    });
  });

  describe('searchCIK', () => {
    it('should call get with correct parameters with all options', async () => {
      const mockData: CIKSearchResult[] = [
        {
          symbol: 'AAPL',
          companyName: 'Apple Inc.',
          cik: '0000320193',
          exchangeFullName: 'NASDAQ Global Select',
          exchange: 'NASDAQ',
          currency: 'USD'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await searchClient.searchCIK('0000320193', 10);

      expect(mockGet).toHaveBeenCalledWith('/search-cik', {
        cik: '0000320193',
        limit: 10
      }, { context: undefined });
      expect(result).toEqual(mockData);
    });

    it('should handle optional limit parameter', async () => {
      const mockData: CIKSearchResult[] = [];
      mockGet.mockResolvedValue(mockData);

      await searchClient.searchCIK('0000789019');

      expect(mockGet).toHaveBeenCalledWith('/search-cik', {
        cik: '0000789019',
        limit: undefined
      }, { context: undefined });
    });

    it('should handle context parameter', async () => {
      const mockData: CIKSearchResult[] = [];
      mockGet.mockResolvedValue(mockData);
      const context = { config: { FMP_ACCESS_TOKEN: 'cik-token' } };

      await searchClient.searchCIK('0000051143', 5, context);

      expect(mockGet).toHaveBeenCalledWith('/search-cik', {
        cik: '0000051143',
        limit: 5
      }, { context });
    });
  });

  describe('searchCUSIP', () => {
    it('should call get with correct parameters', async () => {
      const mockData: CUSIPSearchResult[] = [
        {
          symbol: 'AAPL',
          companyName: 'Apple Inc.',
          cusip: '037833100',
          marketCap: 3000000000000
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await searchClient.searchCUSIP('037833100');

      expect(mockGet).toHaveBeenCalledWith('/search-cusip', {
        cusip: '037833100'
      }, { context: undefined });
      expect(result).toEqual(mockData);
    });

    it('should handle context parameter', async () => {
      const mockData: CUSIPSearchResult[] = [];
      mockGet.mockResolvedValue(mockData);
      const context = { config: { FMP_ACCESS_TOKEN: 'cusip-token' } };

      await searchClient.searchCUSIP('594918104', context);

      expect(mockGet).toHaveBeenCalledWith('/search-cusip', {
        cusip: '594918104'
      }, { context });
    });
  });

  describe('searchISIN', () => {
    it('should call get with correct parameters', async () => {
      const mockData: ISINSearchResult[] = [
        {
          symbol: 'AAPL',
          name: 'Apple Inc.',
          isin: 'US0378331005',
          marketCap: 3000000000000
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await searchClient.searchISIN('US0378331005');

      expect(mockGet).toHaveBeenCalledWith('/search-isin', {
        isin: 'US0378331005'
      }, { context: undefined });
      expect(result).toEqual(mockData);
    });

    it('should handle context parameter', async () => {
      const mockData: ISINSearchResult[] = [];
      mockGet.mockResolvedValue(mockData);
      const context = { config: { FMP_ACCESS_TOKEN: 'isin-token' } };

      await searchClient.searchISIN('US5949181045', context);

      expect(mockGet).toHaveBeenCalledWith('/search-isin', {
        isin: 'US5949181045'
      }, { context });
    });
  });

  describe('stockScreener', () => {
    it('should call get with correct parameters with all screening criteria', async () => {
      const mockData: StockScreenerResult[] = [
        {
          symbol: 'AAPL',
          companyName: 'Apple Inc.',
          marketCap: 3000000000000,
          sector: 'Technology',
          industry: 'Consumer Electronics',
          beta: 1.2,
          price: 175.50,
          lastAnnualDividend: 0.92,
          volume: 85000000,
          exchange: 'NASDAQ',
          exchangeShortName: 'NASDAQ',
          country: 'US',
          isEtf: false,
          isFund: false,
          isActivelyTrading: true
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const params = {
        marketCapMoreThan: 1000000000,
        marketCapLowerThan: 5000000000000,
        sector: 'Technology',
        industry: 'Consumer Electronics',
        betaMoreThan: 0.5,
        betaLowerThan: 2.0,
        priceMoreThan: 100,
        priceLowerThan: 200,
        dividendMoreThan: 0.5,
        dividendLowerThan: 2.0,
        volumeMoreThan: 50000000,
        volumeLowerThan: 100000000,
        exchange: 'NASDAQ',
        country: 'US',
        isEtf: false,
        isFund: false,
        isActivelyTrading: true,
        limit: 50,
        includeAllShareClasses: false
      };

      const result = await searchClient.stockScreener(params);

      expect(mockGet).toHaveBeenCalledWith('/company-screener', params, {
        context: undefined
      });
      expect(result).toEqual(mockData);
    });

    it('should handle minimal parameters', async () => {
      const mockData: StockScreenerResult[] = [];
      mockGet.mockResolvedValue(mockData);

      await searchClient.stockScreener({ sector: 'Technology' });

      expect(mockGet).toHaveBeenCalledWith('/company-screener', {
        sector: 'Technology'
      }, { context: undefined });
    });

    it('should handle context parameter', async () => {
      const mockData: StockScreenerResult[] = [];
      mockGet.mockResolvedValue(mockData);
      const context = { config: { FMP_ACCESS_TOKEN: 'screener-token' } };

      await searchClient.stockScreener({ marketCapMoreThan: 1000000000 }, context);

      expect(mockGet).toHaveBeenCalledWith('/company-screener', {
        marketCapMoreThan: 1000000000
      }, { context });
    });

    it('should handle empty parameters object', async () => {
      const mockData: StockScreenerResult[] = [];
      mockGet.mockResolvedValue(mockData);

      await searchClient.stockScreener({});

      expect(mockGet).toHaveBeenCalledWith('/company-screener', {}, {
        context: undefined
      });
    });
  });

  describe('searchExchangeVariants', () => {
    it('should call get with correct parameters', async () => {
      const mockData: ExchangeVariantResult[] = [
        {
          symbol: 'AAPL',
          price: 175.50,
          beta: 1.2,
          volAvg: 85000000,
          mktCap: 3000000000000,
          lastDiv: 0.92,
          range: '124.17-198.23',
          changes: 2.50,
          companyName: 'Apple Inc.',
          currency: 'USD',
          cik: '0000320193',
          isin: 'US0378331005',
          cusip: '037833100',
          exchange: 'NASDAQ',
          exchangeShortName: 'NASDAQ',
          industry: 'Consumer Electronics',
          website: 'https://www.apple.com',
          description: 'Apple Inc. designs, manufactures, and markets smartphones...',
          ceo: 'Timothy Cook',
          sector: 'Technology',
          country: 'US',
          fullTimeEmployees: '164000',
          phone: '408 996 1010',
          address: 'One Apple Park Way',
          city: 'Cupertino',
          state: 'CA',
          zip: '95014',
          dcfDiff: 15.25,
          dcf: 190.75,
          image: 'https://financialmodelingprep.com/image-stock/AAPL.png',
          ipoDate: '1980-12-12',
          defaultImage: false,
          isEtf: false,
          isActivelyTrading: true,
          isAdr: false,
          isFund: false
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await searchClient.searchExchangeVariants('AAPL');

      expect(mockGet).toHaveBeenCalledWith('/search-exchange-variants', {
        symbol: 'AAPL'
      }, { context: undefined });
      expect(result).toEqual(mockData);
    });

    it('should handle context parameter', async () => {
      const mockData: ExchangeVariantResult[] = [];
      mockGet.mockResolvedValue(mockData);
      const context = { config: { FMP_ACCESS_TOKEN: 'variant-token' } };

      await searchClient.searchExchangeVariants('MSFT', context);

      expect(mockGet).toHaveBeenCalledWith('/search-exchange-variants', {
        symbol: 'MSFT'
      }, { context });
    });

    it('should handle API errors', async () => {
      const errorMessage = 'Symbol not found';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(searchClient.searchExchangeVariants('INVALID'))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('constructor', () => {
    it('should create instance with API key', () => {
      const client = new SearchClient('my-api-key');
      expect(client).toBeInstanceOf(SearchClient);
    });

    it('should create instance without API key', () => {
      const client = new SearchClient();
      expect(client).toBeInstanceOf(SearchClient);
    });
  });
}); 
