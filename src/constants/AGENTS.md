# Constants Module

This module defines tool set configurations and default values for the FMP MCP Server.

## Files

- `index.ts` - Re-exports constants and utilities
- `toolSets.ts` - Tool set definitions and mappings

## Key Constants

```typescript
DEFAULT_API_KEY = "PLACEHOLDER_TOKEN_FOR_TOOL_LISTING"  // Used when no real key provided
DEFAULT_PORT = 8080
```

## Tool Sets System

24 tool sets map high-level domains to implementation modules:

| Tool Set | Modules | Purpose |
|----------|---------|---------|
| `search` | search, directory | Symbol/company lookup |
| `company` | company | Company profiles, peers, executives |
| `quotes` | quotes | Real-time and historical quotes |
| `statements` | statements | Financial statements (income, balance, cash flow) |
| `calendar` | calendar, earnings-transcript | IPO, dividends, earnings calendars |
| `charts` | chart | OHLCV chart data |
| `news` | news | Market and company news |
| `analyst` | analyst | Analyst estimates and recommendations |
| `market-performance` | market-performance, market-hours | Gainers, losers, actives, hours |
| `insider-trades` | insider-trades | Insider transaction data |
| `institutional` | form-13f | 13F institutional holdings |
| `indexes` | indexes | Index constituents and data |
| `economics` | economics, cot | Economic indicators, COT reports |
| `crypto` | crypto | Cryptocurrency quotes |
| `forex` | forex | Foreign exchange rates |
| `commodities` | commodity | Commodity prices |
| `etf-funds` | fund, fundraisers | ETF/mutual fund data |
| `esg` | esg | ESG scores and ratings |
| `technical-indicators` | technical-indicators | SMA, EMA, RSI, etc. |
| `senate` | government-trading | Congressional trading disclosures |
| `sec-filings` | sec-filings | SEC filing data |
| `earnings` | earnings-transcript | Earnings call transcripts |
| `dcf` | dcf | Discounted cash flow valuations |
| `bulk` | bulk | Bulk data endpoints |

## Tool Set Definition Structure

```typescript
interface ToolSetDefinition {
  name: string;           // Display name
  description: string;    // What the tool set provides
  decisionCriteria: string;  // When to use this set
  modules: string[];      // Module names to load
}
```

## Helper Functions

### `getModulesForToolSets(toolSets: ToolSet[]): string[]`
Flattens tool set names to their constituent module names. Used by Toolception to determine which modules to load.

### `getAvailableToolSets(): ToolSetDefinition[]`
Returns all tool set definitions. Used for help text and validation.

## Usage Pattern

```typescript
import { TOOL_SETS, getModulesForToolSets } from './constants';

// Get modules for specific tool sets
const modules = getModulesForToolSets(['search', 'company']);
// Returns: ['search', 'directory', 'company']
```

## Type Definition

```typescript
type ToolSet =
  | "search" | "company" | "quotes" | "statements" | "calendar"
  | "charts" | "news" | "analyst" | "market-performance" | "insider-trades"
  | "institutional" | "indexes" | "economics" | "crypto" | "forex"
  | "commodities" | "etf-funds" | "esg" | "technical-indicators"
  | "senate" | "sec-filings" | "earnings" | "dcf" | "bulk";
```

## Invariants

1. Tool set names are case-sensitive and lowercase
2. Each tool set maps to 1-2 modules
3. Module names match filenames in `src/tools/` and `src/api/`
