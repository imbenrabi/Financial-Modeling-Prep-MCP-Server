# Prompts

The `list_mcp_assets` prompt.

## Key Rules

- Register prompts inside the `createServer` factory in `src/index.ts`, never on a single shared server — see [`../FLOW.md`](../FLOW.md)

## Pitfalls

- `McpServer.prompt()` is a toolception runtime extension reached through a type cast. If it is absent the registration is skipped without a log (a throw only logs a warning), and `list_mcp_assets` disappears with no error
- The prompt text diverges from runtime in three places:
  - it says server-level tokens take precedence; the real order is in [adapters FLOW](../toolception-adapters/FLOW.md) (session wins)
  - its quick starts put `DYNAMIC_TOOL_DISCOVERY` / `FMP_TOOL_SETS` in the session `config`, which the adapters drop
  - its dynamic quick start calls `enable_toolset` with `toolset`, while the meta-tool (and the server card) take `name`
- Keep this text aligned with runtime behavior when either side changes
