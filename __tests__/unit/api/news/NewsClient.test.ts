import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NewsClient } from '../../../../src/api/news/NewsClient.js';
import { FMPClient } from '../../../../src/api/FMPClient.js';
import type {
  FMPArticle,
  NewsArticle,
  NewsParams,
  NewsSearchParams,
} from '../../../../src/api/news/types.js';

// Mock the FMPClient
vi.mock('../FMPClient.js');

describe('NewsClient', () => {
  let newsClient: NewsClient;
  let mockGet: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Create mock for the get method
    mockGet = vi.fn();
    
    // Mock FMPClient prototype get method using any to bypass protected access
    (FMPClient.prototype as any).get = mockGet;
    
    // Create NewsClient instance
    newsClient = new NewsClient('test-api-key');
  });

  describe('getFMPArticles', () => {
    it('should call get with correct parameters', async () => {
      const mockData: FMPArticle[] = [
        {
          title: 'Apple Earnings Beat Expectations',
          date: '2024-01-01',
          content: 'Apple reported strong quarterly earnings...',
          tickers: 'AAPL',
          image: 'https://example.com/image.jpg',
          link: 'https://example.com/article',
          author: 'John Doe',
          site: 'Financial News'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await newsClient.getFMPArticles({ page: 0, limit: 10 });

      expect(mockGet).toHaveBeenCalledWith('/fmp-articles', {
        page: 0,
        limit: 10
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with default parameters when no params provided', async () => {
      const mockData: FMPArticle[] = [];
      mockGet.mockResolvedValue(mockData);

      const result = await newsClient.getFMPArticles();

      expect(mockGet).toHaveBeenCalledWith('/fmp-articles', {}, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(newsClient.getFMPArticles({ page: 0, limit: 10 }))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getGeneralNews', () => {
    it('should call get with correct parameters', async () => {
      const mockData: NewsArticle[] = [
        {
          symbol: null,
          publishedDate: '2024-01-01T10:00:00Z',
          publisher: 'Reuters',
          title: 'Market Update Today',
          image: 'https://example.com/news-image.jpg',
          site: 'Reuters.com',
          text: 'Financial markets showed positive movement...',
          url: 'https://example.com/news-article'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await newsClient.getGeneralNews({
        from: '2024-01-01',
        to: '2024-01-31',
        page: 0,
        limit: 20
      });

      expect(mockGet).toHaveBeenCalledWith('/news/general-latest', {
        from: '2024-01-01',
        to: '2024-01-31',
        page: 0,
        limit: 20
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should call get with default parameters when no params provided', async () => {
      const mockData: NewsArticle[] = [];
      mockGet.mockResolvedValue(mockData);

      const result = await newsClient.getGeneralNews();

      expect(mockGet).toHaveBeenCalledWith('/news/general-latest', {}, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(newsClient.getGeneralNews({ from: '2024-01-01' }))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getPressReleases', () => {
    it('should call get with correct parameters', async () => {
      const mockData: NewsArticle[] = [
        {
          symbol: 'AAPL',
          publishedDate: '2024-01-01T10:00:00Z',
          publisher: 'Apple Inc.',
          title: 'Apple Announces New Product Launch',
          image: 'https://example.com/press-image.jpg',
          site: 'Apple.com',
          text: 'Apple today announced the launch of...',
          url: 'https://apple.com/press-release'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await newsClient.getPressReleases({
        from: '2024-01-01',
        to: '2024-01-31',
        page: 1,
        limit: 50
      });

      expect(mockGet).toHaveBeenCalledWith('/news/press-releases-latest', {
        from: '2024-01-01',
        to: '2024-01-31',
        page: 1,
        limit: 50
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle optional parameters', async () => {
      const mockData: NewsArticle[] = [];
      mockGet.mockResolvedValue(mockData);

      await newsClient.getPressReleases();

      expect(mockGet).toHaveBeenCalledWith('/news/press-releases-latest', {}, undefined);
    });
  });

  describe('getStockNews', () => {
    it('should call get with correct parameters', async () => {
      const mockData: NewsArticle[] = [
        {
          symbol: 'TSLA',
          publishedDate: '2024-01-01T10:00:00Z',
          publisher: 'Bloomberg',
          title: 'Tesla Stock Surges After Earnings',
          image: 'https://example.com/tesla-image.jpg',
          site: 'Bloomberg.com',
          text: 'Tesla shares rose 5% after reporting...',
          url: 'https://bloomberg.com/tesla-news'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await newsClient.getStockNews({
        from: '2024-01-01',
        limit: 25
      });

      expect(mockGet).toHaveBeenCalledWith('/news/stock-latest', {
        from: '2024-01-01',
        limit: 25
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle optional parameters', async () => {
      const mockData: NewsArticle[] = [];
      mockGet.mockResolvedValue(mockData);

      await newsClient.getStockNews();

      expect(mockGet).toHaveBeenCalledWith('/news/stock-latest', {}, undefined);
    });
  });

  describe('getCryptoNews', () => {
    it('should call get with correct parameters', async () => {
      const mockData: NewsArticle[] = [
        {
          symbol: 'BTC',
          publishedDate: '2024-01-01T10:00:00Z',
          publisher: 'CoinDesk',
          title: 'Bitcoin Reaches New High',
          image: 'https://example.com/bitcoin-image.jpg',
          site: 'CoinDesk.com',
          text: 'Bitcoin price surged to new heights...',
          url: 'https://coindesk.com/bitcoin-news'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await newsClient.getCryptoNews({
        to: '2024-01-31',
        page: 2,
        limit: 15
      });

      expect(mockGet).toHaveBeenCalledWith('/news/crypto-latest', {
        to: '2024-01-31',
        page: 2,
        limit: 15
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle optional parameters', async () => {
      const mockData: NewsArticle[] = [];
      mockGet.mockResolvedValue(mockData);

      await newsClient.getCryptoNews();

      expect(mockGet).toHaveBeenCalledWith('/news/crypto-latest', {}, undefined);
    });
  });

  describe('getForexNews', () => {
    it('should call get with correct parameters', async () => {
      const mockData: NewsArticle[] = [
        {
          symbol: 'EURUSD',
          publishedDate: '2024-01-01T10:00:00Z',
          publisher: 'ForexLive',
          title: 'EUR/USD Breaks Key Resistance',
          image: 'https://example.com/forex-image.jpg',
          site: 'ForexLive.com',
          text: 'The EUR/USD pair broke above...',
          url: 'https://forexlive.com/eurusd-news'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await newsClient.getForexNews({
        from: '2024-01-01',
        to: '2024-01-31',
        page: 0,
        limit: 30
      });

      expect(mockGet).toHaveBeenCalledWith('/news/forex-latest', {
        from: '2024-01-01',
        to: '2024-01-31',
        page: 0,
        limit: 30
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle optional parameters', async () => {
      const mockData: NewsArticle[] = [];
      mockGet.mockResolvedValue(mockData);

      await newsClient.getForexNews();

      expect(mockGet).toHaveBeenCalledWith('/news/forex-latest', {}, undefined);
    });
  });

  describe('searchPressReleases', () => {
    it('should call get with correct parameters', async () => {
      const mockData: NewsArticle[] = [
        {
          symbol: 'AAPL',
          publishedDate: '2024-01-01T10:00:00Z',
          publisher: 'Apple Inc.',
          title: 'Apple Q1 Earnings Press Release',
          image: 'https://example.com/apple-pr.jpg',
          site: 'Apple.com',
          text: 'Apple reported record Q1 earnings...',
          url: 'https://apple.com/earnings-press-release'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await newsClient.searchPressReleases({
        symbols: 'AAPL,MSFT',
        from: '2024-01-01',
        to: '2024-01-31',
        page: 0,
        limit: 20
      });

      expect(mockGet).toHaveBeenCalledWith('/news/press-releases', {
        symbols: 'AAPL,MSFT',
        from: '2024-01-01',
        to: '2024-01-31',
        page: 0,
        limit: 20
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle required symbols parameter only', async () => {
      const mockData: NewsArticle[] = [];
      mockGet.mockResolvedValue(mockData);

      await newsClient.searchPressReleases({ symbols: 'AAPL' });

      expect(mockGet).toHaveBeenCalledWith('/news/press-releases', {
        symbols: 'AAPL'
      }, undefined);
    });
  });

  describe('searchStockNews', () => {
    it('should call get with correct parameters', async () => {
      const mockData: NewsArticle[] = [
        {
          symbol: 'TSLA',
          publishedDate: '2024-01-01T10:00:00Z',
          publisher: 'MarketWatch',
          title: 'Tesla Stock Analysis',
          image: 'https://example.com/tesla-stock.jpg',
          site: 'MarketWatch.com',
          text: 'Analysts weigh in on Tesla stock...',
          url: 'https://marketwatch.com/tesla-analysis'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await newsClient.searchStockNews({
        symbols: 'TSLA,NVDA,AMD',
        from: '2024-01-01',
        limit: 50
      });

      expect(mockGet).toHaveBeenCalledWith('/news/stock', {
        symbols: 'TSLA,NVDA,AMD',
        from: '2024-01-01',
        limit: 50
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle required symbols parameter only', async () => {
      const mockData: NewsArticle[] = [];
      mockGet.mockResolvedValue(mockData);

      await newsClient.searchStockNews({ symbols: 'GOOGL' });

      expect(mockGet).toHaveBeenCalledWith('/news/stock', {
        symbols: 'GOOGL'
      }, undefined);
    });
  });

  describe('searchCryptoNews', () => {
    it('should call get with correct parameters', async () => {
      const mockData: NewsArticle[] = [
        {
          symbol: 'BTC',
          publishedDate: '2024-01-01T10:00:00Z',
          publisher: 'CryptoPanic',
          title: 'Bitcoin Technical Analysis',
          image: 'https://example.com/btc-analysis.jpg',
          site: 'CryptoPanic.com',
          text: 'Bitcoin shows bullish patterns...',
          url: 'https://cryptopanic.com/btc-analysis'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await newsClient.searchCryptoNews({
        symbols: 'BTC,ETH,ADA',
        to: '2024-01-31',
        page: 1,
        limit: 25
      });

      expect(mockGet).toHaveBeenCalledWith('/news/crypto', {
        symbols: 'BTC,ETH,ADA',
        to: '2024-01-31',
        page: 1,
        limit: 25
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle required symbols parameter only', async () => {
      const mockData: NewsArticle[] = [];
      mockGet.mockResolvedValue(mockData);

      await newsClient.searchCryptoNews({ symbols: 'ETH' });

      expect(mockGet).toHaveBeenCalledWith('/news/crypto', {
        symbols: 'ETH'
      }, undefined);
    });
  });

  describe('searchForexNews', () => {
    it('should call get with correct parameters', async () => {
      const mockData: NewsArticle[] = [
        {
          symbol: 'GBPUSD',
          publishedDate: '2024-01-01T10:00:00Z',
          publisher: 'FXStreet',
          title: 'GBP/USD Weekly Forecast',
          image: 'https://example.com/gbpusd-forecast.jpg',
          site: 'FXStreet.com',
          text: 'The British pound shows strength...',
          url: 'https://fxstreet.com/gbpusd-forecast'
        }
      ];
      mockGet.mockResolvedValue(mockData);

      const result = await newsClient.searchForexNews({
        symbols: 'EURUSD,GBPUSD,USDJPY',
        from: '2024-01-01',
        to: '2024-01-31',
        page: 0,
        limit: 40
      });

      expect(mockGet).toHaveBeenCalledWith('/news/forex', {
        symbols: 'EURUSD,GBPUSD,USDJPY',
        from: '2024-01-01',
        to: '2024-01-31',
        page: 0,
        limit: 40
      }, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle required symbols parameter only', async () => {
      const mockData: NewsArticle[] = [];
      mockGet.mockResolvedValue(mockData);

      await newsClient.searchForexNews({ symbols: 'EURUSD' });

      expect(mockGet).toHaveBeenCalledWith('/news/forex', {
        symbols: 'EURUSD'
      }, undefined);
    });
  });

  describe('constructor', () => {
    it('should create instance with API key', () => {
      const client = new NewsClient('my-api-key');
      expect(client).toBeInstanceOf(NewsClient);
    });

    it('should create instance without API key', () => {
      const client = new NewsClient();
      expect(client).toBeInstanceOf(NewsClient);
    });
  });
}); 