import { FMPClient } from "../FMPClient.js";
import type { FMPContext } from "../../types/index.js";
import type {
  CrowdfundingCampaign,
  CrowdfundingSearchResult,
  EquityOffering,
  EquityOfferingSearchResult,
} from "./types.js";



export class FundraisersClient extends FMPClient {

  /**
   * Get latest crowdfunding campaigns
   * @param page Optional page number (default: 0)
   * @param limit Optional number of results per page (default: 100)
   * @param options Additional options including abort signal and context
   * @returns Array of crowdfunding campaigns
   */
  async getLatestCrowdfundingCampaigns(
    page?: number,
    limit?: number,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<CrowdfundingCampaign[]> {
    return super.get<CrowdfundingCampaign[]>(
      "/crowdfunding-offerings-latest",
      {
        page,
        limit,
      },
      options
    );
  }

  /**
   * Search for crowdfunding campaigns by name
   * @param name Company name, campaign name, or platform to search for
   * @param options Additional options including abort signal and context
   * @returns Array of crowdfunding search results
   */
  async searchCrowdfundingCampaigns(
    name: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<CrowdfundingSearchResult[]> {
    return super.get<CrowdfundingSearchResult[]>(
      "/crowdfunding-offerings-search",
      {
        name,
      },
      options
    );
  }

  /**
   * Get crowdfunding campaigns by CIK
   * @param cik CIK number to search for
   * @param options Additional options including abort signal and context
   * @returns Array of crowdfunding campaigns
   */
  async getCrowdfundingCampaignsByCIK(
    cik: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<CrowdfundingCampaign[]> {
    return super.get<CrowdfundingCampaign[]>(
      "/crowdfunding-offerings",
      {
        cik,
      },
      options
    );
  }

  /**
   * Get latest equity offerings
   * @param page Optional page number (default: 0)
   * @param limit Optional number of results per page (default: 10)
   * @param cik Optional CIK to filter by
   * @param options Additional options including abort signal and context
   * @returns Array of equity offerings
   */
  async getLatestEquityOfferings(
    page?: number,
    limit?: number,
    cik?: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<EquityOffering[]> {
    return super.get<EquityOffering[]>(
      "/fundraising-latest",
      {
        page,
        limit,
        cik,
      },
      options
    );
  }

  /**
   * Search for equity offerings by name
   * @param name Company name or stock symbol to search for
   * @param options Additional options including abort signal and context
   * @returns Array of equity offering search results
   */
  async searchEquityOfferings(
    name: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<EquityOfferingSearchResult[]> {
    return super.get<EquityOfferingSearchResult[]>(
      "/fundraising-search",
      {
        name,
      },
      options
    );
  }

  /**
   * Get equity offerings by CIK
   * @param cik CIK number to search for
   * @param options Additional options including abort signal and context
   * @returns Array of equity offerings
   */
  async getEquityOfferingsByCIK(
    cik: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<EquityOffering[]> {
    return super.get<EquityOffering[]>(
      "/fundraising",
      {
        cik,
      },
      options
    );
  }
}
