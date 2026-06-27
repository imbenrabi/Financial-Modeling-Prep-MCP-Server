import { FMPClient } from "../FMPClient.js";
import type { FMPContext } from "../../types.js";
import {
  InsiderTrading,
  InsiderReportingName,
  InsiderTransactionType,
  InsiderTradeStatistics,
  AcquisitionOwnership,
} from "./types.js";

export class InsiderTradesClient extends FMPClient {

  /**
   * Get latest insider trading activities
   * @param params Optional parameters for date, pagination
   * @param options Optional parameters including abort signal and context
   */
  async getLatestInsiderTrading(
    params: { date?: string; page?: number; limit?: number } = {},
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<InsiderTrading[]> {
    return super.get<InsiderTrading[]>(
      "/insider-trading/latest",
      params,
      options
    );
  }

  /**
   * Search insider trades by various criteria
   * @param params Search parameters
   * @param options Optional parameters including abort signal and context
   */
  async searchInsiderTrades(
    params: {
      symbol?: string;
      page?: number;
      limit?: number;
      reportingCik?: string;
      companyCik?: string;
      transactionType?: string;
    } = {},
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<InsiderTrading[]> {
    return super.get<InsiderTrading[]>(
      "/insider-trading/search",
      params,
      options
    );
  }

  /**
   * Search insider trades by reporting name
   * @param name Name to search for
   * @param options Optional parameters including abort signal and context
   */
  async searchInsiderTradesByReportingName(
    name: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<InsiderReportingName[]> {
    return super.get<InsiderReportingName[]>(
      "/insider-trading/reporting-name",
      { name },
      options
    );
  }

  /**
   * Get all insider transaction types
   * @param options Optional parameters including abort signal and context
   */
  async getInsiderTransactionTypes(options?: {
    signal?: AbortSignal;
    context?: FMPContext;
  }): Promise<InsiderTransactionType[]> {
    return super.get<InsiderTransactionType[]>(
      "/insider-trading-transaction-type",
      {},
      options
    );
  }

  /**
   * Get insider trade statistics for a symbol
   * @param symbol Stock symbol
   * @param options Optional parameters including abort signal and context
   */
  async getInsiderTradeStatistics(
    symbol: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<InsiderTradeStatistics[]> {
    return super.get<InsiderTradeStatistics[]>(
      "/insider-trading/statistics",
      { symbol },
      options
    );
  }

  /**
   * Get acquisition ownership information for a symbol
   * @param symbol Stock symbol
   * @param limit Optional limit on number of results
   * @param options Optional parameters including abort signal and context
   */
  async getAcquisitionOwnership(
    symbol: string,
    limit?: number,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<AcquisitionOwnership[]> {
    const params: Record<string, any> = { symbol };
    if (limit !== undefined) {
      params.limit = limit;
    }
    return super.get<AcquisitionOwnership[]>(
      "/acquisition-of-beneficial-ownership",
      params,
      options
    );
  }
}
