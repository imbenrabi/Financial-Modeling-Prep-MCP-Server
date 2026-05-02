# Configuration

## Server Modes

| Mode | Description | Env Var | CLI Args |
|------|-------------|---------|----------|
| `DYNAMIC_TOOL_DISCOVERY` | Load tools on demand per session | `DYNAMIC_TOOL_DISCOVERY` | `--dynamic-tool-discovery`, `--dynamicToolDiscovery` |
| `STATIC_TOOL_SETS` | Load only specified tool sets | `FMP_TOOL_SETS` | `--fmp-tool-sets`, `--tool-sets`, `--toolSets` |
| `ALL_TOOLS` | Load all available tools (default) | — | — |

## Precedence

Configuration resolves in this order:

1. **CLI arguments**
2. **Environment variables**
3. **Session config**
4. **Defaults**

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `FMP_ACCESS_TOKEN` | FMP API access token | — |
| `PORT` | HTTP server port | `8080` |
| `DYNAMIC_TOOL_DISCOVERY` | Enable dynamic tool discovery | — |
| `FMP_TOOL_SETS` | Comma-separated tool sets for static mode | — |

## CLI Arguments

| Argument | Description |
|----------|-------------|
| `--fmp-token <token>` | FMP API access token |
| `--port <number>` | HTTP server port |
| `--dynamic-tool-discovery` | Enable dynamic tool discovery |
| `--dynamicToolDiscovery` | Enable dynamic tool discovery (alias) |
| `--fmp-tool-sets <sets>` | Comma-separated tool sets |
| `--tool-sets <sets>` | Comma-separated tool sets (alias) |
| `--toolSets <sets>` | Comma-separated tool sets (alias) |

## Tool Sets

Valid keys for `FMP_TOOL_SETS` or `--fmp-tool-sets`:

`search`, `company`, `quotes`, `statements`, `calendar`, `charts`, `news`, `analyst`, `market-performance`, `insider-trades`, `institutional`, `indexes`, `economics`, `crypto`, `forex`, `commodities`, `etf-funds`, `esg`, `technical-indicators`, `senate`, `sec-filings`, `earnings`, `dcf`, `bulk`

## Session Config

Only `FMP_ACCESS_TOKEN` is accepted per-session. Pass it as base64-encoded JSON via the `config` query parameter:

```
?config=eyJGTVBfQUNDRVNTX1RPS0VOIjoiPGtleT4ifQ==
```

## Fail-Fast Behavior

If `FMP_TOOL_SETS` or `--fmp-tool-sets` contains an invalid tool set key, the process exits with code `1`.

## Examples

**All tools (default):**
```bash
FMP_ACCESS_TOKEN=<token> npm start
```

**Dynamic tool discovery:**
```bash
npm start -- --dynamic-tool-discovery
# or
DYNAMIC_TOOL_DISCOVERY=true npm start
```

**Static tool sets:**
```bash
npm start -- --fmp-tool-sets search,quotes,news
# or
FMP_TOOL_SETS=search,quotes,news npm start
```
