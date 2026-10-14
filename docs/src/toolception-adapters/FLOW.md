# Adapter Flow

How a request's token reaches a tool, and where failures disappear.

## Session context to client token

1. Toolception reads the `config` query param, base64-decodes and JSON-parses it, and keeps only `allowedKeys` (`FMP_ACCESS_TOKEN`). Any parse failure yields `{}`.
2. The result is shallow-merged over the server context `{ accessToken }` (from `--fmp-token` or `FMP_ACCESS_TOKEN`).
3. The cache key is `clientId` alone when the filtered config is empty, otherwise `clientId:<first 16 hex of sha256(sorted JSON)>`. Different tokens therefore get different cached servers; an invalid config shares the token-less entry.
4. Loaders run with the merged context, in every mode. `createModuleAdapter` picks `FMP_ACCESS_TOKEN || accessToken` and passes it to `registerXxxTools`, which builds the client. The token is fixed when the loader runs, not per tool call.

## Loader failures are silent

- `createModuleAdapter` logs and rethrows when a registration function throws, so the failure carries the module name.
- Toolception's module resolver catches that throw, logs a warning, and carries on; the same applies to a toolset module with no `MODULE_ADAPTERS` entry (skipped without a log).
- Result: startup succeeds, the toolset reports active, and it exposes zero tools. Check the server log for `Module loader '<name>' failed` and `[ModuleAdapter] Loaded N tools` lines instead of trusting a clean start.
