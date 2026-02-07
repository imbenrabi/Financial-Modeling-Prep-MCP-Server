# Server Mode Enforcer

Singleton that manages server mode configuration with strict precedence rules.

## Files

- `ServerModeEnforcer.ts` - Main singleton implementation
- `index.ts` - Re-exports

## Server Modes

```typescript
type ServerMode = 'DYNAMIC_TOOL_DISCOVERY' | 'STATIC_TOOL_SETS' | 'ALL_TOOLS';
```

| Mode | Behavior |
|------|----------|
| `DYNAMIC_TOOL_DISCOVERY` | Client discovers/activates tool sets at runtime |
| `STATIC_TOOL_SETS` | Fixed tool sets loaded at startup |
| `ALL_TOOLS` | All 253+ tools loaded immediately (default) |

## Configuration Precedence

**CLI arguments take highest priority, then env vars:**

```
1. CLI args (highest)
   --dynamic-tool-discovery    → DYNAMIC_TOOL_DISCOVERY mode
   --fmp-tool-sets=a,b,c       → STATIC_TOOL_SETS mode with specified sets
   --tool-sets=a,b,c           → alias for --fmp-tool-sets

2. Environment variables
   DYNAMIC_TOOL_DISCOVERY=true → DYNAMIC_TOOL_DISCOVERY mode
   FMP_TOOL_SETS=a,b,c         → STATIC_TOOL_SETS mode

3. Default (lowest)
   No override → ALL_TOOLS mode
```

## Singleton Pattern

```typescript
// Initialize once at startup (required before getInstance)
ServerModeEnforcer.initialize(process.env, minimist(process.argv.slice(2)));

// Get instance anywhere in code
const enforcer = ServerModeEnforcer.getInstance();
const mode = enforcer.serverModeOverride;  // ServerMode | null
const toolSets = enforcer.toolSets;        // ToolSet[] (copy)
```

## Critical Behaviors

### Fail-Fast Validation
Invalid tool set names cause immediate process termination:
```typescript
// If user specifies invalid tool set
FMP_TOOL_SETS=search,INVALID,company
// → Logs error and calls process.exit(1)
```

### Immutability Protection
`toolSets` getter returns a copy to prevent external mutation:
```typescript
public get toolSets(): ToolSet[] {
  return [...this._toolSets];  // New array each call
}
```

### Single Initialization
```typescript
ServerModeEnforcer.initialize(env, args);  // OK
ServerModeEnforcer.initialize(env, args);  // Logs warning, ignored
```

### Instance Requirement
```typescript
ServerModeEnforcer.getInstance();  // Throws if initialize() not called
```

## Validation Rules

- Tool set names: case-sensitive, lowercase only
- Whitespace trimmed: `"  search  "` → `"search"`
- Comma-separated parsing: `"search,company,quotes"`
- Empty strings ignored: `"search,,company"` → `["search", "company"]`

## Testing

```typescript
ServerModeEnforcer.reset();  // Clears singleton for test isolation
```

## Integration Point

Used by `ModeConfigMapper` to translate enforcer state into Toolception configuration.
