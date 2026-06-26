# Toolception Adapters

Bridge layer converting FMP's imperative tool registration to Toolception's declarative module loader pattern.

## Key Rules

- Session config travels as base64-encoded JSON in the `config` query parameter — not a header
- Session cache key = `${clientId}:${sessionConfigHash}` — both must match for session lookup
- Only `FMP_ACCESS_TOKEN` takes effect at session level — schema also accepts `FMP_TOOL_SETS` and `DYNAMIC_TOOL_DISCOVERY` but they're no-ops (mode is fixed at startup from env+CLI)
- Module names must match between `MODULE_ADAPTERS` and `TOOL_SETS` mappings

## Anti-patterns

- Never add toolset config to session params — will be ignored, causes confusion
- Never change `MODULE_ADAPTERS` keys without updating `TOOL_SETS` — module loader lookup fails silently at runtime

## Pitfalls

- "Session not found" usually means clientId or configHash changed between requests
- Malformed base64/JSON in the `config` query param is silently ignored and falls back to the default context/cache key — bad tokens fail without an error
- ToolCollector captures registrations — doesn't execute tools, just collects definitions
