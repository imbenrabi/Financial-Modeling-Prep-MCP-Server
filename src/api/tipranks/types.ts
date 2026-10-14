/**
 * Response rows of the TipRanks partner endpoints. FMP's docs describe the fields
 * in prose only and no live response has been checked, so rows stay untyped.
 */
export type TipRanksRecord = Record<string, unknown>;

interface TipRanksPagingParams {
  limit?: number;
  page?: number;
}

export interface TipRanksSearchParams extends TipRanksPagingParams {
  symbol?: string;
  expertUID?: string;
  from?: string;
  to?: string;
  nonadjusted?: boolean;
}

export interface TipRanksPointInTimeParams extends TipRanksPagingParams {
  date?: string;
  nonadjusted?: boolean;
}

export interface TipRanksDateWindow {
  from?: string;
  to?: string;
}
