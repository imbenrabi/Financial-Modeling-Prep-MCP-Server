import { FMPClient } from "../FMPClient.js";
import type { FMPContext } from "../../types/index.js";
import type {
  SectorPerformance,
  IndustryPerformance,
  SectorPE,
  IndustryPE,
  StockMovement,
} from "./types.js";

export class MarketPerformanceClient extends FMPClient {

  /**
   * Get market sector performance snapshot
   * @param date Date for the snapshot (YYYY-MM-DD)
   * @param params Optional parameters for filtering by exchange and sector
   * @param options Optional parameters including abort signal and context
   */
  async getSectorPerformanceSnapshot(
    date: string,
    params: { exchange?: string; sector?: string } = {},
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<SectorPerformance[]> {
    return super.get<SectorPerformance[]>(
      "/sector-performance-snapshot",
      {
        date,
        ...params,
      },
      options
    );
  }

  /**
   * Get industry performance snapshot
   * @param date Date for the snapshot (YYYY-MM-DD)
   * @param params Optional parameters for filtering by exchange and industry
   * @param options Optional parameters including abort signal and context
   */
  async getIndustryPerformanceSnapshot(
    date: string,
    params: { exchange?: string; industry?: string } = {},
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<IndustryPerformance[]> {
    return super.get<IndustryPerformance[]>(
      "/industry-performance-snapshot",
      {
        date,
        ...params,
      },
      options
    );
  }

  /**
   * Get historical market sector performance
   * @param sector Sector name
   * @param params Optional parameters for filtering by date range and exchange
   * @param options Optional parameters including abort signal and context
   */
  async getHistoricalSectorPerformance(
    sector: string,
    params: { from?: string; to?: string; exchange?: string } = {},
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<SectorPerformance[]> {
    return super.get<SectorPerformance[]>(
      "/historical-sector-performance",
      {
        sector,
        ...params,
      },
      options
    );
  }

  /**
   * Get historical industry performance
   * @param industry Industry name
   * @param params Optional parameters for filtering by date range and exchange
   * @param options Optional parameters including abort signal and context
   */
  async getHistoricalIndustryPerformance(
    industry: string,
    params: { from?: string; to?: string; exchange?: string } = {},
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<IndustryPerformance[]> {
    return super.get<IndustryPerformance[]>(
      "/historical-industry-performance",
      {
        industry,
        ...params,
      },
      options
    );
  }

  /**
   * Get sector PE snapshot
   * @param date Date for the snapshot (YYYY-MM-DD)
   * @param params Optional parameters for filtering by exchange and sector
   * @param options Optional parameters including abort signal and context
   */
  async getSectorPESnapshot(
    date: string,
    params: { exchange?: string; sector?: string } = {},
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<SectorPE[]> {
    return super.get<SectorPE[]>(
      "/sector-pe-snapshot",
      {
        date,
        ...params,
      },
      options
    );
  }

  /**
   * Get industry PE snapshot
   * @param date Date for the snapshot (YYYY-MM-DD)
   * @param params Optional parameters for filtering by exchange and industry
   * @param options Optional parameters including abort signal and context
   */
  async getIndustryPESnapshot(
    date: string,
    params: { exchange?: string; industry?: string } = {},
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<IndustryPE[]> {
    return super.get<IndustryPE[]>(
      "/industry-pe-snapshot",
      {
        date,
        ...params,
      },
      options
    );
  }

  /**
   * Get historical sector PE
   * @param sector Sector name
   * @param params Optional parameters for filtering by date range and exchange
   * @param options Optional parameters including abort signal and context
   */
  async getHistoricalSectorPE(
    sector: string,
    params: { from?: string; to?: string; exchange?: string } = {},
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<SectorPE[]> {
    return super.get<SectorPE[]>(
      "/historical-sector-pe",
      {
        sector,
        ...params,
      },
      options
    );
  }

  /**
   * Get historical industry PE
   * @param industry Industry name
   * @param params Optional parameters for filtering by date range and exchange
   * @param options Optional parameters including abort signal and context
   */
  async getHistoricalIndustryPE(
    industry: string,
    params: { from?: string; to?: string; exchange?: string } = {},
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<IndustryPE[]> {
    return super.get<IndustryPE[]>(
      "/historical-industry-pe",
      {
        industry,
        ...params,
      },
      options
    );
  }

  /**
   * Get biggest stock gainers
   * @param options Optional parameters including abort signal and context
   */
  async getBiggestGainers(options?: {
    signal?: AbortSignal;
    context?: FMPContext;
  }): Promise<StockMovement[]> {
    return super.get<StockMovement[]>("/biggest-gainers", {}, options);
  }

  /**
   * Get biggest stock losers
   * @param options Optional parameters including abort signal and context
   */
  async getBiggestLosers(options?: {
    signal?: AbortSignal;
    context?: FMPContext;
  }): Promise<StockMovement[]> {
    return super.get<StockMovement[]>("/biggest-losers", {}, options);
  }

  /**
   * Get most active stocks
   * @param options Optional parameters including abort signal and context
   */
  async getMostActiveStocks(options?: {
    signal?: AbortSignal;
    context?: FMPContext;
  }): Promise<StockMovement[]> {
    return super.get<StockMovement[]>("/most-actives", {}, options);
  }
}
