import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EarningsTranscriptClient } from '../../../../src/api/earnings-transcript/EarningsTranscriptClient.js';
import { FMPClient } from '../../../../src/api/FMPClient.js';
import type {
  LatestEarningTranscript,
  EarningTranscript,
  TranscriptDate,
  AvailableTranscriptSymbol,
} from '../../../../src/api/earnings-transcript/types.js';

// Mock the FMPClient
vi.mock('../FMPClient.js');

describe('EarningsTranscriptClient', () => {
  let earningsTranscriptClient: EarningsTranscriptClient;
  let mockGet: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Create mock for the get method
    mockGet = vi.fn();
    
    // Mock FMPClient prototype get method using any to bypass protected access
    (FMPClient.prototype as any).get = mockGet;
    
    // Create EarningsTranscriptClient instance
    earningsTranscriptClient = new EarningsTranscriptClient('test-api-key');
  });

  describe('getLatestTranscripts', () => {
    it('should call get with correct parameters with all options', async () => {
      const mockData: LatestEarningTranscript[] = [
        {
          symbol: 'AAPL',
          period: 'Q4',
          fiscalYear: 2024,
          date: '2024-01-15'
        },
        {
          symbol: 'MSFT',
          period: 'Q3',
          fiscalYear: 2024,
          date: '2024-01-10'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await earningsTranscriptClient.getLatestTranscripts({
        limit: 10,
        page: 0
      });

      expect(mockGet).toHaveBeenCalledWith('/earning-call-transcript-latest', {
        limit: 10,
        page: 0
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with correct parameters without optional params', async () => {
      const mockData: LatestEarningTranscript[] = [];
      mockGet.mockResolvedValue(mockData);

      const result = await earningsTranscriptClient.getLatestTranscripts();

      expect(mockGet).toHaveBeenCalledWith('/earning-call-transcript-latest', {
        limit: undefined,
        page: undefined
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with options including signal and context', async () => {
      const mockData: LatestEarningTranscript[] = [];
      mockGet.mockResolvedValue(mockData);
      const abortController = new AbortController();
      const context = { config: { FMP_ACCESS_TOKEN: 'test-token' } };

      const result = await earningsTranscriptClient.getLatestTranscripts(
        { limit: 5 },
        { signal: abortController.signal, context }
      );

      expect(mockGet).toHaveBeenCalledWith('/earning-call-transcript-latest', {
        limit: 5,
        page: undefined
      }, { signal: abortController.signal, context });
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(earningsTranscriptClient.getLatestTranscripts())
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getTranscript', () => {
    it('should call get with correct parameters with all options', async () => {
      const mockData: EarningTranscript[] = [
        {
          symbol: 'AAPL',
          period: 'Q4',
          year: 2024,
          date: '2024-01-15',
          content: 'Thank you for joining Apple\'s Q4 2024 earnings call...'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await earningsTranscriptClient.getTranscript({
        symbol: 'AAPL',
        year: '2024',
        quarter: '4',
        limit: 1
      });

      expect(mockGet).toHaveBeenCalledWith('/earning-call-transcript', {
        symbol: 'AAPL',
        year: '2024',
        quarter: '4',
        limit: 1
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with correct parameters without optional limit', async () => {
      const mockData: EarningTranscript[] = [];
      mockGet.mockResolvedValue(mockData);

      const result = await earningsTranscriptClient.getTranscript({
        symbol: 'MSFT',
        year: '2023',
        quarter: '3'
      });

      expect(mockGet).toHaveBeenCalledWith('/earning-call-transcript', {
        symbol: 'MSFT',
        year: '2023',
        quarter: '3',
        limit: undefined
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with options including signal and context', async () => {
      const mockData: EarningTranscript[] = [];
      mockGet.mockResolvedValue(mockData);
      const abortController = new AbortController();
      const context = { config: { FMP_ACCESS_TOKEN: 'test-token' } };

      const result = await earningsTranscriptClient.getTranscript(
        {
          symbol: 'GOOGL',
          year: '2024',
          quarter: '1'
        },
        { signal: abortController.signal, context }
      );

      expect(mockGet).toHaveBeenCalledWith('/earning-call-transcript', {
        symbol: 'GOOGL',
        year: '2024',
        quarter: '1',
        limit: undefined
      }, { signal: abortController.signal, context });
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'Transcript not found';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(earningsTranscriptClient.getTranscript({
        symbol: 'AAPL',
        year: '2024',
        quarter: '4'
      })).rejects.toThrow(errorMessage);
    });
  });

  describe('getTranscriptDates', () => {
    it('should call get with correct parameters', async () => {
      const mockData: TranscriptDate[] = [
        {
          quarter: 4,
          fiscalYear: 2024,
          date: '2024-01-15'
        },
        {
          quarter: 3,
          fiscalYear: 2024,
          date: '2023-10-15'
        },
        {
          quarter: 2,
          fiscalYear: 2024,
          date: '2023-07-15'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await earningsTranscriptClient.getTranscriptDates({
        symbol: 'AAPL'
      });

      expect(mockGet).toHaveBeenCalledWith('/earning-call-transcript-dates', {
        symbol: 'AAPL'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with options including signal and context', async () => {
      const mockData: TranscriptDate[] = [];
      mockGet.mockResolvedValue(mockData);
      const abortController = new AbortController();
      const context = { config: { FMP_ACCESS_TOKEN: 'test-token' } };

      const result = await earningsTranscriptClient.getTranscriptDates(
        { symbol: 'TSLA' },
        { signal: abortController.signal, context }
      );

      expect(mockGet).toHaveBeenCalledWith('/earning-call-transcript-dates', {
        symbol: 'TSLA'
      }, { signal: abortController.signal, context });
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'Symbol not found';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(earningsTranscriptClient.getTranscriptDates({
        symbol: 'INVALID'
      })).rejects.toThrow(errorMessage);
    });
  });

  describe('getAvailableTranscriptSymbols', () => {
    it('should call get with correct parameters', async () => {
      const mockData: AvailableTranscriptSymbol[] = [
        {
          symbol: 'AAPL',
          companyName: 'Apple Inc.',
          noOfTranscripts: '45'
        },
        {
          symbol: 'MSFT',
          companyName: 'Microsoft Corporation',
          noOfTranscripts: '38'
        },
        {
          symbol: 'GOOGL',
          companyName: 'Alphabet Inc.',
          noOfTranscripts: '42'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await earningsTranscriptClient.getAvailableTranscriptSymbols();

      expect(mockGet).toHaveBeenCalledWith('/earnings-transcript-list', {}, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with options including signal and context', async () => {
      const mockData: AvailableTranscriptSymbol[] = [];
      mockGet.mockResolvedValue(mockData);
      const abortController = new AbortController();
      const context = { config: { FMP_ACCESS_TOKEN: 'test-token' } };

      const result = await earningsTranscriptClient.getAvailableTranscriptSymbols({
        signal: abortController.signal,
        context
      });

      expect(mockGet).toHaveBeenCalledWith('/earnings-transcript-list', {}, {
        signal: abortController.signal,
        context
      });
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'Service unavailable';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(earningsTranscriptClient.getAvailableTranscriptSymbols())
        .rejects.toThrow(errorMessage);
    });
  });

  describe('constructor', () => {
    it('should create instance with API key', () => {
      const client = new EarningsTranscriptClient('my-api-key');
      expect(client).toBeInstanceOf(EarningsTranscriptClient);
    });

    it('should create instance without API key', () => {
      const client = new EarningsTranscriptClient();
      expect(client).toBeInstanceOf(EarningsTranscriptClient);
    });
  });
}); 
