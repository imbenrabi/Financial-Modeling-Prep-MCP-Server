# Tools Layer

MCP tool registrations for all FMP API endpoints.

## Key Rules

- Tools never throw — a handler catches everything and returns `{ content: [{ type: "text", text: "Error: <message>" }], isError: true }`
- Tool name and toolset catalog rules: [`../constants/AGENTS.md`](../constants/AGENTS.md)

## Pitfalls

- Declare each tool's `inputSchema` as a raw shape of Zod schemas. Toolception falls back to an open passthrough object for anything else, so clients lose the parameter list and arguments go unvalidated, with no error; `__tests__/unit/toolception-adapters/inputSchemaCompat.test.ts` guards it
