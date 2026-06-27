import { FMPClient } from "../FMPClient.js";
import type {
  SECFiling,
  CompanySearchResult,
  CompanyProfile,
  IndustryClassification,
  Form8KParams,
  FinancialsParams,
  FormTypeParams,
  SymbolParams,
  CIKParams,
  CompanyNameSearchParams,
  CompanySymbolSearchParams,
  CompanyCIKSearchParams,
  CompanyProfileParams,
  IndustrySearchParams,
  IndustryClassificationSearchParams,
  AllIndustryClassificationParams,
  SECFilingFormType,
} from "./types.js";

export class SECFilingsClient extends FMPClient {

  /**
   * Get latest 8-K SEC filings for a date range
   * @param params Filing search parameters
   */
  async getLatest8KFilings(
    params: Form8KParams
  ): Promise<SECFiling[]> {
    return this.get<SECFiling[]>(
      `/sec-filings-8k`,
      {
        from: params.from,
        to: params.to,
        page: params.page,
        limit: params.limit,
      }
    );
  }

  /**
   * Get latest SEC filings with financial statements for a date range
   * @param params Filing search parameters with financials
   */
  async getLatestFinancialFilings(
    params: FinancialsParams
  ): Promise<SECFiling[]> {
    return this.get<SECFiling[]>(
      `/sec-filings-financials`,
      {
        from: params.from,
        to: params.to,
        page: params.page,
        limit: params.limit,
      }
    );
  }

  /**
   * Get SEC filings by form type for a date range
   * @param params Form type search parameters
   */
  async getFilingsByFormType(
    params: FormTypeParams
  ): Promise<SECFilingFormType[]> {
    return this.get<SECFilingFormType[]>(
      `/sec-filings-search/form-type`,
      {
        formType: params.formType,
        from: params.from,
        to: params.to,
        page: params.page,
        limit: params.limit,
      }
    );
  }

  /**
   * Get SEC filings by symbol for a date range
   * @param params Symbol search parameters
   */
  async getFilingsBySymbol(
    params: SymbolParams
  ): Promise<SECFilingFormType[]> {
    return this.get<SECFilingFormType[]>(
      `/sec-filings-search/symbol`,
      {
        symbol: params.symbol,
        from: params.from,
        to: params.to,
        page: params.page,
        limit: params.limit,
      }
    );
  }

  /**
   * Get SEC filings by CIK for a date range
   * @param params CIK search parameters
   */
  async getFilingsByCIK(
    params: CIKParams
  ): Promise<SECFilingFormType[]> {
    return this.get<SECFilingFormType[]>(
      `/sec-filings-search/cik`,
      {
        cik: params.cik,
        from: params.from,
        to: params.to,
        page: params.page,
        limit: params.limit,
      }
    );
  }

  /**
   * Search for companies by name
   * @param params Company name search parameters
   */
  async searchCompaniesByName(
    params: CompanyNameSearchParams
  ): Promise<CompanySearchResult[]> {
    return this.get<CompanySearchResult[]>(
      `/sec-filings-company-search/name`,
      {
        company: params.company,
      }
    );
  }

  /**
   * Search for companies by symbol
   * @param params Company symbol search parameters
   */
  async searchCompaniesBySymbol(
    params: CompanySymbolSearchParams
  ): Promise<CompanySearchResult[]> {
    return this.get<CompanySearchResult[]>(
      `/sec-filings-company-search/symbol`,
      {
        symbol: params.symbol,
      }
    );
  }

  /**
   * Search for companies by CIK
   * @param params Company CIK search parameters
   */
  async searchCompaniesByCIK(
    params: CompanyCIKSearchParams
  ): Promise<CompanySearchResult[]> {
    return this.get<CompanySearchResult[]>(
      `/sec-filings-company-search/cik`,
      {
        cik: params.cik,
      }
    );
  }

  /**
   * Get company full profile
   * @param params Company profile parameters
   */
  async getCompanyProfile(
    params: CompanyProfileParams
  ): Promise<CompanyProfile[]> {
    return this.get<CompanyProfile[]>(
      `/sec-profile`,
      {
        symbol: params.symbol,
        cik: params.cik,
      }
    );
  }

  /**
   * Get industry classification list
   * @param params Industry search parameters
   */
  async getIndustryClassificationList(
    params: IndustrySearchParams = {}
  ): Promise<IndustryClassification[]> {
    return this.get<IndustryClassification[]>(
      `/standard-industrial-classification-list`,
      {
        industryTitle: params.industryTitle,
        sicCode: params.sicCode,
      }
    );
  }

  /**
   * Search for industry classifications
   * @param params Industry classification search parameters
   */
  async searchIndustryClassification(
    params: IndustryClassificationSearchParams = {}
  ): Promise<CompanySearchResult[]> {
    return this.get<CompanySearchResult[]>(
      `/industry-classification-search`,
      {
        symbol: params.symbol,
        cik: params.cik,
        sicCode: params.sicCode,
      }
    );
  }

  /**
   * Get all industry classifications
   * @param params Industry classification pagination parameters
   */
  async getAllIndustryClassification(
    params: AllIndustryClassificationParams = {}
  ): Promise<CompanySearchResult[]> {
    return this.get<CompanySearchResult[]>(
      `/all-industry-classification`,
      {
        page: params.page,
        limit: params.limit,
      }
    );
  }
}
