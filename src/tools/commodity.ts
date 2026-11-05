import { CommodityClient } from "../api/commodity/CommodityClient.js";
import type { ToolRegistrar } from "../types/index.js";

/**
 * Register all commodity-related tools with the MCP server
 * @param server The MCP server instance
 * @param accessToken The Financial Modeling Prep API access token (optional when using lazy loading)
 */
export function registerCommodityTools(
  server: ToolRegistrar,
  accessToken?: string
): void {
  const commodityClient = new CommodityClient(accessToken);

  server.tool(
    "listCommodities",
    "Access an extensive list of tracked commodities across various sectors, including energy, metals, and agricultural products. The FMP Commodities List API provides essential data on tradable commodities, giving investors the ability to explore market options in real-time.",
    {},
    async () => {
      try {
        const results = await commodityClient.listCommodities();
        return {
          content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
