import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CompanyClient } from '../../../../src/api/company/CompanyClient.js';
import { FMPClient } from '../../../../src/api/FMPClient.js';
import type {
  CompanyProfile,
  CompanyNote,
  StockPeer,
  DelistedCompany,
  EmployeeCount,
  MarketCap,
  ShareFloat,
  MergerAcquisition,
  CompanyExecutive,
  ExecutiveCompensation,
  ExecutiveCompensationBenchmark,
} from '../../../../src/api/company/types.js';

// Mock the FMPClient
vi.mock('../FMPClient.js');

describe('CompanyClient', () => {
  let companyClient: CompanyClient;
  let mockGet: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Create mock for the get method
    mockGet = vi.fn();
    
    // Mock FMPClient prototype get method using any to bypass protected access
    (FMPClient.prototype as any).get = mockGet;
    
    // Create CompanyClient instance
    companyClient = new CompanyClient('test-api-key');
  });

  describe('getProfile', () => {
    it('should call get with correct parameters', async () => {
      const mockData: CompanyProfile[] = [
        {
          symbol: 'AAPL',
          price: 150.25,
          marketCap: 2500000000000,
          beta: 1.2,
          lastDividend: 0.24,
          range: '120.00-180.00',
          change: 2.5,
          changePercentage: 1.67,
          volume: 75000000,
          averageVolume: 80000000,
          companyName: 'Apple Inc.',
          currency: 'USD',
          cik: '0000320193',
          isin: 'US0378331005',
          cusip: '037833100',
          exchangeFullName: 'NASDAQ Global Select',
          exchange: 'NASDAQ',
          industry: 'Consumer Electronics',
          website: 'https://www.apple.com',
          description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.',
          ceo: 'Timothy Donald Cook',
          sector: 'Technology',
          country: 'US',
          fullTimeEmployees: '164000',
          phone: '14089961010',
          address: 'One Apple Park Way',
          city: 'Cupertino',
          state: 'CA',
          zip: '95014',
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

      const result = await companyClient.getProfile('AAPL');

      expect(mockGet).toHaveBeenCalledWith('/profile', { symbol: 'AAPL' }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle options parameter', async () => {
      const mockData: CompanyProfile[] = [];
      mockGet.mockResolvedValue(mockData);

      const options = { signal: new AbortController().signal };
      await companyClient.getProfile('AAPL', options);

      expect(mockGet).toHaveBeenCalledWith('/profile', { symbol: 'AAPL' }, options);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(companyClient.getProfile('AAPL'))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getProfileByCIK', () => {
    it('should call get with correct parameters', async () => {
      const mockData: CompanyProfile[] = [
        {
          symbol: 'AAPL',
          price: 150.25,
          marketCap: 2500000000000,
          beta: 1.2,
          lastDividend: 0.24,
          range: '120.00-180.00',
          change: 2.5,
          changePercentage: 1.67,
          volume: 75000000,
          averageVolume: 80000000,
          companyName: 'Apple Inc.',
          currency: 'USD',
          cik: '0000320193',
          isin: 'US0378331005',
          cusip: '037833100',
          exchangeFullName: 'NASDAQ Global Select',
          exchange: 'NASDAQ',
          industry: 'Consumer Electronics',
          website: 'https://www.apple.com',
          description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.',
          ceo: 'Timothy Donald Cook',
          sector: 'Technology',
          country: 'US',
          fullTimeEmployees: '164000',
          phone: '14089961010',
          address: 'One Apple Park Way',
          city: 'Cupertino',
          state: 'CA',
          zip: '95014',
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

      const result = await companyClient.getProfileByCIK('0000320193');

      expect(mockGet).toHaveBeenCalledWith('/profile-cik', { cik: '0000320193' }, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('getNotes', () => {
    it('should call get with correct parameters', async () => {
      const mockData: CompanyNote[] = [
        {
          cik: '0000320193',
          symbol: 'AAPL',
          title: 'Apple Inc. - Annual Report',
          exchange: 'NASDAQ'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await companyClient.getNotes('AAPL');

      expect(mockGet).toHaveBeenCalledWith('/company-notes', { symbol: 'AAPL' }, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('getPeers', () => {
    it('should call get with correct parameters', async () => {
      const mockData: StockPeer[] = [
        {
          symbol: 'MSFT',
          companyName: 'Microsoft Corporation',
          price: 280.50,
          mktCap: 2100000000000
        },
        {
          symbol: 'GOOGL',
          companyName: 'Alphabet Inc.',
          price: 2500.75,
          mktCap: 1650000000000
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await companyClient.getPeers('AAPL');

      expect(mockGet).toHaveBeenCalledWith('/stock-peers', { symbol: 'AAPL' }, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('getDelistedCompanies', () => {
    it('should call get with correct parameters with all options', async () => {
      const mockData: DelistedCompany[] = [
        {
          symbol: 'ENRN',
          companyName: 'Enron Corporation',
          exchange: 'NYSE',
          ipoDate: '1986-07-10',
          delistedDate: '2001-11-28'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await companyClient.getDelistedCompanies(0, 50);

      expect(mockGet).toHaveBeenCalledWith('/delisted-companies', { page: 0, limit: 50 }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle optional parameters', async () => {
      const mockData: DelistedCompany[] = [];
      mockGet.mockResolvedValue(mockData);

      await companyClient.getDelistedCompanies();

      expect(mockGet).toHaveBeenCalledWith('/delisted-companies', { page: undefined, limit: undefined }, undefined);
    });
  });

  describe('getEmployeeCount', () => {
    it('should call get with correct parameters', async () => {
      const mockData: EmployeeCount[] = [
        {
          symbol: 'AAPL',
          cik: '0000320193',
          acceptanceTime: '2024-01-01T10:00:00Z',
          periodOfReport: '2023-12-31',
          companyName: 'Apple Inc.',
          formType: '10-K',
          filingDate: '2024-01-15',
          employeeCount: 164000,
          source: 'SEC'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await companyClient.getEmployeeCount('AAPL', 100);

      expect(mockGet).toHaveBeenCalledWith('/employee-count', { symbol: 'AAPL', limit: 100 }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle optional limit parameter', async () => {
      const mockData: EmployeeCount[] = [];
      mockGet.mockResolvedValue(mockData);

      await companyClient.getEmployeeCount('AAPL');

      expect(mockGet).toHaveBeenCalledWith('/employee-count', { symbol: 'AAPL', limit: undefined }, undefined);
    });
  });

  describe('getHistoricalEmployeeCount', () => {
    it('should call get with correct parameters', async () => {
      const mockData: EmployeeCount[] = [
        {
          symbol: 'AAPL',
          cik: '0000320193',
          acceptanceTime: '2023-01-01T10:00:00Z',
          periodOfReport: '2022-12-31',
          companyName: 'Apple Inc.',
          formType: '10-K',
          filingDate: '2023-01-15',
          employeeCount: 154000,
          source: 'SEC'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await companyClient.getHistoricalEmployeeCount('AAPL', 50);

      expect(mockGet).toHaveBeenCalledWith('/historical-employee-count', { symbol: 'AAPL', limit: 50 }, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('getMarketCap', () => {
    it('should call get with correct parameters', async () => {
      const mockData: MarketCap[] = [
        {
          symbol: 'AAPL',
          date: '2024-01-01',
          marketCap: 2500000000000
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await companyClient.getMarketCap('AAPL');

      expect(mockGet).toHaveBeenCalledWith('/market-capitalization', { symbol: 'AAPL' }, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('getBatchMarketCap', () => {
    it('should call get with correct parameters', async () => {
      const mockData: MarketCap[] = [
        {
          symbol: 'AAPL',
          date: '2024-01-01',
          marketCap: 2500000000000
        },
        {
          symbol: 'MSFT',
          date: '2024-01-01',
          marketCap: 2100000000000
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await companyClient.getBatchMarketCap('AAPL,MSFT');

      expect(mockGet).toHaveBeenCalledWith('/market-capitalization-batch', { symbols: 'AAPL,MSFT' }, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('getHistoricalMarketCap', () => {
    it('should call get with correct parameters with all options', async () => {
      const mockData: MarketCap[] = [
        {
          symbol: 'AAPL',
          date: '2024-01-01',
          marketCap: 2500000000000
        },
        {
          symbol: 'AAPL',
          date: '2023-12-31',
          marketCap: 2450000000000
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await companyClient.getHistoricalMarketCap('AAPL', 100, '2023-01-01', '2024-01-01');

      expect(mockGet).toHaveBeenCalledWith('/historical-market-capitalization', {
        symbol: 'AAPL',
        limit: 100,
        from: '2023-01-01',
        to: '2024-01-01'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle optional parameters', async () => {
      const mockData: MarketCap[] = [];
      mockGet.mockResolvedValue(mockData);

      await companyClient.getHistoricalMarketCap('AAPL');

      expect(mockGet).toHaveBeenCalledWith('/historical-market-capitalization', {
        symbol: 'AAPL',
        limit: undefined,
        from: undefined,
        to: undefined
      }, undefined);
    });
  });

  describe('getShareFloat', () => {
    it('should call get with correct parameters', async () => {
      const mockData: ShareFloat[] = [
        {
          symbol: 'AAPL',
          date: '2024-01-01',
          freeFloat: 0.95,
          floatShares: 15200000000,
          outstandingShares: 16000000000
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await companyClient.getShareFloat('AAPL');

      expect(mockGet).toHaveBeenCalledWith('/shares-float', { symbol: 'AAPL' }, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('getAllShareFloat', () => {
    it('should call get with correct parameters', async () => {
      const mockData: ShareFloat[] = [
        {
          symbol: 'AAPL',
          date: '2024-01-01',
          freeFloat: 0.95,
          floatShares: 15200000000,
          outstandingShares: 16000000000
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await companyClient.getAllShareFloat(0, 1000);

      expect(mockGet).toHaveBeenCalledWith('/shares-float-all', { page: 0, limit: 1000 }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle optional parameters', async () => {
      const mockData: ShareFloat[] = [];
      mockGet.mockResolvedValue(mockData);

      await companyClient.getAllShareFloat();

      expect(mockGet).toHaveBeenCalledWith('/shares-float-all', { page: undefined, limit: undefined }, undefined);
    });
  });

  describe('getLatestMergersAcquisitions', () => {
    it('should call get with correct parameters', async () => {
      const mockData: MergerAcquisition[] = [
        {
          symbol: 'MSFT',
          companyName: 'Microsoft Corporation',
          cik: '0000789019',
          targetedCompanyName: 'Activision Blizzard, Inc.',
          targetedCik: '0000718877',
          targetedSymbol: 'ATVI',
          transactionDate: '2023-10-13',
          acceptedDate: '2023-10-13',
          link: 'https://www.sec.gov/Archives/edgar/data/789019/000119312523254000/d123456d8k.htm'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await companyClient.getLatestMergersAcquisitions(0, 50);

      expect(mockGet).toHaveBeenCalledWith('/mergers-acquisitions-latest', { page: 0, limit: 50 }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle optional parameters', async () => {
      const mockData: MergerAcquisition[] = [];
      mockGet.mockResolvedValue(mockData);

      await companyClient.getLatestMergersAcquisitions();

      expect(mockGet).toHaveBeenCalledWith('/mergers-acquisitions-latest', { page: undefined, limit: undefined }, undefined);
    });
  });

  describe('searchMergersAcquisitions', () => {
    it('should call get with correct parameters', async () => {
      const mockData: MergerAcquisition[] = [
        {
          symbol: 'MSFT',
          companyName: 'Microsoft Corporation',
          cik: '0000789019',
          targetedCompanyName: 'Activision Blizzard, Inc.',
          targetedCik: '0000718877',
          targetedSymbol: 'ATVI',
          transactionDate: '2023-10-13',
          acceptedDate: '2023-10-13',
          link: 'https://www.sec.gov/Archives/edgar/data/789019/000119312523254000/d123456d8k.htm'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await companyClient.searchMergersAcquisitions('Microsoft');

      expect(mockGet).toHaveBeenCalledWith('/mergers-acquisitions-search', { name: 'Microsoft' }, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('getExecutives', () => {
    it('should call get with correct parameters with active filter', async () => {
      const mockData: CompanyExecutive[] = [
        {
          title: 'Chief Executive Officer',
          name: 'Timothy Donald Cook',
          pay: 3000000,
          currencyPay: 'USD',
          gender: 'Male',
          yearBorn: 1960,
          active: true
        },
        {
          title: 'Chief Financial Officer',
          name: 'Luca Maestri',
          pay: 2500000,
          currencyPay: 'USD',
          gender: 'Male',
          yearBorn: 1963,
          active: true
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await companyClient.getExecutives('AAPL', 'true');

      expect(mockGet).toHaveBeenCalledWith('/key-executives', { symbol: 'AAPL', active: 'true' }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle optional active parameter', async () => {
      const mockData: CompanyExecutive[] = [];
      mockGet.mockResolvedValue(mockData);

      await companyClient.getExecutives('AAPL');

      expect(mockGet).toHaveBeenCalledWith('/key-executives', { symbol: 'AAPL', active: undefined }, undefined);
    });
  });

  describe('getExecutiveCompensation', () => {
    it('should call get with correct parameters', async () => {
      const mockData: ExecutiveCompensation[] = [
        {
          cik: '0000320193',
          symbol: 'AAPL',
          companyName: 'Apple Inc.',
          filingDate: '2024-01-15',
          acceptedDate: '2024-01-15',
          nameAndPosition: 'Timothy Donald Cook, Chief Executive Officer',
          year: 2023,
          salary: 3000000,
          bonus: 0,
          stockAward: 45000000,
          optionAward: 0,
          incentivePlanCompensation: 10500000,
          allOtherCompensation: 1500000,
          total: 60000000,
          link: 'https://www.sec.gov/Archives/edgar/data/320193/000032019324000007/aapl-20231230.htm'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await companyClient.getExecutiveCompensation('AAPL');

      expect(mockGet).toHaveBeenCalledWith('/governance-executive-compensation', { symbol: 'AAPL' }, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('getExecutiveCompensationBenchmark', () => {
    it('should call get with correct parameters with year', async () => {
      const mockData: ExecutiveCompensationBenchmark[] = [
        {
          industryTitle: 'Technology',
          year: 2023,
          averageCompensation: 15000000
        },
        {
          industryTitle: 'Financial Services',
          year: 2023,
          averageCompensation: 12000000
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await companyClient.getExecutiveCompensationBenchmark('2023');

      expect(mockGet).toHaveBeenCalledWith('/executive-compensation-benchmark', { year: '2023' }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle optional year parameter', async () => {
      const mockData: ExecutiveCompensationBenchmark[] = [];
      mockGet.mockResolvedValue(mockData);

      await companyClient.getExecutiveCompensationBenchmark();

      expect(mockGet).toHaveBeenCalledWith('/executive-compensation-benchmark', { year: undefined }, undefined);
    });
  });

  describe('constructor', () => {
    it('should create instance with API key', () => {
      const client = new CompanyClient('my-api-key');
      expect(client).toBeInstanceOf(CompanyClient);
    });

    it('should create instance without API key', () => {
      const client = new CompanyClient();
      expect(client).toBeInstanceOf(CompanyClient);
    });
  });
});
