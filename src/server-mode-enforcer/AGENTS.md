# Server Mode Enforcer

Singleton managing server mode configuration with strict precedence rules.

## Key Rules

- Always call `initialize(envVars, cliArgs)` before `getInstance()` — throws otherwise
- CLI arguments take precedence over environment variables
- Tool set names are case-sensitive and lowercase only

## Anti-patterns

- Never call `getInstance()` without prior `initialize()` — will throw "Instance not initialized"
- Never re-initialize — logs warning and ignores (not an error, but indicates logic bug)
- Never mutate `toolSets` directly — getter returns defensive copy

## Pitfalls

- Invalid tool set names cause `process.exit(1)` — fail-fast, not graceful error handling
- `reset()` method exists for testing but isn't discoverable from types
- Stray commas count as invalid entries: `"search,,company"` → empty string fails validation → `process.exit(1)`. The trailing `.filter(s => s.length > 0)` in `_parseAndValidateToolSets` looks like it handles this but runs after validation, so it's unreachable for this case.
