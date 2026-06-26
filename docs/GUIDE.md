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
3. Add adapter in `src/toolception-adapters/moduleAdapters.ts`
4. Map to tool set in `src/constants/toolSets.ts`

## Adding a New Tool Set

1. Add definition to `TOOL_SETS` in `src/constants/toolSets.ts`
2. Add type to `ToolSet` union in `src/types/index.ts`
