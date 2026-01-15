import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { readFile, writeFile, mkdir, rm } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { validateServerJsonSchema } from '../../../src/utils/versionSync.js';

describe('ServerJsonSchemaValidation', () => {
  let testDir: string;
  
  beforeEach(async () => {
    testDir = join(tmpdir(), `server-json-test-${Date.now()}`);
    await mkdir(testDir, { recursive: true });
  });
  
  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  /**
   * Creates a valid server.json file for testing.
   * @param overrides - Optional overrides for server.json fields.
   */
  async function createServerJson(overrides: any = {}): Promise<void> {
    const defaultServerJson = {
      $schema: 'https://static.modelcontextprotocol.io/schemas/2025-10-17/server.schema.json',
      name: 'io.github.imbenrabi/financial-modeling-prep-mcp-server',
      description: 'MCP server for Financial Modeling Prep API with 250+ financial data tools',
      version: '2.5.0',
      packages: [
        {
          registryType: 'npm',
          registryBaseUrl: 'https://registry.npmjs.org',
          identifier: 'financial-modeling-prep-mcp-server',
          version: '2.5.0',
          runtimeHint: 'npx',
          transport: {
            type: 'streamable-http',
            url: 'https://financial-modeling-prep-mcp-server-production.up.railway.app/mcp'
          },
          packageArguments: [
            {
              type: 'named',
              name: '--fmp-token',
              description: 'Financial Modeling Prep API access token',
              isRequired: false,
              format: 'string'
            }
          ],
          environmentVariables: [
            {
              name: 'FMP_ACCESS_TOKEN',
              description: 'Financial Modeling Prep API access token',
              isRequired: false,
              format: 'string',
              isSecret: true
            }
          ]
        }
      ],
      repository: {
        url: 'https://github.com/imbenrabi/Financial-Modeling-Prep-MCP-Server',
        source: 'github'
      },
      websiteUrl: 'https://github.com/imbenrabi/Financial-Modeling-Prep-MCP-Server',
      ...overrides
    };
    
    await writeFile(
      join(testDir, 'server.json'),
      JSON.stringify(defaultServerJson, null, 2),
      'utf-8'
    );
  }

  describe('Official Schema Compliance', () => {
    it('should validate a complete valid server.json', async () => {
      await createServerJson();
      
      const result = await validateServerJsonSchema(testDir);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should require $schema field', async () => {
      await createServerJson({ $schema: undefined });
      
      const result = await validateServerJsonSchema(testDir);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('server.json missing required field: $schema');
    });

    it('should require name field', async () => {
      await createServerJson({ name: undefined });
      
      const result = await validateServerJsonSchema(testDir);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('server.json missing required field: name');
    });

    it('should require description field', async () => {
      await createServerJson({ description: undefined });
      
      const result = await validateServerJsonSchema(testDir);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('server.json missing required field: description');
    });

    it('should require version field', async () => {
      await createServerJson({ version: undefined });
      
      const result = await validateServerJsonSchema(testDir);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('server.json missing required field: version');
    });

    it('should validate description length (1-100 characters)', async () => {
      await createServerJson({ description: '' });
      
      const result = await validateServerJsonSchema(testDir);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('server.json description must be 1-100 characters, got 0');
    });

    it('should reject description longer than 100 characters', async () => {
      const longDescription = 'a'.repeat(101);
      await createServerJson({ description: longDescription });
      
      const result = await validateServerJsonSchema(testDir);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('server.json description must be 1-100 characters, got 101');
    });

    it('should warn about non-standard schema URL', async () => {
      await createServerJson({ 
        $schema: 'https://example.com/custom-schema.json' 
      });
      
      const result = await validateServerJsonSchema(testDir);
      
      expect(result.errors).toContain(
        'server.json uses schema: https://example.com/custom-schema.json, expected: https://static.modelcontextprotocol.io/schemas/2025-10-17/server.schema.json'
      );
    });

    it('should warn about name without namespace', async () => {
      await createServerJson({ name: 'simple-server-name' });
      
      const result = await validateServerJsonSchema(testDir);
      
      expect(result.warnings).toContain(
        'server.json name should include namespace (e.g., "namespace/server-name")'
      );
    });

    it('should validate SemVer version format', async () => {
      await createServerJson({ version: 'invalid-version' });
      
      const result = await validateServerJsonSchema(testDir);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('server.json version "invalid-version" is not valid SemVer');
    });
  });

  describe('Packages Array Validation', () => {
    it('should validate NPM package configuration', async () => {
      await createServerJson({
        packages: [
          {
            registryType: 'npm',
            identifier: 'test-package',
            version: '1.0.0'
          }
        ]
      });
      
      const result = await validateServerJsonSchema(testDir);
      
      expect(result.isValid).toBe(true);
    });

    it('should require registryType in packages', async () => {
      await createServerJson({
        packages: [
          {
            identifier: 'test-package',
            version: '1.0.0'
          }
        ]
      });
      
      const result = await validateServerJsonSchema(testDir);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('server.json packages[0] missing registryType');
    });

    it('should require identifier in packages', async () => {
      await createServerJson({
        packages: [
          {
            registryType: 'npm',
            version: '1.0.0'
          }
        ]
      });
      
      const result = await validateServerJsonSchema(testDir);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('server.json packages[0] missing identifier');
    });

    it('should require version in packages', async () => {
      await createServerJson({
        packages: [
          {
            registryType: 'npm',
            identifier: 'test-package'
          }
        ]
      });
      
      const result = await validateServerJsonSchema(testDir);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('server.json packages[0] missing version');
    });

    it('should validate package version SemVer format', async () => {
      await createServerJson({
        packages: [
          {
            registryType: 'npm',
            identifier: 'test-package',
            version: 'invalid'
          }
        ]
      });
      
      const result = await validateServerJsonSchema(testDir);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('server.json packages[0].version "invalid" is not valid SemVer');
    });

    it('should validate multiple packages', async () => {
      await createServerJson({
        packages: [
          {
            registryType: 'npm',
            identifier: 'test-package-1',
            version: '1.0.0'
          },
          {
            registryType: 'pypi',
            identifier: 'test-package-2',
            version: '2.0.0'
          }
        ]
      });
      
      const result = await validateServerJsonSchema(testDir);
      
      expect(result.isValid).toBe(true);
    });
  });

  describe('Repository Validation', () => {
    it('should validate complete repository configuration', async () => {
      await createServerJson({
        repository: {
          url: 'https://github.com/user/repo',
          source: 'github',
        }
      });
      
      const result = await validateServerJsonSchema(testDir);
      
      expect(result.isValid).toBe(true);
    });

    it('should require repository url', async () => {
      await createServerJson({
        repository: {
          source: 'github'
        }
      });
      
      const result = await validateServerJsonSchema(testDir);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('server.json repository missing url field');
    });

    it('should require repository source', async () => {
      await createServerJson({
        repository: {
          url: 'https://github.com/user/repo'
        }
      });
      
      const result = await validateServerJsonSchema(testDir);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('server.json repository missing source field');
    });

    it('should allow repository to be optional', async () => {
      await createServerJson({ repository: undefined });
      
      const result = await validateServerJsonSchema(testDir);
      
      expect(result.isValid).toBe(true);
    });
  });

  describe('Transport Configuration Validation', () => {
    it('should validate streamable-http transport', async () => {
      await createServerJson({
        packages: [
          {
            registryType: 'npm',
            identifier: 'test-package',
            version: '1.0.0',
            transport: {
              type: 'streamable-http',
              url: 'https://example.com/mcp'
            }
          }
        ]
      });
      
      const result = await validateServerJsonSchema(testDir);
      
      expect(result.isValid).toBe(true);
    });

    it('should validate stdio transport', async () => {
      await createServerJson({
        packages: [
          {
            registryType: 'npm',
            identifier: 'test-package',
            version: '1.0.0',
            transport: {
              type: 'stdio'
            }
          }
        ]
      });
      
      const result = await validateServerJsonSchema(testDir);
      
      expect(result.isValid).toBe(true);
    });

    it('should validate sse transport', async () => {
      await createServerJson({
        packages: [
          {
            registryType: 'npm',
            identifier: 'test-package',
            version: '1.0.0',
            transport: {
              type: 'sse',
              url: 'https://example.com/sse'
            }
          }
        ]
      });
      
      const result = await validateServerJsonSchema(testDir);
      
      expect(result.isValid).toBe(true);
    });
  });

  describe('Runtime Arguments Validation', () => {
    it('should validate package arguments structure', async () => {
      await createServerJson({
        packages: [
          {
            registryType: 'npm',
            identifier: 'test-package',
            version: '1.0.0',
            packageArguments: [
              {
                type: 'named',
                name: '--token',
                description: 'API token',
                isRequired: true,
                format: 'string'
              },
              {
                type: 'positional',
                name: 'input-file',
                description: 'Input file path',
                isRequired: false,
                format: 'string'
              }
            ]
          }
        ]
      });
      
      const result = await validateServerJsonSchema(testDir);
      
      expect(result.isValid).toBe(true);
    });

    it('should validate environment variables structure', async () => {
      await createServerJson({
        packages: [
          {
            registryType: 'npm',
            identifier: 'test-package',
            version: '1.0.0',
            environmentVariables: [
              {
                name: 'API_TOKEN',
                description: 'API access token',
                isRequired: true,
                format: 'string',
                isSecret: true
              },
              {
                name: 'DEBUG_MODE',
                description: 'Enable debug logging',
                isRequired: false,
                format: 'boolean',
                isSecret: false
              }
            ]
          }
        ]
      });
      
      const result = await validateServerJsonSchema(testDir);
      
      expect(result.isValid).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle missing server.json file', async () => {
      // Don't create server.json file
      
      const result = await validateServerJsonSchema(testDir);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('Failed to validate server.json schema'))).toBe(true);
    });

    it('should handle invalid JSON', async () => {
      await writeFile(
        join(testDir, 'server.json'),
        '{ invalid json }',
        'utf-8'
      );
      
      const result = await validateServerJsonSchema(testDir);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('Failed to validate server.json schema'))).toBe(true);
    });
  });
});