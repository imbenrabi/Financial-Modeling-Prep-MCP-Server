import { FMPClient } from "../FMPClient.js";
import type { FMPContext } from "../../types.js";
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
   * @param options Optional parameters including abort signal and context
   */
  async getQuote(
    params: QuoteParams,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<StockQuote[]> {
    return this.get<StockQuote[]>(`/quote`, { symbol: params.symbol }, options);
  }

  /**
   * Get short version of real-time stock quotes for a symbol
   * @param params Quote parameters including symbol
   * @param options Optional parameters including abort signal and context
   */
  async getQuoteShort(
    params: QuoteParams,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<StockQuoteShort[]> {
    return this.get<StockQuoteShort[]>(
      `/quote-short`,
      { symbol: params.symbol },
      options
    );
  }

  /**
   * Get aftermarket trade data for a symbol
   * @param params Quote parameters including symbol
   * @param options Optional parameters including abort signal and context
   */
  async getAftermarketTrade(
    params: QuoteParams,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<AftermarketTrade[]> {
    return this.get<AftermarketTrade[]>(
      `/aftermarket-trade`,
      { symbol: params.symbol },
      options
    );
  }

  /**
   * Get aftermarket quote data for a symbol
   * @param params Quote parameters including symbol
   * @param options Optional parameters including abort signal and context
   */
  async getAftermarketQuote(
    params: QuoteParams,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<AftermarketQuote[]> {
    return this.get<AftermarketQuote[]>(
      `/aftermarket-quote`,
      { symbol: params.symbol },
      options
    );
  }

  /**
   * Get stock price change data for a symbol
   * @param params Quote parameters including symbol
   * @param options Optional parameters including abort signal and context
   */
  async getStockPriceChange(
    params: QuoteParams,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<StockPriceChange[]> {
    return this.get<StockPriceChange[]>(
      `/stock-price-change`,
      { symbol: params.symbol },
      options
    );
  }

  /**
   * Get batch quotes for multiple symbols
   * @param params Batch quote parameters including symbols
   * @param options Optional parameters including abort signal and context
   */
  async getBatchQuotes(
    params: BatchQuoteParams,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<StockQuote[]> {
    return this.get<StockQuote[]>(
      `/batch-quote`,
      { symbols: params.symbols },
      options
    );
  }

  /**
   * Get short version of batch quotes for multiple symbols
   * @param params Batch quote parameters including symbols
   * @param options Optional parameters including abort signal and context
   */
  async getBatchQuotesShort(
    params: BatchQuoteParams,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<StockQuoteShort[]> {
    return this.get<StockQuoteShort[]>(
      `/batch-quote-short`,
      { symbols: params.symbols },
      options
    );
  }

  /**
   * Get batch aftermarket trade data for multiple symbols
   * @param params Batch quote parameters including symbols
   * @param options Optional parameters including abort signal and context
   */
  async getBatchAftermarketTrade(
    params: BatchQuoteParams,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<AftermarketTrade[]> {
    return this.get<AftermarketTrade[]>(
      `/batch-aftermarket-trade`,
      { symbols: params.symbols },
      options
    );
  }

  /**
   * Get batch aftermarket quote data for multiple symbols
   * @param params Batch quote parameters including symbols
   * @param options Optional parameters including abort signal and context
   */
  async getBatchAftermarketQuote(
    params: BatchQuoteParams,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<AftermarketQuote[]> {
    return this.get<AftermarketQuote[]>(
      `/batch-aftermarket-quote`,
      { symbols: params.symbols },
      options
    );
  }

  /**
   * Get stock quotes for all listed stocks on a specific exchange
   * @param params Exchange quote parameters
   * @param options Optional parameters including abort signal and context
   */
  async getExchangeQuotes(
    params: ExchangeQuoteParams,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<StockQuoteShort[]> {
    return this.get<StockQuoteShort[]>(
      `/batch-exchange-quote`,
      {
        exchange: params.exchange,
        short: params.short,
      },
      options
    );
  }

  /**
   * Get quotes for mutual funds
   * @param params Optional short format parameters
   * @param options Optional parameters including abort signal and context
   */
  async getMutualFundQuotes(
    params: ShortParams = {},
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<StockQuoteShort[]> {
    return this.get<StockQuoteShort[]>(
      `/batch-mutualfund-quotes`,
      { short: params.short },
      options
    );
  }

  /**
   * Get quotes for ETFs
   * @param params Optional short format parameters
   * @param options Optional parameters including abort signal and context
   */
  async getETFQuotes(
    params: ShortParams = {},
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<StockQuoteShort[]> {
    return this.get<StockQuoteShort[]>(
      `/batch-etf-quotes`,
      { short: params.short },
      options
    );
  }

  /**
   * Get quotes for commodities
   * @param params Optional short format parameters
   * @param options Optional parameters including abort signal and context
   */
  async getCommodityQuotes(
    params: ShortParams = {},
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<StockQuoteShort[]> {
    return this.get<StockQuoteShort[]>(
      `/batch-commodity-quotes`,
      { short: params.short },
      options
    );
  }

  /**
   * Get quotes for cryptocurrencies
   * @param params Optional short format parameters
   * @param options Optional parameters including abort signal and context
   */
  async getCryptoQuotes(
    params: ShortParams = {},
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<StockQuoteShort[]> {
    return this.get<StockQuoteShort[]>(
      `/batch-crypto-quotes`,
      { short: params.short },
      options
    );
  }

  /**
   * Get quotes for forex pairs
   * @param params Optional short format parameters
   * @param options Optional parameters including abort signal and context
   */
  async getForexQuotes(
    params: ShortParams = {},
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<StockQuoteShort[]> {
    return this.get<StockQuoteShort[]>(
      `/batch-forex-quotes`,
      { short: params.short },
      options
    );
  }

  /**
   * Get quotes for market indexes
   * @param params Optional short format parameters
   * @param options Optional parameters including abort signal and context
   */
  async getIndexQuotes(
    params: ShortParams = {},
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<StockQuoteShort[]> {
    return this.get<StockQuoteShort[]>(
      `/batch-index-quotes`,
      { short: params.short },
      options
    );
  }
}
