import { describe, it, expect, vi, beforeEach } from 'vitest';
import { COTClient } from '../../../../src/api/cot/COTClient.js';
import { FMPClient } from '../../../../src/api/FMPClient.js';
import type {
  COTReport,
  COTAnalysis,
  COTList,
} from '../../../../src/api/cot/types.js';

// Mock the FMPClient
vi.mock('../FMPClient.js');

describe('COTClient', () => {
  let cotClient: COTClient;
  let mockGet: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Create mock for the get method
    mockGet = vi.fn();
    
    // Mock FMPClient prototype get method using any to bypass protected access
    (FMPClient.prototype as any).get = mockGet;
    
    // Create COTClient instance
    cotClient = new COTClient('test-api-key');
  });

  describe('getReports', () => {
    it('should call get with correct parameters for symbol only', async () => {
      const mockData: COTReport[] = [
        {
          symbol: 'GC',
          date: '2024-01-15',
          name: 'GOLD - COMMODITY EXCHANGE INC.',
          sector: 'Precious Metals',
          marketAndExchangeNames: 'COMEX',
          cftcContractMarketCode: '084',
          cftcMarketCode: 'GC',
          cftcRegionCode: '1',
          cftcCommodityCode: '001',
          openInterestAll: 523456,
          noncommPositionsLongAll: 234567,
          noncommPositionsShortAll: 198765,
          noncommPositionsSpreadAll: 45678,
          commPositionsLongAll: 167890,
          commPositionsShortAll: 189234,
          totReptPositionsLongAll: 402457,
          totReptPositionsShortAll: 387999,
          nonreptPositionsLongAll: 120999,
          nonreptPositionsShortAll: 135457,
          openInterestOld: 512345,
          noncommPositionsLongOld: 228765,
          noncommPositionsShortOld: 195432,
          noncommPositionsSpreadOld: 44321,
          commPositionsLongOld: 164567,
          commPositionsShortOld: 186543,
          totReptPositionsLongOld: 393332,
          totReptPositionsShortOld: 381975,
          nonreptPositionsLongOld: 119013,
          nonreptPositionsShortOld: 130370,
          openInterestOther: 498765,
          noncommPositionsLongOther: 221234,
          noncommPositionsShortOther: 189876,
          noncommPositionsSpreadOther: 43210,
          commPositionsLongOther: 159876,
          commPositionsShortOther: 182345,
          totReptPositionsLongOther: 381110,
          totReptPositionsShortOther: 372221,
          nonreptPositionsLongOther: 117655,
          nonreptPositionsShortOther: 126544,
          changeInOpenInterestAll: 11111,
          changeInNoncommLongAll: 5802,
          changeInNoncommShortAll: 3333,
          changeInNoncommSpeadAll: 1357,
          changeInCommLongAll: 3323,
          changeInCommShortAll: 2691,
          changeInTotReptLongAll: 9125,
          changeInTotReptShortAll: 6024,
          changeInNonreptLongAll: 1986,
          changeInNonreptShortAll: 5087,
          pctOfOpenInterestAll: 100.0,
          pctOfOiNoncommLongAll: 44.8,
          pctOfOiNoncommShortAll: 38.0,
          pctOfOiNoncommSpreadAll: 8.7,
          pctOfOiCommLongAll: 32.1,
          pctOfOiCommShortAll: 36.1,
          pctOfOiTotReptLongAll: 76.9,
          pctOfOiTotReptShortAll: 74.1,
          pctOfOiNonreptLongAll: 23.1,
          pctOfOiNonreptShortAll: 25.9,
          pctOfOpenInterestOl: 95.3,
          pctOfOiNoncommLongOl: 43.2,
          pctOfOiNoncommShortOl: 37.1,
          pctOfOiNoncommSpreadOl: 8.4,
          pctOfOiCommLongOl: 31.2,
          pctOfOiCommShortOl: 35.4,
          pctOfOiTotReptLongOl: 74.4,
          pctOfOiTotReptShortOl: 72.5,
          pctOfOiNonreptLongOl: 25.6,
          pctOfOiNonreptShortOl: 27.5,
          pctOfOpenInterestOther: 95.3,
          pctOfOiNoncommLongOther: 44.4,
          pctOfOiNoncommShortOther: 38.1,
          pctOfOiNoncommSpreadOther: 8.7,
          pctOfOiCommLongOther: 32.1,
          pctOfOiCommShortOther: 36.6,
          pctOfOiTotReptLongOther: 76.4,
          pctOfOiTotReptShortOther: 74.7,
          pctOfOiNonreptLongOther: 23.6,
          pctOfOiNonreptShortOther: 25.3,
          tradersTotAll: 287,
          tradersNoncommLongAll: 156,
          tradersNoncommShortAll: 134,
          tradersNoncommSpreadAll: 89,
          tradersCommLongAll: 67,
          tradersCommShortAll: 78,
          tradersTotReptLongAll: 223,
          tradersTotReptShortAll: 212,
          tradersTotOl: 245,
          tradersNoncommLongOl: 142,
          tradersNoncommShortOl: 128,
          tradersNoncommSpeadOl: 85,
          tradersCommLongOl: 63,
          tradersCommShortOl: 74,
          tradersTotReptLongOl: 205,
          tradersTotReptShortOl: 202,
          tradersTotOther: 245,
          tradersNoncommLongOther: 142,
          tradersNoncommShortOther: 128,
          tradersNoncommSpreadOther: 85,
          tradersCommLongOther: 63,
          tradersCommShortOther: 74,
          tradersTotReptLongOther: 205,
          tradersTotReptShortOther: 202,
          concGrossLe4TdrLongAll: 45.2,
          concGrossLe4TdrShortAll: 42.1,
          concGrossLe8TdrLongAll: 67.8,
          concGrossLe8TdrShortAll: 63.5,
          concNetLe4TdrLongAll: 28.9,
          concNetLe4TdrShortAll: 31.2,
          concNetLe8TdrLongAll: 52.4,
          concNetLe8TdrShortAll: 48.7,
          concGrossLe4TdrLongOl: 44.1,
          concGrossLe4TdrShortOl: 41.3,
          concGrossLe8TdrLongOl: 66.7,
          concGrossLe8TdrShortOl: 62.4,
          concNetLe4TdrLongOl: 27.8,
          concNetLe4TdrShortOl: 30.1,
          concNetLe8TdrLongOl: 51.3,
          concNetLe8TdrShortOl: 47.6,
          concGrossLe4TdrLongOther: 44.1,
          concGrossLe4TdrShortOther: 41.3,
          concGrossLe8TdrLongOther: 66.7,
          concGrossLe8TdrShortOther: 62.4,
          concNetLe4TdrLongOther: 27.8,
          concNetLe4TdrShortOther: 30.1,
          concNetLe8TdrLongOther: 51.3,
          concNetLe8TdrShortOther: 47.6,
          contractUnits: 'TROY OUNCES'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await cotClient.getReports('GC');

      expect(mockGet).toHaveBeenCalledWith('/commitment-of-traders-report', {
        symbol: 'GC',
        from: undefined,
        to: undefined
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with correct parameters with date range', async () => {
      const mockData: COTReport[] = [];
      mockGet.mockResolvedValue(mockData);

      const result = await cotClient.getReports('GC', '2024-01-01', '2024-01-31');

      expect(mockGet).toHaveBeenCalledWith('/commitment-of-traders-report', {
        symbol: 'GC',
        from: '2024-01-01',
        to: '2024-01-31'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle options parameter', async () => {
      const mockData: COTReport[] = [];
      mockGet.mockResolvedValue(mockData);

      const options = { signal: new AbortController().signal };
      await cotClient.getReports('GC', undefined, undefined, options);

      expect(mockGet).toHaveBeenCalledWith('/commitment-of-traders-report', {
        symbol: 'GC',
        from: undefined,
        to: undefined
      }, options);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(cotClient.getReports('GC'))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getAnalysis', () => {
    it('should call get with correct parameters for symbol only', async () => {
      const mockData: COTAnalysis[] = [
        {
          symbol: 'GC',
          date: '2024-01-15',
          name: 'GOLD - COMMODITY EXCHANGE INC.',
          sector: 'Precious Metals',
          exchange: 'COMEX',
          currentLongMarketSituation: 72.5,
          currentShortMarketSituation: 68.2,
          marketSituation: 'Bullish',
          previousLongMarketSituation: 69.8,
          previousShortMarketSituation: 71.3,
          previousMarketSituation: 'Bearish',
          netPostion: 35802,
          previousNetPosition: 33267,
          changeInNetPosition: 2535,
          marketSentiment: 'Improving',
          reversalTrend: true
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await cotClient.getAnalysis('GC');

      expect(mockGet).toHaveBeenCalledWith('/commitment-of-traders-analysis', {
        symbol: 'GC',
        from: undefined,
        to: undefined
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with correct parameters with date range', async () => {
      const mockData: COTAnalysis[] = [];
      mockGet.mockResolvedValue(mockData);

      const result = await cotClient.getAnalysis('CL', '2024-01-01', '2024-01-31');

      expect(mockGet).toHaveBeenCalledWith('/commitment-of-traders-analysis', {
        symbol: 'CL',
        from: '2024-01-01',
        to: '2024-01-31'
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle options parameter', async () => {
      const mockData: COTAnalysis[] = [];
      mockGet.mockResolvedValue(mockData);

      const options = { signal: new AbortController().signal };
      await cotClient.getAnalysis('GC', '2024-01-01', undefined, options);

      expect(mockGet).toHaveBeenCalledWith('/commitment-of-traders-analysis', {
        symbol: 'GC',
        from: '2024-01-01',
        to: undefined
      }, options);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(cotClient.getAnalysis('GC'))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getList', () => {
    it('should call get with correct parameters', async () => {
      const mockData: COTList[] = [
        {
          symbol: 'GC',
          name: 'GOLD - COMMODITY EXCHANGE INC.'
        },
        {
          symbol: 'CL',
          name: 'LIGHT SWEET CRUDE OIL - NEW YORK MERCANTILE EXCHANGE'
        },
        {
          symbol: 'SI',
          name: 'SILVER - COMMODITY EXCHANGE INC.'
        },
        {
          symbol: 'NG',
          name: 'NATURAL GAS - NEW YORK MERCANTILE EXCHANGE'
        },
        {
          symbol: 'HG',
          name: 'COPPER-GRADE #1 - COMMODITY EXCHANGE INC.'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await cotClient.getList();

      expect(mockGet).toHaveBeenCalledWith('/commitment-of-traders-list', {}, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle options parameter', async () => {
      const mockData: COTList[] = [];
      mockGet.mockResolvedValue(mockData);

      const options = { signal: new AbortController().signal };
      await cotClient.getList(options);

      expect(mockGet).toHaveBeenCalledWith('/commitment-of-traders-list', {}, options);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(cotClient.getList())
        .rejects.toThrow(errorMessage);
    });
  });

  describe('constructor', () => {
    it('should create instance with API key', () => {
      const client = new COTClient('my-api-key');
      expect(client).toBeInstanceOf(COTClient);
    });

    it('should create instance without API key', () => {
      const client = new COTClient();
      expect(client).toBeInstanceOf(COTClient);
    });
  });
}); 
