# Changelog

All notable changes to the Financial Modeling Prep MCP Server will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.6.3] - 2026-01-29

### Added
- Version 2.6.3 release

## [2.5.3] - 2025-12-06

### Added
- Version 2.5.3 release

## [Unreleased]

## [2.5.0] - 2025-01-09

### Added

- **MCP Registry Publishing**: Complete integration with official Model Context Protocol Registry
- **GitHub Actions Automation**: Automated publishing workflow with GitHub OIDC authentication
- **Registry Metadata**: Comprehensive server.json with package configurations and transport settings
- **NPM Package Validation**: mcpName field for registry compliance and ownership verification
- **Version Synchronization**: Automated utilities to maintain consistency across package.json, server.json, and CHANGELOG.md
- **Documentation Suite**: Complete guides for version sync, and manual publishing
- **Verification Scripts**: Tools to validate GitHub secrets configuration and publishing readiness

### Changed

- **Release Workflow**: Enhanced GitHub Actions workflow to publish to both NPM and MCP Registry
- **Authentication Strategy**: Implemented GitHub OIDC for secure, secret-free registry authentication
- **Documentation Structure**: Reorganized docs with dedicated guides for registry publishing
- **README Enhancement**: Added comprehensive MCP Registry section with installation methods

### Fixed

- **Version Consistency**: Automated synchronization prevents version mismatches across metadata files
- **Publishing Pipeline**: Robust error handling and rollback procedures for failed publications
- **Registry Compliance**: Full adherence to MCP Registry schema and validation requirements

### Security

- **GitHub OIDC**: Secure authentication without long-term credentials or manual secret management
- **Token Isolation**: Local development tokens separated from CI/CD authentication
- **NPM Automation**: Secure NPM publishing with automation tokens

### Notes

- **First Automated Release**: This is the first version published using the new automated GitHub Actions workflow
- **Registry Debut**: First version available through the official MCP Registry for one-click installation
- **Breaking Change**: Publishing process now requires NPM_TOKEN secret in GitHub repository settings

## [2.4.0] - 2024-12-09

### Added

- MCP Registry metadata configuration (server.json)
- NPM package validation field (mcpName) for registry compliance
- Version synchronization scripts for package.json, server.json consistency
- Comprehensive registry documentation and installation methods

### Changed

- Enhanced README with MCP Registry section and installation options
- Updated package.json with registry-compliant mcpName field
- Improved documentation structure for better discoverability

### Fixed

- Version consistency across package.json and registry metadata files

## [2.3.0] - 2024-11-15

### Added

- Dynamic toolset management (BETA) with runtime tool loading/unloading
- Meta-tools for toolset control: enable_toolset, disable_toolset, get_toolset_status
- Server-level mode enforcement with configuration precedence hierarchy
- Session-level configuration via Base64-encoded query parameters

### Changed

- Refactored server architecture to support multiple operational modes
- Enhanced client storage with LRU cache and TTL for session management
- Improved tool registration system with dynamic loading capabilities

### Fixed

- Memory optimization through selective tool loading
- Session isolation and proper cache management

## [2.2.0] - 2024-10-20

### Added

- Comprehensive tool categorization across 24 financial domains
- Static toolset configuration for predictable performance
- Enhanced error handling and graceful degradation
- Docker support with environment variable configuration

### Changed

- Reorganized tool structure for better maintainability
- Improved API client architecture with base class inheritance
- Enhanced documentation with usage examples and system prompts

### Fixed

- Tool loading performance optimizations
- Consistent error responses across all tools

## [2.1.0] - 2024-09-25

### Added

- 253+ financial tools across comprehensive categories
- Real-time market data integration
- Financial statements and ratio analysis tools
- Technical indicators and market performance metrics

### Changed

- Migrated to TypeScript for better type safety
- Enhanced API client with context-aware authentication
- Improved tool registration patterns

### Fixed

- API rate limiting and timeout handling
- Data validation and error reporting

## [2.0.0] - 2024-08-15

### Added

- Model Context Protocol (MCP) server implementation
- Smithery SDK integration for stateful session management
- HTTP server with JSON-RPC endpoint
- Comprehensive financial data access via FMP API

### Changed

- Complete rewrite from previous versions
- New architecture with session-based tool management
- Enhanced security with token-based authentication

### Removed

- Legacy API interfaces (breaking change)
- Deprecated configuration methods

## [1.x.x] - Legacy Versions

Previous versions were experimental implementations. See git history for detailed changes.

---

## Release Process

### Version Numbering

This project follows [Semantic Versioning](https://semver.org/):

- **MAJOR** version for incompatible API changes
- **MINOR** version for backwards-compatible functionality additions
- **PATCH** version for backwards-compatible bug fixes

### Release Checklist

1. Update version in package.json
2. Run version synchronization: `npm run version:sync`
3. Update CHANGELOG.md with new version section
4. Verify GitHub secrets are configured: `npm run verify:github-secrets`
5. Create git tag: `git tag v{version}`
6. Push changes and tag: `git push origin main --tags`
7. Automated publishing workflow handles NPM and registry updates

### Automated Publishing (v2.5.0+)

Starting with version 2.5.0, releases are fully automated through GitHub Actions:

- **Trigger**: Push git tag with `v*` pattern (e.g., `v2.5.0`)
- **NPM Publishing**: Automatic with `NPM_TOKEN` secret
- **MCP Registry**: Automatic with GitHub OIDC authentication
- **GitHub Release**: Auto-generated with release notes

**Prerequisites**: Ensure `NPM_TOKEN` secret is configured in repository settings.

### Registry Publishing

Registry updates are automatically synchronized with NPM releases through GitHub Actions. Manual publishing can be performed using:

```bash
# Validate metadata
npm run version:validate

# Publish to NPM (required for registry validation)
npm publish

# Submit to MCP Registry (requires authentication)
mcp-publisher publish
```

For detailed publishing instructions, see the [MCP Registry Publishing Guide](https://docs.modelcontextprotocol.io/registry/publishing).
