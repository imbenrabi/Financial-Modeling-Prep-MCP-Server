# Source Directory

Cross-cutting concerns and startup sequence for the FMP MCP Server.

## Key Rules

- `ServerModeEnforcer.initialize()` must be called before any `getInstance()` calls
- Fastify preHandler hook must be registered before toolception routes are mounted
- When passing custom Fastify app to toolception, caller must invoke `app.listen()` — toolception won't

## Pitfalls

- Startup order: initialize enforcer → build config → create Fastify with hook → create MCP server → register prompts → start → listen
- `app.listen()` is separate from `start()` when using custom Fastify instance
- preHandler hook generates stable client ID from `IP + User-Agent` (not `Accept` — it varies)

## Deeper Context

- [`api/AGENTS.md`](api/AGENTS.md) — API key as query param invariant, token precedence
- [`tools/AGENTS.md`](tools/AGENTS.md) — Never-throw pattern, error handling
- [`toolception-adapters/AGENTS.md`](toolception-adapters/AGENTS.md) — Session caching gotchas
- [`server-mode-enforcer/AGENTS.md`](server-mode-enforcer/AGENTS.md) — Singleton initialization order
