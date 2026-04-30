import { FMPClient } from "../FMPClient.js";
import type { FMPContext } from "../../types/index.js";
import type {
  FinancialDisclosure,
  PaginationParams,
  SymbolParams,
  NameParams,
} from "./types.js";

export class GovernmentTradingClient extends FMPClient {

  /**
   * Get latest financial disclosures from U.S. Senate members
   * @param params Optional pagination parameters
   * @param options Optional parameters including abort signal and context
   */
  async getLatestSenateDisclosures(
    params: PaginationParams = {},
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<FinancialDisclosure[]> {
    return this.get<FinancialDisclosure[]>(
      `/senate-latest`,
      {
        page: params.page,
        limit: params.limit,
      },
      options
    );
  }

  /**
   * Get latest financial disclosures from U.S. House members
   * @param params Optional pagination parameters
   * @param options Optional parameters including abort signal and context
   */
  async getLatestHouseDisclosures(
    params: PaginationParams = {},
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<FinancialDisclosure[]> {
    return this.get<FinancialDisclosure[]>(
      `/house-latest`,
      {
        page: params.page,
        limit: params.limit,
      },
      options
    );
  }

  /**
   * Get Senate trading activity for a specific symbol
   * @param params Symbol parameters
   * @param options Optional parameters including abort signal and context
   */
  async getSenateTrades(
    params: SymbolParams,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<FinancialDisclosure[]> {
    return this.get<FinancialDisclosure[]>(
      `/senate-trades`,
      {
        symbol: params.symbol,
      },
      options
    );
  }

  /**
   * Get Senate trades by senator name
   * @param params Name parameters
   * @param options Optional parameters including abort signal and context
   */
  async getSenateTradesByName(
    params: NameParams,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<FinancialDisclosure[]> {
    return this.get<FinancialDisclosure[]>(
      `/senate-trades-by-name`,
      {
        name: params.name,
      },
      options
    );
  }

  /**
   * Get House trading activity for a specific symbol
   * @param params Symbol parameters
   * @param options Optional parameters including abort signal and context
   */
  async getHouseTrades(
    params: SymbolParams,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<FinancialDisclosure[]> {
    return this.get<FinancialDisclosure[]>(
      `/house-trades`,
      {
        symbol: params.symbol,
      },
      options
    );
  }

  /**
   * Get House trades by representative name
   * @param params Name parameters
   * @param options Optional parameters including abort signal and context
   */
  async getHouseTradesByName(
    params: NameParams,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<FinancialDisclosure[]> {
    return this.get<FinancialDisclosure[]>(
      `/house-trades-by-name`,
      {
        name: params.name,
      },
      options
    );
  }
}
