# Tools Layer

MCP tool registrations for all FMP API endpoints.

## Key Rules

- Tools must never throw — always return `{ content: [...], isError: true }`
- Tool names must be globally unique across all 28 modules, and each module belongs to exactly one toolset (`__tests__/unit/constants/toolSets.test.ts` enforces both)
- All tools get identical annotations: `readOnlyHint`, `idempotentHint`, `openWorldHint`

## Anti-patterns

- Never throw from tool handler — MCP protocol expects error in response, not exception
- Never use duplicate tool names or list a module in two toolsets — toolception 0.7.x silently keeps one, 0.8.0 fails `initialize`

## Pitfalls

- Error message format must be `Error: ${message}` for consistency with MCP clients
