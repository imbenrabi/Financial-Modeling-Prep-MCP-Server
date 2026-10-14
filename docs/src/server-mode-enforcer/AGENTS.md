# Server Mode Enforcer

Singleton managing server mode configuration with strict precedence rules.

## Key Rules

- CLI arguments take precedence over environment variables; the full order is in [FLOW.md](FLOW.md)
- Tool set names are case-sensitive and lowercase (`SEARCH` is invalid)

## Anti-patterns

- Never read a missing override as DYNAMIC — the enforcer returns `null` and `src/index.ts` falls back to ALL_TOOLS

## Pitfalls

- Invalid tool set names cause `process.exit(1)` — fail-fast, not a graceful error. Only the branch that wins is validated, so an invalid list loses silently when dynamic mode takes precedence
- Stray commas count as invalid entries: `"search,,company"` → empty string fails validation → `process.exit(1)`. The trailing `.filter(s => s.length > 0)` in `_parseAndValidateToolSets` looks like it handles this but runs after validation, so it is unreachable for this case

## Flow Reference

See [FLOW.md](FLOW.md) — mode resolution order and the bare-flag rule
