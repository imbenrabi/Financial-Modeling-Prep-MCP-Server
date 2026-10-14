# Startup Sequence

Ordered control flow for server initialization with non-obvious consequences.

## Sequence

1. `ServerModeEnforcer.initialize(process.env, argv)`
2. `ModeConfigMapper.toToolceptionConfig(mode, enforcer, token, MODULE_ADAPTERS)`
3. `Fastify()` + `app.addHook('preHandler', ...)`
4. `createMcpServer({ ..., createServer, http: { app, ... }})` — runs `createServer()` once for the base server
5. `await start()` — mounts routes on `app`
6. `await app.listen({ host, port })`

## Non-obvious Constraints

- Steps 1→2: Enforcer must be initialized before config is built — `getInstance()` throws otherwise
- Steps 3→6: the `preHandler` hook must exist before `app.listen()`; Fastify applies it to routes mounted before or after it, so only listening is the cut-off
- Steps 5→6: When passing custom `http.app`, toolception registers routes but does NOT `listen()` — caller must call `app.listen()` or the server never accepts connections
- Step 4: Toolception calls `createServer()` for its base server and again for every client bundle; the clients' `tools/list` and `prompts/list` come from those per-client servers, so `registerPrompts` runs inside the factory. Registering on the base server only leaves prompts invisible to clients

## Client identity coupling

The `preHandler` hook (`generateStableClientId`) fills a missing or blank `mcp-client-id` with `auto-<hash of IP|User-Agent>`. Toolception keys its per-client cache on that ID (plus the session-config hash) and a fresh `initialize` on an existing cache entry closes that entry's open sessions first.

Requests that carry an `mcp-session-id` reuse the client ID recorded when that session's `initialize` response was written (`SessionClientIds`, bounded to 1000 sessions, least recently used forgotten first), so a session survives its IP changing between requests. An unknown session ID falls back to the fingerprint.

Consequence: two distinct clients that share a source IP (every client behind one reverse proxy, since `trustProxy` is unset), a User-Agent and the same session config resolve to one cache entry, and each `initialize` evicts the other's session. Clients sending their own `mcp-client-id`, or a different `config` token, are not affected.
