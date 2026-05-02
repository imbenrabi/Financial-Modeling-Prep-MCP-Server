export interface FundHolding {
  symbol: string;
  asset: string;
  name: string;
  isin: string;
  securityCusip: string;
  sharesNumber: number;
  weightPercentage: number; 
  marketValue: number;
  updatedAt: string;
  updated: string;
}

interface FundSector {
  industry: string;
  exposure: number;
}

export interface FundInfo {
  symbol: string;
  name: string;
  description: string;
  isin: string;
  assetClass: string;
  securityCusip: string;
  domicile: string;   
  website: string;
  etfCompany: string;
  expenseRatio: number;
  assetsUnderManagement: number;
  avgVolume: number;
  inceptionDate: string;  
  nav: number;
  navCurrency: string;
  holdingsCount: number;
  updatedAt: string;
  sectorsList: FundSector[];
}

export interface FundCountryAllocation {
  country: string;
  weightPercentage: string;
}

export interface FundAssetExposure {
  symbol: string;
  asset: string;
  sharesNumber: number;
  weightPercentage: number;
  marketValue: number;
}

export interface FundSectorWeighting {
  symbol: string;
  sector: string;
  weightPercentage: number;
}

export interface FundDisclosureHolder {
  cik: string;
  holder: string;
  shares: number;
  dateReported: string;
  change: number;
  weightPercent: number;
}

export interface FundDisclosureSearch {
  symbol: string;
  cik: string;
  classId: string;
  seriesId: string;
  entityName: string;
  entityOrgType: string;
  seriesName: string; 
  className: string;
  reportingFileNumber: string;
  address: string;
  city: string;
  zipCode: string;
  state: string;
}

export interface FundDisclosureDate {
  date: string;
  year: number;
  quarter: number;
}

export interface FundDisclosure {
  cik: string;
  date: string;
  acceptedDate: string;
  symbol: string;
  name: string;
  lei: string;
  title: string;
  cusip: string;
  isin: string;
  balance: number;
  units: string;
  cur_cd: string;
  valUsd: number;
  pctVal: number;
  payoffProfile: string;
  assetCat: string;
  issuerCat: string;
  invCountry: string;
  isRestrictedSec: string;
  fairValLevel: string;
  isCashCollateral: string;
  isNonCashCollateral: string;
  isLoanByFund: string;
}
