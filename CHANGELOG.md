# Changelog

All notable changes to the Financial Modeling Prep MCP Server will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.8.0] - 2026-10-14

### Security
- **API key written to logs on upstream failures.** The 14 statements tools that log a failed FMP call (`getFinancialReportJSON`, `getFinancialReportXLSX`, `getRevenueProductSegmentation`, the as-reported statements, key metrics, ratios, scores and owner earnings among them) wrote the whole error object to stderr. Its `cause` is the `AxiosError`, whose request URL carries `apikey=`, so the API key reached the server logs on any upstream failure. They now log the error message only. Tool responses were never affected

### Added
- Fourteen tools for FMP endpoints the server did not cover: `getEnterpriseValues` (`/enterprise-values`); `getSenateTradesById`, `getHouseTradesById`, `getSenatePositions`, `getSenateProfile`, `getSenateNetWorth` and `getSenateNetWorthAggregated`; and the seven TipRanks partner endpoints (`searchTipRanksAnalystRatings`, `getTipRanksPointInTimeRatingsBySymbol`, `getTipRanksPointInTimeRatingsByAnalyst`, `getTipRanksSymbolSummary`, `getTipRanksAnalystSummary`, `getTipRanksFirmSummary`, `lookupTipRanksAnalyst`) in a new `tipranks` module, part of the `analyst` tool set. `ALL_TOOLS` now exposes 267 tools
- `stockScreener` accepts `avgVolumeMoreThan`, `avgVolumeLowerThan` and `page`; `getEarningsCalendar` accepts `includeReportTimes`

### Fixed
- `server.json` now lists the hosted endpoint under top-level `remotes`, not only inside the npm package's `transport`, so registries that read a listing's tools from the manifest's remote, such as mcprush, have an endpoint to query
- `getEconomicIndicators` called `/economic-indicator` and `getESGDisclosures` called `/esg-disclosure` and `listCommodities` called `/commodity-list`; FMP documents them as `/economic-indicators`, `/esg-disclosures` and `/commodities-list`
- `ALL_TOOLS` mode registered the four `earnings-transcript` tools twice (`getLatestEarningsTranscripts`, `getEarningsTranscript`, `getEarningsTranscriptDates`, `getAvailableTranscriptSymbols`) because both the `calendar` and `earnings` tool sets listed that module. Toolception 0.8.0 rejects duplicate tool names at `initialize`. A new test fails on any module or tool name shared between tool sets

### Changed
- `getEconomicIndicators` now lists the valid indicator names and the 90-day date range limit from FMP's documentation in its tool description
- Upgraded `toolception` from `^0.7.0` to `^0.8.0`. `disable_toolset` now removes the toolset's tools, so clients no longer list or call them after a disable (before, it only tracked state and the tools stayed callable); `enable_toolset` and `disable_toolset` are advertised with `destructiveHint: false`; and a tool name registered twice in a startup tool set now stops `ALL_TOOLS` and `STATIC_TOOL_SETS` from starting instead of leaving a tool set half loaded
- The `calendar` tool set no longer includes the transcript tools. With `STATIC_TOOL_SETS` or `DYNAMIC_TOOL_DISCOVERY`, select `earnings` for transcripts; `calendar` keeps `getEarningsCalendar`. `ALL_TOOLS` keeps the 253 tools it had in 2.7.0 (plus the 14 added above)

### Notes
- Some new and changed endpoints follow FMP's documentation and were not confirmed against the live API: the seven TipRanks tools and `/commodities-list` were never called; the Senate/House and ESG disclosure calls and the `avgVolume` screener filters returned HTTP 402 on the plan used for testing; and the `getHouseTradesById` parameter name (`senateID`) is a guess

## [2.7.0] - 2026-10-10

### Changed
- Upgraded `toolception` from `^0.6.3` to `^0.7.0` (#109). Clients now stay connected side by side in every mode (`ALL_TOOLS`, `STATIC_TOOL_SETS` and `DYNAMIC_TOOL_DISCOVERY`); previously a second client in `ALL_TOOLS` or `STATIC_TOOL_SETS` dropped the first with `Session not found or expired`
- A per-session `?config=` token (`FMP_ACCESS_TOKEN`) now reaches the tools in every mode, so clients no longer get `FMP_ACCESS_TOKEN is required` when the server has no token of its own
- Every tool registers through the SDK's `registerTool`, so its Zod input schema is advertised to clients and invalid arguments are rejected with `Input validation error`
- Raised dependency floors to match: `@modelcontextprotocol/sdk` `^1.32.1`, `fastify` `^5.12.5` and `zod` `^3.25.76`
- `ToolCollector`, `createModuleAdapter` and `ModeConfigMapper` now import their types from toolception instead of keeping local copies

### Fixed
- Prompts are registered on every per-client MCP server, so `prompts/list` no longer returns `Method not found` in `DYNAMIC_TOOL_DISCOVERY` mode (#108)
- Resolved 19 of 23 `npm audit` advisories in runtime and dev dependencies, including `@modelcontextprotocol/sdk`, `axios`, `fastify`, `hono`, `proxy-addr`, `fast-uri`, `ip-address` and `form-data`, and bumped `vitest` to `^4.1.11` to clear its critical advisories (#107)

### Added
- `npm run verify:toolception -- --source <npm version | tarball | git:ref>` checks the server against any toolception build before a future dependency bump (#109)

### CI
- The Claude Code Review workflow now runs only on manual dispatch, because its OAuth token expired (#110)

## [2.6.12] - 2026-07-02

### Added
- Version 2.6.12 release

## [2.6.11] - 2026-06-26

### Added
- Version 2.6.11 release

## [2.6.10] - 2026-04-30

### Added
- Version 2.6.10 release

## [2.6.9] - 2026-04-24

### Changed
- Renamed `from` parameter to `from_date` in MCP tool schemas to avoid Python reserved keyword conflicts
- Updated `@modelcontextprotocol/sdk` dependency from `^1.24.3` to `^1.27.1` to align with toolception

## [2.6.8] - 2026-02-03

### Changed
- Improved codebase organization by removing misleading directories, flattening unnecessary nesting in `src/schemas/`, relocating registry test configuration to `__tests__/unit/registry-tests/config.ts`, and fixing test script paths for better maintainability

## [2.6.7] - 2026-02-02

### Changed
- Clarified documentation on session configuration restrictions, explicitly allowing only `FMP_ACCESS_TOKEN` to be set per-session
- Updated Docker installation instructions to build the MCP server image from source instead of pulling a pre-built image
- Refreshed documentation for the minimum supported Node.js version and runtime requirements

### Removed
- Cleaned up code by removing the unused `sessionConfig` parameter from `ModeConfigMapper`

## [2.6.6] - 2026-02-01

### Added
- Version 2.6.6 release

## [2.6.5] - 2026-02-01

### Added
- Version 2.6.5 release

## [2.6.4] - 2026-01-30

### Added
- Version 2.6.4 release

## [2.6.3] - 2026-01-29

### Added
- Version 2.6.3 release

## [2.5.3] - 2025-12-06

### Added
- Version 2.5.3 release

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
