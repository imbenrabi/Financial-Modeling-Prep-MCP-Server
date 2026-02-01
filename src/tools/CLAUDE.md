# Tools Layer

MCP tool registrations for all FMP API endpoints. Each module exports a registration function.

## Pattern

Every tool module follows this structure:

```typescript
// src/tools/{module}.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { DomainClient } from '../api/{domain}';

export function register{Module}Tools(server: McpServer, accessToken?: string): void {
  const client = new DomainClient(accessToken);

  server.tool(
    "toolName",                           // Unique identifier
    "Description of what tool does...",   // Human-readable description
    {
      // Zod schema for parameters
      symbol: z.string().describe("Stock ticker symbol"),
      limit: z.number().optional().describe("Max results"),
    },
    async ({ symbol, limit }) => {
      try {
        const results = await client.method(symbol, limit);
        return {
          content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Error: ${error instanceof Error ? error.message : String(error)}`,
          }],
          isError: true,
        };
      }
    }
  );
}
```

## Tool Registration Signature

```typescript
server.tool(
  name: string,                    // Unique tool identifier
  description: string,             // Shown to LLM for tool selection
  schema: Record<string, ZodType>, // Input parameter definitions
  handler: (params) => Promise<ToolResult>
)
```

## Zod Schema Patterns

```typescript
// Required string
symbol: z.string().describe("Stock ticker symbol (e.g., AAPL)")

// Optional number with default behavior
limit: z.number().optional().describe("Maximum results to return")

// Enum/union types
period: z.enum(["annual", "quarter"]).describe("Reporting period")

// Date strings
from: z.string().optional().describe("Start date (YYYY-MM-DD)")
```

## Error Handling

**Tools never throw.** Always return error in response:

```typescript
return {
  content: [{ type: "text", text: `Error: ${message}` }],
  isError: true,  // Flags error to MCP client
};
```

## Tool Annotations

When tools are collected by `ToolCollector`, these annotations are added:

```typescript
{
  readOnlyHint: true,      // All tools are read-only data fetchers
  destructiveHint: false,  // No tools modify data
  idempotentHint: true,    // Same request = same response
  openWorldHint: true,     // Calls external FMP API
}
```

## Module List (28 modules, 253+ tools)

| Module | Tools | Description |
|--------|-------|-------------|
| `search` | 4 | Symbol, name, CIK, CUSIP search |
| `directory` | 7 | Exchange lists, trading symbols |
| `company` | 15 | Profiles, peers, executives, notes |
| `quotes` | 12 | Real-time and historical quotes |
| `statements` | 18 | Income, balance, cash flow statements |
| `calendar` | 8 | IPO, dividends, earnings, splits |
| `earnings-transcript` | 3 | Earnings call transcripts |
| `chart` | 4 | OHLCV chart data |
| `news` | 5 | Market and company news |
| `analyst` | 8 | Estimates, recommendations, targets |
| `market-performance` | 6 | Gainers, losers, most active |
| `market-hours` | 2 | Market hours by exchange |
| `insider-trades` | 4 | Insider transactions |
| `form-13f` | 5 | 13F institutional filings |
| `indexes` | 6 | Index constituents |
| `cot` | 3 | Commitments of Traders |
| `economics` | 8 | Economic indicators |
| `crypto` | 6 | Cryptocurrency data |
| `forex` | 5 | Foreign exchange |
| `commodity` | 4 | Commodity prices |
| `fund` | 10 | ETF/mutual fund data |
| `fundraisers` | 3 | Crowdfunding data |
| `esg` | 5 | ESG scores and ratings |
| `technical-indicators` | 8 | SMA, EMA, RSI, MACD, etc. |
| `government-trading` | 4 | Congressional trades |
| `sec-filings` | 6 | SEC filing data |
| `dcf` | 4 | DCF valuations |
| `bulk` | 8 | Bulk data downloads |

## Response Format

All tools return JSON-stringified data:

```typescript
return {
  content: [{
    type: "text",
    text: JSON.stringify(results, null, 2)  // Pretty-printed JSON
  }],
};
```

## Adding a New Tool

1. Add to existing module or create new `src/tools/{module}.ts`
2. Follow the registration pattern above
3. Use existing API client or create new one in `src/api/`
4. Add module to `MODULE_ADAPTERS` in `src/toolception-adapters/moduleAdapters.ts`
5. Map to tool set in `src/constants/toolSets.ts`

## Common Tool Patterns

### Single Entity Lookup
```typescript
server.tool("getCompanyProfile", "Get company profile", {
  symbol: z.string().describe("Ticker symbol"),
}, async ({ symbol }) => { ... });
```

### List with Pagination
```typescript
server.tool("getEarningsCalendar", "Get earnings calendar", {
  from: z.string().optional().describe("Start date"),
  to: z.string().optional().describe("End date"),
}, async ({ from, to }) => { ... });
```

### Search
```typescript
server.tool("searchSymbol", "Search for stocks", {
  query: z.string().describe("Search query"),
  limit: z.number().optional().describe("Max results"),
}, async ({ query, limit }) => { ... });
```
