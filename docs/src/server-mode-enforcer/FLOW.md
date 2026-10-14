# Mode Resolution

How `ServerModeEnforcer._determineOverride` picks a mode. First match wins.

## Order

1. CLI `--dynamic-tool-discovery` (or `--dynamicToolDiscovery`), only when minimist yields boolean `true` → DYNAMIC_TOOL_DISCOVERY
2. CLI `--fmp-tool-sets` / `--tool-sets` / `--toolSets` as a string → STATIC_TOOL_SETS (validated here)
3. Env `DYNAMIC_TOOL_DISCOVERY` that parses as `true` (case-insensitive, trimmed) → DYNAMIC_TOOL_DISCOVERY
4. Env `FMP_TOOL_SETS` → STATIC_TOOL_SETS (validated here)
5. Nothing matched → `null`

## Non-obvious consequences

- Dynamic outranks static at the same level, and CLI static outranks env dynamic. `--dynamic-tool-discovery --fmp-tool-sets bogus` starts in dynamic mode without ever validating `bogus`; `--fmp-tool-sets search` with env `DYNAMIC_TOOL_DISCOVERY=true` starts static
- The CLI flag is honored only as a bare flag. `--dynamic-tool-discovery=true` and `--dynamic-tool-discovery true` reach the enforcer as the string `"true"` (`minimist` has no boolean declaration in `src/index.ts`), match nothing, and the server silently starts in ALL_TOOLS. `server.json` declares this argument as a boolean, so any launcher that passes a value form hits it. The env var accepts the string `true`
- `--fmp-tool-sets` without a value is boolean `true`, not a string, so rule 2 is skipped and resolution continues to the env rules
- Empty entries from stray commas are dropped before validation (`search,company,` is `search,company`). A set value that leaves no names at all (`,`, ` , `, a run of spaces) exits with `process.exit(1)` when rule 2 or 4 is reached (a higher rule wins first, so `--dynamic-tool-discovery` with `FMP_TOOL_SETS=,` starts dynamic and never validates it); only an unset or empty-string value counts as "not set" and falls through
