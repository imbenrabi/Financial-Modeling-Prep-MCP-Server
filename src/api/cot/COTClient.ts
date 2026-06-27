import { FMPClient } from "../FMPClient.js";
import { COTReport, COTAnalysis, COTList } from "./types.js";

export class COTClient extends FMPClient {

  /**
   * Get COT(Commitment Of Traders) reports for a symbol
   * @param symbol Optional the commodity symbol
   * @param from Optional start date
   * @param to Optional end date
   * @returns Array of COT reports
   */
  async getReports(
    symbol: string,
    from?: string,
    to?: string
  ): Promise<COTReport[]> {
    return super.get<COTReport[]>("/commitment-of-traders-report", { symbol, from, to });
  }

  /**
   * Get COT(Commitment Of Traders) analysis for a symbol
   * @param symbol The commodity symbol
   * @param from Optional start date
   * @param to Optional end date
   * @returns Array of COT analysis
   */
  async getAnalysis(
    symbol: string,
    from?: string,
    to?: string
  ): Promise<COTAnalysis[]> {
    return super.get<COTAnalysis[]>(
      "/commitment-of-traders-analysis",
      { symbol, from, to }
    );
  }

  /**
   * Get list of available COT(Commitment Of Traders) reports
   * @returns Array of available COT reports
   */
  async getList(): Promise<COTList[]> {
    return super.get<COTList[]>("/commitment-of-traders-list", {});
  }
}
