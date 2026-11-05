# Installation Method Verification

This document describes the installation method verification process for the Financial Modeling Prep MCP Server. The verification ensures that all installation methods work correctly and meet registry publishing requirements.

## Overview

The installation verification process has been optimized for CI/CD environments to provide fast, reliable testing without network dependencies. It focuses on local verification of core functionality while maintaining comprehensive coverage of installation requirements. This is a critical step before publishing to the MCP Registry.

## Verification Methods

The verification process has been streamlined into a CI-optimized test suite that focuses on local validation without network dependencies. This ensures fast, reliable testing in CI/CD environments.

### 1. Required Files and Configuration

Validates that all necessary files are present and properly configured:

**Verification Points:**
- All required files exist (package.json, dist/index.js, README.md, LICENSE, server.json)
- Package.json has correct configuration (name, mcpName, version, main, bin)
- Server.json has valid MCP registry configuration
- Build artifacts are syntactically valid

### 2. CLI Functionality

Tests the command-line interface without network dependencies:

**Verification Points:**
- Help command displays correct information with expected patterns
- Server accepts FMP token via CLI arguments
- Server accepts FMP token via environment variables
- Server starts successfully with proper configuration

### 3. NPM Package Structure

Validates the NPM package can be properly packaged:

**Verification Points:**
- Package can be packed without errors (`npm pack --dry-run`)
- Package structure is valid for NPM registry
- All essential files are included in the package

### 4. Version Consistency

Ensures version information is synchronized across all files:

**Verification Points:**
- Package.json and server.json have matching versions
- Version follows semantic versioning format
- MCP name is consistent across configuration files

### 5. Basic Server Functionality

Tests core server operations locally:

**Verification Points:**
- Server starts successfully with expected output patterns
- Server handles shutdown gracefully
- Server listens on specified ports
- Server responds to basic configuration

## Running Verification Tests

### CI-Optimized Verification (Recommended)

The primary verification method, optimized for CI/CD environments:

```bash
npm run test:run
```

This includes the installation verification as part of the complete test suite. The installation tests are located in `src/registry-tests/InstallationMethodVerification.test.ts` and run automatically with all other tests.

**Features:**
- Fast execution (under 4 seconds total)
- No network dependencies
- Reliable in CI environments
- Comprehensive local validation

### Quick Local Verification

For a standalone verification script:

```bash
npm run verify:installation
```

This runs a simplified verification script that tests:
- Required files presence
- Package.json configuration
- Build artifacts validity
- CLI help functionality
- Server startup capability
- NPM package structure

### Comprehensive Testing (Development Only)

For full installation method testing including network operations (not recommended for CI):

```bash
npm run test:installation-verification
```

This runs the complete test suite including:
- NPM package installation from registry
- Docker container testing (if available)
- Source code cloning and building
- Cross-method consistency verification

**Note:** This comprehensive testing is intended for development and manual verification only, as it requires network access and can be slow/unreliable in CI environments.

### Individual Test Categories

You can also run specific test categories:

```bash
# Run only registry tests (includes installation verification)
npm run test:registry

# Run specific installation test
npx vitest run src/registry-tests/InstallationMethodVerification.test.ts

# Run with specific timeout
npx vitest run src/registry-tests/InstallationMethodVerification.test.ts --testTimeout=15000
```

## Verification Results

### Success Criteria

All installation methods should:
- Install/build without errors
- Display consistent help information
- Start the server successfully
- Load tools correctly
- Respond to basic health checks

### Expected Output Patterns

**CLI Help Output:**
- "Financial Modeling Prep MCP Server"
- "--fmp-token" option
- "--port" option
- "--help" option

**Server Startup Output:**
- "MCP Server started successfully"
- Port number information
- Health endpoint availability

### Common Issues and Solutions

#### Missing Dependencies

**Issue:** Node.js, NPM, Docker, or Git not available
**Solution:** Install required dependencies or skip optional tests

#### Network Connectivity

**Issue:** Cannot clone repository or install packages
**Solution:** Check network connection and proxy settings

#### Permission Issues

**Issue:** Cannot write to directories or execute binaries
**Solution:** Check file permissions and user privileges

#### Build Failures

**Issue:** TypeScript compilation or build process fails
**Solution:** Ensure all dependencies are installed and TypeScript is configured correctly

## Integration with CI/CD

The verification process is integrated into the automated testing pipeline and runs as part of the standard test suite:

```yaml
# .github/workflows/release.yml
- name: Run tests
  run: npm run test:run
```

The installation verification tests are included in the main test suite and run automatically. This ensures that:
- All releases are verified before publishing
- Tests run quickly and reliably in CI environments
- No network dependencies cause CI failures
- Installation requirements are validated on every build

For additional verification during the release process, the pipeline also includes:

```yaml
- name: Verify Installation Methods
  run: npm run verify:installation
```

## Verification Configuration

The CI-optimized verification uses reduced timeouts for faster execution:

```bash
# Default timeout for CI operations (10 seconds)
CI_TIMEOUT=10000

# Test timeout for vitest (15 seconds)
--testTimeout=15000
```

For comprehensive testing (development only), you can configure:

```bash
# Timeout for installation operations (default: 120000ms)
INSTALLATION_TIMEOUT=180000

# Timeout for server startup (default: 30000ms)
SERVER_TIMEOUT=45000

# Skip Docker tests
SKIP_DOCKER_TESTS=true
```

## Troubleshooting

### CI Test Failures

The CI-optimized tests should rarely fail, but if they do:

```bash
# Run with increased timeout
npx vitest run src/registry-tests/InstallationMethodVerification.test.ts --testTimeout=30000

# Run with verbose output
npx vitest run src/registry-tests/InstallationMethodVerification.test.ts --reporter=verbose
```

### Local Development Issues

For local development and testing:

```bash
# Ensure project is built
npm run build

# Run quick verification
npm run verify:installation

# Check specific test
npx vitest run src/registry-tests/InstallationMethodVerification.test.ts
```

### Comprehensive Test Issues

If running comprehensive tests (development only):

```bash
# For comprehensive tests with extended timeout
npx vitest run --testTimeout=300000 src/registry-tests/InstallationMethodVerification.test.ts

# For quick verification with custom timeout
INSTALLATION_TIMEOUT=180000 npm run verify:installation
```

### Common Issues

1. **Build artifacts missing**: Run `npm run build` first
2. **Port conflicts**: Tests use different ports (8085, 8086, 8087, 8088) to avoid conflicts
3. **Permission issues**: Ensure proper file permissions for the dist/ directory
4. **Node.js version**: Ensure Node.js >= 25.3.0 is installed

## Maintenance

### Updating Verification Tests

When adding new installation methods or changing server behavior:

1. Update test patterns in `src/registry-tests/InstallationMethodVerification.test.ts`
2. Update verification scripts in `scripts/verify-installation-methods.ts`
3. Update this documentation
4. Test locally with `npm run test:run`
5. Ensure CI compatibility (fast execution, no network dependencies)

### Adding New Verification Points

To add new verification points:

1. Add test cases to `src/registry-tests/InstallationMethodVerification.test.ts`
2. Keep tests CI-friendly (local only, fast execution)
3. Update the verification script if needed
4. Document the new verification points
5. Test with `npm run test:run` to ensure CI compatibility

### CI Optimization Guidelines

When modifying tests, ensure they remain CI-optimized:

- **Fast execution**: Keep total test time under 5 seconds
- **No network dependencies**: Avoid external API calls, git clones, NPM installs
- **Local validation only**: Test local files and functionality
- **Reliable**: Tests should pass consistently in CI environments
- **Focused**: Test essential functionality without redundancy

## Related Documentation

- [Manual Publishing Guide](manual-publishing.md)
- [Automated Publishing Guide](automated-publishing.md)
- [Version Synchronization](version-sync.md)
- [Registry Testing Suite](../src/registry-tests/README.md)