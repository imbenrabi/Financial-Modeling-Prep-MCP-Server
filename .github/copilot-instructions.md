# Instructions for AI coding agents

This is an MCP server that exposes 267 read-only Financial Modeling Prep (FMP) tools over streamable HTTP. It is built on [toolception](https://www.npmjs.com/package/toolception) (toolset management and session handling), the MCP TypeScript SDK v2 and Fastify, with Zod 4 for tool schemas.

The repo keeps its agent guidance in two places. Read them before changing anything; this file only orients you.

- [`CLAUDE.md`](../CLAUDE.md): architecture, key invariants and the development commands.
- [`AGENTS.md`](../AGENTS.md): the intent layer root. It links one node per area under `docs/` (for example `docs/src/tools/AGENTS.md`) with the pitfalls and anti-patterns for that area.
- [`docs/GUIDE.md`](../docs/GUIDE.md): how to add a tool, a module or a tool set.

## Server modes

| Mode | Enabled by | Tools at start |
|------|-----------|----------------|
| Dynamic | `DYNAMIC_TOOL_DISCOVERY=true` or `--dynamic-tool-discovery` | 5 meta-tools; toolsets are enabled and disabled at runtime |
| Static | `FMP_TOOL_SETS=search,company` or `--fmp-tool-sets` | The listed toolsets |
| All tools (default) | nothing | All 267 tools |

The mode and tool sets are fixed at startup (CLI arguments, then environment variables, then defaults). A session cannot change them.

## Rules that are easy to break

- **API key as a query parameter.** Every FMP call sends `?apikey=`. Do not move it to a header.
- **Token precedence.** A `FMP_ACCESS_TOKEN` in the session `?config=` overrides the server's token (`--fmp-token` or the environment variable) for that session. `FMP_ACCESS_TOKEN` is the only setting a session can supply.
- **Tools never throw.** A handler catches errors and returns `{ content: [...], isError: true }`.
- **Read-only.** Every tool fetches data; none changes anything.

## Adding or changing a tool

A tool module in `src/tools/` receives a `ToolRegistrar` (not an `McpServer`) and registers tools with `server.tool(name, description, zodShape, handler)`. The handler calls a client from `src/api/`, which extends `FMPClient`.

## Before you push

```bash
npm run build && npm run typecheck && npm run lint && npm run test:run
```

The smoke tests start `dist/`, so build first. `npm run knip` finds unused exports. Run `npm run version:validate` if you touched a version.
