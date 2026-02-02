# Financial Modeling Prep MCP Server

MCP server providing 253+ financial data tools via the Financial Modeling Prep API.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     MCP Protocol Layer                       │
│                    (Toolception Framework)                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Tools Layer                             │
│         28 modules, 253+ tools with Zod schemas             │
│                    → src/tools/CLAUDE.md                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       API Layer                              │
│              FMPClient + 27 domain clients                  │
│                     → src/api/CLAUDE.md                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Financial Modeling Prep API                 │
│              https://financialmodelingprep.com               │
└─────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
src/
├── api/                    # HTTP clients for FMP API
│   └── CLAUDE.md           # API layer documentation
├── tools/                  # MCP tool registrations
│   └── CLAUDE.md           # Tools layer documentation
├── toolception-adapters/   # Toolception framework integration
│   └── CLAUDE.md           # Adapter layer documentation
├── server-mode-enforcer/   # Mode configuration singleton
│   └── CLAUDE.md           # Mode enforcer documentation
├── constants/              # Tool sets and defaults
│   └── CLAUDE.md           # Constants documentation
├── types/                  # TypeScript type definitions
├── utils/                  # Validation utilities
├── endpoints/              # HTTP endpoints (health, ready, etc.)
├── prompts/                # MCP prompt definitions
└── index.ts                # Server entry point
```

## Server Modes

| Mode | Behavior | Use Case |
|------|----------|----------|
| `ALL_TOOLS` | Load all 253+ tools at startup (default) | Simple deployments |
| `STATIC_TOOL_SETS` | Load specific tool sets at startup | Resource-constrained |
| `DYNAMIC_TOOL_DISCOVERY` | Client activates tool sets at runtime | Flexible clients |

## Configuration

### Precedence (highest to lowest)

```
1. CLI arguments
   --dynamic-tool-discovery
   --fmp-tool-sets=search,company,quotes
   --tool-sets=search,company  (alias)

2. Environment variables
   DYNAMIC_TOOL_DISCOVERY=true
   FMP_TOOL_SETS=search,company,quotes

3. Session config (per-request)
   ?config=<base64 JSON with FMP_ACCESS_TOKEN>

4. Defaults
   Mode: ALL_TOOLS
   Port: 8080
```

### Environment Variables

```bash
FMP_ACCESS_TOKEN=your_api_key    # Required for API calls
PORT=8080                         # Server port
FMP_TOOL_SETS=search,company     # Comma-separated tool sets
DYNAMIC_TOOL_DISCOVERY=true      # Enable dynamic mode
```

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

## Development

```bash
# Install dependencies
npm install

# Development server (watch mode)
npm run dev

# Build
npm run build

# Start production server
npm start

# Run tests
npm test

# Lint
npm run lint
```

## Key Invariants

1. **API Key as Query Parameter** - FMP API requires key as `?apikey=` query param, never in headers
2. **Token Precedence** - Context token > Instance token > Environment variable
3. **Fail-Fast Validation** - Invalid tool sets cause `process.exit(1)` at startup
4. **Session Restrictions** - Only `FMP_ACCESS_TOKEN` and `FMP_TOOL_SETS` allowed in session config
5. **Read-Only Tools** - All 253+ tools are read-only data fetchers (no mutations)
6. **Error Handling** - Tools never throw; return `{ isError: true }` instead
7. **Auto-Generated Client IDs** - When `mcp-client-id` header is missing, server generates stable ID from request fingerprint

## Session Management

Toolception requires `mcp-client-id` header for session caching. Some MCP clients (Glama, Smithery) don't send this header, causing "Session not found or expired" errors.

### Auto-Generated Client ID

When `mcp-client-id` is missing, the server auto-generates a stable ID:

```
auto-{sha256(ip|userAgent).slice(0,16)}
```

**How it works:**
1. Fastify `preHandler` hook checks for `mcp-client-id` header
2. If missing/empty, generates stable ID from request fingerprint
3. Injects header before toolception processes the request
4. Same fingerprint → same ID → session lookup succeeds

**Fingerprint components:**
- Client IP address (or `x-forwarded-for`)
- `User-Agent` header

Note: `Accept` header is intentionally excluded as it can vary between requests.

This ensures clients without proper MCP headers can still maintain sessions across multiple requests.

## Entry Points

| File | Purpose |
|------|---------|
| `src/index.ts` | Main server entry, initializes Toolception |
| `src/endpoints/` | HTTP endpoints (health, ready) |
| `src/prompts/` | MCP prompt definitions |

## Adding New Functionality

### New Tool
1. Add method to existing client in `src/api/{domain}/`
2. Register tool in `src/tools/{module}.ts`
3. Follow Zod schema pattern for parameters

### New Module
1. Create `src/api/{domain}/{Domain}Client.ts`
2. Create `src/tools/{module}.ts` with registration function
3. Add adapter in `src/toolception-adapters/moduleAdapters.ts`
4. Map to tool set in `src/constants/toolSets.ts`

### New Tool Set
1. Add definition to `TOOL_SETS` in `src/constants/toolSets.ts`
2. Add type to `ToolSet` union in `src/types/`

## Dependencies

- `toolception` - Dynamic tool loading framework
- `@modelcontextprotocol/sdk` - MCP protocol implementation
- `fastify` - HTTP server (used for preHandler middleware)
- `axios` - HTTP client
- `zod` - Schema validation
- `minimist` - CLI argument parsing

---

## Intent Layer Maintenance

This codebase uses CLAUDE.md files as an "Intent Layer" - structured documentation that helps AI agents understand and navigate the code efficiently.

### File Hierarchy

```
CLAUDE.md (root)                           # Architecture, config, invariants
├── src/api/CLAUDE.md                      # API clients and patterns
├── src/tools/CLAUDE.md                    # Tool registration patterns
├── src/toolception-adapters/CLAUDE.md     # Framework integration
├── src/server-mode-enforcer/CLAUDE.md     # Mode configuration
└── src/constants/CLAUDE.md                # Tool sets and defaults
```

### When to Update

Update the relevant CLAUDE.md when:
- Adding new modules, tools, or API clients
- Changing architectural patterns or conventions
- Adding new invariants or critical behaviors
- Modifying configuration options or precedence rules

### Writing Guidelines

1. **Document patterns, not implementations** - Focus on "how things work" not line-by-line code
2. **Highlight invariants** - Critical rules that must never be violated
3. **Show code snippets** - For patterns that are hard to describe in prose
4. **Keep it concise** - Target <4K tokens per file
5. **Use tables** - For mappings, options, and comparisons
6. **Link to child nodes** - Reference deeper CLAUDE.md files with `→ path/CLAUDE.md`

### What NOT to Document

- Simple type definitions (self-documenting)
- Trivial utility functions
- Test files
- Generated code
- Anything that changes frequently without architectural impact
