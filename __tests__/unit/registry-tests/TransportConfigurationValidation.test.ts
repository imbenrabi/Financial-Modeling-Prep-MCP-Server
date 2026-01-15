import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { readFile, writeFile, mkdir, rm } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { validateServerJsonSchema } from '../../../src/utils/versionSync.js';

describe('TransportConfigurationValidation', () => {
  let testDir: string;
  
  beforeEach(async () => {
    testDir = join(tmpdir(), `transport-config-test-${Date.now()}`);
    await mkdir(testDir, { recursive: true });
  });
  
  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  /**
   * Creates a base server.json with specified transport configuration.
   * @param transportConfig - Transport configuration to use.
   * @param packageOverrides - Optional package-level overrides.
   */
  async function createServerJsonWithTransport(
    transportConfig: any,
    packageOverrides: any = {}
  ): Promise<void> {
    const serverJson = {
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
          transport: transportConfig,
          ...packageOverrides
        }
      ],
      repository: {
        url: 'https://github.com/imbenrabi/Financial-Modeling-Prep-MCP-Server',
        source: 'github',
      },
      websiteUrl: 'https://github.com/imbenrabi/Financial-Modeling-Prep-MCP-Server'
    };
    
    await writeFile(
      join(testDir, 'server.json'),
      JSON.stringify(serverJson, null, 2),
      'utf-8'
    );
  }

  describe('HTTP Transport Configuration', () => {
    it('should validate streamable-http transport with URL', async () => {
      const transportConfig = {
        type: 'streamable-http',
        url: 'https://financial-modeling-prep-mcp-server-production.up.railway.app/mcp'
      };
      
      await createServerJsonWithTransport(transportConfig);
      
      const result = await validateServerJsonSchema(testDir);
      expect(result.isValid).toBe(true);
      
      const serverJson = JSON.parse(await readFile(join(testDir, 'server.json'), 'utf-8'));
      const transport = serverJson.packages[0].transport;
      
      expect(transport.type).toBe('streamable-http');
      expect(transport.url).toBeDefined();
      expect(transport.url).toMatch(/^https:\/\//);
    });

    it('should validate streamable-http transport with headers', async () => {
      const transportConfig = {
        type: 'streamable-http',
        url: 'https://example.com/mcp',
        headers: [
          {
            name: 'Authorization',
            value: 'Bearer token'
          },
          {
            name: 'Content-Type',
            value: 'application/json'
          }
        ]
      };
      
      await createServerJsonWithTransport(transportConfig);
      
      const serverJson = JSON.parse(await readFile(join(testDir, 'server.json'), 'utf-8'));
      const transport = serverJson.packages[0].transport;
      
      expect(transport.headers).toBeDefined();
      expect(Array.isArray(transport.headers)).toBe(true);
      expect(transport.headers).toHaveLength(2);
      expect(transport.headers[0].name).toBe('Authorization');
      expect(transport.headers[1].name).toBe('Content-Type');
    });

    it('should validate SSE transport configuration', async () => {
      const transportConfig = {
        type: 'sse',
        url: 'https://example.com/sse-endpoint'
      };
      
      await createServerJsonWithTransport(transportConfig);
      
      const serverJson = JSON.parse(await readFile(join(testDir, 'server.json'), 'utf-8'));
      const transport = serverJson.packages[0].transport;
      
      expect(transport.type).toBe('sse');
      expect(transport.url).toBeDefined();
      expect(transport.url).toMatch(/^https:\/\//);
    });

    it('should validate URL format requirements', async () => {
      const validUrls = [
        'https://example.com/mcp',
        'https://api.example.com:8080/mcp',
        'https://subdomain.example.com/path/to/mcp',
        'http://localhost:3000/mcp' // Local development
      ];
      
      for (const url of validUrls) {
        const transportConfig = {
          type: 'streamable-http',
          url
        };
        
        await createServerJsonWithTransport(transportConfig);
        
        const serverJson = JSON.parse(await readFile(join(testDir, 'server.json'), 'utf-8'));
        const transport = serverJson.packages[0].transport;
        
        expect(() => new URL(transport.url)).not.toThrow();
      }
    });
  });

  describe('STDIO Transport Configuration', () => {
    it('should validate stdio transport without URL', async () => {
      const transportConfig = {
        type: 'stdio'
      };
      
      await createServerJsonWithTransport(transportConfig);
      
      const result = await validateServerJsonSchema(testDir);
      expect(result.isValid).toBe(true);
      
      const serverJson = JSON.parse(await readFile(join(testDir, 'server.json'), 'utf-8'));
      const transport = serverJson.packages[0].transport;
      
      expect(transport.type).toBe('stdio');
      expect(transport.url).toBeUndefined();
    });

    it('should validate stdio transport with runtime arguments', async () => {
      const transportConfig = {
        type: 'stdio'
      };
      
      const packageOverrides = {
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
      };
      
      await createServerJsonWithTransport(transportConfig, packageOverrides);
      
      const serverJson = JSON.parse(await readFile(join(testDir, 'server.json'), 'utf-8'));
      const pkg = serverJson.packages[0];
      
      expect(pkg.transport.type).toBe('stdio');
      expect(pkg.packageArguments).toBeDefined();
      expect(pkg.packageArguments).toHaveLength(2);
    });
  });

  describe('Runtime Arguments Validation', () => {
    it('should validate named arguments structure', async () => {
      const transportConfig = { type: 'stdio' };
      const packageOverrides = {
        packageArguments: [
          {
            type: 'named',
            name: '--fmp-token',
            description: 'Financial Modeling Prep API access token',
            isRequired: true,
            format: 'string'
          },
          {
            type: 'named',
            name: '--debug',
            description: 'Enable debug mode',
            isRequired: false,
            format: 'boolean'
          },
          {
            type: 'named',
            name: '--port',
            description: 'Port number',
            isRequired: false,
            format: 'number'
          }
        ]
      };
      
      await createServerJsonWithTransport(transportConfig, packageOverrides);
      
      const serverJson = JSON.parse(await readFile(join(testDir, 'server.json'), 'utf-8'));
      const args = serverJson.packages[0].packageArguments;
      
      expect(args).toHaveLength(3);
      
      const tokenArg = args.find((arg: any) => arg.name === '--fmp-token');
      expect(tokenArg.type).toBe('named');
      expect(tokenArg.isRequired).toBe(true);
      expect(tokenArg.format).toBe('string');
      
      const debugArg = args.find((arg: any) => arg.name === '--debug');
      expect(debugArg.format).toBe('boolean');
      expect(debugArg.isRequired).toBe(false);
      
      const portArg = args.find((arg: any) => arg.name === '--port');
      expect(portArg.format).toBe('number');
    });

    it('should validate positional arguments structure', async () => {
      const transportConfig = { type: 'stdio' };
      const packageOverrides = {
        packageArguments: [
          {
            type: 'positional',
            name: 'config-file',
            description: 'Path to configuration file',
            isRequired: true,
            format: 'string'
          },
          {
            type: 'positional',
            name: 'output-dir',
            description: 'Output directory',
            isRequired: false,
            format: 'string'
          }
        ]
      };
      
      await createServerJsonWithTransport(transportConfig, packageOverrides);
      
      const serverJson = JSON.parse(await readFile(join(testDir, 'server.json'), 'utf-8'));
      const args = serverJson.packages[0].packageArguments;
      
      expect(args).toHaveLength(2);
      
      const configArg = args.find((arg: any) => arg.name === 'config-file');
      expect(configArg.type).toBe('positional');
      expect(configArg.isRequired).toBe(true);
      
      const outputArg = args.find((arg: any) => arg.name === 'output-dir');
      expect(outputArg.type).toBe('positional');
      expect(outputArg.isRequired).toBe(false);
    });

    it('should validate argument format types', async () => {
      const transportConfig = { type: 'stdio' };
      const packageOverrides = {
        packageArguments: [
          {
            type: 'named',
            name: '--string-arg',
            description: 'String argument',
            format: 'string'
          },
          {
            type: 'named',
            name: '--number-arg',
            description: 'Number argument',
            format: 'number'
          },
          {
            type: 'named',
            name: '--boolean-arg',
            description: 'Boolean argument',
            format: 'boolean'
          },
          {
            type: 'named',
            name: '--array-arg',
            description: 'Array argument',
            format: 'array'
          }
        ]
      };
      
      await createServerJsonWithTransport(transportConfig, packageOverrides);
      
      const serverJson = JSON.parse(await readFile(join(testDir, 'server.json'), 'utf-8'));
      const args = serverJson.packages[0].packageArguments;
      
      const formats = args.map((arg: any) => arg.format);
      expect(formats).toContain('string');
      expect(formats).toContain('number');
      expect(formats).toContain('boolean');
      expect(formats).toContain('array');
    });
  });

  describe('Environment Variables Configuration', () => {
    it('should validate environment variables structure', async () => {
      const transportConfig = { type: 'stdio' };
      const packageOverrides = {
        environmentVariables: [
          {
            name: 'FMP_ACCESS_TOKEN',
            description: 'Financial Modeling Prep API access token',
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
          },
          {
            name: 'PORT',
            description: 'Server port number',
            isRequired: false,
            format: 'number',
            isSecret: false
          }
        ]
      };
      
      await createServerJsonWithTransport(transportConfig, packageOverrides);
      
      const serverJson = JSON.parse(await readFile(join(testDir, 'server.json'), 'utf-8'));
      const envVars = serverJson.packages[0].environmentVariables;
      
      expect(envVars).toHaveLength(3);
      
      const tokenVar = envVars.find((env: any) => env.name === 'FMP_ACCESS_TOKEN');
      expect(tokenVar.isRequired).toBe(true);
      expect(tokenVar.isSecret).toBe(true);
      expect(tokenVar.format).toBe('string');
      
      const debugVar = envVars.find((env: any) => env.name === 'DEBUG_MODE');
      expect(debugVar.format).toBe('boolean');
      expect(debugVar.isSecret).toBe(false);
      
      const portVar = envVars.find((env: any) => env.name === 'PORT');
      expect(portVar.format).toBe('number');
    });

    it('should validate secret environment variables', async () => {
      const transportConfig = { type: 'stdio' };
      const packageOverrides = {
        environmentVariables: [
          {
            name: 'API_KEY',
            description: 'Secret API key',
            isSecret: true,
            format: 'string'
          },
          {
            name: 'DATABASE_PASSWORD',
            description: 'Database password',
            isSecret: true,
            format: 'string'
          },
          {
            name: 'PUBLIC_CONFIG',
            description: 'Public configuration',
            isSecret: false,
            format: 'string'
          }
        ]
      };
      
      await createServerJsonWithTransport(transportConfig, packageOverrides);
      
      const serverJson = JSON.parse(await readFile(join(testDir, 'server.json'), 'utf-8'));
      const envVars = serverJson.packages[0].environmentVariables;
      
      const secretVars = envVars.filter((env: any) => env.isSecret === true);
      const publicVars = envVars.filter((env: any) => env.isSecret === false);
      
      expect(secretVars).toHaveLength(2);
      expect(publicVars).toHaveLength(1);
      
      expect(secretVars.map((env: any) => env.name)).toContain('API_KEY');
      expect(secretVars.map((env: any) => env.name)).toContain('DATABASE_PASSWORD');
      expect(publicVars[0].name).toBe('PUBLIC_CONFIG');
    });
  });

  describe('Runtime Hints Validation', () => {
    it('should validate NPX runtime hint', async () => {
      const transportConfig = { type: 'stdio' };
      const packageOverrides = {
        runtimeHint: 'npx'
      };
      
      await createServerJsonWithTransport(transportConfig, packageOverrides);
      
      const serverJson = JSON.parse(await readFile(join(testDir, 'server.json'), 'utf-8'));
      const pkg = serverJson.packages[0];
      
      expect(pkg.runtimeHint).toBe('npx');
    });

    it('should validate UVX runtime hint', async () => {
      const transportConfig = { type: 'stdio' };
      const packageOverrides = {
        registryType: 'pypi',
        runtimeHint: 'uvx'
      };
      
      await createServerJsonWithTransport(transportConfig, packageOverrides);
      
      const serverJson = JSON.parse(await readFile(join(testDir, 'server.json'), 'utf-8'));
      const pkg = serverJson.packages[0];
      
      expect(pkg.runtimeHint).toBe('uvx');
      expect(pkg.registryType).toBe('pypi');
    });

    it('should validate Docker runtime hint', async () => {
      const transportConfig = { type: 'streamable-http', url: 'http://localhost:8080/mcp' };
      const packageOverrides = {
        registryType: 'oci',
        runtimeHint: 'docker'
      };
      
      await createServerJsonWithTransport(transportConfig, packageOverrides);
      
      const serverJson = JSON.parse(await readFile(join(testDir, 'server.json'), 'utf-8'));
      const pkg = serverJson.packages[0];
      
      expect(pkg.runtimeHint).toBe('docker');
      expect(pkg.registryType).toBe('oci');
    });

    it('should validate custom runtime hints', async () => {
      const customHints = ['node', 'python', 'java', 'go'];
      
      for (const hint of customHints) {
        const transportConfig = { type: 'stdio' };
        const packageOverrides = {
          runtimeHint: hint
        };
        
        await createServerJsonWithTransport(transportConfig, packageOverrides);
        
        const serverJson = JSON.parse(await readFile(join(testDir, 'server.json'), 'utf-8'));
        const pkg = serverJson.packages[0];
        
        expect(pkg.runtimeHint).toBe(hint);
      }
    });
  });

  describe('Transport and Arguments Integration', () => {
    it('should validate HTTP transport with runtime arguments', async () => {
      const transportConfig = {
        type: 'streamable-http',
        url: 'https://example.com/mcp'
      };
      
      const packageOverrides = {
        packageArguments: [
          {
            type: 'named',
            name: '--token',
            description: 'API token for authentication',
            isRequired: true,
            format: 'string'
          }
        ],
        environmentVariables: [
          {
            name: 'API_TOKEN',
            description: 'API token from environment',
            isRequired: false,
            format: 'string',
            isSecret: true
          }
        ]
      };
      
      await createServerJsonWithTransport(transportConfig, packageOverrides);
      
      const serverJson = JSON.parse(await readFile(join(testDir, 'server.json'), 'utf-8'));
      const pkg = serverJson.packages[0];
      
      expect(pkg.transport.type).toBe('streamable-http');
      expect(pkg.transport.url).toBeDefined();
      expect(pkg.packageArguments).toHaveLength(1);
      expect(pkg.environmentVariables).toHaveLength(1);
    });

    it('should validate stdio transport with comprehensive configuration', async () => {
      const transportConfig = { type: 'stdio' };
      const packageOverrides = {
        runtimeHint: 'npx',
        packageArguments: [
          {
            type: 'named',
            name: '--fmp-token',
            description: 'FMP API token',
            isRequired: false,
            format: 'string'
          },
          {
            type: 'named',
            name: '--port',
            description: 'HTTP server port',
            isRequired: false,
            format: 'number'
          },
          {
            type: 'named',
            name: '--dynamic-tool-discovery',
            description: 'Enable dynamic tool discovery',
            isRequired: false,
            format: 'boolean'
          },
          {
            type: 'named',
            name: '--fmp-tool-sets',
            description: 'Comma-separated tool sets',
            isRequired: false,
            format: 'string'
          }
        ],
        environmentVariables: [
          {
            name: 'FMP_ACCESS_TOKEN',
            description: 'FMP API access token',
            isRequired: false,
            format: 'string',
            isSecret: true
          },
          {
            name: 'PORT',
            description: 'HTTP server port',
            isRequired: false,
            format: 'number',
            isSecret: false
          },
          {
            name: 'DYNAMIC_TOOL_DISCOVERY',
            description: 'Enable dynamic tool discovery',
            isRequired: false,
            format: 'boolean',
            isSecret: false
          },
          {
            name: 'FMP_TOOL_SETS',
            description: 'Comma-separated tool sets',
            isRequired: false,
            format: 'string',
            isSecret: false
          }
        ]
      };
      
      await createServerJsonWithTransport(transportConfig, packageOverrides);
      
      const result = await validateServerJsonSchema(testDir);
      expect(result.isValid).toBe(true);
      
      const serverJson = JSON.parse(await readFile(join(testDir, 'server.json'), 'utf-8'));
      const pkg = serverJson.packages[0];
      
      expect(pkg.transport.type).toBe('stdio');
      expect(pkg.runtimeHint).toBe('npx');
      expect(pkg.packageArguments).toHaveLength(4);
      expect(pkg.environmentVariables).toHaveLength(4);
      
      // Validate specific arguments match our server's actual configuration
      const tokenArg = pkg.packageArguments.find((arg: any) => arg.name === '--fmp-token');
      expect(tokenArg).toBeDefined();
      
      const portArg = pkg.packageArguments.find((arg: any) => arg.name === '--port');
      expect(portArg).toBeDefined();
      
      const dynamicArg = pkg.packageArguments.find((arg: any) => arg.name === '--dynamic-tool-discovery');
      expect(dynamicArg).toBeDefined();
      
      const toolSetsArg = pkg.packageArguments.find((arg: any) => arg.name === '--fmp-tool-sets');
      expect(toolSetsArg).toBeDefined();
    });
  });

  describe('Multiple Transport Support', () => {
    it('should validate server with both HTTP and stdio transports', async () => {
      const serverJson = {
        $schema: 'https://static.modelcontextprotocol.io/schemas/2025-10-17/server.schema.json',
        name: 'io.github.imbenrabi/financial-modeling-prep-mcp-server',
        description: 'MCP server with multiple transport options',
        version: '2.5.0',
        packages: [
          {
            registryType: 'npm',
            identifier: 'financial-modeling-prep-mcp-server',
            version: '2.5.0',
            runtimeHint: 'npx',
            transport: {
              type: 'streamable-http',
              url: 'https://example.com/mcp'
            }
          }
        ],
        remotes: [
          {
            type: 'streamable-http',
            url: 'https://alternative.example.com/mcp'
          },
          {
            type: 'sse',
            url: 'https://sse.example.com/events'
          }
        ]
      };
      
      await writeFile(
        join(testDir, 'server.json'),
        JSON.stringify(serverJson, null, 2),
        'utf-8'
      );
      
      const result = await validateServerJsonSchema(testDir);
      expect(result.isValid).toBe(true);
      
      const parsedServerJson = JSON.parse(await readFile(join(testDir, 'server.json'), 'utf-8'));
      
      expect(parsedServerJson.packages[0].transport.type).toBe('streamable-http');
      expect(parsedServerJson.remotes).toHaveLength(2);
      expect(parsedServerJson.remotes[0].type).toBe('streamable-http');
      expect(parsedServerJson.remotes[1].type).toBe('sse');
    });
  });

  describe('Transport Configuration Edge Cases', () => {
    it('should handle missing transport configuration', async () => {
      const serverJson = {
        $schema: 'https://static.modelcontextprotocol.io/schemas/2025-10-17/server.schema.json',
        name: 'io.github.imbenrabi/financial-modeling-prep-mcp-server',
        description: 'MCP server without transport',
        version: '2.5.0',
        packages: [
          {
            registryType: 'npm',
            identifier: 'financial-modeling-prep-mcp-server',
            version: '2.5.0'
            // No transport specified
          }
        ]
      };
      
      await writeFile(
        join(testDir, 'server.json'),
        JSON.stringify(serverJson, null, 2),
        'utf-8'
      );
      
      const result = await validateServerJsonSchema(testDir);
      expect(result.isValid).toBe(true); // Transport is optional
    });

    it('should validate empty arguments and environment variables arrays', async () => {
      const transportConfig = { type: 'stdio' };
      const packageOverrides = {
        packageArguments: [],
        environmentVariables: []
      };
      
      await createServerJsonWithTransport(transportConfig, packageOverrides);
      
      const result = await validateServerJsonSchema(testDir);
      expect(result.isValid).toBe(true);
      
      const serverJson = JSON.parse(await readFile(join(testDir, 'server.json'), 'utf-8'));
      const pkg = serverJson.packages[0];
      
      expect(pkg.packageArguments).toHaveLength(0);
      expect(pkg.environmentVariables).toHaveLength(0);
    });
  });
});