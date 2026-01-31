import { TOOL_SETS } from "../constants/toolSets.js";
import type { ServerMode, ToolSet } from "../types/index.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export interface PromptContext {
  mode: ServerMode;
  version: string;
  listChanged: boolean;
  staticToolSets?: ToolSet[];
}

export function registerListMcpAssets(server: McpServer, context: PromptContext): void {
  const contentBuilder = () => buildAssetsOverview(context);
  const hasPrompt = (server as unknown as { prompt?: Function }).prompt;
  if (typeof hasPrompt === 'function') {
    try {
      (server as unknown as { prompt: Function }).prompt(
        "list_mcp_assets",
        "Human-friendly overview of server capabilities: modes, prompts, tools, resources, and quick start.",
        {},
        async () => {
          const text = contentBuilder();
          return {
            messages: [
              {
                role: "user",
                content: [{ type: "text", text }]
              }
            ]
          };
        }
      );
    } catch (err) {
      console.warn("Failed to register native prompt:", err);
    }
  }
}

function buildAssetsOverview(ctx: PromptContext): string {
  const { mode, version, listChanged, staticToolSets } = ctx;
  const now = new Date().toISOString();
  const uptime = process.uptime();
  const mem = process.memoryUsage();
  const toolsetCount = Object.keys(TOOL_SETS).length;

  const header = [
    `# Server Capabilities`,
    `Name: Financial Modeling Prep MCP (Stateful)`,
    `Version: ${version}`,
    `Mode: ${mode}`,
    `Tools listChanged: ${listChanged}`,
  ].join('\n');

  const prompts = [
    `## Prompts`,
    `- list_mcp_assets: Human-friendly overview of capabilities and quick start guidance.`,
  ].join('\n');

  const tools = renderToolsSection(mode, staticToolSets, toolsetCount);

  const resources = [
    `## Resources`,
    `Health snapshot (@ ${now})`,
    `- uptime: ${uptime.toFixed(0)}s`,
    `- memory: rss=${Math.round(mem.rss/1024/1024)}MB, heapUsed=${Math.round(mem.heapUsed/1024/1024)}MB`,
    `- serverVersion: ${version}`,
    `- mode: ${mode}`,
  ].join('\n');

  const quickStart = renderQuickStart(mode, staticToolSets);

  const tokenNotice = [
    ``,
    `## Authentication Notice`,
    `- FMP_ACCESS_TOKEN is optional for server initialization.`,
    `- It is required when invoking any FMP-backed tools. Without a valid token, tool calls will return an error.`,
    `- You can provide the token via server CLI/env or per-session config. Server-level values take precedence.`,
  ].join('\n');

  return [header, '', prompts, '', tools, '', resources, '', quickStart, '', tokenNotice].join('\n');
}

function renderToolsSection(mode: ServerMode, staticToolSets: ToolSet[] | undefined, toolsetCount: number): string {
  const lines: string[] = [
    `## Tools`
  ];

  if (mode === 'DYNAMIC_TOOL_DISCOVERY') {
    lines.push(
      `Dynamic mode starts with meta-tools only:`,
      `- enable_toolset`,
      `- disable_toolset`,
      `- list_toolsets`,
      `- describe_toolset`,
      `- list_tools`,
      ``,
      `Available toolsets (${toolsetCount}):`
    );
    for (const [key, def] of Object.entries(TOOL_SETS)) {
      lines.push(`- ${key}: ${def.name} — ${def.description}`);
    }
    lines.push(
      ``,
      `Tip: Use enable_toolset to load needed categories before calling tools.`
    );
    return lines.join('\n');
  }

  if (mode === 'STATIC_TOOL_SETS') {
    const active = staticToolSets ?? [];
    lines.push(`Static mode with configured toolsets (${active.length}):`);
    if (active.length === 0) {
      lines.push(`- (none configured)`);
    } else {
      for (const ts of active) {
        const def = TOOL_SETS[ts];
        if (def) lines.push(`- ${ts}: ${def.name} — ${def.description}`);
      }
    }
    lines.push(
      ``,
      `Note: Only the above toolsets are pre-loaded for this session.`
    );
    return lines.join('\n');
  }

  lines.push(
    `Legacy mode loads all tools (253+ across ${toolsetCount} categories).`,
    `To avoid long lists, categories are summarized below:`,
  );
  for (const [key, def] of Object.entries(TOOL_SETS)) {
    lines.push(`- ${key}: ${def.name} — ${def.description}`);
  }
  lines.push(
    ``,
    `Tip: Use tools/list or filter by category when exploring.`
  );
  return lines.join('\n');
}

function renderQuickStart(mode: ServerMode, staticToolSets?: ToolSet[]): string {
  if (mode === 'DYNAMIC_TOOL_DISCOVERY') {
    return [
      `## Quick Start`,
      `1) Initialize session in dynamic mode`,
      '```bash',
      'CONFIG_BASE64=$(echo -n "{\"DYNAMIC_TOOL_DISCOVERY\":\"true\"}" | base64)',
      'curl -X POST "http://localhost:8080/mcp?config=${CONFIG_BASE64}" \\ ',
      '  -H "Content-Type: application/json" -d "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"initialize\",\"params\":{}}"',
      '```',
      `2) Enable a toolset and call a tool`,
      '```bash',
      '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"enable_toolset","arguments":{"toolset":"search"}}}',
      '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"searchSymbol","arguments":{"query":"AAPL"}}}',
      '```',
    ].join('\n');
  }

  if (mode === 'STATIC_TOOL_SETS') {
    const example = (staticToolSets && staticToolSets.includes('quotes' as ToolSet)) ? 'quotes' : (staticToolSets?.[0] ?? 'search');
    const exampleTool = example === 'quotes' ? 'getQuote' : 'searchSymbol';
    const cfg = staticToolSets && staticToolSets.length > 0 ? staticToolSets.join(',') : 'search,company,quotes';
    return [
      `## Quick Start`,
      `1) Initialize session with static toolsets`,
      '```bash',
      `CONFIG_BASE64=$(echo -n '{"FMP_TOOL_SETS":"${cfg}"}' | base64)`,
      'curl -X POST "http://localhost:8080/mcp?config=${CONFIG_BASE64}" \\ ',
      '  -H "Content-Type: application/json" -d "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"initialize\",\"params\":{}}"',
      '```',
      `2) Call a tool directly`,
      '```bash',
      `{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"${exampleTool}","arguments":{"symbol":"AAPL","query":"AAPL"}}}`,
      '```',
    ].join('\n');
  }

  return [
    `## Quick Start`,
    `1) Initialize (legacy mode loads all tools)`,
    '```bash',
    'CONFIG_BASE64=$(echo -n "{}" | base64)',
    'curl -X POST "http://localhost:8080/mcp?config=${CONFIG_BASE64}" \\ ',
    '  -H "Content-Type: application/json" -d "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"initialize\",\"params\":{}}"',
    '```',
    `2) Explore tools then call one`,
    '```bash',
    '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}',
    '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"getQuote","arguments":{"symbol":"AAPL"}}}',
    '```',
  ].join('\n');
}


