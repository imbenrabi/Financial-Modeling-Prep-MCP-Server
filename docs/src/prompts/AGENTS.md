# Prompts

The `list_mcp_assets` prompt.

## Key Rules

- Register prompts inside the `createServer` factory in `src/index.ts`, never on a single shared server — see [`../FLOW.md`](../FLOW.md)

## Pitfalls

- The prompt is registered with `McpServer.registerPrompt()` from `@modelcontextprotocol/server` (SDK v2 removed `prompt()`). A throw during registration is only logged as a warning, and `list_mcp_assets` then disappears with no error; `__tests__/unit/prompts/registerPrompts.test.ts` lists it through a real client to catch that
- The prompt text diverges from runtime in two places:
  - its quick starts put `DYNAMIC_TOOL_DISCOVERY` / `FMP_TOOL_SETS` in the session `config`, which the adapters drop
  - its dynamic quick start calls `enable_toolset` with `toolset`, while the meta-tool (and the server card) take `name`
- Keep this text aligned with runtime behavior when either side changes
