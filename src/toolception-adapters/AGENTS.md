# Toolception Adapters

Bridge layer converting FMP's imperative tool registration to Toolception's declarative module loader pattern.

## Key Rules

- Session cache key = `${clientId}:${sessionConfigHash}` — both must match for session lookup
- Only `FMP_ACCESS_TOKEN` allowed in session config — toolsets are server-level only
- Module names must match between `MODULE_ADAPTERS` and `TOOL_SETS` mappings

## Anti-patterns

- Never add toolset config to session params — will be ignored, causes confusion
- Never change fingerprint algorithm without migration — breaks existing sessions

## Pitfalls

- Missing `mcp-client-id` header triggers auto-generation from `IP + User-Agent`
- `Accept` header intentionally excluded from fingerprint — varies between requests from same client
- "Session not found" usually means clientId or configHash changed between requests
- ToolCollector captures registrations — doesn't execute tools, just collects definitions
