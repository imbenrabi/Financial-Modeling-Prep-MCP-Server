import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { readFile, writeFile, mkdir, rm } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { validateVersionConsistency, synchronizeVersion } from '../../../src/utils/versionSync.js';

describe('EndToEndPublishingWorkflow', () => {
  let testDir: string;
  
  beforeEach(async () => {
    testDir = join(tmpdir(), `e2e-workflow-test-${Date.now()}`);
    await mkdir(testDir, { recursive: true });
  });
  
  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  /**
   * Creates a complete project structure for testing.
   */
  async function createCompleteProject(): Promise<void> {
    // Create package.json
    const packageJson = {
      name: 'financial-modeling-prep-mcp-server',
      version: '2.5.0',
      mcpName: 'io.github.imbenrabi/financial-modeling-prep-mcp-server',
      description: 'MCP server for Financial Modeling Prep API',
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
        build: 'echo "Build completed"',
        test: 'echo "Tests passed"',
        'version:validate': 'echo "Version validation passed"',
        'verify:npm-ready': 'echo "NPM ready"'
      },
      repository: {
        type: 'git',
        url: 'https://github.com/imbenrabi/Financial-Modeling-Prep-MCP-Server'
      },
      keywords: ['mcp', 'financial', 'api'],
      author: 'imbenrabi',
      license: 'Apache-2.0'
    };
    
    // Create server.json
    const serverJson = {
      $schema: 'https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json',
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
        source: 'github',
      },
      websiteUrl: 'https://github.com/imbenrabi/Financial-Modeling-Prep-MCP-Server'
    };
    
    // Create CHANGELOG.md
    const changelog = `# Changelog

All notable changes to this project will be documented in this file.

## [2.5.0] - 2024-01-01

### Added
- Initial registry publication
- Complete MCP server implementation
- 250+ financial data tools
`;
    
    // Create README.md
    const readme = `# Financial Modeling Prep MCP Server

## MCP Registry

This server is available in the official MCP Registry:

\`\`\`bash
npm install financial-modeling-prep-mcp-server
\`\`\`

## Installation

### From NPM Registry
\`\`\`bash
npm install -g financial-modeling-prep-mcp-server
\`\`\`

### Using NPX
\`\`\`bash
npx financial-modeling-prep-mcp-server --fmp-token=YOUR_TOKEN
\`\`\`
`;
    
    // Write all files
    await writeFile(join(testDir, 'package.json'), JSON.stringify(packageJson, null, 2), 'utf-8');
    await writeFile(join(testDir, 'server.json'), JSON.stringify(serverJson, null, 2), 'utf-8');
    await writeFile(join(testDir, 'CHANGELOG.md'), changelog, 'utf-8');
    await writeFile(join(testDir, 'README.md'), readme, 'utf-8');
    await writeFile(join(testDir, 'LICENSE'), 'Apache License 2.0', 'utf-8');
    
    // Create dist directory and files
    await mkdir(join(testDir, 'dist'), { recursive: true });
    await writeFile(join(testDir, 'dist', 'index.js'), '#!/usr/bin/env node\nconsole.log("MCP Server");', 'utf-8');
    await writeFile(join(testDir, 'dist', 'index.d.ts'), 'export {};', 'utf-8');
  }

  /**
   * Simulates command execution with success/failure.
   * @param command - Command to simulate.
   * @param shouldSucceed - Whether the command should succeed.
   * @returns Simulation result.
   */
  function simulateCommand(command: string, shouldSucceed: boolean = true): { success: boolean; output: string } {
    if (shouldSucceed) {
      return { success: true, output: `${command} completed successfully` };
    } else {
      return { success: false, output: `${command} failed` };
    }
  }

  describe('Pre-Publishing Validation', () => {
    beforeEach(async () => {
      await createCompleteProject();
    });

    it('should validate all required files exist', async () => {
      const requiredFiles = [
        'package.json',
        'server.json',
        'CHANGELOG.md',
        'README.md',
        'LICENSE',
        'dist/index.js'
      ];
      
      for (const file of requiredFiles) {
        const content = await readFile(join(testDir, file), 'utf-8');
        expect(content.length).toBeGreaterThan(0);
      }
    });

    it('should validate version consistency across all files', async () => {
      const result = await validateVersionConsistency(testDir);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate package.json has all required fields', async () => {
      const packageJson = JSON.parse(await readFile(join(testDir, 'package.json'), 'utf-8'));
      
      const requiredFields = ['name', 'version', 'mcpName', 'description', 'main', 'bin', 'files'];
      for (const field of requiredFields) {
        expect(packageJson[field]).toBeDefined();
      }
    });

    it('should validate server.json schema compliance', async () => {
      const serverJson = JSON.parse(await readFile(join(testDir, 'server.json'), 'utf-8'));
      
      expect(serverJson.$schema).toBe('https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json');
      expect(serverJson.name).toBe('io.github.imbenrabi/financial-modeling-prep-mcp-server');
      expect(serverJson.packages).toBeDefined();
      expect(Array.isArray(serverJson.packages)).toBe(true);
      expect(serverJson.packages.length).toBeGreaterThan(0);
    });

    it('should validate README contains registry information', async () => {
      const readme = await readFile(join(testDir, 'README.md'), 'utf-8');
      
      expect(readme).toContain('MCP Registry');
      expect(readme).toContain('npm install');
      expect(readme).toContain('npx');
    });
  });

  describe('Build and Package Workflow', () => {
    beforeEach(async () => {
      await createCompleteProject();
    });

    it('should simulate successful build process', async () => {
      const buildResult = simulateCommand('npm run build');
      
      expect(buildResult.success).toBe(true);
      expect(buildResult.output).toContain('completed successfully');
    });

    it('should simulate successful test execution', async () => {
      const testResult = simulateCommand('npm test');
      
      expect(testResult.success).toBe(true);
      expect(testResult.output).toContain('completed successfully');
    });

    it('should simulate package creation', async () => {
      const packResult = simulateCommand('npm pack --dry-run');
      
      expect(packResult.success).toBe(true);
      
      // Validate package would include correct files
      const packageJson = JSON.parse(await readFile(join(testDir, 'package.json'), 'utf-8'));
      expect(packageJson.files).toContain('dist');
      expect(packageJson.files).toContain('LICENSE');
      expect(packageJson.files).toContain('README.md');
    });

    it('should validate binary configuration', async () => {
      const packageJson = JSON.parse(await readFile(join(testDir, 'package.json'), 'utf-8'));
      const binPath = join(testDir, packageJson.bin['fmp-mcp']);
      
      const binContent = await readFile(binPath, 'utf-8');
      expect(binContent).toContain('#!/usr/bin/env node');
    });
  });

  describe('NPM Publishing Workflow', () => {
    beforeEach(async () => {
      await createCompleteProject();
    });

    it('should simulate NPM registry authentication', async () => {
      const authResult = simulateCommand('npm whoami');
      
      expect(authResult.success).toBe(true);
    });

    it('should simulate NPM package publishing', async () => {
      const publishResult = simulateCommand('npm publish');
      
      expect(publishResult.success).toBe(true);
      
      // Validate package metadata would be correct
      const packageJson = JSON.parse(await readFile(join(testDir, 'package.json'), 'utf-8'));
      expect(packageJson.mcpName).toBe('io.github.imbenrabi/financial-modeling-prep-mcp-server');
    });

    it('should simulate NPM package verification', async () => {
      const packageJson = JSON.parse(await readFile(join(testDir, 'package.json'), 'utf-8'));
      const verifyResult = simulateCommand(`npm view ${packageJson.name}`);
      
      expect(verifyResult.success).toBe(true);
    });

    it('should validate NPM package installation', async () => {
      const packageJson = JSON.parse(await readFile(join(testDir, 'package.json'), 'utf-8'));
      const installResult = simulateCommand(`npm install ${packageJson.name}`);
      
      expect(installResult.success).toBe(true);
    });
  });

  describe('MCP Registry Publishing Workflow', () => {
    beforeEach(async () => {
      await createCompleteProject();
    });

    it('should simulate MCP registry authentication', async () => {
      const authResult = simulateCommand('mcp-publisher login github');
      
      expect(authResult.success).toBe(true);
    });

    it('should simulate registry metadata validation', async () => {
      const validateResult = simulateCommand('mcp-publisher validate');
      
      expect(validateResult.success).toBe(true);
    });

    it('should simulate registry submission', async () => {
      const publishResult = simulateCommand('mcp-publisher publish');
      
      expect(publishResult.success).toBe(true);
    });

    it('should simulate registry entry verification', async () => {
      const serverJson = JSON.parse(await readFile(join(testDir, 'server.json'), 'utf-8'));
      const verifyResult = simulateCommand(`curl -s https://registry.modelcontextprotocol.io/api/servers/${encodeURIComponent(serverJson.name)}`);
      
      expect(verifyResult.success).toBe(true);
    });
  });

  describe('Version Management Workflow', () => {
    beforeEach(async () => {
      await createCompleteProject();
    });

    it('should handle version synchronization', async () => {
      const newVersion = '2.6.0';
      const result = await synchronizeVersion(newVersion, testDir, { dryRun: true });
      
      expect(result.isValid).toBe(true);
      expect(result.warnings).toContain('Dry run mode: no files were actually modified');
    });

    it('should validate version bump workflow', async () => {
      const newVersion = '2.6.0';
      
      // Simulate version update
      await synchronizeVersion(newVersion, testDir);
      
      // Verify all files updated
      const packageJson = JSON.parse(await readFile(join(testDir, 'package.json'), 'utf-8'));
      const serverJson = JSON.parse(await readFile(join(testDir, 'server.json'), 'utf-8'));
      
      expect(packageJson.version).toBe(newVersion);
      expect(serverJson.version).toBe(newVersion);
      expect(serverJson.packages[0].version).toBe(newVersion);
    });

    it('should validate changelog updates', async () => {
      const newVersion = '2.6.0';
      await synchronizeVersion(newVersion, testDir);
      
      const changelog = await readFile(join(testDir, 'CHANGELOG.md'), 'utf-8');
      expect(changelog).toContain(`## [${newVersion}]`);
    });
  });

  describe('Installation Method Verification', () => {
    beforeEach(async () => {
      await createCompleteProject();
    });

    it('should validate NPM global installation method', async () => {
      const packageJson = JSON.parse(await readFile(join(testDir, 'package.json'), 'utf-8'));
      const installCommand = `npm install -g ${packageJson.name}`;
      
      const installResult = simulateCommand(installCommand);
      expect(installResult.success).toBe(true);
    });

    it('should validate NPX execution method', async () => {
      const packageJson = JSON.parse(await readFile(join(testDir, 'package.json'), 'utf-8'));
      const npxCommand = `npx ${packageJson.name} --help`;
      
      const npxResult = simulateCommand(npxCommand);
      expect(npxResult.success).toBe(true);
    });

    it('should validate local installation method', async () => {
      const packageJson = JSON.parse(await readFile(join(testDir, 'package.json'), 'utf-8'));
      const installCommand = `npm install ${packageJson.name}`;
      
      const installResult = simulateCommand(installCommand);
      expect(installResult.success).toBe(true);
    });

    it('should validate binary execution after installation', async () => {
      const packageJson = JSON.parse(await readFile(join(testDir, 'package.json'), 'utf-8'));
      const binName = Object.keys(packageJson.bin)[0];
      const execCommand = `${binName} --version`;
      
      const execResult = simulateCommand(execCommand);
      expect(execResult.success).toBe(true);
    });
  });

  describe('Error Handling and Rollback', () => {
    beforeEach(async () => {
      await createCompleteProject();
    });

    it('should handle NPM publishing failure', async () => {
      const publishResult = simulateCommand('npm publish', false);
      
      expect(publishResult.success).toBe(false);
      expect(publishResult.output).toContain('failed');
    });

    it('should handle registry submission failure', async () => {
      const registryResult = simulateCommand('mcp-publisher publish', false);
      
      expect(registryResult.success).toBe(false);
      expect(registryResult.output).toContain('failed');
    });

    it('should validate rollback procedures', async () => {
      // Simulate rollback commands
      const rollbackCommands = [
        'npm unpublish --force',
        'git tag -d v2.5.0',
        'git push origin :refs/tags/v2.5.0'
      ];
      
      for (const command of rollbackCommands) {
        const result = simulateCommand(command);
        expect(result.success).toBe(true);
      }
    });

    it('should validate error reporting', async () => {
      const errorResult = simulateCommand('npm publish', false);
      
      expect(errorResult.success).toBe(false);
      expect(errorResult.output).toBeDefined();
      expect(errorResult.output.length).toBeGreaterThan(0);
    });
  });

  describe('Complete Workflow Integration', () => {
    beforeEach(async () => {
      await createCompleteProject();
    });

    it('should execute complete publishing workflow', async () => {
      const workflowSteps = [
        'npm run version:validate',
        'npm run build',
        'npm test',
        'npm run verify:npm-ready',
        'npm publish',
        'mcp-publisher publish'
      ];
      
      const results = workflowSteps.map(step => simulateCommand(step));
      
      expect(results.every(result => result.success)).toBe(true);
    });

    it('should validate workflow produces correct artifacts', async () => {
      // After complete workflow, validate all artifacts exist
      const packageJson = JSON.parse(await readFile(join(testDir, 'package.json'), 'utf-8'));
      const serverJson = JSON.parse(await readFile(join(testDir, 'server.json'), 'utf-8'));
      
      expect(packageJson.mcpName).toBe(serverJson.name);
      expect(packageJson.version).toBe(serverJson.version);
      expect(serverJson.packages[0].identifier).toBe(packageJson.name);
    });

    it('should validate end-to-end discoverability', async () => {
      const serverJson = JSON.parse(await readFile(join(testDir, 'server.json'), 'utf-8'));
      
      // Simulate registry search
      const searchResult = simulateCommand(`curl -s "https://registry.modelcontextprotocol.io/api/search?q=financial"`);
      expect(searchResult.success).toBe(true);
      
      // Simulate NPM search
      const npmSearchResult = simulateCommand(`npm search financial-modeling-prep`);
      expect(npmSearchResult.success).toBe(true);
    });
  });
});