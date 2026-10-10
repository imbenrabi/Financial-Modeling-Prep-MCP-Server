# Usage

## Server Endpoints

Runs on `0.0.0.0:8080` (override with `PORT` env var or `--port`). Transport is HTTP/SSE (`streamable-http`).

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/healthz` | `GET` | Returns `{ "ok": true }`. |
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

The MCP endpoint is session-based. Send `initialize` first, read the `mcp-session-id` response header, then send it on every later request. Every request needs both `Content-Type: application/json` and `Accept: application/json, text/event-stream`; without `Accept` the server answers `406`, and a request without a valid session answers `400` ("Session not found or expired").

```bash
# 1) Initialize and capture the session ID
SESSION_ID=$(curl -si -X POST http://localhost:8080/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "mcp-client-id: my-client-123" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "initialize",
    "params": {
      "protocolVersion": "2025-03-26",
      "capabilities": {},
      "clientInfo": { "name": "curl", "version": "1.0.0" }
    }
  }' | awk 'tolower($1) == "mcp-session-id:" { print $2 }' | tr -d '\r')

# 2) Confirm initialization
curl -X POST http://localhost:8080/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "mcp-client-id: my-client-123" \
  -H "mcp-session-id: ${SESSION_ID}" \
  -d '{"jsonrpc": "2.0", "method": "notifications/initialized"}'

# 3) Call methods; responses stream back as server-sent events
curl -X POST http://localhost:8080/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "mcp-client-id: my-client-123" \
  -H "mcp-session-id: ${SESSION_ID}" \
  -d '{"jsonrpc": "2.0", "id": 2, "method": "tools/list"}'
```

## Session Configuration

Provide `FMP_ACCESS_TOKEN` per-session via the `config` query parameter as **base64-encoded JSON**. The token is read when the session starts, so pass `config` on the `initialize` request:

```bash
CONFIG=$(echo '{"FMP_ACCESS_TOKEN":"your_token"}' | base64)

curl -X POST "http://localhost:8080/mcp?config=${CONFIG}" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "mcp-client-id: my-client-123" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "initialize",
    "params": {
      "protocolVersion": "2025-03-26",
      "capabilities": {},
      "clientInfo": { "name": "curl", "version": "1.0.0" }
    }
  }'
```

Then continue with the `mcp-session-id` header as in the example above.

Token precedence (highest to lowest): session config → CLI arg (`--fmp-token`) → env var (`FMP_ACCESS_TOKEN`). A token passed through `?config=` overrides the server's own token for that session only.

Only `FMP_ACCESS_TOKEN` takes effect per session. The server mode and tool sets are fixed at startup (CLI args → env vars → defaults), and session config cannot change them.

## Dynamic Tool Discovery

When `DYNAMIC_TOOL_DISCOVERY=true`, only five meta-tools are exposed initially:

- `list_toolsets` — List all available toolsets with their active status and definitions
- `enable_toolset` — Enable a toolset by name to make its tools available
- `disable_toolset` — Disable a toolset by name (state tracking only)
- `describe_toolset` — Describe a toolset with its definition, active status, and tools
- `list_tools` — List currently registered tool names

Enable a toolset before calling its tools.
