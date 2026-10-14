# AI Coding Agent Instructions for Financial Modeling Prep MCP Server

## Architecture Overview

This is a **Model Context Protocol (MCP) server** that exposes 267+ financial tools across 24 categories using the Financial Modeling Prep API. The codebase uses a **stateful server architecture** powered by the Smithery SDK with three operational modes:

- **Dynamic Mode**: Starts with 3 meta-tools, loads toolsets on-demand via `enable_toolset()` calls
- **Static Mode**: Pre-loads specific toolsets at startup via `FMP_TOOL_SETS` environment variable or CLI arg
- **Legacy Mode**: Loads all 267 tools at startup (default)

## Key Components & Data Flow

### Core Architecture Pattern
```
HTTP Request → FmpMcpServer → ClientStorage (by clientId) → McpServerFactory → DynamicToolsetManager → Individual Tool Modules
```

1. **`FmpMcpServer`** (`src/server/FmpMcpServer.ts`): Main HTTP server using Smithery SDK's stateful server wrapper
2. **`ClientStorage`** (`src/client-storage/ClientStorage.ts`): LRU storage with TTL keyed by clientId (derived from access token)
3. **`McpServerFactory`** (`src/mcp-server-factory/McpServerFactory.ts`): Creates MCP server instances per session
4. **`DynamicToolsetManager`** (`src/dynamic-toolset-manager/DynamicToolsetManager.ts`): Runtime tool loading/unloading
5. **`ServerModeEnforcer`** (`src/server-mode-enforcer/ServerModeEnforcer.ts`): Handles config precedence and mode validation
6. **Tool modules** (`src/tools/*.ts`): Individual tool registration functions following consistent patterns

### Client Isolation Pattern
Exactly one `McpServer` instance and `DynamicToolsetManager` is maintained per `clientId`, where `clientId = client:<sha256(token)>`. If no token is provided, a per-request `anon:<uuid>` is used (no reuse). The SDK manages `sessionId`, but caching does not use it.

## Development Workflows

### Testing Strategy
- **Framework**: Vitest with comprehensive mocking patterns
- **Key Pattern**: Mock external dependencies in test files using `vi.mock()` at module level
- **Run Tests**: `npm test` (watch mode) or `npm run test:run` (single run)
- **Coverage**: `npm run test:coverage`

### Mock Pattern Example (from `FmpMcpServer.test.ts`):
```typescript
vi.mock("../client-storage/index.js", () => ({
  ClientStorage: vi.fn().mockImplementation((options = {}) => ({
    get: vi.fn(),
    set: vi.fn(),
    stop: vi.fn(), // Critical: mock ALL methods used in production
  })),
}));
```

### Build & Development
- **Build**: `npm run build` (TypeScript compilation to `dist/`)
- **Dev Mode**: `npm run dev` (uses `tsx watch`)
- **Entry Point**: `src/index.ts` → CLI interface with minimist argument parsing

## Project-Specific Conventions

### Tool Registration Pattern
All tools follow this exact pattern in `src/tools/*.ts`:
```typescript
export function registerXxxTools(server: McpServer, accessToken?: string): void {
  const client = new XxxClient(accessToken);
  
  server.tool("toolName", "description", {
    param: z.string().describe("param description"),
  }, async ({ param }) => {
    try {
      const results = await client.method(param);
      return { content: [{ type: "text", text: JSON.stringify(results, null, 2) }] };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }],
        isError: true,
      };
    }
  });
}
```

### API Client Pattern  
All API clients in `src/api/*/` extend `FMPClient` base class:
- **Context-based API keys**: Clients accept `context` parameter with session-specific tokens
- **Error handling**: Consistent axios error wrapping with FMP-specific messages
- **Method naming**: Direct mapping to FMP API endpoints (e.g., `getProfile`, `getQuote`)

### Environment Configuration Precedence
Server follows strict configuration hierarchy:
1. **Command line arguments** (`--fmp-token`, `--dynamic-tool-discovery`, `--fmp-tool-sets`, `--port`)
2. **Environment variables** (`FMP_ACCESS_TOKEN`, `DYNAMIC_TOOL_DISCOVERY`, `FMP_TOOL_SETS`, `PORT`) 
3. **Defaults**

**Critical**: Mode and tool sets are fixed at startup; session configuration cannot change them. Only `FMP_ACCESS_TOKEN` is accepted per session (`?config=`), and it overrides the server-level token for that session.

### Capabilities Prompt and Authentication Requirement
- The server registers a human-friendly capabilities prompt `list_mcp_assets` that summarizes modes, tools, resources, and quick-start.
- The prompt now explicitly documents authentication behavior:
  - `FMP_ACCESS_TOKEN` is optional for server initialization.
  - It is required to successfully call any FMP-backed tools; without a token, those calls will error.
  - Token can be provided via CLI args/env vars or per-session config, with the session token overriding the server-level token.

## Critical Integration Points

### Smithery SDK Integration
- Uses `@smithery/sdk/server/stateful.js` for session management
- `createStatefulServer()` wraps the core session resource function
- Compatible with `CreateServerArg<SessionConfig>` interface

### Tool Set System
- **Tool sets defined in**: `src/constants/toolSets.ts` with structured metadata
- **Module mapping**: Both static (`src/tools/index.ts`) and dynamic (`DynamicToolsetManager.ts`) registrations
- **Validation**: `src/utils/validation.ts` handles tool set parsing and sanitization

### Error Handling Patterns
- **Session errors**: Logged but re-thrown to let Smithery SDK handle responses
- **Tool errors**: Caught and returned as `{ content: [...], isError: true }`
- **API errors**: Wrapped with context-specific error messages

## Testing Critical Areas

### Client Storage Testing
Mock `ClientStorage` with proper `stop()` method to avoid "not a function" errors in lifecycle tests.

### Dynamic Tool Loading
Test the `DynamicToolsetManager` enable/disable flow, especially module loading timeouts and validation.

### API Client Context Handling  
Verify clients properly extract API keys from session context vs constructor parameters.

## Key Files to Understand

- `src/server/FmpMcpServer.ts`: Main server lifecycle and Smithery SDK integration
- `src/mcp-server-factory/McpServerFactory.ts`: Mode resolution and server creation logic
- `src/server-mode-enforcer/ServerModeEnforcer.ts`: Configuration precedence and validation
- `src/constants/toolSets.ts`: Complete tool organization structure
- `src/tools/index.ts`: Static tool registration patterns
- `src/dynamic-toolset-manager/DynamicToolsetManager.ts`: Runtime tool management
- `src/index.ts`: CLI entry point with minimist argument parsing

When adding new tools or modifying architecture, follow the established patterns for consistency and maintainability.
