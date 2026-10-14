# Constants

The tool set catalog (`TOOL_SETS`) that drives toolception's catalog, the enforcer's validation, and `--help`.

## Key Rules

- List each module in exactly one toolset, and give every listed module a `MODULE_ADAPTERS` entry — `__tests__/unit/constants/toolSets.test.ts` enforces both
- Keep tool names unique across all modules: `namespaceToolsWithSetKey` is `false` in every mode (`ModeConfigMapper`), so tools share one flat namespace

## Anti-patterns

- Never list a module in two toolsets or register a tool name twice — toolception 0.8.0 rejects such a catalog: any static startup that includes the duplicates fails, and in dynamic mode `enable_toolset` returns `success:false` (code-rabi/toolception#33); the test above exists to catch it before then
