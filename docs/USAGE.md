# Usage

## Server Endpoints

Runs on `0.0.0.0:8080` (override with `PORT` env var or `--port`). Transport is HTTP/SSE (`streamable-http`).

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/healthz` | `GET` | Returns `{ "status": "ok" }`. |
| `/mcp` | `POST` | MCP JSON-RPC endpoint. |
| `/ping` | `GET` | Liveness probe. |
| `/.well-known/mcp/server-card.json` | `GET` | Server metadata and config schema. |

## Session Headers

`mcp-client-id` is required for session caching. If missing, the server auto-generates a stable ID:

```
auto-{sha256(ip + "|" + userAgent).slice(0,16)}
```

Fingerprint uses the client IP (or `x-forwarded-for`) and `User-Agent`. The `Accept` header is excluded to avoid drift across requests.

## Connecting from Claude

Add the server as a **remote connector** in Claude.ai or Claude Desktop:

```
https://your-host.com/mcp
```

The `mcp-client-id` header is injected automatically if absent.

## Custom Client Example

```bash
curl -X POST http://localhost:8080/mcp \
  -H "Content-Type: application/json" \
  -H "mcp-client-id: my-client-123" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/list"
  }'
```

## Session Configuration

Provide `FMP_ACCESS_TOKEN` per-session via the `config` query parameter as **base64-encoded JSON**:

```bash
CONFIG=$(echo '{"FMP_ACCESS_TOKEN":"your_token"}' | base64)

curl -X POST "http://localhost:8080/mcp?config=${CONFIG}" \
  -H "mcp-client-id: my-client-123" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

Precedence (highest to lowest): CLI args → env vars → session config → defaults.

## Dynamic Tool Discovery

When `DYNAMIC_TOOL_DISCOVERY=true`, only five meta-tools are exposed initially:

- `list_tool_sets` — View available tool sets
- `enable_tool_set` — Activate a tool set
- `disable_tool_set` — Deactivate a tool set
- `get_enabled_tools` — List currently active tools
- `get_tool_catalog` — Show full catalog with descriptions

Enable a set before calling its tools.
