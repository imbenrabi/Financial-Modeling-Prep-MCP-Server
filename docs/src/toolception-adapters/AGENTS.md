# Toolception Adapters

Bridge layer converting FMP's imperative tool registration to Toolception's declarative module loader pattern.

## Key Rules

- Session config travels as base64-encoded JSON in the `config` query parameter — not a header. `ModeConfigMapper` allows only `FMP_ACCESS_TOKEN` through; `SessionConfigSchema` (also `FMP_TOOL_SETS`, `DYNAMIC_TOOL_DISCOVERY`) is not wired into the runtime

## Anti-patterns

- Never rely on a throwing or missing module loader to stop startup — toolception swallows both and the toolset comes up empty (see FLOW.md)

## Pitfalls

- `POST /mcp` answers 400 "Session not found or expired" when the `mcp-session-id` is missing from the session map of the cache entry the request resolved to, or is absent on a non-`initialize` request. Causes: the client ID or config hash changed, a later `initialize` on the same entry evicted it, or the entry expired from toolception's client cache (1 h TTL, 1000 entries by default)
- A malformed `config` value (bad base64, bad JSON, non-object) is dropped silently and the request falls back to the server token — bad tokens fail without an error

## Flow Reference

See [FLOW.md](FLOW.md) — session context resolution, cache key, and loader failure handling
