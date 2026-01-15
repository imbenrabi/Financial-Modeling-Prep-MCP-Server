import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ESGClient } from '../../../../src/api/esg/ESGClient.js';
import { FMPClient } from '../../../../src/api/FMPClient.js';
import type {
  ESGDisclosure,
  ESGRating,
  ESGBenchmark,
} from '../../../../src/api/esg/types.js';

// Mock the FMPClient
vi.mock('../FMPClient.js');

describe('ESGClient', () => {
  let esgClient: ESGClient;
  let mockGet: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Create mock for the get method
    mockGet = vi.fn();
    
    // Mock FMPClient prototype get method using any to bypass protected access
    (FMPClient.prototype as any).get = mockGet;
    
    // Create ESGClient instance
    esgClient = new ESGClient('test-api-key');
  });

  describe('getDisclosures', () => {
    it('should call get with correct parameters', async () => {
      const mockData: ESGDisclosure[] = [
        {
          date: '2024-01-01',
          acceptedDate: '2024-01-02',
          symbol: 'AAPL',
          cik: '0000320193',
          companyName: 'Apple Inc.',
          formType: '10-K',
          environmentalScore: 85.5,
          socialScore: 78.2,
          governanceScore: 92.1,
          ESGScore: 85.3,
          url: 'https://example.com/filing.html'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await esgClient.getDisclosures('AAPL');

      expect(mockGet).toHaveBeenCalledWith('/esg-disclosure', {
        symbol: 'AAPL'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(esgClient.getDisclosures('AAPL'))
        .rejects.toThrow(errorMessage);
    });

    it('should pass options correctly', async () => {
      const mockData: ESGDisclosure[] = [];
      mockGet.mockResolvedValue(mockData);
      const abortSignal = new AbortController().signal;
      const context = { config: { FMP_ACCESS_TOKEN: 'test-token' } };

      await esgClient.getDisclosures('AAPL', {
        signal: abortSignal,
        context
      });

      expect(mockGet).toHaveBeenCalledWith('/esg-disclosure', {
        symbol: 'AAPL'
      }, {
        signal: abortSignal,
        context
      });
    });
  });

  describe('getRatings', () => {
    it('should call get with correct parameters', async () => {
      const mockData: ESGRating[] = [
        {
          symbol: 'MSFT',
          cik: '0000789019',
          companyName: 'Microsoft Corporation',
          industry: 'Technology',
          fiscalYear: 2024,
          ESGRiskRating: 'Low',
          industryRank: '5th percentile'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await esgClient.getRatings('MSFT');

      expect(mockGet).toHaveBeenCalledWith('/esg-ratings', {
        symbol: 'MSFT'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(esgClient.getRatings('MSFT'))
        .rejects.toThrow(errorMessage);
    });

    it('should pass options correctly', async () => {
      const mockData: ESGRating[] = [];
      mockGet.mockResolvedValue(mockData);
      const abortSignal = new AbortController().signal;
      const context = { config: { FMP_ACCESS_TOKEN: 'test-token' } };

      await esgClient.getRatings('MSFT', {
        signal: abortSignal,
        context
      });

      expect(mockGet).toHaveBeenCalledWith('/esg-ratings', {
        symbol: 'MSFT'
      }, {
        signal: abortSignal,
        context
      });
    });
  });

  describe('getBenchmarks', () => {
    it('should call get with correct parameters with year', async () => {
      const mockData: ESGBenchmark[] = [
        {
          fiscalYear: 2024,
          sector: 'Technology',
          environmentalScore: 82.5,
          socialScore: 75.8,
          governanceScore: 88.9,
          ESGScore: 82.4
        },
        {
          fiscalYear: 2024,
          sector: 'Healthcare',
          environmentalScore: 79.2,
          socialScore: 81.3,
          governanceScore: 85.7,
          ESGScore: 82.1
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await esgClient.getBenchmarks('2024');

      expect(mockGet).toHaveBeenCalledWith('/esg-benchmark', {
        year: '2024'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with correct parameters without year', async () => {
      const mockData: ESGBenchmark[] = [];
      mockGet.mockResolvedValue(mockData);

      const result = await esgClient.getBenchmarks();

      expect(mockGet).toHaveBeenCalledWith('/esg-benchmark', {
        year: undefined
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(esgClient.getBenchmarks('2024'))
        .rejects.toThrow(errorMessage);
    });

    it('should pass options correctly', async () => {
      const mockData: ESGBenchmark[] = [];
      mockGet.mockResolvedValue(mockData);
      const abortSignal = new AbortController().signal;
      const context = { config: { FMP_ACCESS_TOKEN: 'test-token' } };

      await esgClient.getBenchmarks('2024', {
        signal: abortSignal,
        context
      });

      expect(mockGet).toHaveBeenCalledWith('/esg-benchmark', {
        year: '2024'
      }, {
        signal: abortSignal,
        context
      });
    });
  });

  describe('constructor', () => {
    it('should create instance with API key', () => {
      const client = new ESGClient('my-api-key');
      expect(client).toBeInstanceOf(ESGClient);
    });

    it('should create instance without API key', () => {
      const client = new ESGClient();
      expect(client).toBeInstanceOf(ESGClient);
    });
  });
}); 