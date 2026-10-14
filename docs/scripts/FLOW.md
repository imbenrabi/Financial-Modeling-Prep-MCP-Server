# Release Flow

Order of `release.yml`, triggered by pushing a `v*` tag (or `workflow_dispatch` with `dry_run`).

## Sequence

1. `validate`: take the version from the tag, `npm ci`, `version:validate`, `verify:npm-ready` (includes the build), require `NPM_TOKEN` unless dry run
2. `publish`: build the package, build `mcp-publisher` from the default branch of `modelcontextprotocol/registry`, `mcp-publisher login github-oidc`, `npm publish`, wait for npm to show the version, `mcp-publisher publish`
3. `release`: create the GitHub Release, named from the tag's version; skipped on dry run

## Non-obvious consequences

- `npm publish` ships whatever `package.json` says; the tag only names the GitHub Release and drives the propagation wait. A tag that differs from `package.json` publishes one version and labels another
- The propagation wait polls 30 times at 10 s and then continues without error. If npm is slow, `mcp-publisher publish` runs against a version the registry cannot see yet and fails
- npm is published before the MCP Registry. If the registry step fails, the npm version is live and npm will not accept it again, so a workflow re-run stops at `npm publish`; finish the registry step with `npm run publish:manual -- --skip-npm`
- `mcp-publisher` is built unpinned on every run, so a breaking change in the registry repo fails a release that touched no code
- Dry run skips `npm publish` and the GitHub Release but still builds and runs `mcp-publisher --dry-run`
