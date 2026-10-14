# Utilities

Helpers in `src/utils` (and the session schema in `src/schemas`). Most are not on the runtime path.

## Pitfalls

- On the runtime path: `getServerVersion`, `showHelp`, `clientIdHook` and `sessionClientIds` (the `/mcp` client ID hook `index.ts` registers), and `validateDynamicToolDiscoveryConfig` (env values only). Everything else in `validation.ts`, plus `computeClientId`, `isValidJsonRpc` and `SessionConfigSchema` (see [`../toolception-adapters/AGENTS.md`](../toolception-adapters/AGENTS.md)), is imported only by tests, so editing it changes no startup or request behavior
- Do not mistake `parseCommaSeparatedToolSets` (drops invalid names with a warning) for the real parser, `ServerModeEnforcer._parseAndValidateToolSets`, which exits the process on them
- `versionSync.ts` serves the release scripts, not the server; its rules are in [`../../scripts/AGENTS.md`](../../scripts/AGENTS.md)
