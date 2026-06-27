import { FMPClient } from "../FMPClient.js";
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
   */
  async getFMPArticles(
    params: { page?: number; limit?: number } = {}
  ): Promise<FMPArticle[]> {
    return super.get<FMPArticle[]>("/fmp-articles", params);
  }

  /**
   * Get general news
   * @param params Optional parameters for filtering news
   */
  async getGeneralNews(
    params: NewsParams = {}
  ): Promise<NewsArticle[]> {
    return super.get<NewsArticle[]>("/news/general-latest", params);
  }

  /**
   * Get press releases
   * @param params Optional parameters for filtering press releases
   */
  async getPressReleases(
    params: NewsParams = {}
  ): Promise<NewsArticle[]> {
    return super.get<NewsArticle[]>(
      "/news/press-releases-latest",
      params
    );
  }

  /**
   * Get stock news
   * @param params Optional parameters for filtering stock news
   */
  async getStockNews(
    params: NewsParams = {}
  ): Promise<NewsArticle[]> {
    return super.get<NewsArticle[]>("/news/stock-latest", params);
  }

  /**
   * Get crypto news
   * @param params Optional parameters for filtering crypto news
   */
  async getCryptoNews(
    params: NewsParams = {}
  ): Promise<NewsArticle[]> {
    return super.get<NewsArticle[]>("/news/crypto-latest", params);
  }

  /**
   * Get forex news
   * @param params Optional parameters for filtering forex news
   */
  async getForexNews(
    params: NewsParams = {}
  ): Promise<NewsArticle[]> {
    return super.get<NewsArticle[]>("/news/forex-latest", params);
  }

  /**
   * Search press releases by symbols
   * @param params Search parameters for press releases
   */
  async searchPressReleases(
    params: NewsSearchParams
  ): Promise<NewsArticle[]> {
    return super.get<NewsArticle[]>("/news/press-releases", params);
  }

  /**
   * Search stock news by symbols
   * @param params Search parameters for stock news
   */
  async searchStockNews(
    params: NewsSearchParams
  ): Promise<NewsArticle[]> {
    return super.get<NewsArticle[]>("/news/stock", params);
  }

  /**
   * Search crypto news by symbols
   * @param params Search parameters for crypto news
   */
  async searchCryptoNews(
    params: NewsSearchParams
  ): Promise<NewsArticle[]> {
    return super.get<NewsArticle[]>("/news/crypto", params);
  }

  /**
   * Search forex news by symbols
   * @param params Search parameters for forex news
   */
  async searchForexNews(
    params: NewsSearchParams
  ): Promise<NewsArticle[]> {
    return super.get<NewsArticle[]>("/news/forex", params);
  }
}
