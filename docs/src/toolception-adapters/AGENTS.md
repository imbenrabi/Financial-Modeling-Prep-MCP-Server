# Toolception Adapters

Bridge layer converting FMP's imperative tool registration to Toolception's declarative module loader pattern.

## Key Rules

- Session config travels as base64-encoded JSON in the `config` query parameter — not a header. `ModeConfigMapper` allows only `FMP_ACCESS_TOKEN` through; `SessionConfigSchema` (also `FMP_TOOL_SETS`, `DYNAMIC_TOOL_DISCOVERY`) is not wired into the runtime
- Add a new module's adapter to one of `coreModuleAdapters.ts`, `marketModuleAdapters.ts` or `specializedModuleAdapters.ts`; `moduleAdapters.ts` only spreads them. The split keeps fan-out under the sentrux `no_god_files` gate
- Every `MODULE_ADAPTERS` key must match a module in `TOOL_SETS` and vice versa (catalog rules in [`../constants/AGENTS.md`](../constants/AGENTS.md))

## Anti-patterns

- Never rely on a throwing or missing module loader to stop startup — toolception swallows both and the toolset comes up empty (see FLOW.md)

## Pitfalls

- HTTP 400 "Session not found or expired" means the `mcp-session-id` is not in the session map of the cache entry the request resolved to: the client ID or config hash changed, or a later `initialize` on the same entry evicted it
- A malformed `config` value (bad base64, bad JSON, non-object) is dropped silently and the request falls back to the server token — bad tokens fail without an error

## Flow Reference

See [FLOW.md](FLOW.md) — session context resolution, cache key, and loader failure handling
