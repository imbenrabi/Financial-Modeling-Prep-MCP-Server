# Tools Layer

MCP tool registrations for all FMP API endpoints.

## Key Rules

- Tools must never throw — always return `{ content: [...], isError: true }`
- Tool names must be globally unique across all 28 modules
- All tools get identical annotations: `readOnlyHint`, `idempotentHint`, `openWorldHint`

## Anti-patterns

- Never throw from tool handler — MCP protocol expects error in response, not exception
- Never use duplicate tool names — later registration silently overwrites earlier

## Pitfalls

- Error message format must be `Error: ${message}` for consistency with MCP clients
- JSON responses are pretty-printed with `JSON.stringify(results, null, 2)`
