/**
 * Registry Test Configuration
 *
 * Test suite metadata, constants, and utilities for registry publishing tests.
 */

// Re-export test utilities from version sync for use in registry tests
export {
  validateVersionConsistency,
  validateServerJsonSchema,
  synchronizeVersion,
  getVersionInfo,
  isValidSemVer,
  getCurrentVersion,
  type VersionInfo,
  type ValidationResult,
  type SyncOptions
} from '../../../src/utils/versionSync.js';

/**
 * Test suite definitions and metadata.
 */
export const REGISTRY_TEST_SUITES = {
  ServerJsonSchemaValidation: {
    description: 'Tests server.json schema compliance against official MCP schema',
    testFile: 'ServerJsonSchemaValidation.test.ts',
    coverage: [
      'Official schema compliance',
      'Required field validation',
      'Package array validation',
      'Repository configuration',
      'Transport configuration',
      'Runtime arguments structure',
      'Error handling'
    ]
  },

  NpmPackageIntegration: {
    description: 'Tests NPM package installation and mcpName validation',
    testFile: 'NpmPackageIntegration.test.ts',
    coverage: [
      'Package.json mcpName validation',
      'NPM package structure validation',
      'Package installation simulation',
      'Registry validation requirements',
      'Version consistency validation',
      'NPM registry API simulation'
    ]
  },

  RegistryApiIntegration: {
    description: 'Tests registry API responses and server discovery functionality',
    testFile: 'RegistryApiIntegration.test.ts',
    coverage: [
      'Registry API response validation',
      'Server discovery functionality',
      'NPM registry integration',
      'Transport configuration validation',
      'Registry search and filtering'
    ]
  },

  EndToEndPublishingWorkflow: {
    description: 'Tests complete publishing workflow from validation to registry submission',
    testFile: 'EndToEndPublishingWorkflow.test.ts',
    coverage: [
      'Pre-publishing validation',
      'Build and package workflow',
      'NPM publishing workflow',
      'MCP registry publishing workflow',
      'Version management workflow',
      'Installation method verification',
      'Error handling and rollback',
      'Complete workflow integration'
    ]
  },

  VersionSynchronizationIntegration: {
    description: 'Tests version synchronization utilities across all metadata files',
    testFile: 'VersionSynchronizationIntegration.test.ts',
    coverage: [
      'Version consistency validation',
      'Version synchronization operations',
      'Multi-package server.json support',
      'Schema validation integration',
      'Version information retrieval',
      'SemVer validation',
      'Error handling and recovery'
    ]
  },

  TransportConfigurationValidation: {
    description: 'Tests transport configuration and runtime arguments',
    testFile: 'TransportConfigurationValidation.test.ts',
    coverage: [
      'HTTP transport configuration',
      'STDIO transport configuration',
      'Runtime arguments validation',
      'Environment variables configuration',
      'Runtime hints validation',
      'Transport and arguments integration',
      'Multiple transport support',
      'Edge cases handling'
    ]
  },

  InstallationMethodVerification: {
    description: 'Tests all installation methods work correctly',
    testFile: 'InstallationMethodVerification.test.ts',
    coverage: [
      'NPM package installation',
      'Docker container execution',
      'Source code installation and build',
      'CLI entrypoint functionality',
      'Server startup verification',
      'Tool loading verification',
      'Installation method consistency',
      'Version consistency across methods'
    ]
  }
} as const;

/**
 * Registry test configuration and utilities.
 */
export const REGISTRY_TEST_CONFIG = {
  /**
   * Test data directory for temporary files.
   */
  TEST_DATA_DIR: 'registry-tests',

  /**
   * Default server.json schema URL for testing.
   */
  DEFAULT_SCHEMA_URL: 'https://static.modelcontextprotocol.io/schemas/2025-10-17/server.schema.json',

  /**
   * Default MCP name for testing.
   */
  DEFAULT_MCP_NAME: 'io.github.imbenrabi/financial-modeling-prep-mcp-server',

  /**
   * Default NPM package name for testing.
   */
  DEFAULT_NPM_PACKAGE: 'financial-modeling-prep-mcp-server',

  /**
   * Default test version.
   */
  DEFAULT_VERSION: '2.5.0',

  /**
   * Required files for NPM package validation.
   */
  REQUIRED_FILES: [
    'package.json',
    'server.json',
    'CHANGELOG.md',
    'README.md',
    'LICENSE',
    'dist/index.js'
  ] as const,

  /**
   * Required package.json fields for registry validation.
   */
  REQUIRED_PACKAGE_FIELDS: [
    'name',
    'version',
    'mcpName',
    'description',
    'main',
    'bin',
    'files'
  ] as const,

  /**
   * Required server.json fields for schema validation.
   */
  REQUIRED_SERVER_FIELDS: [
    '$schema',
    'name',
    'description',
    'version'
  ] as const,

  /**
   * Supported transport types.
   */
  TRANSPORT_TYPES: [
    'stdio',
    'streamable-http',
    'sse'
  ] as const,

  /**
   * Supported runtime hints.
   */
  RUNTIME_HINTS: [
    'npx',
    'uvx',
    'docker',
    'node',
    'python',
    'java',
    'go'
  ] as const,

  /**
   * Supported argument formats.
   */
  ARGUMENT_FORMATS: [
    'string',
    'number',
    'boolean',
    'array'
  ] as const
} as const;

/**
 * Utility functions for registry testing.
 */
export const REGISTRY_TEST_UTILS = {
  /**
   * Validates if a string is a valid MCP name format.
   * @param mcpName - The MCP name to validate.
   * @returns True if valid, false otherwise.
   */
  isValidMcpName: (mcpName: string): boolean => {
    return mcpName.startsWith('io.github.imbenrabi/') &&
           /^io\.github\.imbenrabi\/[a-z0-9-]+$/.test(mcpName);
  },

  /**
   * Validates if a URL is a valid transport URL.
   * @param url - The URL to validate.
   * @returns True if valid, false otherwise.
   */
  isValidTransportUrl: (url: string): boolean => {
    try {
      const parsedUrl = new URL(url);
      return ['http:', 'https:'].includes(parsedUrl.protocol);
    } catch {
      return false;
    }
  },

  /**
   * Validates if a transport type is supported.
   * @param transportType - The transport type to validate.
   * @returns True if supported, false otherwise.
   */
  isValidTransportType: (transportType: string): boolean => {
    return REGISTRY_TEST_CONFIG.TRANSPORT_TYPES.includes(transportType as any);
  },

  /**
   * Validates if a runtime hint is supported.
   * @param runtimeHint - The runtime hint to validate.
   * @returns True if supported, false otherwise.
   */
  isValidRuntimeHint: (runtimeHint: string): boolean => {
    return REGISTRY_TEST_CONFIG.RUNTIME_HINTS.includes(runtimeHint as any);
  },

  /**
   * Validates if an argument format is supported.
   * @param format - The argument format to validate.
   * @returns True if supported, false otherwise.
   */
  isValidArgumentFormat: (format: string): boolean => {
    return REGISTRY_TEST_CONFIG.ARGUMENT_FORMATS.includes(format as any);
  }
} as const;

/**
 * Test execution summary and reporting utilities.
 */
export const REGISTRY_TEST_REPORTING = {
  /**
   * Generates a summary of all registry test suites.
   * @returns Test suite summary object.
   */
  generateTestSuiteSummary: () => {
    const suites = Object.entries(REGISTRY_TEST_SUITES);
    return {
      totalSuites: suites.length,
      suites: suites.map(([name, config]) => ({
        name,
        description: config.description,
        testFile: config.testFile,
        coverageAreas: config.coverage.length
      })),
      totalCoverageAreas: suites.reduce((total, [, config]) => total + config.coverage.length, 0)
    };
  },

  /**
   * Validates test coverage completeness.
   * @returns Coverage validation result.
   */
  validateTestCoverage: () => {
    const requiredAreas = [
      'Schema validation',
      'NPM integration',
      'Registry API',
      'Publishing workflow',
      'Version synchronization',
      'Transport configuration'
    ];

    const coveredAreas = Object.values(REGISTRY_TEST_SUITES)
      .flatMap(suite => suite.coverage)
      .map(area => area.toLowerCase());

    const missingAreas = requiredAreas.filter(area =>
      !coveredAreas.some(covered => covered.includes(area.toLowerCase()))
    );

    return {
      isComplete: missingAreas.length === 0,
      missingAreas,
      coveragePercentage: ((requiredAreas.length - missingAreas.length) / requiredAreas.length) * 100
    };
  }
} as const;
