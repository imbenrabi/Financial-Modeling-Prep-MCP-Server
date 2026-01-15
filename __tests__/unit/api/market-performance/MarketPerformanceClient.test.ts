import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MarketPerformanceClient } from '../../../../src/api/market-performance/MarketPerformanceClient.js';
import { FMPClient } from '../../../../src/api/FMPClient.js';
import type {
  SectorPerformance,
  IndustryPerformance,
  SectorPE,
  IndustryPE,
  StockMovement,
} from '../../../../src/api/market-performance/types.js';

// Mock the FMPClient
vi.mock('../FMPClient.js');

describe('MarketPerformanceClient', () => {
  let marketPerformanceClient: MarketPerformanceClient;
  let mockGet: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Create mock for the get method
    mockGet = vi.fn();
    
    // Mock FMPClient prototype get method using any to bypass protected access
    (FMPClient.prototype as any).get = mockGet;
    
    // Create MarketPerformanceClient instance
    marketPerformanceClient = new MarketPerformanceClient('test-api-key');
  });

  describe('getSectorPerformanceSnapshot', () => {
    it('should call get with correct parameters for date and filters', async () => {
      const mockData: SectorPerformance[] = [
        {
          date: '2024-01-01',
          sector: 'Technology',
          exchange: 'NASDAQ',
          averageChange: 2.5
        },
        {
          date: '2024-01-01',
          sector: 'Energy',
          exchange: 'NYSE',
          averageChange: -1.2
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await marketPerformanceClient.getSectorPerformanceSnapshot('2024-01-01', {
        exchange: 'NASDAQ',
        sector: 'Technology'
      });

      expect(mockGet).toHaveBeenCalledWith('/sector-performance-snapshot', {
        date: '2024-01-01',
        exchange: 'NASDAQ',
        sector: 'Technology'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with correct parameters for date only', async () => {
      const mockData: SectorPerformance[] = [];
      mockGet.mockResolvedValue(mockData);

      const result = await marketPerformanceClient.getSectorPerformanceSnapshot('2024-01-01');

      expect(mockGet).toHaveBeenCalledWith('/sector-performance-snapshot', {
        date: '2024-01-01'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(marketPerformanceClient.getSectorPerformanceSnapshot('2024-01-01'))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getIndustryPerformanceSnapshot', () => {
    it('should call get with correct parameters for date and filters', async () => {
      const mockData: IndustryPerformance[] = [
        {
          date: '2024-01-01',
          industry: 'Software',
          exchange: 'NASDAQ',
          averageChange: 3.2
        },
        {
          date: '2024-01-01',
          industry: 'Oil & Gas',
          exchange: 'NYSE',
          averageChange: -0.8
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await marketPerformanceClient.getIndustryPerformanceSnapshot('2024-01-01', {
        exchange: 'NASDAQ',
        industry: 'Software'
      });

      expect(mockGet).toHaveBeenCalledWith('/industry-performance-snapshot', {
        date: '2024-01-01',
        exchange: 'NASDAQ',
        industry: 'Software'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with correct parameters for date only', async () => {
      const mockData: IndustryPerformance[] = [];
      mockGet.mockResolvedValue(mockData);

      const result = await marketPerformanceClient.getIndustryPerformanceSnapshot('2024-01-01');

      expect(mockGet).toHaveBeenCalledWith('/industry-performance-snapshot', {
        date: '2024-01-01'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(marketPerformanceClient.getIndustryPerformanceSnapshot('2024-01-01'))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getHistoricalSectorPerformance', () => {
    it('should call get with correct parameters with all filters', async () => {
      const mockData: SectorPerformance[] = [
        {
          date: '2024-01-01',
          sector: 'Technology',
          exchange: 'NASDAQ',
          averageChange: 2.5
        },
        {
          date: '2023-12-31',
          sector: 'Technology',
          exchange: 'NASDAQ',
          averageChange: 1.8
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await marketPerformanceClient.getHistoricalSectorPerformance('Technology', {
        from: '2023-12-01',
        to: '2024-01-01',
        exchange: 'NASDAQ'
      });

      expect(mockGet).toHaveBeenCalledWith('/historical-sector-performance', {
        sector: 'Technology',
        from: '2023-12-01',
        to: '2024-01-01',
        exchange: 'NASDAQ'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with correct parameters for sector only', async () => {
      const mockData: SectorPerformance[] = [];
      mockGet.mockResolvedValue(mockData);

      const result = await marketPerformanceClient.getHistoricalSectorPerformance('Energy');

      expect(mockGet).toHaveBeenCalledWith('/historical-sector-performance', {
        sector: 'Energy'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(marketPerformanceClient.getHistoricalSectorPerformance('Technology'))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getHistoricalIndustryPerformance', () => {
    it('should call get with correct parameters with all filters', async () => {
      const mockData: IndustryPerformance[] = [
        {
          date: '2024-01-01',
          industry: 'Software',
          exchange: 'NASDAQ',
          averageChange: 3.2
        },
        {
          date: '2023-12-31',
          industry: 'Software',
          exchange: 'NASDAQ',
          averageChange: 2.1
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await marketPerformanceClient.getHistoricalIndustryPerformance('Software', {
        from: '2023-12-01',
        to: '2024-01-01',
        exchange: 'NASDAQ'
      });

      expect(mockGet).toHaveBeenCalledWith('/historical-industry-performance', {
        industry: 'Software',
        from: '2023-12-01',
        to: '2024-01-01',
        exchange: 'NASDAQ'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with correct parameters for industry only', async () => {
      const mockData: IndustryPerformance[] = [];
      mockGet.mockResolvedValue(mockData);

      const result = await marketPerformanceClient.getHistoricalIndustryPerformance('Biotechnology');

      expect(mockGet).toHaveBeenCalledWith('/historical-industry-performance', {
        industry: 'Biotechnology'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(marketPerformanceClient.getHistoricalIndustryPerformance('Software'))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getSectorPESnapshot', () => {
    it('should call get with correct parameters for date and filters', async () => {
      const mockData: SectorPE[] = [
        {
          date: '2024-01-01',
          sector: 'Technology',
          exchange: 'NASDAQ',
          pe: 25.5
        },
        {
          date: '2024-01-01',
          sector: 'Energy',
          exchange: 'NYSE',
          pe: 12.3
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await marketPerformanceClient.getSectorPESnapshot('2024-01-01', {
        exchange: 'NASDAQ',
        sector: 'Technology'
      });

      expect(mockGet).toHaveBeenCalledWith('/sector-pe-snapshot', {
        date: '2024-01-01',
        exchange: 'NASDAQ',
        sector: 'Technology'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with correct parameters for date only', async () => {
      const mockData: SectorPE[] = [];
      mockGet.mockResolvedValue(mockData);

      const result = await marketPerformanceClient.getSectorPESnapshot('2024-01-01');

      expect(mockGet).toHaveBeenCalledWith('/sector-pe-snapshot', {
        date: '2024-01-01'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(marketPerformanceClient.getSectorPESnapshot('2024-01-01'))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getIndustryPESnapshot', () => {
    it('should call get with correct parameters for date and filters', async () => {
      const mockData: IndustryPE[] = [
        {
          date: '2024-01-01',
          industry: 'Software',
          exchange: 'NASDAQ',
          pe: 28.7
        },
        {
          date: '2024-01-01',
          industry: 'Oil & Gas',
          exchange: 'NYSE',
          pe: 10.2
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await marketPerformanceClient.getIndustryPESnapshot('2024-01-01', {
        exchange: 'NASDAQ',
        industry: 'Software'
      });

      expect(mockGet).toHaveBeenCalledWith('/industry-pe-snapshot', {
        date: '2024-01-01',
        exchange: 'NASDAQ',
        industry: 'Software'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with correct parameters for date only', async () => {
      const mockData: IndustryPE[] = [];
      mockGet.mockResolvedValue(mockData);

      const result = await marketPerformanceClient.getIndustryPESnapshot('2024-01-01');

      expect(mockGet).toHaveBeenCalledWith('/industry-pe-snapshot', {
        date: '2024-01-01'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(marketPerformanceClient.getIndustryPESnapshot('2024-01-01'))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getHistoricalSectorPE', () => {
    it('should call get with correct parameters with all filters', async () => {
      const mockData: SectorPE[] = [
        {
          date: '2024-01-01',
          sector: 'Technology',
          exchange: 'NASDAQ',
          pe: 25.5
        },
        {
          date: '2023-12-31',
          sector: 'Technology',
          exchange: 'NASDAQ',
          pe: 24.8
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await marketPerformanceClient.getHistoricalSectorPE('Technology', {
        from: '2023-12-01',
        to: '2024-01-01',
        exchange: 'NASDAQ'
      });

      expect(mockGet).toHaveBeenCalledWith('/historical-sector-pe', {
        sector: 'Technology',
        from: '2023-12-01',
        to: '2024-01-01',
        exchange: 'NASDAQ'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with correct parameters for sector only', async () => {
      const mockData: SectorPE[] = [];
      mockGet.mockResolvedValue(mockData);

      const result = await marketPerformanceClient.getHistoricalSectorPE('Energy');

      expect(mockGet).toHaveBeenCalledWith('/historical-sector-pe', {
        sector: 'Energy'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(marketPerformanceClient.getHistoricalSectorPE('Technology'))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getHistoricalIndustryPE', () => {
    it('should call get with correct parameters with all filters', async () => {
      const mockData: IndustryPE[] = [
        {
          date: '2024-01-01',
          industry: 'Software',
          exchange: 'NASDAQ',
          pe: 28.7
        },
        {
          date: '2023-12-31',
          industry: 'Software',
          exchange: 'NASDAQ',
          pe: 27.5
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await marketPerformanceClient.getHistoricalIndustryPE('Software', {
        from: '2023-12-01',
        to: '2024-01-01',
        exchange: 'NASDAQ'
      });

      expect(mockGet).toHaveBeenCalledWith('/historical-industry-pe', {
        industry: 'Software',
        from: '2023-12-01',
        to: '2024-01-01',
        exchange: 'NASDAQ'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with correct parameters for industry only', async () => {
      const mockData: IndustryPE[] = [];
      mockGet.mockResolvedValue(mockData);

      const result = await marketPerformanceClient.getHistoricalIndustryPE('Biotechnology');

      expect(mockGet).toHaveBeenCalledWith('/historical-industry-pe', {
        industry: 'Biotechnology'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(marketPerformanceClient.getHistoricalIndustryPE('Software'))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getBiggestGainers', () => {
    it('should call get with correct parameters', async () => {
      const mockData: StockMovement[] = [
        {
          symbol: 'AAPL',
          price: 185.50,
          name: 'Apple Inc.',
          change: 5.25,
          changesPercentage: 2.92,
          exchange: 'NASDAQ'
        },
        {
          symbol: 'MSFT',
          price: 412.30,
          name: 'Microsoft Corporation',
          change: 8.15,
          changesPercentage: 2.02,
          exchange: 'NASDAQ'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await marketPerformanceClient.getBiggestGainers();

      expect(mockGet).toHaveBeenCalledWith('/biggest-gainers', {}, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(marketPerformanceClient.getBiggestGainers())
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getBiggestLosers', () => {
    it('should call get with correct parameters', async () => {
      const mockData: StockMovement[] = [
        {
          symbol: 'XYZ',
          price: 45.20,
          name: 'XYZ Corporation',
          change: -3.80,
          changesPercentage: -7.75,
          exchange: 'NYSE'
        },
        {
          symbol: 'ABC',
          price: 78.15,
          name: 'ABC Industries',
          change: -2.35,
          changesPercentage: -2.92,
          exchange: 'NASDAQ'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await marketPerformanceClient.getBiggestLosers();

      expect(mockGet).toHaveBeenCalledWith('/biggest-losers', {}, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(marketPerformanceClient.getBiggestLosers())
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getMostActiveStocks', () => {
    it('should call get with correct parameters', async () => {
      const mockData: StockMovement[] = [
        {
          symbol: 'TSLA',
          price: 245.80,
          name: 'Tesla Inc.',
          change: 12.40,
          changesPercentage: 5.32,
          exchange: 'NASDAQ'
        },
        {
          symbol: 'NVDA',
          price: 875.25,
          name: 'NVIDIA Corporation',
          change: -15.75,
          changesPercentage: -1.77,
          exchange: 'NASDAQ'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await marketPerformanceClient.getMostActiveStocks();

      expect(mockGet).toHaveBeenCalledWith('/most-actives', {}, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(marketPerformanceClient.getMostActiveStocks())
        .rejects.toThrow(errorMessage);
    });
  });

  describe('constructor', () => {
    it('should create instance with API key', () => {
      const client = new MarketPerformanceClient('my-api-key');
      expect(client).toBeInstanceOf(MarketPerformanceClient);
    });

    it('should create instance without API key', () => {
      const client = new MarketPerformanceClient();
      expect(client).toBeInstanceOf(MarketPerformanceClient);
    });
  });
}); 