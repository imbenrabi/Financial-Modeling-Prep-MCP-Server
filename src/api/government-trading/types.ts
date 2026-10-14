export interface FinancialDisclosure {
  senateID?: string;
  symbol: string;
  disclosureDate: string;
  transactionDate: string;
  firstName: string;
  lastName: string;
  office: string;
  district: string;
  owner: string;
  assetDescription: string;
  assetType: string;
  type: string;
  amount: string;
  capitalGainsOver200USD?: string;
  comment: string;
  link: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SymbolParams {
  symbol: string;
}

export interface NameParams {
  name: string;
}

export interface MemberIdParams {
  senateID: string;
  page?: number;
  limit?: number;
}

export interface SenatePositionsParams {
  senateID?: string;
  party?: string;
  position?: string;
  limit?: number;
}

export interface SenateProfileParams {
  senateID?: string;
  active?: boolean;
  latestParty?: string;
  latestPosition?: string;
  page?: number;
  limit?: number;
}

export interface SenateNetWorthParams {
  senateID: string;
  page?: number;
  limit?: number;
}

/**
 * Response shape of the congress-member endpoints (profile, positions, net worth)
 * has not been confirmed against a live FMP response, so rows stay untyped.
 */
export type CongressMemberRecord = Record<string, unknown>;
