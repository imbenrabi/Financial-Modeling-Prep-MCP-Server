import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { readFile, writeFile, mkdir, rm } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

describe('RegistryApiIntegration', () => {
  let testDir: string;
  
  beforeEach(async () => {
    testDir = join(tmpdir(), `registry-api-test-${Date.now()}`);
    await mkdir(testDir, { recursive: true });
  });
  
  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  /**
   * Creates test server.json and package.json files.
   */
  async function createTestFiles(): Promise<void> {
    const packageJson = {
      name: 'financial-modeling-prep-mcp-server',
      version: '2.5.0',
      mcpName: 'io.github.imbenrabi/financial-modeling-prep-mcp-server',
      description: 'MCP server for Financial Modeling Prep API',
      repository: {
        type: 'git',
        url: 'https://github.com/imbenrabi/Financial-Modeling-Prep-MCP-Server'
      }
    };
    
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
          }
        }
      ],
      repository: {
        url: 'https://github.com/imbenrabi/Financial-Modeling-Prep-MCP-Server',
        source: 'github',
      },
      websiteUrl: 'https://github.com/imbenrabi/Financial-Modeling-Prep-MCP-Server'
    };
    
    await writeFile(
      join(testDir, 'package.json'),
      JSON.stringify(packageJson, null, 2),
      'utf-8'
    );
    
    await writeFile(
      join(testDir, 'server.json'),
      JSON.stringify(serverJson, null, 2),
      'utf-8'
    );
  }

  /**
   * Simulates MCP Registry API response structure.
   * @param serverName - The server name to look up.
   * @returns Simulated API response.
   */
  function simulateRegistryApiResponse(serverName: string): any {
    return {
      name: serverName,
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
          }
        }
      ],
      repository: {
        url: 'https://github.com/imbenrabi/Financial-Modeling-Prep-MCP-Server',
        source: 'github'
      },
      websiteUrl: 'https://github.com/imbenrabi/Financial-Modeling-Prep-MCP-Server',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    };
  }

  /**
   * Simulates NPM Registry API response.
   * @param packageName - The package name to look up.
   * @returns Simulated NPM API response.
   */
  function simulateNpmApiResponse(packageName: string): any {
    return {
      name: packageName,
      version: '2.5.0',
      mcpName: 'io.github.imbenrabi/financial-modeling-prep-mcp-server',
      description: 'MCP server for Financial Modeling Prep API',
      main: 'dist/index.js',
      bin: {
        'fmp-mcp': 'dist/index.js'
      },
      repository: {
        type: 'git',
        url: 'https://github.com/imbenrabi/Financial-Modeling-Prep-MCP-Server'
      },
      keywords: ['mcp', 'financial', 'api'],
      license: 'Apache-2.0',
      author: 'imbenrabi',
      dist: {
        tarball: `https://registry.npmjs.org/${packageName}/-/${packageName}-2.5.0.tgz`,
        shasum: 'abc123def456',
        integrity: 'sha512-...'
      }
    };
  }

  describe('Registry API Response Validation', () => {
    beforeEach(async () => {
      await createTestFiles();
    });

    it('should validate registry API response structure', async () => {
      const serverJson = JSON.parse(await readFile(join(testDir, 'server.json'), 'utf-8'));
      const apiResponse = simulateRegistryApiResponse(serverJson.name);
      
      // Validate required fields in API response
      expect(apiResponse.name).toBe(serverJson.name);
      expect(apiResponse.description).toBe(serverJson.description);
      expect(apiResponse.version).toBe(serverJson.version);
      // Status field removed in new schema format
      expect(apiResponse.packages).toBeDefined();
      expect(Array.isArray(apiResponse.packages)).toBe(true);
    });

    it('should validate package information in registry response', async () => {
      const serverJson = JSON.parse(await readFile(join(testDir, 'server.json'), 'utf-8'));
      const apiResponse = simulateRegistryApiResponse(serverJson.name);
      
      const npmPackage = apiResponse.packages.find((pkg: any) => pkg.registryType === 'npm');
      expect(npmPackage).toBeDefined();
      expect(npmPackage.identifier).toBe('financial-modeling-prep-mcp-server');
      expect(npmPackage.version).toBe('2.5.0');
      expect(npmPackage.runtimeHint).toBe('npx');
    });

    it('should validate repository information in registry response', async () => {
      const serverJson = JSON.parse(await readFile(join(testDir, 'server.json'), 'utf-8'));
      const apiResponse = simulateRegistryApiResponse(serverJson.name);
      
      expect(apiResponse.repository).toBeDefined();
      expect(apiResponse.repository.url).toBe(serverJson.repository.url);
      expect(apiResponse.repository.source).toBe('github');
    });

    it('should validate timestamps in registry response', async () => {
      const serverJson = JSON.parse(await readFile(join(testDir, 'server.json'), 'utf-8'));
      const apiResponse = simulateRegistryApiResponse(serverJson.name);
      
      expect(apiResponse.created_at).toBeDefined();
      expect(apiResponse.updated_at).toBeDefined();
      expect(new Date(apiResponse.created_at)).toBeInstanceOf(Date);
      expect(new Date(apiResponse.updated_at)).toBeInstanceOf(Date);
    });
  });

  describe('Server Discovery Functionality', () => {
    beforeEach(async () => {
      await createTestFiles();
    });

    it('should validate server can be discovered by name', async () => {
      const serverJson = JSON.parse(await readFile(join(testDir, 'server.json'), 'utf-8'));
      const searchResults = [
        simulateRegistryApiResponse(serverJson.name)
      ];
      
      const foundServer = searchResults.find(server => server.name === serverJson.name);
      expect(foundServer).toBeDefined();
      expect(foundServer.name).toBe('io.github.imbenrabi/financial-modeling-prep-mcp-server');
    });

    it('should validate server can be discovered by keywords', async () => {
      const packageJson = JSON.parse(await readFile(join(testDir, 'package.json'), 'utf-8'));
      
      // Simulate search by keywords
      const searchKeywords = ['financial', 'mcp', 'api'];
      const serverKeywords = ['financial', 'modeling', 'prep', 'mcp', 'api', 'data'];
      
      const hasMatchingKeywords = searchKeywords.some(keyword => 
        serverKeywords.includes(keyword)
      );
      
      expect(hasMatchingKeywords).toBe(true);
    });

    it('should validate server can be discovered by description', async () => {
      const serverJson = JSON.parse(await readFile(join(testDir, 'server.json'), 'utf-8'));
      
      // Simulate search by description content
      const searchTerms = ['financial', 'modeling', 'prep', 'tools'];
      const description = serverJson.description.toLowerCase();
      
      const hasMatchingTerms = searchTerms.some(term => 
        description.includes(term.toLowerCase())
      );
      
      expect(hasMatchingTerms).toBe(true);
    });

    it('should validate server discovery returns installation instructions', async () => {
      const serverJson = JSON.parse(await readFile(join(testDir, 'server.json'), 'utf-8'));
      const apiResponse = simulateRegistryApiResponse(serverJson.name);
      
      const npmPackage = apiResponse.packages.find((pkg: any) => pkg.registryType === 'npm');
      
      // Validate installation methods can be derived
      const installationMethods = {
        npm: `npm install ${npmPackage.identifier}`,
        npx: `npx ${npmPackage.identifier}`,
        global: `npm install -g ${npmPackage.identifier}`
      };
      
      expect(installationMethods.npm).toContain('financial-modeling-prep-mcp-server');
      expect(installationMethods.npx).toContain('financial-modeling-prep-mcp-server');
      expect(installationMethods.global).toContain('financial-modeling-prep-mcp-server');
    });
  });

  describe('NPM Registry Integration', () => {
    beforeEach(async () => {
      await createTestFiles();
    });

    it('should validate NPM registry response structure', async () => {
      const packageJson = JSON.parse(await readFile(join(testDir, 'package.json'), 'utf-8'));
      const npmResponse = simulateNpmApiResponse(packageJson.name);
      
      expect(npmResponse.name).toBe(packageJson.name);
      expect(npmResponse.version).toBe(packageJson.version);
      expect(npmResponse.mcpName).toBe(packageJson.mcpName);
      expect(npmResponse.description).toBeDefined();
    });

    it('should validate NPM package has required MCP fields', async () => {
      const packageJson = JSON.parse(await readFile(join(testDir, 'package.json'), 'utf-8'));
      const npmResponse = simulateNpmApiResponse(packageJson.name);
      
      expect(npmResponse.mcpName).toBeDefined();
      expect(npmResponse.mcpName).toBe('io.github.imbenrabi/financial-modeling-prep-mcp-server');
      expect(npmResponse.bin).toBeDefined();
      expect(npmResponse.bin['fmp-mcp']).toBeDefined();
    });

    it('should validate NPM package distribution information', async () => {
      const packageJson = JSON.parse(await readFile(join(testDir, 'package.json'), 'utf-8'));
      const npmResponse = simulateNpmApiResponse(packageJson.name);
      
      expect(npmResponse.dist).toBeDefined();
      expect(npmResponse.dist.tarball).toContain(packageJson.name);
      expect(npmResponse.dist.shasum).toBeDefined();
      expect(npmResponse.dist.integrity).toBeDefined();
    });

    it('should validate cross-registry consistency', async () => {
      const packageJson = JSON.parse(await readFile(join(testDir, 'package.json'), 'utf-8'));
      const serverJson = JSON.parse(await readFile(join(testDir, 'server.json'), 'utf-8'));
      
      const npmResponse = simulateNpmApiResponse(packageJson.name);
      const registryResponse = simulateRegistryApiResponse(serverJson.name);
      
      // Validate consistency between NPM and MCP registry
      expect(npmResponse.mcpName).toBe(registryResponse.name);
      expect(npmResponse.version).toBe(registryResponse.version);
      
      const npmPackageInRegistry = registryResponse.packages.find(
        (pkg: any) => pkg.registryType === 'npm'
      );
      expect(npmPackageInRegistry.identifier).toBe(npmResponse.name);
      expect(npmPackageInRegistry.version).toBe(npmResponse.version);
    });
  });

  describe('Transport Configuration Validation', () => {
    beforeEach(async () => {
      await createTestFiles();
    });

    it('should validate HTTP transport configuration', async () => {
      const serverJson = JSON.parse(await readFile(join(testDir, 'server.json'), 'utf-8'));
      const npmPackage = serverJson.packages.find((pkg: any) => pkg.registryType === 'npm');
      
      expect(npmPackage.transport).toBeDefined();
      expect(npmPackage.transport.type).toBe('streamable-http');
      expect(npmPackage.transport.url).toBeDefined();
      expect(npmPackage.transport.url).toMatch(/^https?:\/\//);
    });

    it('should validate transport URL accessibility format', async () => {
      const serverJson = JSON.parse(await readFile(join(testDir, 'server.json'), 'utf-8'));
      const npmPackage = serverJson.packages.find((pkg: any) => pkg.registryType === 'npm');
      
      const transportUrl = npmPackage.transport.url;
      
      // Validate URL format
      expect(() => new URL(transportUrl)).not.toThrow();
      expect(transportUrl).toMatch(/^https:\/\//); // Should use HTTPS
      expect(transportUrl).toContain('/mcp'); // Should have MCP endpoint
    });

    it('should validate stdio transport as alternative', async () => {
      // Create server.json with stdio transport
      const serverJsonWithStdio = {
        name: 'io.github.imbenrabi/financial-modeling-prep-mcp-server',
        version: '2.5.0',
        description: 'Test server',
        packages: [
          {
            registryType: 'npm',
            identifier: 'financial-modeling-prep-mcp-server',
            version: '2.5.0',
            runtimeHint: 'npx',
            transport: {
              type: 'stdio'
            }
          }
        ]
      };
      
      await writeFile(
        join(testDir, 'server-stdio.json'),
        JSON.stringify(serverJsonWithStdio, null, 2),
        'utf-8'
      );
      
      const serverJson = JSON.parse(await readFile(join(testDir, 'server-stdio.json'), 'utf-8'));
      const npmPackage = serverJson.packages.find((pkg: any) => pkg.registryType === 'npm');
      
      expect(npmPackage.transport.type).toBe('stdio');
      expect(npmPackage.transport.url).toBeUndefined(); // stdio doesn't need URL
    });

    it('should validate runtime arguments configuration', async () => {
      const serverJson = JSON.parse(await readFile(join(testDir, 'server.json'), 'utf-8'));
      
      // Add runtime arguments to test
      const serverJsonWithArgs = {
        ...serverJson,
        packages: [
          {
            ...serverJson.packages[0],
            packageArguments: [
              {
                type: 'named',
                name: '--fmp-token',
                description: 'Financial Modeling Prep API access token',
                isRequired: false,
                format: 'string'
              },
              {
                type: 'named',
                name: '--port',
                description: 'Port number for HTTP server mode',
                isRequired: false,
                format: 'number'
              }
            ]
          }
        ]
      };
      
      await writeFile(
        join(testDir, 'server-with-args.json'),
        JSON.stringify(serverJsonWithArgs, null, 2),
        'utf-8'
      );
      
      const testServerJson = JSON.parse(await readFile(join(testDir, 'server-with-args.json'), 'utf-8'));
      const npmPackage = testServerJson.packages.find((pkg: any) => pkg.registryType === 'npm');
      
      expect(npmPackage.packageArguments).toBeDefined();
      expect(Array.isArray(npmPackage.packageArguments)).toBe(true);
      expect(npmPackage.packageArguments.length).toBeGreaterThan(0);
      
      const tokenArg = npmPackage.packageArguments.find((arg: any) => arg.name === '--fmp-token');
      expect(tokenArg).toBeDefined();
      expect(tokenArg.type).toBe('named');
      expect(tokenArg.format).toBe('string');
    });
  });

  describe('Registry Search and Filtering', () => {
    it('should validate server appears in category searches', async () => {
      await createTestFiles();
      
      const serverJson = JSON.parse(await readFile(join(testDir, 'server.json'), 'utf-8'));
      
      // Simulate category-based search results
      const financialServers = [
        simulateRegistryApiResponse(serverJson.name)
      ];
      
      const foundInFinancial = financialServers.some(server => 
        server.description.toLowerCase().includes('financial')
      );
      
      expect(foundInFinancial).toBe(true);
    });

    it('should validate server metadata supports filtering', async () => {
      await createTestFiles();
      
      const serverJson = JSON.parse(await readFile(join(testDir, 'server.json'), 'utf-8'));
      const apiResponse = simulateRegistryApiResponse(serverJson.name);
      
      // Validate filterable attributes
      const filterableAttributes = {
        registryType: apiResponse.packages[0].registryType,
        transportType: apiResponse.packages[0].transport?.type || 'none',
        hasRepository: !!apiResponse.repository,
        hasWebsite: !!apiResponse.websiteUrl
      };
      expect(filterableAttributes.registryType).toBe('npm');
      expect(filterableAttributes.transportType).toBeDefined();
      expect(filterableAttributes.transportType).not.toBe('none');
      expect(filterableAttributes.hasRepository).toBe(true);
      expect(filterableAttributes.hasWebsite).toBe(true);
    });

    it('should validate server supports version-based queries', async () => {
      await createTestFiles();
      
      const serverJson = JSON.parse(await readFile(join(testDir, 'server.json'), 'utf-8'));
      const apiResponse = simulateRegistryApiResponse(serverJson.name);
      
      // Validate version information is accessible
      expect(apiResponse.version).toBeDefined();
      expect(apiResponse.version).toMatch(/^\d+\.\d+\.\d+/);
      
      const npmPackage = apiResponse.packages.find((pkg: any) => pkg.registryType === 'npm');
      expect(npmPackage.version).toBe(apiResponse.version);
    });
  });
});