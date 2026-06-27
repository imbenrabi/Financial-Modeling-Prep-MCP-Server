import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CommodityClient } from '../../../../src/api/commodity/CommodityClient.js';
import { FMPClient } from '../../../../src/api/FMPClient.js';
import type {
  Commodity
} from '../../../../src/api/commodity/types.js';

// Mock the FMPClient
vi.mock('../FMPClient.js');

describe('CommodityClient', () => {
  let commodityClient: CommodityClient;
  let mockGet: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Create mock for the get method
    mockGet = vi.fn();
    
    // Mock FMPClient prototype get method using any to bypass protected access
    (FMPClient.prototype as any).get = mockGet;
    
    // Create CommodityClient instance
    commodityClient = new CommodityClient('test-api-key');
  });

  describe('listCommodities', () => {
    it('should call get with correct parameters', async () => {
      const mockData: Commodity[] = [
        {
          symbol: 'CL',
          name: 'Crude Oil',
          exchange: 'NYMEX',
          tradeMonth: '2024-03',
          currency: 'USD'
        },
        {
          symbol: 'GC',
          name: 'Gold',
          exchange: 'COMEX',
          tradeMonth: '2024-04',
          currency: 'USD'
        },
        {
          symbol: 'SI',
          name: 'Silver',
          exchange: 'COMEX',
          tradeMonth: '2024-03',
          currency: 'USD'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await commodityClient.listCommodities();

      expect(mockGet).toHaveBeenCalledWith('/commodity-list', {});
      expect(result).toEqual(mockData);
    });
    it('should handle empty response', async () => {
      const mockData: Commodity[] = [];
      mockGet.mockResolvedValue(mockData);

      const result = await commodityClient.listCommodities();

      expect(mockGet).toHaveBeenCalledWith('/commodity-list', {});
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(commodityClient.listCommodities())
        .rejects.toThrow(errorMessage);
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network Error');
      mockGet.mockRejectedValue(networkError);

      await expect(commodityClient.listCommodities())
        .rejects.toThrow('Network Error');
    });
    it('should handle large dataset response', async () => {
      const mockData: Commodity[] = Array.from({ length: 100 }, (_, index) => ({
        symbol: `COMM${index + 1}`,
        name: `Commodity ${index + 1}`,
        exchange: index % 2 === 0 ? 'NYMEX' : 'COMEX',
        tradeMonth: `2024-${String((index % 12) + 1).padStart(2, '0')}`,
        currency: 'USD'
      }));
      mockGet.mockResolvedValue(mockData);

      const result = await commodityClient.listCommodities();

      expect(mockGet).toHaveBeenCalledWith('/commodity-list', {});
      expect(result).toEqual(mockData);
      expect(result).toHaveLength(100);
    });
  });

  describe('constructor', () => {
    it('should create instance with API key', () => {
      const client = new CommodityClient('my-api-key');
      expect(client).toBeInstanceOf(CommodityClient);
    });

    it('should create instance without API key', () => {
      const client = new CommodityClient();
      expect(client).toBeInstanceOf(CommodityClient);
    });

    it('should extend FMPClient', () => {
      const client = new CommodityClient('test-key');
      expect(client).toBeInstanceOf(FMPClient);
    });
  });

  describe('inheritance', () => {
    it('should properly extend FMPClient', () => {
      expect(commodityClient).toBeInstanceOf(FMPClient);
      expect(commodityClient).toBeInstanceOf(CommodityClient);
    });

    it('should have access to parent class methods through inheritance', () => {
      // Test that the client has the expected structure
      expect(typeof commodityClient.listCommodities).toBe('function');
    });
  });
}); 