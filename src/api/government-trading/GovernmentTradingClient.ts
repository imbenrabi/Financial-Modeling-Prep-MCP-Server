import { FMPClient } from "../FMPClient.js";
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
   */
  async getLatestSenateDisclosures(
    params: PaginationParams = {}
  ): Promise<FinancialDisclosure[]> {
    return this.get<FinancialDisclosure[]>(
      `/senate-latest`,
      {
        page: params.page,
        limit: params.limit,
      }
    );
  }

  /**
   * Get latest financial disclosures from U.S. House members
   * @param params Optional pagination parameters
   */
  async getLatestHouseDisclosures(
    params: PaginationParams = {}
  ): Promise<FinancialDisclosure[]> {
    return this.get<FinancialDisclosure[]>(
      `/house-latest`,
      {
        page: params.page,
        limit: params.limit,
      }
    );
  }

  /**
   * Get Senate trading activity for a specific symbol
   * @param params Symbol parameters
   */
  async getSenateTrades(
    params: SymbolParams
  ): Promise<FinancialDisclosure[]> {
    return this.get<FinancialDisclosure[]>(
      `/senate-trades`,
      {
        symbol: params.symbol,
      }
    );
  }

  /**
   * Get Senate trades by senator name
   * @param params Name parameters
   */
  async getSenateTradesByName(
    params: NameParams
  ): Promise<FinancialDisclosure[]> {
    return this.get<FinancialDisclosure[]>(
      `/senate-trades-by-name`,
      {
        name: params.name,
      }
    );
  }

  /**
   * Get House trading activity for a specific symbol
   * @param params Symbol parameters
   */
  async getHouseTrades(
    params: SymbolParams
  ): Promise<FinancialDisclosure[]> {
    return this.get<FinancialDisclosure[]>(
      `/house-trades`,
      {
        symbol: params.symbol,
      }
    );
  }

  /**
   * Get House trades by representative name
   * @param params Name parameters
   */
  async getHouseTradesByName(
    params: NameParams
  ): Promise<FinancialDisclosure[]> {
    return this.get<FinancialDisclosure[]>(
      `/house-trades-by-name`,
      {
        name: params.name,
      }
    );
  }
}
