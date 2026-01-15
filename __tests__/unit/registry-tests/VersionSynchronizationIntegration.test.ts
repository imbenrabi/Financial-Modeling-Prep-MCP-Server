import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { readFile, writeFile, mkdir, rm } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import {
  validateVersionConsistency,
  synchronizeVersion,
  getVersionInfo,
  validateServerJsonSchema,
  isValidSemVer
} from '../../../src/utils/versionSync.js';

describe('VersionSynchronizationIntegration', () => {
  let testDir: string;
  
  beforeEach(async () => {
    testDir = join(tmpdir(), `version-sync-integration-test-${Date.now()}`);
    await mkdir(testDir, { recursive: true });
  });
  
  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  /**
   * Creates a complete project with all metadata files.
   * @param version - The version to use across all files.
   * @param packageVersion - Optional different version for package.json.
   * @param serverVersion - Optional different version for server.json.
   */
  async function createProjectWithVersions(
    version: string,
    packageVersion?: string,
    serverVersion?: string
  ): Promise<void> {
    const packageJson = {
      name: 'financial-modeling-prep-mcp-server',
      version: packageVersion || version,
      mcpName: 'io.github.imbenrabi/financial-modeling-prep-mcp-server',
      description: 'MCP server for Financial Modeling Prep API',
      main: 'dist/index.js',
      repository: {
        type: 'git',
        url: 'https://github.com/imbenrabi/Financial-Modeling-Prep-MCP-Server'
      }
    };
    
    const serverJson = {
      $schema: 'https://static.modelcontextprotocol.io/schemas/2025-10-17/server.schema.json',
      name: 'io.github.imbenrabi/financial-modeling-prep-mcp-server',
      description: 'MCP server for Financial Modeling Prep API with 250+ financial data tools',
      version: serverVersion || version,
      packages: [
        {
          registryType: 'npm',
          identifier: 'financial-modeling-prep-mcp-server',
          version: serverVersion || version
        }
      ],
      repository: {
        url: 'https://github.com/imbenrabi/Financial-Modeling-Prep-MCP-Server',
        source: 'github'
      }
    };
    
    const changelog = `# Changelog

All notable changes to this project will be documented in this file.

## [${version}] - 2024-01-01

### Added
- Version ${version} release
`;
    
    await writeFile(join(testDir, 'package.json'), JSON.stringify(packageJson, null, 2), 'utf-8');
    await writeFile(join(testDir, 'server.json'), JSON.stringify(serverJson, null, 2), 'utf-8');
    await writeFile(join(testDir, 'CHANGELOG.md'), changelog, 'utf-8');
  }

  describe('Version Consistency Validation', () => {
    it('should validate consistent versions across all files', async () => {
      await createProjectWithVersions('2.5.0');
      
      const result = await validateVersionConsistency(testDir);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect package.json and server.json version mismatch', async () => {
      await createProjectWithVersions('2.5.0', '2.5.0', '2.6.0');
      
      const result = await validateVersionConsistency(testDir);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Version mismatch: package.json (2.5.0) != server.json (2.6.0)'
      );
    });

    it('should detect server.json package version mismatch', async () => {
      await createProjectWithVersions('2.5.0');
      
      // Manually create server.json with mismatched package version
      const serverJson = {
        $schema: 'https://static.modelcontextprotocol.io/schemas/2025-10-17/server.schema.json',
        name: 'io.github.imbenrabi/financial-modeling-prep-mcp-server',
        version: '2.5.0',
        packages: [
          {
            registryType: 'npm',
            identifier: 'financial-modeling-prep-mcp-server',
            version: '2.6.0' // Different from server version
          }
        ]
      };
      
      await writeFile(join(testDir, 'server.json'), JSON.stringify(serverJson, null, 2), 'utf-8');
      
      const result = await validateVersionConsistency(testDir);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'server.json packages[0].version (2.6.0) != server.json.version (2.5.0)'
      );
    });

    it('should warn about changelog version mismatch', async () => {
      await createProjectWithVersions('2.5.0');
      
      // Update changelog with different version
      const changelog = `# Changelog

## [2.6.0] - 2024-01-01

### Added
- Version 2.6.0 release
`;
      
      await writeFile(join(testDir, 'CHANGELOG.md'), changelog, 'utf-8');
      
      const result = await validateVersionConsistency(testDir);
      
      expect(result.warnings).toContain(
        'CHANGELOG.md version (2.6.0) differs from package.json (2.5.0)'
      );
    });

    it('should validate SemVer format compliance', async () => {
      await createProjectWithVersions('invalid-version');
      
      const result = await validateVersionConsistency(testDir);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'package.json version "invalid-version" is not valid SemVer'
      );
      expect(result.errors).toContain(
        'server.json version "invalid-version" is not valid SemVer'
      );
    });
  });

  describe('Version Synchronization Operations', () => {
    it('should synchronize version across all files', async () => {
      await createProjectWithVersions('2.5.0');
      
      const newVersion = '2.6.0';
      const result = await synchronizeVersion(newVersion, testDir);
      
      expect(result.isValid).toBe(true);
      
      // Verify all files updated
      const versionInfo = await getVersionInfo(testDir);
      expect(versionInfo.packageJson).toBe(newVersion);
      expect(versionInfo.serverJson).toBe(newVersion);
      expect(versionInfo.changelog).toBe(newVersion);
    });

    it('should update package versions in server.json', async () => {
      await createProjectWithVersions('2.5.0');
      
      const newVersion = '2.6.0';
      await synchronizeVersion(newVersion, testDir);
      
      const serverJson = JSON.parse(await readFile(join(testDir, 'server.json'), 'utf-8'));
      expect(serverJson.version).toBe(newVersion);
      expect(serverJson.packages[0].version).toBe(newVersion);
    });

    it('should create changelog entry for new version', async () => {
      await createProjectWithVersions('2.5.0');
      
      const newVersion = '2.6.0';
      await synchronizeVersion(newVersion, testDir);
      
      const changelog = await readFile(join(testDir, 'CHANGELOG.md'), 'utf-8');
      expect(changelog).toContain(`## [${newVersion}]`);
      expect(changelog).toContain('Version 2.6.0 release');
    });

    it('should handle dry run mode', async () => {
      await createProjectWithVersions('2.5.0');
      
      const newVersion = '2.6.0';
      const result = await synchronizeVersion(newVersion, testDir, { dryRun: true });
      
      expect(result.warnings).toContain('Dry run mode: no files were actually modified');
      
      // Verify files not actually updated
      const versionInfo = await getVersionInfo(testDir);
      expect(versionInfo.packageJson).toBe('2.5.0');
      expect(versionInfo.serverJson).toBe('2.5.0');
    });

    it('should reject invalid SemVer versions', async () => {
      await createProjectWithVersions('2.5.0');
      
      const invalidVersion = 'not-a-version';
      const result = await synchronizeVersion(invalidVersion, testDir);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(`New version "${invalidVersion}" is not valid SemVer`);
    });

    it('should skip changelog update when requested', async () => {
      await createProjectWithVersions('2.5.0');
      
      const newVersion = '2.6.0';
      await synchronizeVersion(newVersion, testDir, { updateChangelog: false });
      
      const versionInfo = await getVersionInfo(testDir);
      expect(versionInfo.packageJson).toBe(newVersion);
      expect(versionInfo.serverJson).toBe(newVersion);
      expect(versionInfo.changelog).toBe('2.5.0'); // Should remain unchanged
    });
  });

  describe('Multi-Package Server.json Support', () => {
    it('should handle multiple packages in server.json', async () => {
      await createProjectWithVersions('2.5.0');
      
      // Create server.json with multiple packages
      const serverJson = {
        $schema: 'https://static.modelcontextprotocol.io/schemas/2025-10-17/server.schema.json',
        name: 'io.github.imbenrabi/financial-modeling-prep-mcp-server',
        version: '2.5.0',
        packages: [
          {
            registryType: 'npm',
            identifier: 'financial-modeling-prep-mcp-server',
            version: '2.5.0'
          },
          {
            registryType: 'pypi',
            identifier: 'financial-modeling-prep-mcp-server',
            version: '2.5.0'
          }
        ]
      };
      
      await writeFile(join(testDir, 'server.json'), JSON.stringify(serverJson, null, 2), 'utf-8');
      
      const newVersion = '2.6.0';
      await synchronizeVersion(newVersion, testDir);
      
      const updatedServerJson = JSON.parse(await readFile(join(testDir, 'server.json'), 'utf-8'));
      expect(updatedServerJson.version).toBe(newVersion);
      expect(updatedServerJson.packages[0].version).toBe(newVersion);
      expect(updatedServerJson.packages[1].version).toBe(newVersion);
    });

    it('should validate all package versions match server version', async () => {
      await createProjectWithVersions('2.5.0');
      
      // Create server.json with mismatched package versions
      const serverJson = {
        $schema: 'https://static.modelcontextprotocol.io/schemas/2025-10-17/server.schema.json',
        name: 'io.github.imbenrabi/financial-modeling-prep-mcp-server',
        version: '2.5.0',
        packages: [
          {
            registryType: 'npm',
            identifier: 'financial-modeling-prep-mcp-server',
            version: '2.5.0'
          },
          {
            registryType: 'pypi',
            identifier: 'financial-modeling-prep-mcp-server',
            version: '2.4.0' // Different version
          }
        ]
      };
      
      await writeFile(join(testDir, 'server.json'), JSON.stringify(serverJson, null, 2), 'utf-8');
      
      const result = await validateVersionConsistency(testDir);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'server.json packages[1].version (2.4.0) != server.json.version (2.5.0)'
      );
    });
  });

  describe('Schema Validation Integration', () => {
    it('should validate schema after version synchronization', async () => {
      await createProjectWithVersions('2.5.0');
      
      const newVersion = '2.6.0';
      const result = await synchronizeVersion(newVersion, testDir, { validateSchema: true });
      
      expect(result.isValid).toBe(true);
      
      // Separately validate schema
      const schemaResult = await validateServerJsonSchema(testDir);
      expect(schemaResult.isValid).toBe(true);
    });

    it('should detect schema violations during synchronization', async () => {
      await createProjectWithVersions('2.5.0');
      
      // Create invalid server.json (missing required fields)
      const invalidServerJson = {
        name: 'io.github.imbenrabi/financial-modeling-prep-mcp-server',
        version: '2.5.0'
        // Missing required fields like $schema, description
      };
      
      await writeFile(join(testDir, 'server.json'), JSON.stringify(invalidServerJson, null, 2), 'utf-8');
      
      const newVersion = '2.6.0';
      const result = await synchronizeVersion(newVersion, testDir, { validateSchema: true });
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('missing required field'))).toBe(true);
    });

    it('should skip schema validation when requested', async () => {
      await createProjectWithVersions('2.5.0');
      
      const newVersion = '2.6.0';
      const result = await synchronizeVersion(newVersion, testDir, { validateSchema: false });
      
      expect(result.isValid).toBe(true);
      // Should not contain schema validation errors even if schema is invalid
    });
  });

  describe('Version Information Retrieval', () => {
    it('should retrieve version information from all files', async () => {
      const version = '2.5.0';
      await createProjectWithVersions(version);
      
      const versionInfo = await getVersionInfo(testDir);
      
      expect(versionInfo.packageJson).toBe(version);
      expect(versionInfo.serverJson).toBe(version);
      expect(versionInfo.changelog).toBe(version);
    });

    it('should handle missing changelog gracefully', async () => {
      await createProjectWithVersions('2.5.0');
      
      // Remove changelog
      await rm(join(testDir, 'CHANGELOG.md'));
      
      const versionInfo = await getVersionInfo(testDir);
      
      expect(versionInfo.packageJson).toBe('2.5.0');
      expect(versionInfo.serverJson).toBe('2.5.0');
      expect(versionInfo.changelog).toBeUndefined();
    });

    it('should extract version from complex changelog format', async () => {
      await createProjectWithVersions('2.5.0');
      
      // Create complex changelog
      const complexChangelog = `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added
- Future features

## [2.5.0] - 2024-01-01

### Added
- Initial release
- MCP server implementation

### Changed
- Updated dependencies

## [2.4.0] - 2023-12-01

### Added
- Previous version features
`;
      
      await writeFile(join(testDir, 'CHANGELOG.md'), complexChangelog, 'utf-8');
      
      const versionInfo = await getVersionInfo(testDir);
      expect(versionInfo.changelog).toBe('2.5.0');
    });
  });

  describe('SemVer Validation', () => {
    it('should validate standard SemVer versions', () => {
      const validVersions = [
        '1.0.0',
        '2.5.0',
        '10.20.30',
        '1.0.0-alpha',
        '1.0.0-alpha.1',
        '1.0.0-0.3.7',
        '1.0.0-x.7.z.92',
        '1.0.0+20130313144700',
        '1.0.0-beta+exp.sha.5114f85'
      ];
      
      for (const version of validVersions) {
        expect(isValidSemVer(version)).toBe(true);
      }
    });

    it('should reject invalid SemVer versions', () => {
      const invalidVersions = [
        '1',
        '1.2',
        '1.2.3.4',
        'v1.2.3',
        '1.2.3-',
        '1.2.3+',
        '1.2.3-+',
        'invalid',
        '',
        '1.2.3-alpha..1'
      ];
      
      for (const version of invalidVersions) {
        expect(isValidSemVer(version)).toBe(false);
      }
    });
  });

  describe('Error Handling and Recovery', () => {
    it('should handle corrupted package.json', async () => {
      await createProjectWithVersions('2.5.0');
      
      // Corrupt package.json
      await writeFile(join(testDir, 'package.json'), '{ invalid json }', 'utf-8');
      
      const result = await validateVersionConsistency(testDir);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('Failed to validate versions'))).toBe(true);
    });

    it('should handle corrupted server.json', async () => {
      await createProjectWithVersions('2.5.0');
      
      // Corrupt server.json
      await writeFile(join(testDir, 'server.json'), '{ invalid json }', 'utf-8');
      
      const result = await validateVersionConsistency(testDir);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('Failed to validate versions'))).toBe(true);
    });

    it('should handle missing files gracefully', async () => {
      // Only create package.json
      const packageJson = {
        name: 'test-package',
        version: '1.0.0'
      };
      
      await writeFile(join(testDir, 'package.json'), JSON.stringify(packageJson, null, 2), 'utf-8');
      
      const result = await validateVersionConsistency(testDir);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('Failed to validate versions'))).toBe(true);
    });

    it('should provide detailed error messages', async () => {
      await createProjectWithVersions('2.5.0', '2.5.0', '2.6.0');
      
      const result = await validateVersionConsistency(testDir);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Version mismatch: package.json (2.5.0) != server.json (2.6.0)'
      );
    });
  });
});