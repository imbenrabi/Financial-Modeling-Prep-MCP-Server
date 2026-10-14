import { FMPClient } from "../FMPClient.js";
import type {
  CongressMemberRecord,
  FinancialDisclosure,
  MemberIdParams,
  PaginationParams,
  SenateIdParams,
  SenatePositionsParams,
  SenateProfileParams,
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

  /**
   * Get Senate trades for a specific member ID
   * @param params Member ID (senateID) and optional pagination
   */
  async getSenateTradesById(
    params: MemberIdParams
  ): Promise<FinancialDisclosure[]> {
    return this.get<FinancialDisclosure[]>(
      `/senate-trades-by-id`,
      {
        senateID: params.senateID,
        page: params.page,
        limit: params.limit,
      }
    );
  }

  /**
   * Get House trades for a specific member ID
   * @param params Member ID (senateID) and optional pagination
   */
  async getHouseTradesById(
    params: MemberIdParams
  ): Promise<FinancialDisclosure[]> {
    return this.get<FinancialDisclosure[]>(
      `/house-trades-by-id`,
      {
        senateID: params.senateID,
        page: params.page,
        limit: params.limit,
      }
    );
  }

  /**
   * Get positions held by members of Congress
   * @param params Optional filters
   */
  async getSenatePositions(
    params: SenatePositionsParams = {}
  ): Promise<CongressMemberRecord[]> {
    return this.get<CongressMemberRecord[]>(
      `/senate-positions`,
      {
        senateID: params.senateID,
        party: params.party,
        position: params.position,
        limit: params.limit,
      }
    );
  }

  /**
   * Get profiles of members of Congress
   * @param params Optional filters and pagination
   */
  async getSenateProfile(
    params: SenateProfileParams = {}
  ): Promise<CongressMemberRecord[]> {
    return this.get<CongressMemberRecord[]>(
      `/senate-profile`,
      {
        senateID: params.senateID,
        active: params.active,
        latestParty: params.latestParty,
        latestPosition: params.latestPosition,
        page: params.page,
        limit: params.limit,
      }
    );
  }

  /**
   * Get reported net worth records for a member of Congress
   * @param params Member ID (senateID) and optional pagination
   */
  async getSenateNetWorth(
    params: MemberIdParams
  ): Promise<CongressMemberRecord[]> {
    return this.get<CongressMemberRecord[]>(
      `/senate-net-worth`,
      {
        senateID: params.senateID,
        page: params.page,
        limit: params.limit,
      }
    );
  }

  /**
   * Get aggregated net worth for a member of Congress
   * @param params Member ID (senateID)
   */
  async getSenateNetWorthAggregated(
    params: SenateIdParams
  ): Promise<CongressMemberRecord[]> {
    return this.get<CongressMemberRecord[]>(
      `/senate-net-worth-aggregated`,
      {
        senateID: params.senateID,
      }
    );
  }
}
