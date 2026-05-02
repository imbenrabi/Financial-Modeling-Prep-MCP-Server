import { FMPClient } from "../FMPClient.js";
import type {
  AnalystEstimate,
  RatingsSnapshot,
  HistoricalRating,
  PriceTargetSummary,
  PriceTargetConsensus,
  PriceTargetNews,
  StockGrade,
  HistoricalStockGrade,
  StockGradeSummary,
  StockGradeNews,
} from "./types.js";

export class AnalystClient extends FMPClient {

  /**
   * Get analyst financial estimates for a stock symbol
   * @param symbol Stock symbol
   * @param period Period (annual or quarter)
   * @param page Optional page number (default: 0)
   * @param limit Optional limit on number of results (default: 10, max: 1000)
   * @returns Array of analyst estimates
   */
  async getAnalystEstimates(
    symbol: string,
    period: "annual" | "quarter",
    page?: number,
    limit?: number
  ): Promise<AnalystEstimate[]> {
    return super.get<AnalystEstimate[]>("/analyst-estimates", {
      symbol,
      period,
      page,
      limit,
    });
  }

  /**
   * Get ratings snapshot for a stock symbol
   * @param symbol Stock symbol
   * @param limit Optional limit on number of results (default: 1)
   * @returns Array of ratings snapshots
   */
  async getRatingsSnapshot(
    symbol: string,
    limit?: number
  ): Promise<RatingsSnapshot[]> {
    return super.get<RatingsSnapshot[]>("/ratings-snapshot", { symbol, limit });
  }

  /**
   * Get historical ratings for a stock symbol
   * @param symbol Stock symbol
   * @param limit Optional limit on number of results (default: 1, max: 10000)
   * @returns Array of historical ratings
   */
  async getHistoricalRatings(
    symbol: string,
    limit?: number
  ): Promise<HistoricalRating[]> {
    return super.get<HistoricalRating[]>("/ratings-historical", {
      symbol,
      limit,
    });
  }

  /**
   * Get price target summary for a stock symbol
   * @param symbol Stock symbol
   * @returns Array of price target summaries
   */
  async getPriceTargetSummary(symbol: string): Promise<PriceTargetSummary[]> {
    return super.get<PriceTargetSummary[]>("/price-target-summary", { symbol });
  }

  /**
   * Get price target consensus for a stock symbol
   * @param symbol Stock symbol
   * @returns Array of price target consensus
   */
  async getPriceTargetConsensus(
    symbol: string
  ): Promise<PriceTargetConsensus[]> {
    return super.get<PriceTargetConsensus[]>("/price-target-consensus", {
      symbol,
    });
  }

  /**
   * Get price target news for a stock symbol
   * @param symbol Stock symbol
   * @param page Optional page number (default: 0)
   * @param limit Optional limit on number of results (default: 10)
   * @returns Array of price target news
   */
  async getPriceTargetNews(
    symbol: string,
    page?: number,
    limit?: number
  ): Promise<PriceTargetNews[]> {
    return super.get<PriceTargetNews[]>("/price-target-news", {
      symbol,
      page,
      limit,
    });
  }

  /**
   * Get latest price target news for all stocks
   * @param page Optional page number (default: 0, max: 100)
   * @param limit Optional limit on number of results (default: 10, max: 1000)
   * @returns Array of price target news
   */
  async getPriceTargetLatestNews(
    page?: number,
    limit?: number
  ): Promise<PriceTargetNews[]> {
    return super.get<PriceTargetNews[]>("/price-target-latest-news", {
      page,
      limit,
    });
  }

  /**
   * Get stock grades for a stock symbol
   * @param symbol Stock symbol
   * @returns Array of stock grades
   */
  async getStockGrades(symbol: string): Promise<StockGrade[]> {
    return super.get<StockGrade[]>("/grades", { symbol });
  }

  /**
   * Get historical stock grades for a stock symbol
   * @param symbol Stock symbol
   * @param limit Optional limit on number of results (default: 100, max: 1000)
   * @returns Array of historical stock grades
   */
  async getHistoricalStockGrades(
    symbol: string,
    limit?: number
  ): Promise<HistoricalStockGrade[]> {
    return super.get<HistoricalStockGrade[]>("/grades-historical", {
      symbol,
      limit,
    });
  }

  /**
   * Get stock grade summary for a stock symbol
   * @param symbol Stock symbol
   * @returns Array of stock grade summaries
   */
  async getStockGradeSummary(symbol: string): Promise<StockGradeSummary[]> {
    return super.get<StockGradeSummary[]>("/grades-consensus", { symbol });
  }

  /**
   * Get stock grade news for a stock symbol
   * @param symbol Stock symbol
   * @param page Optional page number (default: 0)
   * @param limit Optional limit on number of results (default: 1, max: 100)
   * @returns Array of stock grade news
   */
  async getStockGradeNews(
    symbol: string,
    page?: number,
    limit?: number
  ): Promise<StockGradeNews[]> {
    return super.get<StockGradeNews[]>("/grades-news", { symbol, page, limit });
  }

  /**
   * Get latest stock grade news for all stocks
   * @param page Optional page number (default: 0, max: 100)
   * @param limit Optional limit on number of results (default: 10, max: 1000)
   * @returns Array of stock grade news
   */
  async getStockGradeLatestNews(
    page?: number,
    limit?: number
  ): Promise<StockGradeNews[]> {
    return super.get<StockGradeNews[]>("/grades-latest-news", { page, limit });
  }
}
