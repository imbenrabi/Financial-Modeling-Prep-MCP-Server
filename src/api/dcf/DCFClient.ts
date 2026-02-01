import { FMPClient } from "../FMPClient.js";
import type { FMPContext } from "../../types/index.js";
import type {
  DCFValuation,
  CustomDCFInput,
  CustomDCFOutput,
} from "./types.js";



export class DCFClient extends FMPClient {
  constructor(apiKey?: string) {
    super(apiKey);
  }

  /**
   * Get DCF(Discounted Cash Flow) valuation for a symbol
   * @param symbol The stock symbol
   * @param options Optional parameters including abort signal and context
   * @returns DCF valuation data
   */
  async getValuation(
    symbol: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<DCFValuation> {
    return super.get<DCFValuation>("/discounted-cash-flow", { symbol }, options);
  }

  /**
   * Get levered DCF(Discounted Cash Flow) valuation for a symbol
   * @param symbol The stock symbol
   * @param options Optional parameters including abort signal and context
   * @returns Levered DCF valuation data
   */
  async getLeveredValuation(
    symbol: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<DCFValuation[]> {
    return super.get<DCFValuation[]>("/levered-discounted-cash-flow", { symbol }, options);
  }

  /**
   * Calculate custom levered DCF valuation
   * @param input Custom DCF input parameters
   * @param options Optional parameters including abort signal and context
   * @returns Custom DCF output data
   */
  async calculateCustomLeveredDCF(
    input: CustomDCFInput,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<CustomDCFOutput> {
    return super.get<CustomDCFOutput>("/custom-levered-discounted-cash-flow", { ...input }, options);
  }

  /**
   * Calculate custom DCF valuation
   * @param input Custom DCF input parameters
   * @param options Optional parameters including abort signal and context
   * @returns Custom DCF output data
   */
  async calculateCustomDCF(
    input: CustomDCFInput,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<CustomDCFOutput> {
    return super.get<CustomDCFOutput>("/custom-discounted-cash-flow", { ...input }, options);
  }
}


  

