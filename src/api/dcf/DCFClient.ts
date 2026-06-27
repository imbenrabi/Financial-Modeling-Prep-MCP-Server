import { FMPClient } from "../FMPClient.js";
import type {
  DCFValuation,
  CustomDCFInput,
  CustomDCFOutput,
} from "./types.js";



export class DCFClient extends FMPClient {

  /**
   * Get DCF(Discounted Cash Flow) valuation for a symbol
   * @param symbol The stock symbol
   * @returns DCF valuation data
   */
  async getValuation(symbol: string): Promise<DCFValuation> {
    return super.get<DCFValuation>("/discounted-cash-flow", { symbol });
  }

  /**
   * Get levered DCF(Discounted Cash Flow) valuation for a symbol
   * @param symbol The stock symbol
   * @returns Levered DCF valuation data
   */
  async getLeveredValuation(symbol: string): Promise<DCFValuation[]> {
    return super.get<DCFValuation[]>("/levered-discounted-cash-flow", { symbol });
  }

  /**
   * Calculate custom levered DCF valuation
   * @param input Custom DCF input parameters
   * @returns Custom DCF output data
   */
  async calculateCustomLeveredDCF(input: CustomDCFInput): Promise<CustomDCFOutput> {
    return super.get<CustomDCFOutput>("/custom-levered-discounted-cash-flow", { ...input });
  }

  /**
   * Calculate custom DCF valuation
   * @param input Custom DCF input parameters
   * @returns Custom DCF output data
   */
  async calculateCustomDCF(input: CustomDCFInput): Promise<CustomDCFOutput> {
    return super.get<CustomDCFOutput>("/custom-discounted-cash-flow", { ...input });
  }
}


  

