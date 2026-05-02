export interface SECFiling {
  symbol: string;
  cik: string;
  filingDate: string;
  acceptedDate: string;
  formType: string;
  hasFinancials?: boolean;
  link: string;
  finalLink: string;
}

export interface SECFilingFormType extends Omit<SECFiling, 'hasFinancials'> {}

export interface CompanySearchResult {
  symbol: string;
  name: string;
  cik: string;
  sicCode: string;
  industryTitle: string;
  businessAddress: string;
  phoneNumber: string;
}

export interface CompanyProfile {
  symbol: string;
  cik: string;
  registrantName: string;
  sicCode: string;
  sicDescription: string;
  sicGroup: string;
  isin: string;
  businessAddress: string;
  mailingAddress: string;
  phoneNumber: string;
  postalCode: string;
  city: string;
  state: string;
  country: string;
  description: string;
  ceo: string;
  website: string;
  exchange: string;
  stateLocation: string;
  stateOfIncorporation: string;
  fiscalYearEnd: string;
  ipoDate: string;
  employees: string;
  secFilingsUrl: string;
  taxIdentificationNumber: string;
  fiftyTwoWeekRange: string;
  isActive: boolean;
  assetType: string;
  openFigiComposite: string;
  priceCurrency: string;
  marketSector: string;
  securityType: string | null;
  isEtf: boolean;
  isAdr: boolean;
  isFund: boolean;
}

export interface IndustryClassification {
  office: string;
  sicCode: string;
  industryTitle: string;
}

interface DateRangeParams {
  from: string;
  to: string;
  page?: number;
  limit?: number;
}

export interface Form8KParams extends DateRangeParams {
  // Extends DateRangeParams with no additional fields
}

export interface FinancialsParams extends DateRangeParams {
  // Extends DateRangeParams with no additional fields
}

export interface FormTypeParams extends DateRangeParams {
  formType: string;
}

export interface SymbolParams extends DateRangeParams {
  symbol: string;
}

export interface CIKParams extends DateRangeParams {
  cik: string;
}

export interface CompanyNameSearchParams {
  company: string;
}

export interface CompanySymbolSearchParams {
  symbol: string;
}

export interface CompanyCIKSearchParams {
  cik: string;
}

export interface CompanyProfileParams {
  symbol?: string;
  cik?: string;
}

export interface IndustrySearchParams {
  industryTitle?: string;
  sicCode?: string;
}

export interface IndustryClassificationSearchParams {
  symbol?: string;
  cik?: string;
  sicCode?: string;
}

export interface AllIndustryClassificationParams {
  page?: number;
  limit?: number;
}
