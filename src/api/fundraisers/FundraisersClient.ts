import { FMPClient } from "../FMPClient.js";
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
   * @returns Array of crowdfunding campaigns
   */
  async getLatestCrowdfundingCampaigns(
    page?: number,
    limit?: number
  ): Promise<CrowdfundingCampaign[]> {
    return super.get<CrowdfundingCampaign[]>(
      "/crowdfunding-offerings-latest",
      {
        page,
        limit,
      }
    );
  }

  /**
   * Search for crowdfunding campaigns by name
   * @param name Company name, campaign name, or platform to search for
   * @returns Array of crowdfunding search results
   */
  async searchCrowdfundingCampaigns(
    name: string
  ): Promise<CrowdfundingSearchResult[]> {
    return super.get<CrowdfundingSearchResult[]>(
      "/crowdfunding-offerings-search",
      {
        name,
      }
    );
  }

  /**
   * Get crowdfunding campaigns by CIK
   * @param cik CIK number to search for
   * @returns Array of crowdfunding campaigns
   */
  async getCrowdfundingCampaignsByCIK(
    cik: string
  ): Promise<CrowdfundingCampaign[]> {
    return super.get<CrowdfundingCampaign[]>(
      "/crowdfunding-offerings",
      {
        cik,
      }
    );
  }

  /**
   * Get latest equity offerings
   * @param page Optional page number (default: 0)
   * @param limit Optional number of results per page (default: 10)
   * @param cik Optional CIK to filter by
   * @returns Array of equity offerings
   */
  async getLatestEquityOfferings(
    page?: number,
    limit?: number,
    cik?: string
  ): Promise<EquityOffering[]> {
    return super.get<EquityOffering[]>(
      "/fundraising-latest",
      {
        page,
        limit,
        cik,
      }
    );
  }

  /**
   * Search for equity offerings by name
   * @param name Company name or stock symbol to search for
   * @returns Array of equity offering search results
   */
  async searchEquityOfferings(
    name: string
  ): Promise<EquityOfferingSearchResult[]> {
    return super.get<EquityOfferingSearchResult[]>(
      "/fundraising-search",
      {
        name,
      }
    );
  }

  /**
   * Get equity offerings by CIK
   * @param cik CIK number to search for
   * @returns Array of equity offerings
   */
  async getEquityOfferingsByCIK(
    cik: string
  ): Promise<EquityOffering[]> {
    return super.get<EquityOffering[]>(
      "/fundraising",
      {
        cik,
      }
    );
  }
}
