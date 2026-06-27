import { FMPClient } from "../FMPClient.js";
import type { FMPContext } from "../../types.js";
import type {
  LatestEarningTranscript,
  EarningTranscript,
  TranscriptDate,
  AvailableTranscriptSymbol,
  LatestTranscriptsParams,
  TranscriptParams,
  TranscriptDatesParams,
} from "./types.js";

export class EarningsTranscriptClient extends FMPClient {

  /**
   * Get latest earning transcripts with pagination
   * @param params Parameters for latest transcripts request
   * @param options Optional parameters including abort signal and context
   */
  async getLatestTranscripts(
    params: LatestTranscriptsParams = {},
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<LatestEarningTranscript[]> {
    return this.get<LatestEarningTranscript[]>(
      `/earning-call-transcript-latest`,
      {
        limit: params.limit,
        page: params.page,
      },
      options
    );
  }

  /**
   * Get earning transcript for a specific company, year, and quarter
   * @param params Parameters for transcript request
   * @param options Optional parameters including abort signal and context
   */
  async getTranscript(
    params: TranscriptParams,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<EarningTranscript[]> {
    return this.get<EarningTranscript[]>(
      `/earning-call-transcript`,
      {
        symbol: params.symbol,
        year: params.year,
        quarter: params.quarter,
        limit: params.limit,
      },
      options
    );
  }

  /**
   * Get transcript dates for a specific company
   * @param params Parameters for transcript dates request
   * @param options Optional parameters including abort signal and context
   */
  async getTranscriptDates(
    params: TranscriptDatesParams,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<TranscriptDate[]> {
    return this.get<TranscriptDate[]>(
      `/earning-call-transcript-dates`,
      {
        symbol: params.symbol,
      },
      options
    );
  }

  /**
   * Get list of available transcript symbols
   * @param options Optional parameters including abort signal and context
   */
  async getAvailableTranscriptSymbols(options?: {
    signal?: AbortSignal;
    context?: FMPContext;
  }): Promise<AvailableTranscriptSymbol[]> {
    return this.get<AvailableTranscriptSymbol[]>(
      `/earnings-transcript-list`,
      {},
      options
    );
  }
}
