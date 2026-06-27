import { FMPClient } from "../FMPClient.js";
import type { FMPContext } from "../../types.js";
import type {
  FMPArticle,
  NewsArticle,
  NewsParams,
  NewsSearchParams,
} from "./types.js";

export class NewsClient extends FMPClient {

  /**
   * Get articles from Financial Modeling Prep
   * @param params Optional pagination parameters
   * @param options Optional parameters including abort signal and context
   */
  async getFMPArticles(
    params: { page?: number; limit?: number } = {},
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<FMPArticle[]> {
    return super.get<FMPArticle[]>("/fmp-articles", params, options);
  }

  /**
   * Get general news
   * @param params Optional parameters for filtering news
   * @param options Optional parameters including abort signal and context
   */
  async getGeneralNews(
    params: NewsParams = {},
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<NewsArticle[]> {
    return super.get<NewsArticle[]>("/news/general-latest", params, options);
  }

  /**
   * Get press releases
   * @param params Optional parameters for filtering press releases
   * @param options Optional parameters including abort signal and context
   */
  async getPressReleases(
    params: NewsParams = {},
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<NewsArticle[]> {
    return super.get<NewsArticle[]>(
      "/news/press-releases-latest",
      params,
      options
    );
  }

  /**
   * Get stock news
   * @param params Optional parameters for filtering stock news
   * @param options Optional parameters including abort signal and context
   */
  async getStockNews(
    params: NewsParams = {},
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<NewsArticle[]> {
    return super.get<NewsArticle[]>("/news/stock-latest", params, options);
  }

  /**
   * Get crypto news
   * @param params Optional parameters for filtering crypto news
   * @param options Optional parameters including abort signal and context
   */
  async getCryptoNews(
    params: NewsParams = {},
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<NewsArticle[]> {
    return super.get<NewsArticle[]>("/news/crypto-latest", params, options);
  }

  /**
   * Get forex news
   * @param params Optional parameters for filtering forex news
   * @param options Optional parameters including abort signal and context
   */
  async getForexNews(
    params: NewsParams = {},
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<NewsArticle[]> {
    return super.get<NewsArticle[]>("/news/forex-latest", params, options);
  }

  /**
   * Search press releases by symbols
   * @param params Search parameters for press releases
   * @param options Optional parameters including abort signal and context
   */
  async searchPressReleases(
    params: NewsSearchParams,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<NewsArticle[]> {
    return super.get<NewsArticle[]>("/news/press-releases", params, options);
  }

  /**
   * Search stock news by symbols
   * @param params Search parameters for stock news
   * @param options Optional parameters including abort signal and context
   */
  async searchStockNews(
    params: NewsSearchParams,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<NewsArticle[]> {
    return super.get<NewsArticle[]>("/news/stock", params, options);
  }

  /**
   * Search crypto news by symbols
   * @param params Search parameters for crypto news
   * @param options Optional parameters including abort signal and context
   */
  async searchCryptoNews(
    params: NewsSearchParams,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<NewsArticle[]> {
    return super.get<NewsArticle[]>("/news/crypto", params, options);
  }

  /**
   * Search forex news by symbols
   * @param params Search parameters for forex news
   * @param options Optional parameters including abort signal and context
   */
  async searchForexNews(
    params: NewsSearchParams,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<NewsArticle[]> {
    return super.get<NewsArticle[]>("/news/forex", params, options);
  }
}
