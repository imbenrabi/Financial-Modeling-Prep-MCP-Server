# Server Mode Enforcer

Singleton managing server mode configuration with strict precedence rules.

## Key Rules

- Call `initialize(envVars, cliArgs)` before `getInstance()` (startup order: [`../FLOW.md`](../FLOW.md)); mode resolution order is in [FLOW.md](FLOW.md)
- Tool set names are case-sensitive and lowercase (`SEARCH` is invalid)

## Anti-patterns

- Never read a missing override as DYNAMIC — the enforcer returns `null` and `src/index.ts` falls back to ALL_TOOLS

## Pitfalls

- Invalid tool set names cause `process.exit(1)` — fail-fast, not a graceful error, but only when that list is the one selected (FLOW.md)

## Flow Reference

See [FLOW.md](FLOW.md) — mode resolution order and the bare-flag rule
