# Guide

Teaching and procedural content for the FMP MCP Server.

## Adding a New Tool

1. Add method to existing client in `src/api/{domain}/`
2. Register tool in `src/tools/{module}.ts`
3. Follow Zod schema pattern for parameters

## Adding a New Module

1. Create `src/api/{domain}/{Domain}Client.ts`
2. Create `src/tools/{module}.ts` with registration function
3. Add adapter in `src/toolception-adapters/moduleAdapters.ts`
4. Map to tool set in `src/constants/toolSets.ts`

## Adding a New Tool Set

1. Add definition to `TOOL_SETS` in `src/constants/toolSets.ts`
2. Add type to `ToolSet` union in `src/types/index.ts`

## Session Management

Toolception requires `mcp-client-id` header for session caching. Some MCP clients (Glama, Smithery) don't send this header.

When `mcp-client-id` is missing, the server auto-generates a stable ID:

```
auto-{sha256(ip|userAgent).slice(0,16)}
```

**Fingerprint components:**
- Client IP address (or `x-forwarded-for`)
- `User-Agent` header

Note: `Accept` header is intentionally excluded as it can vary between requests.

## Configuration

### Environment Variables

```bash
FMP_ACCESS_TOKEN=your_api_key    # Required for API calls
PORT=8080                         # Server port
FMP_TOOL_SETS=search,company     # Comma-separated tool sets
DYNAMIC_TOOL_DISCOVERY=true      # Enable dynamic mode
```

### Precedence (highest to lowest)

1. CLI arguments (`--dynamic-tool-discovery`, `--fmp-tool-sets=...`)
2. Environment variables
3. Session config (`?config=<base64 JSON with FMP_ACCESS_TOKEN>`)
4. Defaults (ALL_TOOLS, port 8080)

## Tool Sets (24)

| Set | Description |
|-----|-------------|
| `search` | Symbol/company lookup |
| `company` | Company profiles, peers, executives |
| `quotes` | Real-time and historical quotes |
| `statements` | Financial statements |
| `calendar` | IPO, dividends, earnings calendars |
| `charts` | OHLCV chart data |
| `news` | Market and company news |
| `analyst` | Analyst estimates and recommendations |
| `market-performance` | Gainers, losers, most active |
| `insider-trades` | Insider transaction data |
| `institutional` | 13F institutional holdings |
| `indexes` | Index constituents |
| `economics` | Economic indicators |
| `crypto` | Cryptocurrency data |
| `forex` | Foreign exchange rates |
| `commodities` | Commodity prices |
| `etf-funds` | ETF/mutual fund data |
| `esg` | ESG scores and ratings |
| `technical-indicators` | Technical analysis indicators |
| `senate` | Congressional trading disclosures |
| `sec-filings` | SEC filing data |
| `earnings` | Earnings call transcripts |
| `dcf` | DCF valuations |
| `bulk` | Bulk data downloads |
