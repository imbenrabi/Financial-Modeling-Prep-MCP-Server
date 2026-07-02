import { FMPClient } from "../FMPClient.js";
import {
  StockQuote,
  StockQuoteShort,
  AftermarketTrade,
  AftermarketQuote,
  StockPriceChange,
  QuoteParams,
  BatchQuoteParams,
  ExchangeQuoteParams,
  ShortParams,
} from "./types.js";

export class QuotesClient extends FMPClient {

  /**
   * Get real-time stock quotes for a symbol
   * @param params Quote parameters including symbol
   */
  async getQuote(
    params: QuoteParams
  ): Promise<StockQuote[]> {
    return this.get<StockQuote[]>(`/quote`, { symbol: params.symbol });
  }

  /**
   * Get short version of real-time stock quotes for a symbol
   * @param params Quote parameters including symbol
   */
  async getQuoteShort(
    params: QuoteParams
  ): Promise<StockQuoteShort[]> {
    return this.get<StockQuoteShort[]>(
      `/quote-short`,
      { symbol: params.symbol }
    );
  }

  /**
   * Get aftermarket trade data for a symbol
   * @param params Quote parameters including symbol
   */
  async getAftermarketTrade(
    params: QuoteParams
  ): Promise<AftermarketTrade[]> {
    return this.get<AftermarketTrade[]>(
      `/aftermarket-trade`,
      { symbol: params.symbol }
    );
  }

  /**
   * Get aftermarket quote data for a symbol
   * @param params Quote parameters including symbol
   */
  async getAftermarketQuote(
    params: QuoteParams
  ): Promise<AftermarketQuote[]> {
    return this.get<AftermarketQuote[]>(
      `/aftermarket-quote`,
      { symbol: params.symbol }
    );
  }

  /**
   * Get stock price change data for a symbol
   * @param params Quote parameters including symbol
   */
  async getStockPriceChange(
    params: QuoteParams
  ): Promise<StockPriceChange[]> {
    return this.get<StockPriceChange[]>(
      `/stock-price-change`,
      { symbol: params.symbol }
    );
  }

  /**
   * Get batch quotes for multiple symbols
   * @param params Batch quote parameters including symbols
   */
  async getBatchQuotes(
    params: BatchQuoteParams
  ): Promise<StockQuote[]> {
    return this.get<StockQuote[]>(
      `/batch-quote`,
      { symbols: params.symbols }
    );
  }

  /**
   * Get short version of batch quotes for multiple symbols
   * @param params Batch quote parameters including symbols
   */
  async getBatchQuotesShort(
    params: BatchQuoteParams
  ): Promise<StockQuoteShort[]> {
    return this.get<StockQuoteShort[]>(
      `/batch-quote-short`,
      { symbols: params.symbols }
    );
  }

  /**
   * Get batch aftermarket trade data for multiple symbols
   * @param params Batch quote parameters including symbols
   */
  async getBatchAftermarketTrade(
    params: BatchQuoteParams
  ): Promise<AftermarketTrade[]> {
    return this.get<AftermarketTrade[]>(
      `/batch-aftermarket-trade`,
      { symbols: params.symbols }
    );
  }

  /**
   * Get batch aftermarket quote data for multiple symbols
   * @param params Batch quote parameters including symbols
   */
  async getBatchAftermarketQuote(
    params: BatchQuoteParams
  ): Promise<AftermarketQuote[]> {
    return this.get<AftermarketQuote[]>(
      `/batch-aftermarket-quote`,
      { symbols: params.symbols }
    );
  }

  /**
   * Get stock quotes for all listed stocks on a specific exchange
   * @param params Exchange quote parameters
   */
  async getExchangeQuotes(
    params: ExchangeQuoteParams
  ): Promise<StockQuoteShort[]> {
    return this.get<StockQuoteShort[]>(
      `/batch-exchange-quote`,
      {
        exchange: params.exchange,
        short: params.short,
      }
    );
  }

  /**
   * Get quotes for mutual funds
   * @param params Optional short format parameters
   */
  async getMutualFundQuotes(
    params: ShortParams = {}
  ): Promise<StockQuoteShort[]> {
    return this.get<StockQuoteShort[]>(
      `/batch-mutualfund-quotes`,
      { short: params.short }
    );
  }

  /**
   * Get quotes for ETFs
   * @param params Optional short format parameters
   */
  async getETFQuotes(
    params: ShortParams = {}
  ): Promise<StockQuoteShort[]> {
    return this.get<StockQuoteShort[]>(
      `/batch-etf-quotes`,
      { short: params.short }
    );
  }

  /**
   * Get quotes for commodities
   * @param params Optional short format parameters
   */
  async getCommodityQuotes(
    params: ShortParams = {}
  ): Promise<StockQuoteShort[]> {
    return this.get<StockQuoteShort[]>(
      `/batch-commodity-quotes`,
      { short: params.short }
    );
  }

  /**
   * Get quotes for cryptocurrencies
   * @param params Optional short format parameters
   */
  async getCryptoQuotes(
    params: ShortParams = {}
  ): Promise<StockQuoteShort[]> {
    return this.get<StockQuoteShort[]>(
      `/batch-crypto-quotes`,
      { short: params.short }
    );
  }

  /**
   * Get quotes for forex pairs
   * @param params Optional short format parameters
   */
  async getForexQuotes(
    params: ShortParams = {}
  ): Promise<StockQuoteShort[]> {
    return this.get<StockQuoteShort[]>(
      `/batch-forex-quotes`,
      { short: params.short }
    );
  }

  /**
   * Get quotes for market indexes
   * @param params Optional short format parameters
   */
  async getIndexQuotes(
    params: ShortParams = {}
  ): Promise<StockQuoteShort[]> {
    return this.get<StockQuoteShort[]>(
      `/batch-index-quotes`,
      { short: params.short }
    );
  }
}
