# Release and Verification Scripts

`scripts/`, `src/utils/versionSync.ts`, `.github/workflows/release.yml`, and the `.sentrux` CI gate.

## Key Rules

- Keep `package.json` `version`, `server.json` `version` and every `server.json` `packages[].version` equal — `npm run version:validate` fails the release otherwise
- Run `npm run verify:toolception -- --source <npm version | tarball | git:ref>` against a candidate toolception build before bumping the dependency
- `.github/workflows/ci.yml` runs lint, build, tests, knip and `sentrux check .` on PRs and pushes to main; the release workflow runs none of the tests

## Anti-patterns

- Never expect `version:validate` to catch a stale changelog — a `CHANGELOG.md` version that differs from `package.json` is only a warning
- Never assume the pushed tag is checked — the workflow reads the version from the tag but never compares it with `package.json`

## Pitfalls

- `validateServerJsonSchema` pins `server.json`'s `$schema` to one exact URL (2025-12-11) and caps `description` at 100 characters; a registry schema change needs a code change there
- `verify:toolception` installs the candidate with `--no-save` and restores `node_modules` with `npm ci` unless `--keep` is passed; its per-client checks need a toolception build that includes code-rabi/toolception#27

## Flow Reference

See [FLOW.md](FLOW.md) — tag-to-registry ordering and its failure modes
