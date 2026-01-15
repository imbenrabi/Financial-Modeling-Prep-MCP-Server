import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { readFile, writeFile, mkdir, rm } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import {
  isValidSemVer,
  getVersionInfo,
  validateVersionConsistency,
  validateServerJsonSchema,
  synchronizeVersion,
  getCurrentVersion
} from '../../../src/utils/versionSync.js';

describe('versionSync', () => {
  let testDir: string;
  
  beforeEach(async () => {
    // Create a temporary directory for testing
    testDir = join(tmpdir(), `version-sync-test-${Date.now()}`);
    await mkdir(testDir, { recursive: true });
  });
  
  afterEach(async () => {
    // Clean up test directory
    await rm(testDir, { recursive: true, force: true });
  });

  /**
   * Creates a test package.json file.
   * @param version - The version to set in package.json.
   * @param mcpName - Optional mcpName field.
   */
  async function createTestPackageJson(version: string, mcpName?: string): Promise<void> {
    const packageJson = {
      name: 'test-package',
      version,
      description: 'Test package',
      ...(mcpName && { mcpName })
    };
    
    await writeFile(
      join(testDir, 'package.json'),
      JSON.stringify(packageJson, null, 2),
      'utf-8'
    );
  }

  /**
   * Creates a test server.json file.
   * @param version - The version to set in server.json.
   * @param packageVersion - Optional different version for packages array.
   */
  async function createTestServerJson(version: string, packageVersion?: string): Promise<void> {
    const serverJson = {
      $schema: 'https://static.modelcontextprotocol.io/schemas/2025-10-17/server.schema.json',
      name: 'test/server',
      description: 'Test server description',
      version,
      packages: [
        {
          registryType: 'npm',
          identifier: 'test-package',
          version: packageVersion || version
        }
      ],
      repository: {
        url: 'https://github.com/test/repo',
        source: 'github'
      }
    };
    
    await writeFile(
      join(testDir, 'server.json'),
      JSON.stringify(serverJson, null, 2),
      'utf-8'
    );
  }

  /**
   * Creates a test CHANGELOG.md file.
   * @param version - The version to include in the changelog.
   */
  async function createTestChangelog(version: string): Promise<void> {
    const changelog = `# Changelog

## [${version}] - 2024-01-01

### Added
- Initial release
`;
    
    await writeFile(join(testDir, 'CHANGELOG.md'), changelog, 'utf-8');
  }

  describe('isValidSemVer', () => {
    it('should validate correct SemVer versions', () => {
      expect(isValidSemVer('1.0.0')).toBe(true);
      expect(isValidSemVer('2.4.0')).toBe(true);
      expect(isValidSemVer('1.0.0-alpha')).toBe(true);
      expect(isValidSemVer('1.0.0-alpha.1')).toBe(true);
      expect(isValidSemVer('1.0.0+build.1')).toBe(true);
      expect(isValidSemVer('1.0.0-alpha.1+build.1')).toBe(true);
    });

    it('should reject invalid SemVer versions', () => {
      expect(isValidSemVer('1.0')).toBe(false);
      expect(isValidSemVer('1')).toBe(false);
      expect(isValidSemVer('v1.0.0')).toBe(false);
      expect(isValidSemVer('1.0.0.0')).toBe(false);
      expect(isValidSemVer('invalid')).toBe(false);
      expect(isValidSemVer('')).toBe(false);
    });
  });

  describe('getVersionInfo', () => {
    it('should read version information from all files', async () => {
      await createTestPackageJson('1.0.0');
      await createTestServerJson('1.0.0');
      await createTestChangelog('1.0.0');

      const versionInfo = await getVersionInfo(testDir);

      expect(versionInfo.packageJson).toBe('1.0.0');
      expect(versionInfo.serverJson).toBe('1.0.0');
      expect(versionInfo.changelog).toBe('1.0.0');
    });

    it('should handle missing CHANGELOG.md', async () => {
      await createTestPackageJson('1.0.0');
      await createTestServerJson('1.0.0');

      const versionInfo = await getVersionInfo(testDir);

      expect(versionInfo.packageJson).toBe('1.0.0');
      expect(versionInfo.serverJson).toBe('1.0.0');
      expect(versionInfo.changelog).toBeUndefined();
    });
  });

  describe('validateVersionConsistency', () => {
    it('should pass validation when all versions match', async () => {
      await createTestPackageJson('1.0.0');
      await createTestServerJson('1.0.0');
      await createTestChangelog('1.0.0');

      const result = await validateVersionConsistency(testDir);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail validation when versions mismatch', async () => {
      await createTestPackageJson('1.0.0');
      await createTestServerJson('1.1.0');

      const result = await validateVersionConsistency(testDir);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Version mismatch: package.json (1.0.0) != server.json (1.1.0)'
      );
    });

    it('should fail validation for invalid SemVer', async () => {
      await createTestPackageJson('invalid');
      await createTestServerJson('1.0.0');

      const result = await validateVersionConsistency(testDir);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'package.json version "invalid" is not valid SemVer'
      );
    });

    it('should detect package version mismatch in server.json', async () => {
      await createTestPackageJson('1.0.0');
      await createTestServerJson('1.0.0', '1.1.0'); // Different package version

      const result = await validateVersionConsistency(testDir);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'server.json packages[0].version (1.1.0) != server.json.version (1.0.0)'
      );
    });
  });

  describe('validateServerJsonSchema', () => {
    it('should pass validation for valid server.json', async () => {
      await createTestServerJson('1.0.0');

      const result = await validateServerJsonSchema(testDir);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail validation for missing required fields', async () => {
      const invalidServerJson = {
        name: 'test/server'
        // Missing required fields
      };
      
      await writeFile(
        join(testDir, 'server.json'),
        JSON.stringify(invalidServerJson, null, 2),
        'utf-8'
      );

      const result = await validateServerJsonSchema(testDir);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('server.json missing required field: $schema');
      expect(result.errors).toContain('server.json missing required field: description');
      expect(result.errors).toContain('server.json missing required field: version');
    });

    it('should fail validation for description length', async () => {
      const serverJson = {
        $schema: 'https://static.modelcontextprotocol.io/schemas/2025-10-17/server.schema.json',
        name: 'test/server',
        description: 'a'.repeat(101), // Too long
        version: '1.0.0'
      };
      
      await writeFile(
        join(testDir, 'server.json'),
        JSON.stringify(serverJson, null, 2),
        'utf-8'
      );

      const result = await validateServerJsonSchema(testDir);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'server.json description must be 1-100 characters, got 101'
      );
    });
  });

  describe('synchronizeVersion', () => {
    it('should synchronize version across all files', async () => {
      await createTestPackageJson('1.0.0');
      await createTestServerJson('1.0.0');

      const result = await synchronizeVersion('2.0.0', testDir);

      expect(result.isValid).toBe(true);

      // Verify files were updated
      const versionInfo = await getVersionInfo(testDir);
      expect(versionInfo.packageJson).toBe('2.0.0');
      expect(versionInfo.serverJson).toBe('2.0.0');
      expect(versionInfo.changelog).toBe('2.0.0');
    });

    it('should handle dry run mode', async () => {
      await createTestPackageJson('1.0.0');
      await createTestServerJson('1.0.0');

      const result = await synchronizeVersion('2.0.0', testDir, { dryRun: true });

      expect(result.warnings).toContain('Dry run mode: no files were actually modified');

      // Verify files were not updated
      const versionInfo = await getVersionInfo(testDir);
      expect(versionInfo.packageJson).toBe('1.0.0');
      expect(versionInfo.serverJson).toBe('1.0.0');
    });

    it('should reject invalid SemVer versions', async () => {
      await createTestPackageJson('1.0.0');
      await createTestServerJson('1.0.0');

      const result = await synchronizeVersion('invalid', testDir);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('New version "invalid" is not valid SemVer');
    });

    it('should skip changelog update when requested', async () => {
      await createTestPackageJson('1.0.0');
      await createTestServerJson('1.0.0');

      const result = await synchronizeVersion('2.0.0', testDir, { updateChangelog: false });

      expect(result.isValid).toBe(true);

      // Verify changelog was not created
      const versionInfo = await getVersionInfo(testDir);
      expect(versionInfo.changelog).toBeUndefined();
    });
  });

  describe('getCurrentVersion', () => {
    it('should return current version from package.json', async () => {
      await createTestPackageJson('1.2.3');

      const version = await getCurrentVersion(testDir);

      expect(version).toBe('1.2.3');
    });
  });
});