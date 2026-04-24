# Source Directory

Cross-cutting concerns and startup sequence for the FMP MCP Server.

## Key Rules

- Fastify `preHandler` hook must be registered before toolception routes are mounted
- When passing custom Fastify app to toolception, caller must invoke `app.listen()` — toolception won't

## Anti-patterns

- Never register the `preHandler` hook after `createMcpServer()` — toolception mounts routes during `start()` and the hook will miss requests
- Never skip `app.listen()` when passing a custom Fastify instance — the server will initialize but never accept connections
- Never change the client ID fingerprint algorithm without a migration plan — breaks existing sessions for registry clients

## Pitfalls

- `preHandler` hook generates stable client ID from `IP + User-Agent` (`Accept` is intentionally excluded — it varies between requests)

## Flow Reference

See [FLOW.md](FLOW.md) — ordered startup sequence with non-obvious ordering constraints

## Deeper Context

- [`api/AGENTS.md`](api/AGENTS.md) — API key as query param invariant, token precedence
- [`tools/AGENTS.md`](tools/AGENTS.md) — Never-throw pattern, error handling
- [`toolception-adapters/AGENTS.md`](toolception-adapters/AGENTS.md) — Session caching gotchas
- [`server-mode-enforcer/AGENTS.md`](server-mode-enforcer/AGENTS.md) — Singleton initialization order
