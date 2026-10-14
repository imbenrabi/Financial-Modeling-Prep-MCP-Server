# Source Directory

Cross-cutting concerns and startup sequence for the FMP MCP Server.

## Key Rules

- Register the Fastify `preHandler` hook before `app.listen()` — Fastify throws `FST_ERR_INSTANCE_ALREADY_LISTENING` afterwards, and toolception rejects `/mcp` requests that lack `mcp-client-id`. `src/index.ts` registers it first, before `createMcpServer()`; Fastify applies it to routes mounted earlier, so ordering against `start()` does not matter
- With a custom Fastify app, the caller runs `app.listen()` — toolception only listens on an app it created
- Layers depend downward only: `index.ts`/`endpoints`/`server-mode-enforcer`/`prompts` → `toolception-adapters` → `tools` → `api`. `.sentrux/rules.toml` encodes this (plus no cycles, no god files) and CI runs `sentrux check .`. That is why `ModeConfigMapper` declares its own `ModeEnforcerView` instead of importing the enforcer

## Anti-patterns

- Never change the client ID fingerprint (`generateStableClientId`) without accepting that every client sending no `mcp-client-id` header gets a new cache identity

## Pitfalls

- The hook derives the client ID from `IP + User-Agent` (`Accept` is excluded because it varies between requests). Fastify's `trustProxy` is unset, so behind a reverse proxy `request.ip` is the proxy; see FLOW.md for the consequence
- `close()` from `createMcpServer` does not close a caller-supplied Fastify app; shutdown ends in `process.exit(0)`, so in-flight requests are cut rather than drained

## Flow Reference

See [FLOW.md](FLOW.md) — ordered startup sequence, factory invocation, and client identity coupling

## Deeper Context

- [`api/AGENTS.md`](api/AGENTS.md) — API key as query param, token precedence, error surface
- [`tools/AGENTS.md`](tools/AGENTS.md) — Never-throw pattern
- [`toolception-adapters/AGENTS.md`](toolception-adapters/AGENTS.md) — Session context and swallowed loader failures
- [`server-mode-enforcer/AGENTS.md`](server-mode-enforcer/AGENTS.md) — Singleton init order and mode resolution
- [`constants/AGENTS.md`](constants/AGENTS.md) — Tool set catalog invariants
- [`prompts/AGENTS.md`](prompts/AGENTS.md) — Prompt registration and text-vs-runtime divergence
- [`endpoints/AGENTS.md`](endpoints/AGENTS.md) — Server-card registry coupling and schema divergence
- [`utils/AGENTS.md`](utils/AGENTS.md) — Helpers that are not wired into the runtime
- [`../scripts/AGENTS.md`](../scripts/AGENTS.md) — Release pipeline and toolception verification
