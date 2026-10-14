# Financial Modeling Prep MCP Server

> For user-facing docs, see README.md and the docs/ directory.

MCP server providing 253+ financial data tools via the Financial Modeling Prep API. HTTP/SSE transport only. Built on toolception + Fastify.

## Architecture

```
┌─────────────────────────────────────────────┐
│  MCP Protocol Layer (toolception)           │
├─────────────────────────────────────────────┤
│  Tools Layer (28 modules, 253+ tools)       │
├─────────────────────────────────────────────┤
│  API Layer (FMPClient + 28 domain clients)  │
├─────────────────────────────────────────────┤
│  Financial Modeling Prep API                │
└─────────────────────────────────────────────┘
```

See [`AGENTS.md`](AGENTS.md) for the intent layer root (pitfalls, invariants, anti-patterns, navigation).  
See [`docs/GUIDE.md`](docs/GUIDE.md) for how-to guides, templates, and procedural content.

Area nodes live in `docs/` and mirror the repo layout (`docs/src/<area>/AGENTS.md`). Read the node for the area you touch:

| Area | Node |
|------|------|
| Startup, Fastify wiring | [`docs/src/AGENTS.md`](docs/src/AGENTS.md) |
| FMP clients | [`docs/src/api/AGENTS.md`](docs/src/api/AGENTS.md) |
| Tool registrations | [`docs/src/tools/AGENTS.md`](docs/src/tools/AGENTS.md) |
| Toolception adapters | [`docs/src/toolception-adapters/AGENTS.md`](docs/src/toolception-adapters/AGENTS.md) |
| Mode enforcer | [`docs/src/server-mode-enforcer/AGENTS.md`](docs/src/server-mode-enforcer/AGENTS.md) |
| Tool set catalog | [`docs/src/constants/AGENTS.md`](docs/src/constants/AGENTS.md) |
| Prompts | [`docs/src/prompts/AGENTS.md`](docs/src/prompts/AGENTS.md) |
| HTTP endpoints | [`docs/src/endpoints/AGENTS.md`](docs/src/endpoints/AGENTS.md) |
| Utilities | [`docs/src/utils/AGENTS.md`](docs/src/utils/AGENTS.md) |
| Release and verification scripts | [`docs/scripts/AGENTS.md`](docs/scripts/AGENTS.md) |
| Smoke tests | [`docs/tests/smoke/AGENTS.md`](docs/tests/smoke/AGENTS.md) |

## Directory Structure

```
src/
├── api/                    # HTTP clients for FMP API
├── tools/                  # MCP tool registrations
├── toolception-adapters/   # Toolception framework integration
├── server-mode-enforcer/   # Mode configuration singleton
├── constants/              # Tool sets and defaults
├── utils/                  # Version, validation, and help helpers
├── schemas/ types/         # Session config schema, shared types
├── endpoints/              # HTTP endpoints (ping, healthcheck, server-card)
├── prompts/                # MCP prompt definitions
└── index.ts                # Server entry point
```

## Key Invariants

1. **API Key as Query Parameter** — every FMP call sends `?apikey=`; never move it to headers
2. **Token Precedence** — Instance > Environment; the session token is injected via the client constructor at construction time
3. **Fail-Fast Validation** — Invalid tool sets cause `process.exit(1)` at startup
4. **Session Restrictions** — Only `FMP_ACCESS_TOKEN` takes effect at session level; `FMP_TOOL_SETS` / `DYNAMIC_TOOL_DISCOVERY` in a session config are ignored (mode is fixed at startup)
5. **Read-Only Tools** — All tools are read-only data fetchers
6. **Error Handling** — Tools never throw; return `{ isError: true }`

## Development Commands

| Command | Purpose |
|---------|---------|
| `npm run setup` | Install dependencies |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run dev` | Run server in watch mode via `tsx` |
| `npm run start` | Run compiled server (`node dist/index.js`) |
| `npm run test` | Run tests interactively with Vitest |
| `npm run test:run` | Run tests once (CI mode) |
| `npm run typecheck` | Type-check without emitting (`tsc --noEmit`) |
| `npm run lint` | Lint with Oxlint (`--deny-warnings`) |
| `npm run lint:fix` | Auto-fix Oxlint issues |
| `npm run knip` | Find unused exports/dependencies |
| `npm run version:validate` | Validate `package.json` / `server.json` version sync |
| `npm run verify:toolception -- --source <spec>` | Check the server against a candidate toolception build before a dependency bump |
