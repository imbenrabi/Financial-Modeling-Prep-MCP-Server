# Toolception Adapters

Bridge layer converting FMP's imperative tool registration to Toolception's declarative module loader pattern.

## Files

- `ToolCollector.ts` - Virtual MCP server that captures tool registrations
- `createModuleAdapter.ts` - Factory creating module loaders from registration functions
- `moduleAdapters.ts` - All 28 module adapters
- `ModeConfigMapper.ts` - Translates ServerMode to Toolception config
- `index.ts` - Re-exports

## Architecture Flow

```
Registration Function          ToolCollector              ModuleLoader
register*Tools(server) ──────► captures tools ──────────► returns definitions
                               (virtual server)
```

## ToolCollector

Virtual server implementing the `tool()` method to capture registrations:

```typescript
interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, any>;  // Zod schema converted
  handler: (args: any) => Promise<any>;
  annotations: {
    readOnlyHint: true;      // All FMP tools read-only
    destructiveHint: false;  // None modify data
    idempotentHint: true;    // Cacheable
    openWorldHint: true;     // Calls external API
  };
}

class ToolCollector {
  tool(name, description, schema, handler): void  // Captures registration
  getToolDefinitions(): McpToolDefinition[]       // Returns all captured
  getToolCount(): number
  clear(): void  // For testing
}
```

## createModuleAdapter

Factory that wraps registration functions as Toolception module loaders:

```typescript
function createModuleAdapter(
  moduleName: string,
  registerFn: (server, accessToken?) => void
): ModuleLoader
```

**Token Priority in Adapter:**
```typescript
// Session token takes priority over server token
const accessToken = context?.FMP_ACCESS_TOKEN   // 1. Session override
                 || context?.accessToken;        // 2. Server-level
```

## Module Adapters

All 28 modules mapped in `moduleAdapters.ts`:

```typescript
const MODULE_ADAPTERS: Record<string, ModuleLoader> = {
  search: createModuleAdapter('search', registerSearchTools),
  directory: createModuleAdapter('directory', registerDirectoryTools),
  company: createModuleAdapter('company', registerCompanyTools),
  // ... 25 more
};

// Utility functions
getModuleNames(): string[]                    // All module names
getModuleAdapter(name): ModuleLoader | undefined
getModuleCount(): number                      // Returns 28
```

## ModeConfigMapper

Translates `ServerModeEnforcer` state to Toolception configuration:

```typescript
class ModeConfigMapper {
  static toToolceptionConfig(
    mode: ServerMode,
    sessionConfig: SessionConfig,
    enforcer: ServerModeEnforcer,
    accessToken?: string,
    moduleLoaders?: Record<string, ModuleLoader>
  ): ToolceptionConfig
}
```

### Mode Mapping

| ServerMode | Toolception startup.mode | startup.toolsets |
|------------|-------------------------|------------------|
| `DYNAMIC_TOOL_DISCOVERY` | `'DYNAMIC'` | (none) |
| `STATIC_TOOL_SETS` | `'STATIC'` | `['search', 'company', ...]` |
| `ALL_TOOLS` | `'STATIC'` | `'ALL'` |

### Session Context Configuration

```typescript
sessionContext: {
  enabled: true,
  queryParam: {
    name: 'config',
    encoding: 'base64',           // Base64-encoded JSON
    allowedKeys: ['FMP_ACCESS_TOKEN'],  // Only this key allowed
  },
  merge: 'shallow',  // Session overrides server-level
}
```

**Usage:** Client passes `?config=eyJGTVBfQUNDRVNTX1RPS0VOIjoieW91cl9rZXkifQ==`
(base64 of `{"FMP_ACCESS_TOKEN":"your_key"}`)

### Exposure Policy

```typescript
exposurePolicy: {
  namespaceToolsWithSetKey: false,  // Flat namespace (no prefixes)
  maxActiveToolsets: undefined,     // No limit
  allowlist: toolSets,              // Only allowed sets in STATIC mode
}
```

## ToolceptionConfig Structure

```typescript
interface ToolceptionConfig {
  catalog: ToolSetCatalog;              // From TOOL_SETS constant
  moduleLoaders: Record<string, ModuleLoader>;
  startup: {
    mode: 'DYNAMIC' | 'STATIC';
    toolsets?: string[] | 'ALL';
  };
  context: { accessToken?: string };
  sessionContext?: SessionContextConfig;
  exposurePolicy: ExposurePolicy;
}
```

## Adding a New Module

1. Create registration function in `src/tools/{module}.ts`
2. Add adapter to `MODULE_ADAPTERS`:
   ```typescript
   {module}: createModuleAdapter('{module}', register{Module}Tools),
   ```
3. Map to tool set in `src/constants/toolSets.ts`

## Session Caching (Toolception Behavior)

Toolception caches client bundles (containing sessions) with a cache key:

```
${clientId}:${sessionConfigHash}
```

**Critical:** If either component differs between requests, session lookup fails with "Session not found or expired".

### Cache Key Components

| Component | Source | Impact |
|-----------|--------|--------|
| `clientId` | `mcp-client-id` header | Different ID = different cache entry |
| `sessionConfigHash` | Hash of `?config=` query param | Different config = different cache suffix |

### Auto-Generated Client ID (src/index.ts)

When `mcp-client-id` header is missing, the server generates a stable ID:

```typescript
// Fingerprint: IP + User-Agent + Accept
const hash = sha256(`${ip}|${userAgent}|${accept}`).slice(0, 16);
return `auto-${hash}`;
```

This ensures MCP clients that don't send the header (Glama, Smithery) can still maintain sessions.

## Invariants

1. Session `FMP_ACCESS_TOKEN` always takes priority over server-level token
2. Only `FMP_ACCESS_TOKEN` is allowed in session config (security restriction)
3. All tools get identical annotations (read-only, idempotent, open-world)
4. Module names must match between `MODULE_ADAPTERS` and `TOOL_SETS` mappings
5. Missing `mcp-client-id` header → auto-generated stable ID from request fingerprint
