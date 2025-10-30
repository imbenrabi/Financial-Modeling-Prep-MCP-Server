# Admin: Release Process

This document is intended for repo admins and maintainers.

## GitHub Release

We create GitHub Releases automatically when pushing a tag that starts with `v`.

- The automated workflow publishes to NPM, the MCP Registry, and GHCR before creating the GitHub Release.
- CI builds already run on `main` for pushes and PRs, but the release workflow also performs targeted verification before publishing.

> **Heads-up:** The reusable `Publish GHCR Image` workflow must be run manually once (Actions → Publish GHCR Image → Run workflow) to seed the repository on GHCR. After that, tagged releases trigger the same workflow automatically.

### Release notes generation

Our workflow uses `softprops/action-gh-release` with `generate_release_notes: true`.

This means:

- GitHub auto-generates release notes from commits/PRs since the last tag.
- Quality of notes depends on commit messages and PR titles. Prefer Conventional Commits (e.g., `feat: ...`, `fix: ...`).
- You can edit the generated release notes in the GitHub UI after the release is created.

Optional ways to influence notes:

- Create an annotated tag with a meaningful message, e.g.:
  ```bash
  git tag -a v1.2.0 -m "feat: dynamic toolsets\nfix: retry token resolution\nchore: docs updates"
  git push origin v1.2.0
  ```
  The generated notes will still be created by GitHub, but the tag message is shown in the release and can provide extra context.

### Recommended Release Flow

```bash
# 1) Ensure you are on an up-to-date main
git checkout main && git pull

# 2) Run local verification (optional but recommended)
npm run verify:npm-ready

# 3) Bump version and create a tag (choose one)
npm version patch -m "release: v%s"
# or
npm version minor -m "release: v%s"
# or
npm version major -m "release: v%s"

# 4) Push commit and tags to trigger the automated publishing workflow
git push && git push --tags

# Alternative (manual tag with a custom message):
# git tag -a v1.1.0 -m "feat: X\nfix: Y\nchore: Z"
# git push origin v1.1.0
```

### What Happens After Pushing a Tag

1. **GitHub Actions workflow triggers** (`Automated Publishing Pipeline`)
2. **Package verification** ensures NPM readiness (includes build)
3. **NPM publication** publishes to the public registry
4. **MCP registry submission** runs via the `mcp-publisher` CLI
5. **GHCR image** (linux/amd64 + linux/arm64) is built and pushed to `ghcr.io/imbenrabi/financial-modeling-prep-mcp-server`
6. **GitHub Release** is created with auto-generated notes

**Note**: Tests are not run since tags are created from main where CI already validates the code.

### Monitoring the Release

- Check the **Actions** tab in GitHub to monitor workflow progress
- Verify NPM publication at: `https://www.npmjs.com/package/financial-modeling-prep-mcp-server`
- Check the **Releases** page for the GitHub release

Notes:

- Create tags from commits on `main` only.
- Release notes are auto-generated from commits/PRs since the last tag.
- After the release is created, you may edit the notes in the GitHub UI if needed.

## NPM Publish

The package is automatically published to NPM as part of the GitHub Release workflow.

### Automated Publishing Process

When a tag starting with `v` is pushed, the workflow:

1. **Verifies NPM readiness** using our custom verification script (includes build)
2. **Publishes to NPM** using the `NPM_TOKEN` secret
3. **Submits to the MCP Registry** via the `mcp-publisher` CLI
4. **Invokes the reusable GHCR workflow** to build and push the Docker image
5. **Creates a GitHub Release** with auto-generated notes

**Note**: Tests are not run in the release workflow since tags are created from main where CI already runs tests.

### NPM Token Setup

The workflow requires an `NPM_TOKEN` secret to be configured in the repository.

**Quick setup:**

1. Run: `npm token create --type=automation`
2. Copy the generated token
3. Add it as `NPM_TOKEN` secret in GitHub repository settings

**Detailed instructions:** See [scripts/setup-npm-token.md](../scripts/setup-npm-token.md)

### Publishing Verification

The workflow includes several verification steps:

- Verifies package configuration (`npm run verify:npm-ready`)
- Ensures build succeeds before publishing
- Publishes with `--access public` for scoped packages

### Manual Override

If you need to publish manually (e.g., for hotfixes):

```bash
# Ensure you're logged in to NPM
npm login

# Verify readiness
npm run verify:npm-ready

# Publish manually
npm publish --access public
```

### Troubleshooting

**NPM Token Issues:**

- Ensure `NPM_TOKEN` secret is set in repository settings
- Token must have publish permissions for the package
- Use automation tokens for CI/CD workflows

**Version Conflicts:**

- If version already exists on NPM, bump version and create new tag
- Check existing versions: `npm view financial-modeling-prep-mcp-server versions --json`

**Build Failures:**

- Workflow will fail if `verify:npm-ready` script fails (includes build verification)
- Check Actions logs for detailed error messages
- Tests are not run in release workflow (they run in CI on main)

**Permission Issues:**

- Ensure NPM account has publish permissions for the package
- For first-time publishing, package name must be available

## Docker Image Publish (GHCR)

- Image: `ghcr.io/imbenrabi/financial-modeling-prep-mcp-server`
- Platforms: `linux/amd64`, `linux/arm64`
- Tags generated:
  - `latest`
  - Version tag (e.g., `v1.2.3`) when provided via Git ref or manual input

### Manual First Publish

1. Open **Actions → Publish GHCR Image**.
2. Click **Run workflow** (optionally provide a version tag, otherwise only `latest` is pushed).
3. Verify the image exists at `https://github.com/orgs/imbenrabi/packages?repo=Financial-Modeling-Prep-MCP-Server`.

After this initial seed, the release workflow invokes the same reusable workflow automatically for every tagged release (skipped when `dry_run` is enabled).

### Troubleshooting

- **Authentication:** Confirm `GHCR_PAT` is configured with `write:packages` scope for the repository owner.
- **Tag collision:** Delete or retag the conflicting image in GHCR, then re-run the workflow.
- **Platform failure:** Inspect the `docker/build-push-action` logs for the failing architecture. To reproduce locally: `docker buildx build --platform <platform> --push .`
