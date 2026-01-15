import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import { FMPClient } from '../../../src/api/FMPClient.js';

vi.mock('axios');
const mockedAxios = vi.mocked(axios);

// Create a test class that extends FMPClient to test protected methods
class TestFMPClient extends FMPClient {
  constructor(apiKey?: string) {
    super(apiKey);
  }

  // Expose protected methods for testing
  public async testGet<T>(
    endpoint: string,
    params: Record<string, any> = {},
    options?: {
      signal?: AbortSignal;
      context?: { config?: { FMP_ACCESS_TOKEN?: string } };
    }
  ): Promise<T> {
    return super.get<T>(endpoint, params, options);
  }

  public async testGetCSV(
    endpoint: string,
    params: Record<string, any> = {},
    options?: {
      signal?: AbortSignal;
      context?: { config?: { FMP_ACCESS_TOKEN?: string } };
    }
  ): Promise<string> {
    return super.getCSV(endpoint, params, options);
  }

  public async testPost<T>(
    endpoint: string,
    data: any,
    params: Record<string, any> = {},
    options?: {
      signal?: AbortSignal;
      context?: { config?: { FMP_ACCESS_TOKEN?: string } };
    }
  ): Promise<T> {
    return super.post<T>(endpoint, data, params, options);
  }
}

describe('FMPClient', () => {
  let client: TestFMPClient;
  let mockAxiosInstance: any;
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    // Store original environment
    originalEnv = { ...process.env };
    
    // Clear environment variables
    delete process.env.FMP_ACCESS_TOKEN;

    // Mock axios.create
    mockAxiosInstance = {
      get: vi.fn(),
      post: vi.fn(),
    };
    
    mockedAxios.create = vi.fn().mockReturnValue(mockAxiosInstance);
    
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  describe('Constructor', () => {
    it('should create client with API key', () => {
      client = new TestFMPClient('test-api-key');
      expect(client).toBeInstanceOf(FMPClient);
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'https://financialmodelingprep.com/stable',
      });
    });

    it('should create client without API key', () => {
      client = new TestFMPClient();
      expect(client).toBeInstanceOf(FMPClient);
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'https://financialmodelingprep.com/stable',
      });
    });
  });

  describe('API Key Resolution Priority', () => {
    it('should prioritize context config over constructor parameter', async () => {
      client = new TestFMPClient('constructor-token');
      
      mockAxiosInstance.get.mockResolvedValue({ data: { result: 'success' } });
      
      await client.testGet('/test', {}, {
        context: { config: { FMP_ACCESS_TOKEN: 'context-token' } }
      });
      
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test', {
        params: { apikey: 'context-token' }
      });
    });

    it('should prioritize context config over environment variable', async () => {
      process.env.FMP_ACCESS_TOKEN = 'env-token';
      client = new TestFMPClient();
      
      mockAxiosInstance.get.mockResolvedValue({ data: { result: 'success' } });
      
      await client.testGet('/test', {}, {
        context: { config: { FMP_ACCESS_TOKEN: 'context-token' } }
      });
      
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test', {
        params: { apikey: 'context-token' }
      });
    });

    it('should fall back to constructor parameter when no context', async () => {
      client = new TestFMPClient('constructor-token');
      
      mockAxiosInstance.get.mockResolvedValue({ data: { result: 'success' } });
      
      await client.testGet('/test');
      
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test', {
        params: { apikey: 'constructor-token' }
      });
    });

    it('should fall back to environment variable when no context or constructor parameter', async () => {
      process.env.FMP_ACCESS_TOKEN = 'env-token';
      client = new TestFMPClient();
      
      mockAxiosInstance.get.mockResolvedValue({ data: { result: 'success' } });
      
      await client.testGet('/test');
      
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test', {
        params: { apikey: 'env-token' }
      });
    });

    it('should throw error when no API key is available', async () => {
      client = new TestFMPClient();
      
      await expect(client.testGet('/test')).rejects.toThrow(
        'FMP_ACCESS_TOKEN is required for this operation. Please provide it in the configuration.'
      );
    });
  });

  describe('GET requests', () => {
    beforeEach(() => {
      client = new TestFMPClient('test-token');
    });

    it('should make successful GET request', async () => {
      const mockData = { symbol: 'AAPL', price: 150 };
      mockAxiosInstance.get.mockResolvedValue({ data: mockData });

      const result = await client.testGet('/test', { symbol: 'AAPL' });

      expect(result).toEqual(mockData);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test', {
        params: { symbol: 'AAPL', apikey: 'test-token' }
      });
    });

    it('should include abort signal in request config', async () => {
      const mockData = { result: 'success' };
      mockAxiosInstance.get.mockResolvedValue({ data: mockData });
      
      const abortController = new AbortController();
      
      await client.testGet('/test', {}, { signal: abortController.signal });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test', {
        params: { apikey: 'test-token' },
        signal: abortController.signal
      });
    });

    it('should handle axios errors', async () => {
      const axiosError = {
        response: {
          data: { message: 'API rate limit exceeded' }
        },
        message: 'Request failed'
      };
      
      mockAxiosInstance.get.mockRejectedValue(axiosError);
      vi.mocked(mockedAxios.isAxiosError).mockReturnValue(true);

      await expect(client.testGet('/test')).rejects.toThrow(
        'FMP API Error: API rate limit exceeded'
      );
    });

    it('should handle non-axios errors', async () => {
      const genericError = new Error('Network error');
      
      mockAxiosInstance.get.mockRejectedValue(genericError);
      vi.mocked(mockedAxios.isAxiosError).mockReturnValue(false);

      await expect(client.testGet('/test')).rejects.toThrow(
        'Unexpected error: Network error'
      );
    });
  });

  describe('CSV requests', () => {
    beforeEach(() => {
      client = new TestFMPClient('test-token');
    });

    it('should make successful CSV request', async () => {
      const mockCsvData = 'symbol,price\nAAPL,150\nGOOGL,2500';
      mockAxiosInstance.get.mockResolvedValue({ data: mockCsvData });

      const result = await client.testGetCSV('/test-csv', { format: 'csv' });

      expect(result).toEqual(mockCsvData);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test-csv', {
        params: { format: 'csv', apikey: 'test-token' },
        responseType: 'text'
      });
    });

    it('should include abort signal in CSV request config', async () => {
      const mockCsvData = 'data';
      mockAxiosInstance.get.mockResolvedValue({ data: mockCsvData });
      
      const abortController = new AbortController();
      
      await client.testGetCSV('/test-csv', {}, { signal: abortController.signal });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test-csv', {
        params: { apikey: 'test-token' },
        responseType: 'text',
        signal: abortController.signal
      });
    });
  });

  describe('POST requests', () => {
    beforeEach(() => {
      client = new TestFMPClient('test-token');
    });

    it('should make successful POST request', async () => {
      const mockData = { success: true };
      const postData = { symbol: 'AAPL' };
      mockAxiosInstance.post.mockResolvedValue({ data: mockData });

      const result = await client.testPost('/test-post', postData, { limit: 10 });

      expect(result).toEqual(mockData);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/test-post', postData, {
        params: { limit: 10, apikey: 'test-token' }
      });
    });

    it('should include abort signal in POST request config', async () => {
      const mockData = { success: true };
      const postData = { symbol: 'AAPL' };
      mockAxiosInstance.post.mockResolvedValue({ data: mockData });
      
      const abortController = new AbortController();
      
      await client.testPost('/test-post', postData, {}, { signal: abortController.signal });

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/test-post', postData, {
        params: { apikey: 'test-token' },
        signal: abortController.signal
      });
    });
  });

  describe('Docker Integration Scenarios', () => {
    it('should work with Docker environment variables', async () => {
      // Simulate Docker environment
      process.env.FMP_ACCESS_TOKEN = 'docker-token-from-compose';
      client = new TestFMPClient();
      
      mockAxiosInstance.get.mockResolvedValue({ data: { result: 'success' } });
      
      await client.testGet('/test');
      
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test', {
        params: { apikey: 'docker-token-from-compose' }
      });
    });

    it('should work with Smithery SDK context (Docker + Smithery)', async () => {
      // Simulate Docker environment with Smithery SDK providing context
      process.env.FMP_ACCESS_TOKEN = 'docker-token';
      client = new TestFMPClient();
      
      mockAxiosInstance.get.mockResolvedValue({ data: { result: 'success' } });
      
      // Smithery SDK passes the token via context
      await client.testGet('/test', {}, {
        context: { config: { FMP_ACCESS_TOKEN: 'smithery-provided-token' } }
      });
      
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test', {
        params: { apikey: 'smithery-provided-token' }
      });
    });

    it('should handle tool discovery mode (no token)', async () => {
      client = new TestFMPClient();
      
      await expect(client.testGet('/test')).rejects.toThrow(
        'FMP_ACCESS_TOKEN is required for this operation. Please provide it in the configuration.'
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string API key in constructor', async () => {
      client = new TestFMPClient('');
      
      await expect(client.testGet('/test')).rejects.toThrow(
        'FMP_ACCESS_TOKEN is required for this operation. Please provide it in the configuration.'
      );
    });

    it('should handle empty string API key in environment', async () => {
      process.env.FMP_ACCESS_TOKEN = '';
      client = new TestFMPClient();
      
      await expect(client.testGet('/test')).rejects.toThrow(
        'FMP_ACCESS_TOKEN is required for this operation. Please provide it in the configuration.'
      );
    });

    it('should handle empty string API key in context', async () => {
      client = new TestFMPClient('fallback-token');
      
      mockAxiosInstance.get.mockResolvedValue({ data: { result: 'success' } });
      
      // Empty context token should fall back to constructor/env
      await client.testGet('/test', {}, {
        context: { config: { FMP_ACCESS_TOKEN: '' } }
      });
      
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test', {
        params: { apikey: 'fallback-token' }
      });
    });

    it('should handle undefined context config', async () => {
      client = new TestFMPClient('fallback-token');
      
      mockAxiosInstance.get.mockResolvedValue({ data: { result: 'success' } });
      
      await client.testGet('/test', {}, { context: {} });
      
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test', {
        params: { apikey: 'fallback-token' }
      });
    });
  });
}); 