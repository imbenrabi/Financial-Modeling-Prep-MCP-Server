import { FMPClient } from "../FMPClient.js";
import type { ESGDisclosure, ESGRating, ESGBenchmark } from "./types.js";

export class ESGClient extends FMPClient {

  /**
   * Get ESG disclosures for a symbol
   * @param symbol The stock symbol
   * @returns Array of ESG disclosures
   */
  async getDisclosures(symbol: string): Promise<ESGDisclosure[]> {
    return super.get<ESGDisclosure[]>("/esg-disclosure", { symbol });
  }

  /**
   * Get ESG ratings for a symbol
   * @param symbol The stock symbol
   * @returns Array of ESG ratings
   */
  async getRatings(symbol: string): Promise<ESGRating[]> {
    return super.get<ESGRating[]>("/esg-ratings", { symbol });
  }

  /**
   * Get ESG benchmarks
   * @param year Optional year to get benchmarks for
   * @returns Array of ESG benchmarks
   */
  async getBenchmarks(year?: string): Promise<ESGBenchmark[]> {
    return super.get<ESGBenchmark[]>("/esg-benchmark", { year });
  }
}
