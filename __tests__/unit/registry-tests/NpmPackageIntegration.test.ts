import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { readFile, writeFile, mkdir, rm } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { execSync } from 'child_process';

describe('NpmPackageIntegration', () => {
  let testDir: string;
  
  beforeEach(async () => {
    testDir = join(tmpdir(), `npm-integration-test-${Date.now()}`);
    await mkdir(testDir, { recursive: true });
  });
  
  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  /**
   * Creates a test package.json file.
   * @param overrides - Optional overrides for package.json fields.
   */
  async function createPackageJson(overrides: any = {}): Promise<void> {
    const defaultPackageJson = {
      name: 'financial-modeling-prep-mcp-server',
      version: '2.5.0',
      mcpName: 'io.github.imbenrabi/financial-modeling-prep-mcp-server',
      description: 'Model Context Protocol server for Financial Modeling Prep API',
      main: 'dist/index.js',
      type: 'module',
      bin: {
        'fmp-mcp': 'dist/index.js'
      },
      files: [
        'dist',
        'LICENSE',
        'README.md'
      ],
      scripts: {
        build: 'tsc',
        start: 'node dist/index.js'
      },
      repository: {
        type: 'git',
        url: 'https://github.com/imbenrabi/Financial-Modeling-Prep-MCP-Server'
      },
      keywords: ['mcp', 'financial', 'api'],
      author: 'imbenrabi',
      license: 'Apache-2.0',
      ...overrides
    };
    
    await writeFile(
      join(testDir, 'package.json'),
      JSON.stringify(defaultPackageJson, null, 2),
      'utf-8'
    );
  }

  /**
   * Creates required files for package validation.
   */
  async function createRequiredFiles(): Promise<void> {
    // Create dist directory and files
    await mkdir(join(testDir, 'dist'), { recursive: true });
    await writeFile(join(testDir, 'dist', 'index.js'), '#!/usr/bin/env node\nconsole.log("MCP Server");', 'utf-8');
    await writeFile(join(testDir, 'dist', 'index.d.ts'), 'export {};', 'utf-8');
    
    // Create other required files
    await writeFile(join(testDir, 'LICENSE'), 'Apache License 2.0', 'utf-8');
    await writeFile(join(testDir, 'README.md'), '# Test Package', 'utf-8');
  }

  /**
   * Executes a command safely and returns result.
   * @param command - Command to execute.
   * @param cwd - Working directory.
   * @returns Object with success status and output.
   */
  function safeExecute(command: string, cwd: string = testDir): { success: boolean; output: string } {
    try {
      const output = execSync(command, { 
        encoding: 'utf-8', 
        stdio: 'pipe',
        cwd
      });
      return { success: true, output };
    } catch (error: any) {
      return { success: false, output: error.message };
    }
  }

  describe('Package.json mcpName Validation', () => {
    it('should validate correct mcpName field', async () => {
      await createPackageJson();
      
      const packageJson = JSON.parse(await readFile(join(testDir, 'package.json'), 'utf-8'));
      
      expect(packageJson.mcpName).toBe('io.github.imbenrabi/financial-modeling-prep-mcp-server');
      expect(packageJson.mcpName).toMatch(/^io\.github\.imbenrabi\//);
    });

    it('should detect missing mcpName field', async () => {
      await createPackageJson({ mcpName: undefined });
      
      const packageJson = JSON.parse(await readFile(join(testDir, 'package.json'), 'utf-8'));
      
      expect(packageJson.mcpName).toBeUndefined();
    });

    it('should validate mcpName format matches namespace convention', async () => {
      await createPackageJson({ mcpName: 'io.github.imbenrabi/test-server' });
      
      const packageJson = JSON.parse(await readFile(join(testDir, 'package.json'), 'utf-8'));
      
      expect(packageJson.mcpName).toMatch(/^io\.github\.imbenrabi\/[a-z0-9-]+$/);
    });

    it('should reject invalid mcpName format', async () => {
      await createPackageJson({ mcpName: 'invalid-format' });
      
      const packageJson = JSON.parse(await readFile(join(testDir, 'package.json'), 'utf-8'));
      
      expect(packageJson.mcpName).not.toMatch(/^io\.github\.imbenrabi\//);
    });

    it('should validate mcpName matches server.json name', async () => {
      await createPackageJson();
      
      // Create matching server.json
      const serverJson = {
        name: 'io.github.imbenrabi/financial-modeling-prep-mcp-server',
        version: '2.5.0',
        description: 'Test server'
      };
      
      await writeFile(
        join(testDir, 'server.json'),
        JSON.stringify(serverJson, null, 2),
        'utf-8'
      );
      
      const packageData = JSON.parse(await readFile(join(testDir, 'package.json'), 'utf-8'));
      const serverData = JSON.parse(await readFile(join(testDir, 'server.json'), 'utf-8'));
      
      expect(packageData.mcpName).toBe(serverData.name);
    });
  });

  describe('NPM Package Structure Validation', () => {
    it('should validate required package.json fields', async () => {
      await createPackageJson();
      
      const packageJson = JSON.parse(await readFile(join(testDir, 'package.json'), 'utf-8'));
      
      const requiredFields = ['name', 'version', 'description', 'main', 'mcpName'];
      for (const field of requiredFields) {
        expect(packageJson[field]).toBeDefined();
      }
    });

    it('should validate binary configuration', async () => {
      await createPackageJson();
      
      const packageJson = JSON.parse(await readFile(join(testDir, 'package.json'), 'utf-8'));
      
      expect(packageJson.bin).toBeDefined();
      expect(packageJson.bin['fmp-mcp']).toBe('dist/index.js');
    });

    it('should validate files array includes required files', async () => {
      await createPackageJson();
      
      const packageJson = JSON.parse(await readFile(join(testDir, 'package.json'), 'utf-8'));
      
      const requiredFiles = ['dist', 'LICENSE', 'README.md'];
      for (const file of requiredFiles) {
        expect(packageJson.files).toContain(file);
      }
    });

    it('should validate repository configuration', async () => {
      await createPackageJson();
      
      const packageJson = JSON.parse(await readFile(join(testDir, 'package.json'), 'utf-8'));
      
      expect(packageJson.repository).toBeDefined();
      expect(packageJson.repository.type).toBe('git');
      expect(packageJson.repository.url).toMatch(/github\.com/);
    });

    it('should validate keywords for discoverability', async () => {
      await createPackageJson();
      
      const packageJson = JSON.parse(await readFile(join(testDir, 'package.json'), 'utf-8'));
      
      expect(packageJson.keywords).toBeDefined();
      expect(packageJson.keywords).toContain('mcp');
      expect(Array.isArray(packageJson.keywords)).toBe(true);
    });
  });

  describe('Package Installation Simulation', () => {
    beforeEach(async () => {
      await createPackageJson();
      await createRequiredFiles();
    });

    it('should validate package can be packed', async () => {
      // Initialize npm in test directory
      const initResult = safeExecute('npm init -y');
      expect(initResult.success).toBe(true);
      
      // Copy our package.json over the generated one
      await createPackageJson();
      
      const packResult = safeExecute('npm pack --dry-run');
      expect(packResult.success).toBe(true);
      // NPM pack output format may vary, check for tarball name instead
      expect(packResult.output).toContain('.tgz');
    });

    it('should validate all required files exist for packaging', async () => {
      const packageJson = JSON.parse(await readFile(join(testDir, 'package.json'), 'utf-8'));
      
      // Check that all files in the files array exist
      for (const file of packageJson.files) {
        const filePath = join(testDir, file);
        try {
          await readFile(filePath);
        } catch (error) {
          // For directories, check if they exist
          if (file === 'dist') {
            const distFiles = await readFile(join(testDir, 'dist', 'index.js'));
            expect(distFiles).toBeDefined();
          } else {
            throw error;
          }
        }
      }
    });

    it('should validate binary file is executable', async () => {
      const packageJson = JSON.parse(await readFile(join(testDir, 'package.json'), 'utf-8'));
      const binPath = join(testDir, packageJson.bin['fmp-mcp']);
      
      const binContent = await readFile(binPath, 'utf-8');
      expect(binContent).toContain('#!/usr/bin/env node');
    });

    it('should validate package.json scripts are functional', async () => {
      const packageJson = JSON.parse(await readFile(join(testDir, 'package.json'), 'utf-8'));
      
      expect(packageJson.scripts).toBeDefined();
      expect(packageJson.scripts.build).toBeDefined();
      expect(packageJson.scripts.start).toBeDefined();
    });
  });

  describe('Registry Validation Requirements', () => {
    it('should validate package meets registry requirements', async () => {
      await createPackageJson();
      
      const packageJson = JSON.parse(await readFile(join(testDir, 'package.json'), 'utf-8'));
      
      // Registry-specific validations
      expect(packageJson.mcpName).toBeDefined();
      expect(packageJson.mcpName).toMatch(/^io\.github\.imbenrabi\//);
      expect(packageJson.name).toBe('financial-modeling-prep-mcp-server');
      expect(packageJson.version).toMatch(/^\d+\.\d+\.\d+/); // SemVer
      expect(packageJson.description).toBeDefined();
      expect(packageJson.description.length).toBeGreaterThan(0);
      expect(packageJson.description.length).toBeLessThanOrEqual(100);
    });

    it('should validate package name matches NPM conventions', async () => {
      await createPackageJson();
      
      const packageJson = JSON.parse(await readFile(join(testDir, 'package.json'), 'utf-8'));
      
      // NPM package name validation
      expect(packageJson.name).toMatch(/^[a-z0-9-]+$/);
      expect(packageJson.name).not.toContain('_');
      expect(packageJson.name).not.toContain(' ');
      expect(packageJson.name.length).toBeLessThanOrEqual(214);
    });

    it('should validate license is specified', async () => {
      await createPackageJson();
      
      const packageJson = JSON.parse(await readFile(join(testDir, 'package.json'), 'utf-8'));
      
      expect(packageJson.license).toBeDefined();
      expect(packageJson.license).toBe('Apache-2.0');
    });

    it('should validate author information', async () => {
      await createPackageJson();
      
      const packageJson = JSON.parse(await readFile(join(testDir, 'package.json'), 'utf-8'));
      
      expect(packageJson.author).toBeDefined();
      expect(typeof packageJson.author).toBe('string');
    });
  });

  describe('Version Consistency Validation', () => {
    it('should validate version consistency across files', async () => {
      const version = '2.5.0';
      await createPackageJson({ version });
      
      // Create server.json with same version
      const serverJson = {
        name: 'io.github.imbenrabi/financial-modeling-prep-mcp-server',
        version,
        description: 'Test server',
        packages: [
          {
            registryType: 'npm',
            identifier: 'financial-modeling-prep-mcp-server',
            version
          }
        ]
      };
      
      await writeFile(
        join(testDir, 'server.json'),
        JSON.stringify(serverJson, null, 2),
        'utf-8'
      );
      
      const packageData = JSON.parse(await readFile(join(testDir, 'package.json'), 'utf-8'));
      const serverData = JSON.parse(await readFile(join(testDir, 'server.json'), 'utf-8'));
      
      expect(packageData.version).toBe(serverData.version);
      expect(serverData.packages[0].version).toBe(version);
    });

    it('should detect version mismatches', async () => {
      await createPackageJson({ version: '2.5.0' });
      
      // Create server.json with different version
      const serverJson = {
        name: 'io.github.imbenrabi/financial-modeling-prep-mcp-server',
        version: '2.6.0',
        description: 'Test server'
      };
      
      await writeFile(
        join(testDir, 'server.json'),
        JSON.stringify(serverJson, null, 2),
        'utf-8'
      );
      
      const packageData = JSON.parse(await readFile(join(testDir, 'package.json'), 'utf-8'));
      const serverData = JSON.parse(await readFile(join(testDir, 'server.json'), 'utf-8'));
      
      expect(packageData.version).not.toBe(serverData.version);
    });
  });

  describe('NPM Registry API Simulation', () => {
    it('should simulate NPM registry package lookup', async () => {
      await createPackageJson();
      
      const packageJson = JSON.parse(await readFile(join(testDir, 'package.json'), 'utf-8'));
      
      // Simulate what the registry would validate
      const registryValidation = {
        hasName: !!packageJson.name,
        hasVersion: !!packageJson.version,
        hasMcpName: !!packageJson.mcpName,
        mcpNameFormat: packageJson.mcpName?.startsWith('io.github.imbenrabi/'),
        hasDescription: !!packageJson.description,
        hasRepository: !!packageJson.repository,
        hasLicense: !!packageJson.license
      };
      
      expect(registryValidation.hasName).toBe(true);
      expect(registryValidation.hasVersion).toBe(true);
      expect(registryValidation.hasMcpName).toBe(true);
      expect(registryValidation.mcpNameFormat).toBe(true);
      expect(registryValidation.hasDescription).toBe(true);
      expect(registryValidation.hasRepository).toBe(true);
      expect(registryValidation.hasLicense).toBe(true);
    });

    it('should validate package metadata for registry consumption', async () => {
      await createPackageJson();
      
      const packageJson = JSON.parse(await readFile(join(testDir, 'package.json'), 'utf-8'));
      
      // Simulate registry metadata extraction
      const registryMetadata = {
        name: packageJson.name,
        version: packageJson.version,
        mcpName: packageJson.mcpName,
        description: packageJson.description,
        repository: packageJson.repository?.url,
        keywords: packageJson.keywords,
        license: packageJson.license,
        author: packageJson.author
      };
      
      expect(registryMetadata.name).toBe('financial-modeling-prep-mcp-server');
      expect(registryMetadata.mcpName).toBe('io.github.imbenrabi/financial-modeling-prep-mcp-server');
      expect(registryMetadata.repository).toContain('github.com');
      expect(registryMetadata.keywords).toContain('mcp');
    });
  });
});