import { FMPClient } from "../FMPClient.js";
import type { FMPContext } from "../../types.js";
import type { ESGDisclosure, ESGRating, ESGBenchmark } from "./types.js";

export class ESGClient extends FMPClient {

  /**
   * Get ESG disclosures for a symbol
   * @param symbol The stock symbol
   * @param options Optional parameters including abort signal and context
   * @returns Array of ESG disclosures
   */
  async getDisclosures(
    symbol: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<ESGDisclosure[]> {
    return super.get<ESGDisclosure[]>(
      "/esg-disclosure",
      { symbol },
      options
    );
  }

  /**
   * Get ESG ratings for a symbol
   * @param symbol The stock symbol
   * @param options Optional parameters including abort signal and context
   * @returns Array of ESG ratings
   */
  async getRatings(
    symbol: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<ESGRating[]> {
    return super.get<ESGRating[]>("/esg-ratings", { symbol }, options);
  }

  /**
   * Get ESG benchmarks
   * @param year Optional year to get benchmarks for
   * @param options Optional parameters including abort signal and context
   * @returns Array of ESG benchmarks
   */
  async getBenchmarks(
    year?: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<ESGBenchmark[]> {
    return super.get<ESGBenchmark[]>(
      "/esg-benchmark",
      { year },
      options
    );
  }
}
