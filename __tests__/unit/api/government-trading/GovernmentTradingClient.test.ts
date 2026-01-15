import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GovernmentTradingClient } from '../../../../src/api/government-trading/GovernmentTradingClient.js';
import { FMPClient } from '../../../../src/api/FMPClient.js';
import type {
  FinancialDisclosure,
  PaginationParams,
  SymbolParams,
  NameParams,
} from '../../../../src/api/government-trading/types.js';

// Mock the FMPClient
vi.mock('../FMPClient.js');

describe('GovernmentTradingClient', () => {
  let governmentTradingClient: GovernmentTradingClient;
  let mockGet: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Create mock for the get method
    mockGet = vi.fn();
    
    // Mock FMPClient prototype get method using any to bypass protected access
    (FMPClient.prototype as any).get = mockGet;
    
    // Create GovernmentTradingClient instance
    governmentTradingClient = new GovernmentTradingClient('test-api-key');
  });

  describe('getLatestSenateDisclosures', () => {
    it('should call get with correct parameters with pagination options', async () => {
      const mockData: FinancialDisclosure[] = [
        {
          symbol: 'AAPL',
          disclosureDate: '2024-01-15',
          transactionDate: '2024-01-10',
          firstName: 'John',
          lastName: 'Smith',
          office: 'Senator',
          district: 'CA',
          owner: 'Spouse',
          assetDescription: 'Apple Inc. Common Stock',
          assetType: 'Stock',
          type: 'Purchase',
          amount: '$1,001 - $15,000',
          capitalGainsOver200USD: 'No',
          comment: 'Investment diversification',
          link: 'https://example.com/disclosure/12345'
        },
        {
          symbol: 'MSFT',
          disclosureDate: '2024-01-14',
          transactionDate: '2024-01-08',
          firstName: 'Jane',
          lastName: 'Doe',
          office: 'Senator',
          district: 'NY',
          owner: 'Self',
          assetDescription: 'Microsoft Corporation Common Stock',
          assetType: 'Stock',
          type: 'Sale',
          amount: '$15,001 - $50,000',
          comment: 'Portfolio rebalancing',
          link: 'https://example.com/disclosure/12346'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const params: PaginationParams = { page: 0, limit: 50 };
      const result = await governmentTradingClient.getLatestSenateDisclosures(params);

      expect(mockGet).toHaveBeenCalledWith('/senate-latest', {
        page: 0,
        limit: 50
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with correct parameters without optional params', async () => {
      const mockData: FinancialDisclosure[] = [];
      mockGet.mockResolvedValue(mockData);

      const result = await governmentTradingClient.getLatestSenateDisclosures();

      expect(mockGet).toHaveBeenCalledWith('/senate-latest', {
        page: undefined,
        limit: undefined
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'Senate disclosures API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(governmentTradingClient.getLatestSenateDisclosures())
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getLatestHouseDisclosures', () => {
    it('should call get with correct parameters with pagination options', async () => {
      const mockData: FinancialDisclosure[] = [
        {
          symbol: 'TSLA',
          disclosureDate: '2024-01-16',
          transactionDate: '2024-01-12',
          firstName: 'Robert',
          lastName: 'Johnson',
          office: 'Representative',
          district: 'TX-02',
          owner: 'Self',
          assetDescription: 'Tesla Inc. Common Stock',
          assetType: 'Stock',
          type: 'Purchase',
          amount: '$50,001 - $100,000',
          capitalGainsOver200USD: 'Yes',
          comment: 'Long-term investment',
          link: 'https://example.com/disclosure/12347'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const params: PaginationParams = { page: 1, limit: 25 };
      const result = await governmentTradingClient.getLatestHouseDisclosures(params);

      expect(mockGet).toHaveBeenCalledWith('/house-latest', {
        page: 1,
        limit: 25
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with correct parameters without optional params', async () => {
      const mockData: FinancialDisclosure[] = [];
      mockGet.mockResolvedValue(mockData);

      const result = await governmentTradingClient.getLatestHouseDisclosures();

      expect(mockGet).toHaveBeenCalledWith('/house-latest', {
        page: undefined,
        limit: undefined
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'House disclosures API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(governmentTradingClient.getLatestHouseDisclosures())
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getSenateTrades', () => {
    it('should call get with correct parameters', async () => {
      const mockData: FinancialDisclosure[] = [
        {
          symbol: 'GOOGL',
          disclosureDate: '2024-01-18',
          transactionDate: '2024-01-15',
          firstName: 'Sarah',
          lastName: 'Williams',
          office: 'Senator',
          district: 'FL',
          owner: 'Joint',
          assetDescription: 'Alphabet Inc. Class A Common Stock',
          assetType: 'Stock',
          type: 'Sale',
          amount: '$100,001 - $250,000',
          capitalGainsOver200USD: 'Yes',
          comment: 'Retirement planning',
          link: 'https://example.com/disclosure/12348'
        },
        {
          symbol: 'GOOGL',
          disclosureDate: '2024-01-10',
          transactionDate: '2024-01-05',
          firstName: 'Michael',
          lastName: 'Brown',
          office: 'Senator',
          district: 'OH',
          owner: 'Self',
          assetDescription: 'Alphabet Inc. Class A Common Stock',
          assetType: 'Stock',
          type: 'Purchase',
          amount: '$15,001 - $50,000',
          comment: 'Technology sector investment',
          link: 'https://example.com/disclosure/12349'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const params: SymbolParams = { symbol: 'GOOGL' };
      const result = await governmentTradingClient.getSenateTrades(params);

      expect(mockGet).toHaveBeenCalledWith('/senate-trades', {
        symbol: 'GOOGL'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'Senate trades API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      const params: SymbolParams = { symbol: 'AAPL' };
      await expect(governmentTradingClient.getSenateTrades(params))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getSenateTradesByName', () => {
    it('should call get with correct parameters', async () => {
      const mockData: FinancialDisclosure[] = [
        {
          symbol: 'NVDA',
          disclosureDate: '2024-01-20',
          transactionDate: '2024-01-17',
          firstName: 'Elizabeth',
          lastName: 'Davis',
          office: 'Senator',
          district: 'WA',
          owner: 'Spouse',
          assetDescription: 'NVIDIA Corporation Common Stock',
          assetType: 'Stock',
          type: 'Purchase',
          amount: '$250,001 - $500,000',
          capitalGainsOver200USD: 'No',
          comment: 'AI technology investment',
          link: 'https://example.com/disclosure/12350'
        },
        {
          symbol: 'AMD',
          disclosureDate: '2024-01-12',
          transactionDate: '2024-01-08',
          firstName: 'Elizabeth',
          lastName: 'Davis',
          office: 'Senator',
          district: 'WA',
          owner: 'Self',
          assetDescription: 'Advanced Micro Devices Inc. Common Stock',
          assetType: 'Stock',
          type: 'Sale',
          amount: '$50,001 - $100,000',
          comment: 'Semiconductor sector adjustment',
          link: 'https://example.com/disclosure/12351'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const params: NameParams = { name: 'Davis' };
      const result = await governmentTradingClient.getSenateTradesByName(params);

      expect(mockGet).toHaveBeenCalledWith('/senate-trades-by-name', {
        name: 'Davis'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'Senate trades by name API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      const params: NameParams = { name: 'Smith' };
      await expect(governmentTradingClient.getSenateTradesByName(params))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getHouseTrades', () => {
    it('should call get with correct parameters', async () => {
      const mockData: FinancialDisclosure[] = [
        {
          symbol: 'META',
          disclosureDate: '2024-01-22',
          transactionDate: '2024-01-19',
          firstName: 'David',
          lastName: 'Wilson',
          office: 'Representative',
          district: 'CA-12',
          owner: 'Self',
          assetDescription: 'Meta Platforms Inc. Class A Common Stock',
          assetType: 'Stock',
          type: 'Purchase',
          amount: '$15,001 - $50,000',
          capitalGainsOver200USD: 'No',
          comment: 'Social media sector investment',
          link: 'https://example.com/disclosure/12352'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const params: SymbolParams = { symbol: 'META' };
      const result = await governmentTradingClient.getHouseTrades(params);

      expect(mockGet).toHaveBeenCalledWith('/house-trades', {
        symbol: 'META'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'House trades API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      const params: SymbolParams = { symbol: 'TSLA' };
      await expect(governmentTradingClient.getHouseTrades(params))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getHouseTradesByName', () => {
    it('should call get with correct parameters', async () => {
      const mockData: FinancialDisclosure[] = [
        {
          symbol: 'AMZN',
          disclosureDate: '2024-01-25',
          transactionDate: '2024-01-22',
          firstName: 'Nancy',
          lastName: 'Miller',
          office: 'Representative',
          district: 'IL-07',
          owner: 'Joint',
          assetDescription: 'Amazon.com Inc. Common Stock',
          assetType: 'Stock',
          type: 'Sale',
          amount: '$100,001 - $250,000',
          capitalGainsOver200USD: 'Yes',
          comment: 'E-commerce sector rebalancing',
          link: 'https://example.com/disclosure/12353'
        },
        {
          symbol: 'SHOP',
          disclosureDate: '2024-01-18',
          transactionDate: '2024-01-15',
          firstName: 'Nancy',
          lastName: 'Miller',
          office: 'Representative',
          district: 'IL-07',
          owner: 'Self',
          assetDescription: 'Shopify Inc. Class A Subordinate Voting Shares',
          assetType: 'Stock',
          type: 'Purchase',
          amount: '$50,001 - $100,000',
          comment: 'E-commerce growth investment',
          link: 'https://example.com/disclosure/12354'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const params: NameParams = { name: 'Miller' };
      const result = await governmentTradingClient.getHouseTradesByName(params);

      expect(mockGet).toHaveBeenCalledWith('/house-trades-by-name', {
        name: 'Miller'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'House trades by name API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      const params: NameParams = { name: 'Johnson' };
      await expect(governmentTradingClient.getHouseTradesByName(params))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('constructor', () => {
    it('should create instance with API key', () => {
      const client = new GovernmentTradingClient('my-api-key');
      expect(client).toBeInstanceOf(GovernmentTradingClient);
    });

    it('should create instance without API key', () => {
      const client = new GovernmentTradingClient();
      expect(client).toBeInstanceOf(GovernmentTradingClient);
    });
  });
}); 