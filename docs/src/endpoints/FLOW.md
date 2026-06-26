# Endpoint Flow

Registry-facing endpoint behavior and where it diverges from runtime.

## Server-card construction

`/.well-known/mcp/server-card.json` is built at startup by `serverCardEndpoint` (`src/endpoints/server-card.ts`). It is not generated from live state; it is static metadata so registries such as Smithery can discover the server without invoking stateful MCP sessions.

## Non-obvious constraints

- The card hardcodes a `configSchema` that marks `FMP_ACCESS_TOKEN` as `required`, while `src/index.ts` logs a warning and starts successfully when no token is configured. Registry onboarding UI may enforce a token even though the server does not.
- The card lists only the five dynamic meta-tools (`enable_toolset`, `disable_toolset`, `list_toolsets`, `describe_toolset`, `list_tools`). This matches the default DYNAMIC mode surface, but it does not reflect runtime enablement state in STATIC or ALL_TOOLS modes.
- If the server mode or toolset catalog changes, the card content must be kept in sync manually; it is not derived from `TOOL_SETS` or `ModeConfigMapper` at runtime.
