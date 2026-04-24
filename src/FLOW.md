# Startup Sequence

Ordered control flow for server initialization with non-obvious consequences.

## Sequence

1. `ServerModeEnforcer.initialize(process.env, argv)`
2. `ModeConfigMapper.toToolceptionConfig(mode, enforcer, token, MODULE_ADAPTERS)`
3. `Fastify()` + `app.addHook('preHandler', ...)`
4. `createMcpServer({ ..., http: { app, ... }})`
5. `registerPrompts(server, ...)`
6. `await start()`
7. `await app.listen({ host, port })`

## Non-obvious Constraints

- Steps 1→2: Enforcer must be initialized before config is built — `getInstance()` throws otherwise
- Steps 3→4: `preHandler` hook must be registered before `createMcpServer()` — toolception mounts routes during `start()`, and the hook must pre-exist
- Steps 6→7: When passing custom `http.app`, toolception calls Fastify's `register()` but NOT `listen()` — caller must invoke `app.listen()` or the server never accepts connections
- Step 4's `createServer` factory is called synchronously by toolception, but the returned `McpServer` isn't fully wired until `start()` completes
