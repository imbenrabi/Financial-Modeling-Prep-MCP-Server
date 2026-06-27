import { FMPClient } from "../FMPClient.js";
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
   */
  async getIndexList(): Promise<IndexItem[]> {
    return super.get<IndexItem[]>("/index-list", {});
  }

  /**
   * Get quote data for a specific index
   * @param symbol Index symbol
   */
  async getIndexQuote(
    symbol: string
  ): Promise<IndexQuote[]> {
    return super.get<IndexQuote[]>(
      "/quote",
      {
        symbol,
      }
    );
  }

  /**
   * Get short quote data for a specific index
   * @param symbol Index symbol
   */
  async getIndexShortQuote(
    symbol: string
  ): Promise<IndexShortQuote[]> {
    return super.get<IndexShortQuote[]>(
      "/quote-short",
      {
        symbol,
      }
    );
  }

  /**
   * Get quotes for all available indexes
   * @param short Optional Whether to use short format (default: false)
   */
  async getAllIndexQuotes(
    short?: boolean
  ): Promise<IndexShortQuote[]> {
    return super.get<IndexShortQuote[]>(
      "/batch-index-quotes",
      {
        short,
      }
    );
  }

  /**
   * Get historical light chart data for an index
   * @param symbol Index symbol
   * @param params Optional from/to date parameters
   */
  async getHistoricalIndexLightChart(
    symbol: string,
    params: { from?: string; to?: string } = {}
  ): Promise<IndexLightChart[]> {
    return super.get<IndexLightChart[]>(
      "/historical-price-eod/light",
      {
        symbol,
        ...params,
      }
    );
  }

  /**
   * Get historical full chart data for an index
   * @param symbol Index symbol
   * @param params Optional from/to date parameters
   */
  async getHistoricalIndexFullChart(
    symbol: string,
    params: { from?: string; to?: string } = {}
  ): Promise<IndexFullChart[]> {
    return super.get<IndexFullChart[]>(
      "/historical-price-eod/full",
      {
        symbol,
        ...params,
      }
    );
  }

  /**
   * Get 1-minute interval data for an index
   * @param symbol Index symbol
   * @param params Optional from/to date parameters
   */
  async getIndex1MinuteData(
    symbol: string,
    params: { from?: string; to?: string } = {}
  ): Promise<IndexIntradayData[]> {
    return super.get<IndexIntradayData[]>(
      "/historical-chart/1min",
      {
        symbol,
        ...params,
      }
    );
  }

  /**
   * Get 5-minute interval data for an index
   * @param symbol Index symbol
   * @param params Optional from/to date parameters
   */
  async getIndex5MinuteData(
    symbol: string,
    params: { from?: string; to?: string } = {}
  ): Promise<IndexIntradayData[]> {
    return super.get<IndexIntradayData[]>(
      "/historical-chart/5min",
      {
        symbol,
        ...params,
      }
    );
  }

  /**
   * Get 1-hour interval data for an index
   * @param symbol Index symbol
   * @param params Optional from/to date parameters
   */
  async getIndex1HourData(
    symbol: string,
    params: { from?: string; to?: string } = {}
  ): Promise<IndexIntradayData[]> {
    return super.get<IndexIntradayData[]>(
      "/historical-chart/1hour",
      {
        symbol,
        ...params,
      }
    );
  }

  /**
   * Get S&P 500 constituents
   */
  async getSP500Constituents(): Promise<IndexConstituent[]> {
    return super.get<IndexConstituent[]>("/sp500-constituent", {});
  }

  /**
   * Get Nasdaq constituents
   */
  async getNasdaqConstituents(): Promise<IndexConstituent[]> {
    return super.get<IndexConstituent[]>("/nasdaq-constituent", {});
  }

  /**
   * Get Dow Jones constituents
   */
  async getDowJonesConstituents(): Promise<IndexConstituent[]> {
    return super.get<IndexConstituent[]>("/dowjones-constituent", {});
  }

  /**
   * Get historical S&P 500 changes
   */
  async getHistoricalSP500Changes(): Promise<HistoricalIndexChange[]> {
    return super.get<HistoricalIndexChange[]>(
      "/historical-sp500-constituent",
      {}
    );
  }

  /**
   * Get historical Nasdaq changes
   */
  async getHistoricalNasdaqChanges(): Promise<HistoricalIndexChange[]> {
    return super.get<HistoricalIndexChange[]>(
      "/historical-nasdaq-constituent",
      {}
    );
  }

  /**
   * Get historical Dow Jones changes
   */
  async getHistoricalDowJonesChanges(): Promise<HistoricalIndexChange[]> {
    return super.get<HistoricalIndexChange[]>(
      "/historical-dowjones-constituent",
      {}
    );
  }
}
