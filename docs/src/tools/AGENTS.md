# Tools Layer

MCP tool registrations for all FMP API endpoints.

## Key Rules

- Tools never throw — a handler catches everything and returns `{ content: [{ type: "text", text: "Error: <message>" }], isError: true }`
- Tool name and toolset catalog rules: [`../constants/AGENTS.md`](../constants/AGENTS.md)

## Pitfalls

- Declare each tool's `inputSchema` as a raw shape of Zod 4 schemas; `ToolCollector` passes it through and toolception wraps it. Since toolception 0.9.0 a Zod 3 value, or any non-Zod value in the shape, fails the whole toolset's enable with `E_VALIDATION` (no open-passthrough fallback any more): `enable_toolset` returns `success:false`, and a static or ALL_TOOLS start aborts. `__tests__/unit/toolception-adapters/inputSchemaCompat.test.ts` checks that every shape holds Zod-like values; it cannot tell Zod 3 from Zod 4, since both carry `_def`
- Each `registerXxxTools(server, ...)` takes a `ToolRegistrar` (`src/types/index.ts`; tools may not import from the adapters layer), not an `McpServer`: SDK v2 removed `McpServer.tool()`, and `createModuleAdapter` hands these functions a `ToolCollector` anyway. `z.record()` needs two arguments in Zod 4
