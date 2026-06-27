import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { ServerMode, ToolSet } from "../types/index.js";
import { registerListMcpAssets, type PromptContext } from "./list-mcp-assets.js";

export function registerPrompts(
  server: McpServer,
  context: { mode: ServerMode; version: string; listChanged: boolean; staticToolSets?: ToolSet[] }
): void {
  const ctx: PromptContext = {
    mode: context.mode,
    version: context.version,
    listChanged: context.listChanged,
    staticToolSets: context.staticToolSets,
  };

  registerListMcpAssets(server, ctx);
}


