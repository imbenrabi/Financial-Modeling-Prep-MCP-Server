import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SECFilingsClient } from '../../../../src/api/sec-filings/SECFilingsClient.js';
import { FMPClient } from '../../../../src/api/FMPClient.js';
import type {
  SECFiling,
  SECFilingFormType,
  CompanySearchResult,
  CompanyProfile,
  IndustryClassification,
  Form8KParams,
  FinancialsParams,
  FormTypeParams,
  SymbolParams,
  CIKParams,
  CompanyNameSearchParams,
  CompanySymbolSearchParams,
  CompanyCIKSearchParams,
  CompanyProfileParams,
  IndustrySearchParams,
  IndustryClassificationSearchParams,
  AllIndustryClassificationParams,
} from '../../../../src/api/sec-filings/types.js';

// Mock the FMPClient
vi.mock('../FMPClient.js');

describe('SECFilingsClient', () => {
  let secFilingsClient: SECFilingsClient;
  let mockGet: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Create mock for the get method
    mockGet = vi.fn();
    
    // Mock FMPClient prototype get method using any to bypass protected access
    (FMPClient.prototype as any).get = mockGet;
    
    // Create SECFilingsClient instance
    secFilingsClient = new SECFilingsClient('test-api-key');
  });

  describe('getLatest8KFilings', () => {
    it('should call get with correct parameters with all options', async () => {
      const mockData: SECFiling[] = [
        {
          symbol: 'AAPL',
          cik: '0000320193',
          filingDate: '2024-01-01',
          acceptedDate: '2024-01-01T16:30:15-05:00',
          formType: '8-K',
          hasFinancials: true,
          link: 'https://www.sec.gov/Archives/edgar/data/320193/000032019324000001/0000320193-24-000001-index.htm',
          finalLink: 'https://www.sec.gov/Archives/edgar/data/320193/000032019324000001/xslF345X03/0000320193-24-000001.xml'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const params: Form8KParams = {
        from: '2024-01-01',
        to: '2024-01-31',
        page: 0,
        limit: 10
      };

      const result = await secFilingsClient.getLatest8KFilings(params);

      expect(mockGet).toHaveBeenCalledWith('/sec-filings-8k', {
        from: '2024-01-01',
        to: '2024-01-31',
        page: 0,
        limit: 10
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle optional parameters', async () => {
      const mockData: SECFiling[] = [];
      mockGet.mockResolvedValue(mockData);

      const params: Form8KParams = {
        from: '2024-01-01',
        to: '2024-01-31'
      };

      await secFilingsClient.getLatest8KFilings(params);

      expect(mockGet).toHaveBeenCalledWith('/sec-filings-8k', {
        from: '2024-01-01',
        to: '2024-01-31',
        page: undefined,
        limit: undefined
      }, undefined);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      const params: Form8KParams = {
        from: '2024-01-01',
        to: '2024-01-31'
      };

      await expect(secFilingsClient.getLatest8KFilings(params))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getLatestFinancialFilings', () => {
    it('should call get with correct parameters', async () => {
      const mockData: SECFiling[] = [
        {
          symbol: 'MSFT',
          cik: '0000789019',
          filingDate: '2024-01-01',
          acceptedDate: '2024-01-01T16:30:15-05:00',
          formType: '10-K',
          hasFinancials: true,
          link: 'https://www.sec.gov/Archives/edgar/data/789019/000078901924000001/0000789019-24-000001-index.htm',
          finalLink: 'https://www.sec.gov/Archives/edgar/data/789019/000078901924000001/xslF345X03/0000789019-24-000001.xml'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const params: FinancialsParams = {
        from: '2024-01-01',
        to: '2024-01-31',
        page: 0,
        limit: 20
      };

      const result = await secFilingsClient.getLatestFinancialFilings(params);

      expect(mockGet).toHaveBeenCalledWith('/sec-filings-financials', {
        from: '2024-01-01',
        to: '2024-01-31',
        page: 0,
        limit: 20
      }, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('getFilingsByFormType', () => {
    it('should call get with correct parameters', async () => {
      const mockData: SECFilingFormType[] = [
        {
          symbol: 'GOOGL',
          cik: '0001652044',
          filingDate: '2024-01-01',
          acceptedDate: '2024-01-01T16:30:15-05:00',
          formType: '10-Q',
          link: 'https://www.sec.gov/Archives/edgar/data/1652044/000165204424000001/0001652044-24-000001-index.htm',
          finalLink: 'https://www.sec.gov/Archives/edgar/data/1652044/000165204424000001/xslF345X03/0001652044-24-000001.xml'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const params: FormTypeParams = {
        formType: '10-Q',
        from: '2024-01-01',
        to: '2024-01-31',
        page: 0,
        limit: 15
      };

      const result = await secFilingsClient.getFilingsByFormType(params);

      expect(mockGet).toHaveBeenCalledWith('/sec-filings-search/form-type', {
        formType: '10-Q',
        from: '2024-01-01',
        to: '2024-01-31',
        page: 0,
        limit: 15
      }, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('getFilingsBySymbol', () => {
    it('should call get with correct parameters', async () => {
      const mockData: SECFilingFormType[] = [
        {
          symbol: 'TSLA',
          cik: '0001318605',
          filingDate: '2024-01-01',
          acceptedDate: '2024-01-01T16:30:15-05:00',
          formType: '8-K',
          link: 'https://www.sec.gov/Archives/edgar/data/1318605/000131860524000001/0001318605-24-000001-index.htm',
          finalLink: 'https://www.sec.gov/Archives/edgar/data/1318605/000131860524000001/xslF345X03/0001318605-24-000001.xml'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const params: SymbolParams = {
        symbol: 'TSLA',
        from: '2024-01-01',
        to: '2024-01-31',
        page: 0,
        limit: 25
      };

      const result = await secFilingsClient.getFilingsBySymbol(params);

      expect(mockGet).toHaveBeenCalledWith('/sec-filings-search/symbol', {
        symbol: 'TSLA',
        from: '2024-01-01',
        to: '2024-01-31',
        page: 0,
        limit: 25
      }, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('getFilingsByCIK', () => {
    it('should call get with correct parameters', async () => {
      const mockData: SECFilingFormType[] = [
        {
          symbol: 'AMZN',
          cik: '0001018724',
          filingDate: '2024-01-01',
          acceptedDate: '2024-01-01T16:30:15-05:00',
          formType: '10-K',
          link: 'https://www.sec.gov/Archives/edgar/data/1018724/000101872424000001/0001018724-24-000001-index.htm',
          finalLink: 'https://www.sec.gov/Archives/edgar/data/1018724/000101872424000001/xslF345X03/0001018724-24-000001.xml'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const params: CIKParams = {
        cik: '0001018724',
        from: '2024-01-01',
        to: '2024-01-31',
        page: 0,
        limit: 30
      };

      const result = await secFilingsClient.getFilingsByCIK(params);

      expect(mockGet).toHaveBeenCalledWith('/sec-filings-search/cik', {
        cik: '0001018724',
        from: '2024-01-01',
        to: '2024-01-31',
        page: 0,
        limit: 30
      }, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('searchCompaniesByName', () => {
    it('should call get with correct parameters', async () => {
      const mockData: CompanySearchResult[] = [
        {
          symbol: 'AAPL',
          name: 'Apple Inc.',
          cik: '0000320193',
          sicCode: '3571',
          industryTitle: 'Electronic Computers',
          businessAddress: '1 Apple Park Way, Cupertino, CA 95014',
          phoneNumber: '(408) 996-1010'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const params: CompanyNameSearchParams = {
        company: 'Apple'
      };

      const result = await secFilingsClient.searchCompaniesByName(params);

      expect(mockGet).toHaveBeenCalledWith('/sec-filings-company-search/name', {
        company: 'Apple'
      }, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('searchCompaniesBySymbol', () => {
    it('should call get with correct parameters', async () => {
      const mockData: CompanySearchResult[] = [
        {
          symbol: 'MSFT',
          name: 'Microsoft Corporation',
          cik: '0000789019',
          sicCode: '7372',
          industryTitle: 'Prepackaged Software',
          businessAddress: '1 Microsoft Way, Redmond, WA 98052',
          phoneNumber: '(425) 882-8080'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const params: CompanySymbolSearchParams = {
        symbol: 'MSFT'
      };

      const result = await secFilingsClient.searchCompaniesBySymbol(params);

      expect(mockGet).toHaveBeenCalledWith('/sec-filings-company-search/symbol', {
        symbol: 'MSFT'
      }, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('searchCompaniesByCIK', () => {
    it('should call get with correct parameters', async () => {
      const mockData: CompanySearchResult[] = [
        {
          symbol: 'GOOGL',
          name: 'Alphabet Inc.',
          cik: '0001652044',
          sicCode: '7375',
          industryTitle: 'Information Retrieval Services',
          businessAddress: '1600 Amphitheatre Parkway, Mountain View, CA 94043',
          phoneNumber: '(650) 253-0000'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const params: CompanyCIKSearchParams = {
        cik: '0001652044'
      };

      const result = await secFilingsClient.searchCompaniesByCIK(params);

      expect(mockGet).toHaveBeenCalledWith('/sec-filings-company-search/cik', {
        cik: '0001652044'
      }, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('getCompanyProfile', () => {
    it('should call get with correct parameters with symbol', async () => {
      const mockData: CompanyProfile[] = [
        {
          symbol: 'AAPL',
          cik: '0000320193',
          registrantName: 'Apple Inc.',
          sicCode: '3571',
          sicDescription: 'Electronic Computers',
          sicGroup: 'Manufacturing',
          isin: 'US0378331005',
          businessAddress: '1 Apple Park Way, Cupertino, CA 95014',
          mailingAddress: '1 Apple Park Way, Cupertino, CA 95014',
          phoneNumber: '(408) 996-1010',
          postalCode: '95014',
          city: 'Cupertino',
          state: 'CA',
          country: 'US',
          description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.',
          ceo: 'Timothy Cook',
          website: 'https://www.apple.com',
          exchange: 'NASDAQ',
          stateLocation: 'California',
          stateOfIncorporation: 'Delaware',
          fiscalYearEnd: '09-30',
          ipoDate: '1980-12-12',
          employees: '164000',
          secFilingsUrl: 'https://www.sec.gov/cgi-bin/browse-edgar?CIK=0000320193',
          taxIdentificationNumber: '94-2404110',
          fiftyTwoWeekRange: '$124.17 - $199.62',
          isActive: true,
          assetType: 'Common Stock',
          openFigiComposite: 'BBG000B9XRY4',
          priceCurrency: 'USD',
          marketSector: 'Technology',
          securityType: 'Common Stock',
          isEtf: false,
          isAdr: false,
          isFund: false
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const params: CompanyProfileParams = {
        symbol: 'AAPL'
      };

      const result = await secFilingsClient.getCompanyProfile(params);

      expect(mockGet).toHaveBeenCalledWith('/sec-profile', {
        symbol: 'AAPL',
        cik: undefined
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with correct parameters with cik', async () => {
      const mockData: CompanyProfile[] = [];
      mockGet.mockResolvedValue(mockData);

      const params: CompanyProfileParams = {
        cik: '0000320193'
      };

      await secFilingsClient.getCompanyProfile(params);

      expect(mockGet).toHaveBeenCalledWith('/sec-profile', {
        symbol: undefined,
        cik: '0000320193'
      }, undefined);
    });

    it('should call get with correct parameters with both symbol and cik', async () => {
      const mockData: CompanyProfile[] = [];
      mockGet.mockResolvedValue(mockData);

      const params: CompanyProfileParams = {
        symbol: 'AAPL',
        cik: '0000320193'
      };

      await secFilingsClient.getCompanyProfile(params);

      expect(mockGet).toHaveBeenCalledWith('/sec-profile', {
        symbol: 'AAPL',
        cik: '0000320193'
      }, undefined);
    });
  });

  describe('getIndustryClassificationList', () => {
    it('should call get with correct parameters with all options', async () => {
      const mockData: IndustryClassification[] = [
        {
          office: 'Office of Technology',
          sicCode: '3571',
          industryTitle: 'Electronic Computers'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const params: IndustrySearchParams = {
        industryTitle: 'Electronic',
        sicCode: '3571'
      };

      const result = await secFilingsClient.getIndustryClassificationList(params);

      expect(mockGet).toHaveBeenCalledWith('/standard-industrial-classification-list', {
        industryTitle: 'Electronic',
        sicCode: '3571'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle no parameters', async () => {
      const mockData: IndustryClassification[] = [];
      mockGet.mockResolvedValue(mockData);

      await secFilingsClient.getIndustryClassificationList();

      expect(mockGet).toHaveBeenCalledWith('/standard-industrial-classification-list', {
        industryTitle: undefined,
        sicCode: undefined
      }, undefined);
    });
  });

  describe('searchIndustryClassification', () => {
    it('should call get with correct parameters with all options', async () => {
      const mockData: CompanySearchResult[] = [
        {
          symbol: 'AAPL',
          name: 'Apple Inc.',
          cik: '0000320193',
          sicCode: '3571',
          industryTitle: 'Electronic Computers',
          businessAddress: '1 Apple Park Way, Cupertino, CA 95014',
          phoneNumber: '(408) 996-1010'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const params: IndustryClassificationSearchParams = {
        symbol: 'AAPL',
        cik: '0000320193',
        sicCode: '3571'
      };

      const result = await secFilingsClient.searchIndustryClassification(params);

      expect(mockGet).toHaveBeenCalledWith('/industry-classification-search', {
        symbol: 'AAPL',
        cik: '0000320193',
        sicCode: '3571'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle no parameters', async () => {
      const mockData: CompanySearchResult[] = [];
      mockGet.mockResolvedValue(mockData);

      await secFilingsClient.searchIndustryClassification();

      expect(mockGet).toHaveBeenCalledWith('/industry-classification-search', {
        symbol: undefined,
        cik: undefined,
        sicCode: undefined
      }, undefined);    });
  });

  describe('getAllIndustryClassification', () => {
    it('should call get with correct parameters with pagination', async () => {
      const mockData: CompanySearchResult[] = [
        {
          symbol: 'MSFT',
          name: 'Microsoft Corporation',
          cik: '0000789019',
          sicCode: '7372',
          industryTitle: 'Prepackaged Software',
          businessAddress: '1 Microsoft Way, Redmond, WA 98052',
          phoneNumber: '(425) 882-8080'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const params: AllIndustryClassificationParams = {
        page: 0,
        limit: 50
      };

      const result = await secFilingsClient.getAllIndustryClassification(params);

      expect(mockGet).toHaveBeenCalledWith('/all-industry-classification', {
        page: 0,
        limit: 50
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle no parameters', async () => {
      const mockData: CompanySearchResult[] = [];
      mockGet.mockResolvedValue(mockData);

      await secFilingsClient.getAllIndustryClassification();

      expect(mockGet).toHaveBeenCalledWith('/all-industry-classification', {
        page: undefined,
        limit: undefined
      }, undefined);
    });
  });

  describe('constructor', () => {
    it('should create instance with API key', () => {
      const client = new SECFilingsClient('my-api-key');
      expect(client).toBeInstanceOf(SECFilingsClient);
    });

    it('should create instance without API key', () => {
      const client = new SECFilingsClient();
      expect(client).toBeInstanceOf(SECFilingsClient);
    });
  });
}); 