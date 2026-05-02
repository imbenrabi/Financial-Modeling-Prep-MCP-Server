import { FMPClient } from "../FMPClient.js";
import type { FMPContext } from "../../types/index.js";
import type {
  IndexItem,
  IndexQuote,
  IndexShortQuote,
  IndexLightChart,
  IndexFullChart,
  IndexIntradayData,
  IndexConstituent,
  HistoricalIndexChange,
} from "./types.js";

export class IndexesClient extends FMPClient {

  /**
   * Get a list of all stock market indexes
   * @param options Optional parameters including abort signal and context
   */
  async getIndexList(options?: {
    signal?: AbortSignal;
    context?: FMPContext;
  }): Promise<IndexItem[]> {
    return super.get<IndexItem[]>("/index-list", {}, options);
  }

  /**
   * Get quote data for a specific index
   * @param symbol Index symbol
   * @param options Optional parameters including abort signal and context
   */
  async getIndexQuote(
    symbol: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<IndexQuote[]> {
    return super.get<IndexQuote[]>(
      "/quote",
      {
        symbol,
      },
      options
    );
  }

  /**
   * Get short quote data for a specific index
   * @param symbol Index symbol
   * @param options Optional parameters including abort signal and context
   */
  async getIndexShortQuote(
    symbol: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<IndexShortQuote[]> {
    return super.get<IndexShortQuote[]>(
      "/quote-short",
      {
        symbol,
      },
      options
    );
  }

  /**
   * Get quotes for all available indexes
   * @param short Optional Whether to use short format (default: false)
   * @param options Optional parameters including abort signal and context
   */
  async getAllIndexQuotes(
    short?: boolean,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<IndexShortQuote[]> {
    return super.get<IndexShortQuote[]>(
      "/batch-index-quotes",
      {
        short,
      },
      options
    );
  }

  /**
   * Get historical light chart data for an index
   * @param symbol Index symbol
   * @param params Optional from/to date parameters
   * @param options Optional parameters including abort signal and context
   */
  async getHistoricalIndexLightChart(
    symbol: string,
    params: { from?: string; to?: string } = {},
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<IndexLightChart[]> {
    return super.get<IndexLightChart[]>(
      "/historical-price-eod/light",
      {
        symbol,
        ...params,
      },
      options
    );
  }

  /**
   * Get historical full chart data for an index
   * @param symbol Index symbol
   * @param params Optional from/to date parameters
   * @param options Optional parameters including abort signal and context
   */
  async getHistoricalIndexFullChart(
    symbol: string,
    params: { from?: string; to?: string } = {},
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<IndexFullChart[]> {
    return super.get<IndexFullChart[]>(
      "/historical-price-eod/full",
      {
        symbol,
        ...params,
      },
      options
    );
  }

  /**
   * Get 1-minute interval data for an index
   * @param symbol Index symbol
   * @param params Optional from/to date parameters
   * @param options Optional parameters including abort signal and context
   */
  async getIndex1MinuteData(
    symbol: string,
    params: { from?: string; to?: string } = {},
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<IndexIntradayData[]> {
    return super.get<IndexIntradayData[]>(
      "/historical-chart/1min",
      {
        symbol,
        ...params,
      },
      options
    );
  }

  /**
   * Get 5-minute interval data for an index
   * @param symbol Index symbol
   * @param params Optional from/to date parameters
   * @param options Optional parameters including abort signal and context
   */
  async getIndex5MinuteData(
    symbol: string,
    params: { from?: string; to?: string } = {},
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<IndexIntradayData[]> {
    return super.get<IndexIntradayData[]>(
      "/historical-chart/5min",
      {
        symbol,
        ...params,
      },
      options
    );
  }

  /**
   * Get 1-hour interval data for an index
   * @param symbol Index symbol
   * @param params Optional from/to date parameters
   * @param options Optional parameters including abort signal and context
   */
  async getIndex1HourData(
    symbol: string,
    params: { from?: string; to?: string } = {},
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<IndexIntradayData[]> {
    return super.get<IndexIntradayData[]>(
      "/historical-chart/1hour",
      {
        symbol,
        ...params,
      },
      options
    );
  }

  /**
   * Get S&P 500 constituents
   * @param options Optional parameters including abort signal and context
   */
  async getSP500Constituents(options?: {
    signal?: AbortSignal;
    context?: FMPContext;
  }): Promise<IndexConstituent[]> {
    return super.get<IndexConstituent[]>("/sp500-constituent", {}, options);
  }

  /**
   * Get Nasdaq constituents
   * @param options Optional parameters including abort signal and context
   */
  async getNasdaqConstituents(options?: {
    signal?: AbortSignal;
    context?: FMPContext;
  }): Promise<IndexConstituent[]> {
    return super.get<IndexConstituent[]>("/nasdaq-constituent", {}, options);
  }

  /**
   * Get Dow Jones constituents
   * @param options Optional parameters including abort signal and context
   */
  async getDowJonesConstituents(options?: {
    signal?: AbortSignal;
    context?: FMPContext;
  }): Promise<IndexConstituent[]> {
    return super.get<IndexConstituent[]>("/dowjones-constituent", {}, options);
  }

  /**
   * Get historical S&P 500 changes
   * @param options Optional parameters including abort signal and context
   */
  async getHistoricalSP500Changes(options?: {
    signal?: AbortSignal;
    context?: FMPContext;
  }): Promise<HistoricalIndexChange[]> {
    return super.get<HistoricalIndexChange[]>(
      "/historical-sp500-constituent",
      {},
      options
    );
  }

  /**
   * Get historical Nasdaq changes
   * @param options Optional parameters including abort signal and context
   */
  async getHistoricalNasdaqChanges(options?: {
    signal?: AbortSignal;
    context?: FMPContext;
  }): Promise<HistoricalIndexChange[]> {
    return super.get<HistoricalIndexChange[]>(
      "/historical-nasdaq-constituent",
      {},
      options
    );
  }

  /**
   * Get historical Dow Jones changes
   * @param options Optional parameters including abort signal and context
   */
  async getHistoricalDowJonesChanges(options?: {
    signal?: AbortSignal;
    context?: FMPContext;
  }): Promise<HistoricalIndexChange[]> {
    return super.get<HistoricalIndexChange[]>(
      "/historical-dowjones-constituent",
      {},
      options
    );
  }
}
