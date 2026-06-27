import { FMPClient } from "../FMPClient.js";
import type { FMPContext } from "../../types.js";
import { COTReport, COTAnalysis, COTList } from "./types.js";

export class COTClient extends FMPClient {

  /**
   * Get COT(Commitment Of Traders) reports for a symbol
   * @param symbol Optional the commodity symbol
   * @param from Optional start date
   * @param to Optional end date
   * @param options Optional parameters including abort signal and context
   * @returns Array of COT reports
   */
  async getReports(
    symbol: string,
    from?: string,
    to?: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<COTReport[]> {
    return super.get<COTReport[]>("/commitment-of-traders-report", { symbol, from, to }, options);
  }

  /**
   * Get COT(Commitment Of Traders) analysis for a symbol
   * @param symbol The commodity symbol
   * @param from Optional start date
   * @param to Optional end date
   * @param options Optional parameters including abort signal and context
   * @returns Array of COT analysis
   */
  async getAnalysis(
    symbol: string,
    from?: string,
    to?: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<COTAnalysis[]> {
    return super.get<COTAnalysis[]>(
      "/commitment-of-traders-analysis",
      { symbol, from, to },
      options
    );
  }

  /**
   * Get list of available COT(Commitment Of Traders) reports
   * @param options Optional parameters including abort signal and context
   * @returns Array of available COT reports
   */
  async getList(options?: {
    signal?: AbortSignal;
    context?: FMPContext;
  }): Promise<COTList[]> {
    return super.get<COTList[]>("/commitment-of-traders-list", {}, options);
  }
}
