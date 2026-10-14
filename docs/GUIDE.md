# Guide

> For server configuration, see [CONFIGURATION.md](CONFIGURATION.md).  
> For usage and session management, see [USAGE.md](USAGE.md).

Teaching and procedural content for the FMP MCP Server.

## Adding a New Tool

1. Add method to existing client in `src/api/{domain}/`
2. Register tool in `src/tools/{module}.ts`
3. Follow Zod schema pattern for parameters

## Adding a New Module

1. Create `src/api/{domain}/{Domain}Client.ts`
2. Create `src/tools/{module}.ts` with registration function
3. Add the adapter to one of `src/toolception-adapters/{core,market,specialized}ModuleAdapters.ts` (`moduleAdapters.ts` only composes them)
4. Map to tool set in `src/constants/toolSets.ts`

## Adding a New Tool Set

1. Add definition to `TOOL_SETS` in `src/constants/toolSets.ts`
2. Add type to `ToolSet` union in `src/types/index.ts`

## Adding an Intent Node

1. Create `docs/<path-of-the-source-area>/AGENTS.md` — the path mirrors the source directory (`src/foo` → `docs/src/foo`, `scripts` → `docs/scripts`, `__tests__/x` → `docs/tests/x`)
2. Put only non-obvious invariants in it (score them with the table in the root `AGENTS.md`); invariants scoring 3-4 go in a `FLOW.md` beside it, linked from the AGENTS.md
3. Keep it under 600 words (`wc -w`) and move any procedure here
4. Wire it into the root `AGENTS.md` navigation, the `CLAUDE.md` area table, and the path table in `.claude/skills/code-review/SKILL.md`
