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

See [`AGENTS.md`](AGENTS.md) for non-obvious pitfalls, invariants, and anti-patterns.  
See [`docs/GUIDE.md`](docs/GUIDE.md) for how-to guides, templates, and procedural content.

## Directory Structure

```
src/
├── api/                    # HTTP clients for FMP API
├── tools/                  # MCP tool registrations
├── toolception-adapters/   # Toolception framework integration
├── server-mode-enforcer/   # Mode configuration singleton
├── constants/              # Tool sets and defaults
├── endpoints/              # HTTP endpoints (health, ready)
├── prompts/                # MCP prompt definitions
└── index.ts                # Server entry point
```

## Key Invariants

1. **API Key as Query Parameter** — FMP requires `?apikey=`, never headers
2. **Token Precedence** — Context > Instance > Environment
3. **Fail-Fast Validation** — Invalid tool sets cause `process.exit(1)` at startup
4. **Session Restrictions** — Only `FMP_ACCESS_TOKEN` takes effect at session level; `FMP_TOOL_SETS` / `DYNAMIC_TOOL_DISCOVERY` exist in the schema but are no-ops (mode is fixed at startup)
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
