import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FundraisersClient } from '../../../../src/api/fundraisers/FundraisersClient.js';
import { FMPClient } from '../../../../src/api/FMPClient.js';
import type {
  CrowdfundingCampaign,
  CrowdfundingSearchResult,
  EquityOffering,
  EquityOfferingSearchResult,
} from '../../../../src/api/fundraisers/types.js';

// Mock the FMPClient
vi.mock('../FMPClient.js');

describe('FundraisersClient', () => {
  let fundraisersClient: FundraisersClient;
  let mockGet: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Create mock for the get method
    mockGet = vi.fn();
    
    // Mock FMPClient prototype get method using any to bypass protected access
    (FMPClient.prototype as any).get = mockGet;
    
    // Create FundraisersClient instance
    fundraisersClient = new FundraisersClient('test-api-key');
  });

  describe('getLatestCrowdfundingCampaigns', () => {
    it('should call get with correct parameters with all options', async () => {
      const mockData: CrowdfundingCampaign[] = [
        {
          cik: '0001234567',
          companyName: 'Example Crowdfunding Co.',
          date: '2024-01-15',
          filingDate: '2024-01-10',
          acceptedDate: '2024-01-10T16:30:00.000Z',
          formType: 'C',
          formSignification: 'Crowdfunding Offering',
          nameOfIssuer: 'Example Crowdfunding Co.',
          legalStatusForm: 'Corporation',
          jurisdictionOrganization: 'Delaware',
          issuerStreet: '123 Main Street',
          issuerCity: 'San Francisco',
          issuerStateOrCountry: 'CA',
          issuerZipCode: '94105',
          issuerWebsite: 'https://example-crowdfunding.com',
          intermediaryCompanyName: 'Example Funding Portal',
          intermediaryCommissionCik: '0001234568',
          intermediaryCommissionFileNumber: '007-12345',
          compensationAmount: '5%',
          financialInterest: 'No',
          securityOfferedType: 'Common Stock',
          securityOfferedOtherDescription: '',
          numberOfSecurityOffered: 100000,
          offeringPrice: 10.0,
          offeringAmount: 1000000,
          overSubscriptionAccepted: 'Yes',
          overSubscriptionAllocationType: 'Pro-rata',
          maximumOfferingAmount: 1200000,
          offeringDeadlineDate: '2024-06-15',
          currentNumberOfEmployees: 25,
          totalAssetMostRecentFiscalYear: 500000,
          totalAssetPriorFiscalYear: 300000,
          cashAndCashEquiValentMostRecentFiscalYear: 100000,
          cashAndCashEquiValentPriorFiscalYear: 75000,
          accountsReceivableMostRecentFiscalYear: 50000,
          accountsReceivablePriorFiscalYear: 30000,
          shortTermDebtMostRecentFiscalYear: 25000,
          shortTermDebtPriorFiscalYear: 20000,
          longTermDebtMostRecentFiscalYear: 100000,
          longTermDebtPriorFiscalYear: 80000,
          revenueMostRecentFiscalYear: 750000,
          revenuePriorFiscalYear: 500000,
          costGoodsSoldMostRecentFiscalYear: 450000,
          costGoodsSoldPriorFiscalYear: 300000,
          taxesPaidMostRecentFiscalYear: 15000,
          taxesPaidPriorFiscalYear: 10000,
          netIncomeMostRecentFiscalYear: 50000,
          netIncomePriorFiscalYear: 25000
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await fundraisersClient.getLatestCrowdfundingCampaigns(0, 50);

      expect(mockGet).toHaveBeenCalledWith('/crowdfunding-offerings-latest', {
        page: 0,
        limit: 50
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with correct parameters without optional params', async () => {
      const mockData: CrowdfundingCampaign[] = [];
      mockGet.mockResolvedValue(mockData);

      const result = await fundraisersClient.getLatestCrowdfundingCampaigns();

      expect(mockGet).toHaveBeenCalledWith('/crowdfunding-offerings-latest', {
        page: undefined,
        limit: undefined
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(fundraisersClient.getLatestCrowdfundingCampaigns())
        .rejects.toThrow(errorMessage);
    });
  });

  describe('searchCrowdfundingCampaigns', () => {
    it('should call get with correct parameters', async () => {
      const mockData: CrowdfundingSearchResult[] = [
        {
          cik: '0001234567',
          name: 'Example Crowdfunding Co.',
          date: '2024-01-15'
        },
        {
          cik: '0001234568',
          name: 'Another Crowdfunding Company',
          date: null
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await fundraisersClient.searchCrowdfundingCampaigns('Example');

      expect(mockGet).toHaveBeenCalledWith('/crowdfunding-offerings-search', {
        name: 'Example'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'Search API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(fundraisersClient.searchCrowdfundingCampaigns('Test'))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getCrowdfundingCampaignsByCIK', () => {
    it('should call get with correct parameters', async () => {
      const mockData: CrowdfundingCampaign[] = [
        {
          cik: '0001234567',
          companyName: 'CIK Example Co.',
          date: '2024-01-15',
          filingDate: '2024-01-10',
          acceptedDate: '2024-01-10T16:30:00.000Z',
          formType: 'C',
          formSignification: 'Crowdfunding Offering',
          nameOfIssuer: 'CIK Example Co.',
          legalStatusForm: 'LLC',
          jurisdictionOrganization: 'Nevada',
          issuerStreet: '456 Tech Drive',
          issuerCity: 'Austin',
          issuerStateOrCountry: 'TX',
          issuerZipCode: '78701',
          issuerWebsite: 'https://cik-example.com',
          intermediaryCompanyName: 'CIK Funding Portal',
          intermediaryCommissionCik: '0001234569',
          intermediaryCommissionFileNumber: '007-12346',
          compensationAmount: '6%',
          financialInterest: 'Yes',
          securityOfferedType: 'Preferred Stock',
          securityOfferedOtherDescription: 'Series A Preferred',
          numberOfSecurityOffered: 50000,
          offeringPrice: 25.0,
          offeringAmount: 1250000,
          overSubscriptionAccepted: 'No',
          overSubscriptionAllocationType: 'First-come first-served',
          maximumOfferingAmount: 1250000,
          offeringDeadlineDate: '2024-07-15',
          currentNumberOfEmployees: 15,
          totalAssetMostRecentFiscalYear: 800000,
          totalAssetPriorFiscalYear: 600000,
          cashAndCashEquiValentMostRecentFiscalYear: 200000,
          cashAndCashEquiValentPriorFiscalYear: 150000,
          accountsReceivableMostRecentFiscalYear: 75000,
          accountsReceivablePriorFiscalYear: 50000,
          shortTermDebtMostRecentFiscalYear: 30000,
          shortTermDebtPriorFiscalYear: 25000,
          longTermDebtMostRecentFiscalYear: 150000,
          longTermDebtPriorFiscalYear: 120000,
          revenueMostRecentFiscalYear: 900000,
          revenuePriorFiscalYear: 700000,
          costGoodsSoldMostRecentFiscalYear: 540000,
          costGoodsSoldPriorFiscalYear: 420000,
          taxesPaidMostRecentFiscalYear: 25000,
          taxesPaidPriorFiscalYear: 18000,
          netIncomeMostRecentFiscalYear: 75000,
          netIncomePriorFiscalYear: 55000
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await fundraisersClient.getCrowdfundingCampaignsByCIK('0001234567');

      expect(mockGet).toHaveBeenCalledWith('/crowdfunding-offerings', {
        cik: '0001234567'
      }, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('getLatestEquityOfferings', () => {
    it('should call get with correct parameters with all options', async () => {
      const mockData: EquityOffering[] = [
        {
          cik: '0001234567',
          companyName: 'Example Equity Co.',
          date: '2024-01-15',
          filingDate: '2024-01-10',
          acceptedDate: '2024-01-10T16:30:00.000Z',
          formType: 'D',
          formSignification: 'Form D - Notice of Exempt Offering',
          entityName: 'Example Equity Co.',
          issuerStreet: '789 Investment Blvd',
          issuerCity: 'New York',
          issuerStateOrCountry: 'NY',
          issuerStateOrCountryDescription: 'New York',
          issuerZipCode: '10001',
          issuerPhoneNumber: '(555) 123-4567',
          jurisdictionOfIncorporation: 'Delaware',
          entityType: 'Corporation',
          incorporatedWithinFiveYears: false,
          yearOfIncorporation: '2018',
          relatedPersonFirstName: 'John',
          relatedPersonLastName: 'Smith',
          relatedPersonStreet: '789 Investment Blvd',
          relatedPersonCity: 'New York',
          relatedPersonStateOrCountry: 'NY',
          relatedPersonStateOrCountryDescription: 'New York',
          relatedPersonZipCode: '10001',
          relatedPersonRelationship: 'Executive Officer',
          industryGroupType: 'Technology',
          revenueRange: '$5,000,000 to $25,000,000',
          federalExemptionsExclusions: '506(b)',
          isAmendment: false,
          dateOfFirstSale: '2024-01-20',
          durationOfOfferingIsMoreThanYear: true,
          securitiesOfferedAreOfEquityType: true,
          isBusinessCombinationTransaction: false,
          minimumInvestmentAccepted: 50000,
          totalOfferingAmount: 5000000,
          totalAmountSold: 2500000,
          totalAmountRemaining: 2500000,
          hasNonAccreditedInvestors: false,
          totalNumberAlreadyInvested: 15,
          salesCommissions: 250000,
          findersFees: 100000,
          grossProceedsUsed: 2150000
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await fundraisersClient.getLatestEquityOfferings(0, 20, '0001234567');

      expect(mockGet).toHaveBeenCalledWith('/fundraising-latest', {
        page: 0,
        limit: 20,
        cik: '0001234567'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with correct parameters without optional params', async () => {
      const mockData: EquityOffering[] = [];
      mockGet.mockResolvedValue(mockData);

      const result = await fundraisersClient.getLatestEquityOfferings();

      expect(mockGet).toHaveBeenCalledWith('/fundraising-latest', {
        page: undefined,
        limit: undefined,
        cik: undefined
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'Equity offerings API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(fundraisersClient.getLatestEquityOfferings())
        .rejects.toThrow(errorMessage);
    });
  });

  describe('searchEquityOfferings', () => {
    it('should call get with correct parameters', async () => {
      const mockData: EquityOfferingSearchResult[] = [
        {
          cik: '0001234567',
          name: 'Example Equity Co.',
          date: '2024-01-15'
        },
        {
          cik: '0001234568',
          name: 'Another Equity Company',
          date: '2024-01-10'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await fundraisersClient.searchEquityOfferings('Example Equity');

      expect(mockGet).toHaveBeenCalledWith('/fundraising-search', {
        name: 'Example Equity'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'Search equity offerings API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(fundraisersClient.searchEquityOfferings('Test'))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getEquityOfferingsByCIK', () => {
    it('should call get with correct parameters', async () => {
      const mockData: EquityOffering[] = [
        {
          cik: '0001234567',
          companyName: 'CIK Equity Example Co.',
          date: '2024-01-15',
          filingDate: '2024-01-10',
          acceptedDate: '2024-01-10T16:30:00.000Z',
          formType: 'D',
          formSignification: 'Form D - Notice of Exempt Offering',
          entityName: 'CIK Equity Example Co.',
          issuerStreet: '321 Finance Street',
          issuerCity: 'Chicago',
          issuerStateOrCountry: 'IL',
          issuerStateOrCountryDescription: 'Illinois',
          issuerZipCode: '60601',
          issuerPhoneNumber: '(312) 555-0123',
          jurisdictionOfIncorporation: 'Illinois',
          entityType: 'Limited Liability Company',
          incorporatedWithinFiveYears: true,
          yearOfIncorporation: '2020',
          relatedPersonFirstName: 'Jane',
          relatedPersonLastName: 'Doe',
          relatedPersonStreet: '321 Finance Street',
          relatedPersonCity: 'Chicago',
          relatedPersonStateOrCountry: 'IL',
          relatedPersonStateOrCountryDescription: 'Illinois',
          relatedPersonZipCode: '60601',
          relatedPersonRelationship: 'Managing Member',
          industryGroupType: 'Financial Services',
          revenueRange: '$1,000,000 to $5,000,000',
          federalExemptionsExclusions: '506(c)',
          isAmendment: true,
          dateOfFirstSale: '2024-01-25',
          durationOfOfferingIsMoreThanYear: false,
          securitiesOfferedAreOfEquityType: true,
          isBusinessCombinationTransaction: false,
          minimumInvestmentAccepted: 25000,
          totalOfferingAmount: 2000000,
          totalAmountSold: 1500000,
          totalAmountRemaining: 500000,
          hasNonAccreditedInvestors: true,
          totalNumberAlreadyInvested: 35,
          salesCommissions: 150000,
          findersFees: 50000,
          grossProceedsUsed: 1300000
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await fundraisersClient.getEquityOfferingsByCIK('0001234567');

      expect(mockGet).toHaveBeenCalledWith('/fundraising', {
        cik: '0001234567'
      }, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('constructor', () => {
    it('should create instance with API key', () => {
      const client = new FundraisersClient('my-api-key');
      expect(client).toBeInstanceOf(FundraisersClient);
    });

    it('should create instance without API key', () => {
      const client = new FundraisersClient();
      expect(client).toBeInstanceOf(FundraisersClient);
    });
  });
}); 