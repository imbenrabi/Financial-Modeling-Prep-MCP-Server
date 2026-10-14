# Endpoint Flow

Registry-facing endpoint behavior and where it diverges from runtime.

## Server-card construction

`/.well-known/mcp/server-card.json` is served by `serverCardEndpoint` (`src/endpoints/server-card.ts`). Only the version is read at request time; the rest is hardcoded metadata, so registries such as Smithery can discover the server without invoking stateful MCP sessions.

## Non-obvious constraints

- The card hardcodes a `configSchema` that marks `FMP_ACCESS_TOKEN` as `required`, while `src/index.ts` logs a warning and starts successfully when no token is configured. Registry onboarding UI may enforce a token even though the server does not.
- The card lists only the five dynamic meta-tools (`enable_toolset`, `disable_toolset`, `list_toolsets`, `describe_toolset`, `list_tools`). The server's actual default is ALL_TOOLS (`src/index.ts`), so the card describes DYNAMIC mode even for a default start, and it never reflects runtime enablement state in STATIC or ALL_TOOLS modes.
- If the server mode or toolset catalog changes, the card content must be kept in sync manually; it is not derived from `TOOL_SETS` or `ModeConfigMapper` at runtime.
