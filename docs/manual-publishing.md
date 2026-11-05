# Manual Publishing Guide

This guide provides step-by-step instructions for manually publishing the Financial Modeling Prep MCP Server to both NPM and the MCP Registry.

> **📋 Note**: For the standard release process, see [.github/RELEASE.md](../.github/RELEASE.md). This manual workflow is intended for emergency releases, debugging, or when the automated workflow fails.

## Overview

The manual publishing workflow handles:
- ✅ Environment validation and configuration checks
- 📦 NPM package publishing with validation
- 🌐 MCP Registry submission with metadata validation
- 🔄 Error handling and rollback procedures
- 🔍 Publication verification and troubleshooting

## Prerequisites

### Required Tools

1. **Node.js** (>=25.3.0)
2. **NPM** with publishing permissions
3. **MCP Publisher CLI** (optional for registry publishing)

### Authentication Setup

#### NPM Authentication
```bash
# Login to NPM
npm login --registry https://registry.npmjs.org/

# Verify authentication
npm whoami
```

#### MCP Registry Authentication (Optional)
```bash
# Install MCP publisher CLI
npm install -g @modelcontextprotocol/publisher

# Login with GitHub OAuth
mcp-publisher login github

# Verify authentication
mcp-publisher whoami
```

## Quick Start

### 1. Dry Run (Recommended First)
```bash
# Test the complete workflow without publishing
npm run publish:dry-run
```

### 2. Validate Environment
```bash
# Check all prerequisites and configuration
npm run publish:validate
```

### 3. Full Publishing
```bash
# Run the complete publishing workflow
npm run publish:manual
```

## Publishing Commands

### Core Commands

| Command | Description |
|---------|-------------|
| `npm run publish:manual` | Complete publishing workflow |
| `npm run publish:dry-run` | Test workflow without publishing |
| `npm run publish:validate` | Validate environment only |
| `npm run publish:troubleshoot` | Show troubleshooting guide |

### Advanced Options

```bash
# Skip NPM publishing (registry only)
tsx scripts/manual-publish.ts publish --skip-npm

# Skip registry submission (NPM only)
tsx scripts/manual-publish.ts publish --skip-registry

# Force publishing without confirmation
tsx scripts/manual-publish.ts publish --force

# Skip validation checks
tsx scripts/manual-publish.ts publish --skip-validation
```

## Step-by-Step Workflow

### Phase 1: Pre-Publishing Validation

The workflow automatically validates:

1. **Version Consistency**
   - package.json version matches server.json
   - CHANGELOG.md has corresponding entry
   - All versions follow SemVer format

2. **NPM Readiness**
   - Required files exist (dist/, LICENSE, README.md)
   - package.json has correct mcpName field
   - Build process works correctly
   - Package creation succeeds

3. **Registry Requirements**
   - server.json validates against schema
   - MCP publisher CLI is available
   - Authentication is configured

4. **Environment Setup**
   - Dependencies are installed
   - Build artifacts are current
   - No uncommitted changes (recommended)

### Phase 2: Publishing Execution

1. **File Backups**
   - Creates backups of package.json, server.json, CHANGELOG.md
   - Enables rollback if publishing fails

2. **NPM Publishing**
   - Checks if version already exists
   - Publishes with public access
   - Validates publication success

3. **Registry Submission**
   - Validates server.json metadata
   - Submits to MCP Registry
   - Confirms registry entry creation

### Phase 3: Verification

1. **NPM Verification**
   - Confirms package is available on NPM
   - Validates version and metadata

2. **Registry Verification**
   - Searches for server in registry
   - Confirms metadata accuracy

## Error Handling and Rollback

### Automatic Rollback

If publishing fails, the workflow automatically:

1. **Restores File Backups**
   - Reverts package.json, server.json, CHANGELOG.md
   - Preserves original state

2. **Provides Cleanup Guidance**
   - NPM packages cannot be auto-unpublished
   - Registry entries may need manual cleanup
   - Shows specific error details

### Manual Rollback

If manual intervention is needed:

```bash
# Deprecate NPM package (if published incorrectly)
npm deprecate financial-modeling-prep-mcp-server@<version> "Reason for deprecation"

# Restore from git (if files were modified)
git checkout HEAD -- package.json server.json CHANGELOG.md

# Clean build artifacts
npm run build
```

## Troubleshooting

### Common NPM Issues

#### Authentication Problems
```bash
# Re-login to NPM
npm logout
npm login --registry https://registry.npmjs.org/

# Check authentication
npm whoami
```

#### Package Already Exists
```bash
# Check existing versions
npm view financial-modeling-prep-mcp-server versions --json

# Use force flag if needed (not recommended)
npm run publish:manual -- --force
```

#### Permission Denied
- Ensure you have publish permissions for the package
- For new packages, ensure the name is available
- Check NPM organization membership if applicable

### Common Registry Issues

#### Authentication Problems
```bash
# Re-authenticate with GitHub
mcp-publisher logout
mcp-publisher login github

# Verify authentication
mcp-publisher whoami
```

#### Schema Validation Errors
```bash
# Validate server.json manually
mcp-publisher validate server.json

# Check schema compliance
npm run version:validate
```

#### NPM Package Not Found
- Registry requires NPM package to exist first
- Ensure NPM publishing succeeded before registry submission
- Check package.json mcpName field matches server.json name

### Version Consistency Issues

```bash
# Check current versions
npm run version:info

# Synchronize versions
npm run version:sync <new-version>

# Validate consistency
npm run version:validate
```

### Build and Validation Issues

```bash
# Clean and rebuild
rm -rf dist node_modules
npm install
npm run build

# Run comprehensive tests
npm run test:run
npm run verify:npm-ready

# Check TypeScript compilation
npm run typecheck
```

## Best Practices

### Pre-Publishing Checklist

- [ ] All tests pass: `npm test`
- [ ] Build succeeds: `npm run build`
- [ ] Version consistency: `npm run version:validate`
- [ ] NPM readiness: `npm run verify:npm-ready`
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Git changes committed

### Version Management

1. **Update Version**
   ```bash
   # Update package.json version
   npm version patch|minor|major
   
   # Synchronize all files
   npm run version:sync $(node -p "require('./package.json').version")
   ```

2. **Update CHANGELOG**
   - Add new version section
   - Document all changes
   - Follow Keep a Changelog format

3. **Validate Changes**
   ```bash
   npm run version:validate
   npm run publish:dry-run
   ```

### Security Considerations

- **Never commit NPM tokens** to version control
- **Use automation tokens** for CI/CD (not personal tokens)
- **Rotate tokens periodically** for security
- **Validate all inputs** before publishing
- **Review changes** in dry-run mode first

### Testing Strategy

1. **Local Testing**
   ```bash
   # Test package creation
   npm pack --dry-run
   
   # Test installation locally
   npm install -g ./financial-modeling-prep-mcp-server-<version>.tgz
   ```

2. **Registry Testing**
   ```bash
   # Test server.json validation
   mcp-publisher validate server.json
   
   # Test registry search
   mcp-publisher search financial-modeling-prep
   ```

## Integration with CI/CD

This manual workflow complements the automated GitHub Actions workflow:

- **Manual**: For testing, debugging, and emergency releases
- **Automated**: For regular releases triggered by git tags (see [.github/RELEASE.md](../.github/RELEASE.md))

### Triggering Automated Release

For standard releases, use the automated workflow documented in [.github/RELEASE.md](../.github/RELEASE.md):

```bash
npm version patch  # or minor/major
git push && git push --tags
```

## Support and Resources

### Documentation
- [MCP Registry Documentation](https://docs.modelcontextprotocol.io/registry/)
- [NPM Publishing Guide](https://docs.npmjs.com/packages-and-modules/)
- [Keep a Changelog](https://keepachangelog.com/)
- [Semantic Versioning](https://semver.org/)

### Getting Help
- **Project Issues**: [GitHub Issues](https://github.com/imbenrabi/Financial-Modeling-Prep-MCP-Server/issues)
- **MCP Community**: [MCP Discord](https://discord.gg/modelcontextprotocol)
- **NPM Support**: [NPM Support](https://www.npmjs.com/support)

### Quick Reference

```bash
# Complete workflow
npm run publish:manual

# Test without publishing
npm run publish:dry-run

# Validate environment
npm run publish:validate

# Get help
npm run publish:troubleshoot

# Version management
npm run version:info
npm run version:sync <version>
npm run version:validate
```