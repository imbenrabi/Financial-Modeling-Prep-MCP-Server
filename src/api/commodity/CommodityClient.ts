import { FMPClient } from "../FMPClient.js";
import type {
  Commodity
} from "./types.js";

export class CommodityClient extends FMPClient {

  /**
   * Get list of commodities
   * @returns Array of commodities
   */
  async listCommodities(): Promise<Commodity[]> {
    return super.get<Commodity[]>("/commodity-list", {});
  } 
}
