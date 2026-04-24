# Toolception Adapters

Bridge layer converting FMP's imperative tool registration to Toolception's declarative module loader pattern.

## Key Rules

- Session cache key = `${clientId}:${sessionConfigHash}` — both must match for session lookup
- Only `FMP_ACCESS_TOKEN` allowed in session config — toolsets are server-level only
- Module names must match between `MODULE_ADAPTERS` and `TOOL_SETS` mappings

## Anti-patterns

- Never add toolset config to session params — will be ignored, causes confusion
- Never change `MODULE_ADAPTERS` keys without updating `TOOL_SETS` — module loader lookup fails silently at runtime

## Pitfalls

- "Session not found" usually means clientId or configHash changed between requests
- ToolCollector captures registrations — doesn't execute tools, just collects definitions
