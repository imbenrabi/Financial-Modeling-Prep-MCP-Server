import { FMPClient } from "../FMPClient.js";
import type { FMPContext } from "../../types.js";
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
   * @param options Optional parameters including abort signal and context
   */
  async getLatest8KFilings(
    params: Form8KParams,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<SECFiling[]> {
    return this.get<SECFiling[]>(
      `/sec-filings-8k`,
      {
        from: params.from,
        to: params.to,
        page: params.page,
        limit: params.limit,
      },
      options
    );
  }

  /**
   * Get latest SEC filings with financial statements for a date range
   * @param params Filing search parameters with financials
   * @param options Optional parameters including abort signal and context
   */
  async getLatestFinancialFilings(
    params: FinancialsParams,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<SECFiling[]> {
    return this.get<SECFiling[]>(
      `/sec-filings-financials`,
      {
        from: params.from,
        to: params.to,
        page: params.page,
        limit: params.limit,
      },
      options
    );
  }

  /**
   * Get SEC filings by form type for a date range
   * @param params Form type search parameters
   * @param options Optional parameters including abort signal and context
   */
  async getFilingsByFormType(
    params: FormTypeParams,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<SECFilingFormType[]> {
    return this.get<SECFilingFormType[]>(
      `/sec-filings-search/form-type`,
      {
        formType: params.formType,
        from: params.from,
        to: params.to,
        page: params.page,
        limit: params.limit,
      },
      options
    );
  }

  /**
   * Get SEC filings by symbol for a date range
   * @param params Symbol search parameters
   * @param options Optional parameters including abort signal and context
   */
  async getFilingsBySymbol(
    params: SymbolParams,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<SECFilingFormType[]> {
    return this.get<SECFilingFormType[]>(
      `/sec-filings-search/symbol`,
      {
        symbol: params.symbol,
        from: params.from,
        to: params.to,
        page: params.page,
        limit: params.limit,
      },
      options
    );
  }

  /**
   * Get SEC filings by CIK for a date range
   * @param params CIK search parameters
   * @param options Optional parameters including abort signal and context
   */
  async getFilingsByCIK(
    params: CIKParams,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<SECFilingFormType[]> {
    return this.get<SECFilingFormType[]>(
      `/sec-filings-search/cik`,
      {
        cik: params.cik,
        from: params.from,
        to: params.to,
        page: params.page,
        limit: params.limit,
      },
      options
    );
  }

  /**
   * Search for companies by name
   * @param params Company name search parameters
   * @param options Optional parameters including abort signal and context
   */
  async searchCompaniesByName(
    params: CompanyNameSearchParams,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<CompanySearchResult[]> {
    return this.get<CompanySearchResult[]>(
      `/sec-filings-company-search/name`,
      {
        company: params.company,
      },
      options
    );
  }

  /**
   * Search for companies by symbol
   * @param params Company symbol search parameters
   * @param options Optional parameters including abort signal and context
   */
  async searchCompaniesBySymbol(
    params: CompanySymbolSearchParams,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<CompanySearchResult[]> {
    return this.get<CompanySearchResult[]>(
      `/sec-filings-company-search/symbol`,
      {
        symbol: params.symbol,
      },
      options
    );
  }

  /**
   * Search for companies by CIK
   * @param params Company CIK search parameters
   * @param options Optional parameters including abort signal and context
   */
  async searchCompaniesByCIK(
    params: CompanyCIKSearchParams,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<CompanySearchResult[]> {
    return this.get<CompanySearchResult[]>(
      `/sec-filings-company-search/cik`,
      {
        cik: params.cik,
      },
      options
    );
  }

  /**
   * Get company full profile
   * @param params Company profile parameters
   * @param options Optional parameters including abort signal and context
   */
  async getCompanyProfile(
    params: CompanyProfileParams,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<CompanyProfile[]> {
    return this.get<CompanyProfile[]>(
      `/sec-profile`,
      {
        symbol: params.symbol,
        cik: params.cik,
      },
      options
    );
  }

  /**
   * Get industry classification list
   * @param params Industry search parameters
   * @param options Optional parameters including abort signal and context
   */
  async getIndustryClassificationList(
    params: IndustrySearchParams = {},
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<IndustryClassification[]> {
    return this.get<IndustryClassification[]>(
      `/standard-industrial-classification-list`,
      {
        industryTitle: params.industryTitle,
        sicCode: params.sicCode,
      },
      options
    );
  }

  /**
   * Search for industry classifications
   * @param params Industry classification search parameters
   * @param options Optional parameters including abort signal and context
   */
  async searchIndustryClassification(
    params: IndustryClassificationSearchParams = {},
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<CompanySearchResult[]> {
    return this.get<CompanySearchResult[]>(
      `/industry-classification-search`,
      {
        symbol: params.symbol,
        cik: params.cik,
        sicCode: params.sicCode,
      },
      options
    );
  }

  /**
   * Get all industry classifications
   * @param params Industry classification pagination parameters
   * @param options Optional parameters including abort signal and context
   */
  async getAllIndustryClassification(
    params: AllIndustryClassificationParams = {},
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<CompanySearchResult[]> {
    return this.get<CompanySearchResult[]>(
      `/all-industry-classification`,
      {
        page: params.page,
        limit: params.limit,
      },
      options
    );
  }
}
