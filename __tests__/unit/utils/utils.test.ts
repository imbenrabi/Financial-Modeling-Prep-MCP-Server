
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import crypto from 'node:crypto';

// Import utility functions
import { getServerVersion } from '../../../src/utils/getServerVersion.js';
import { isValidJsonRpc } from '../../../src/utils/isValidJsonRpc.js';
import {
  validateAndSanitizeToolsetName,
  validateToolSets,
  validateDynamicToolDiscoveryConfig,
  parseCommaSeparatedToolSets,
  validateToolsetModules
} from '../../../src/utils/validation.js';
import { areStringSetsEqual } from '../../../src/utils/validation.js';
import { computeClientId } from '../../../src/utils/computeClientId.js';
import { resolveAccessToken } from '../../../src/utils/resolveAccessToken.js';

// Mock fs for getServerVersion tests
vi.mock('node:fs');
const mockedFs = vi.mocked(fs);

// Mock console for showHelp tests (declare at module level)
const consoleSpy = vi.spyOn(console, 'log');

describe('getServerVersion', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return version from package.json', () => {
    const mockPackageJson = JSON.stringify({ version: '1.2.3' });
    mockedFs.readFileSync.mockReturnValue(mockPackageJson);

    const version = getServerVersion();

    expect(version).toBe('1.2.3');
    expect(mockedFs.readFileSync).toHaveBeenCalledWith(
      expect.stringContaining('package.json'),
      'utf8'
    );
  });

  it('should handle malformed package.json', () => {
    mockedFs.readFileSync.mockReturnValue('invalid json');

    expect(() => getServerVersion()).toThrow();
  });

  it('should handle missing version field', () => {
    const mockPackageJson = JSON.stringify({ name: 'test' });
    mockedFs.readFileSync.mockReturnValue(mockPackageJson);

    const version = getServerVersion();

    expect(version).toBeUndefined();
  });
});

describe('computeClientId', () => {
  const originalRandomUUID = crypto.randomUUID;

  afterEach(() => {
    // restore randomUUID if mocked
    if (crypto.randomUUID !== originalRandomUUID) {
      // @ts-ignore
      crypto.randomUUID = originalRandomUUID;
    }
  });

  it('should compute deterministic client id from token using sha256', () => {
    const token = 'my-secret-token';
    const expectedHash = crypto.createHash('sha256').update(token).digest('hex');
    const id = computeClientId(token);
    expect(id).toBe(`client:${expectedHash}`);
  });

  it('should return anon:uuid when no token is provided', () => {
    const fakeUuid = '00000000-0000-0000-0000-000000000000';
    vi.spyOn(crypto, 'randomUUID').mockReturnValue(fakeUuid as any);
    const id = computeClientId(undefined);
    expect(id).toBe(`anon:${fakeUuid}`);
  });

  it('should treat empty string token as no token', () => {
    const fakeUuid = '11111111-1111-1111-1111-111111111111';
    vi.spyOn(crypto, 'randomUUID').mockReturnValue(fakeUuid as any);
    const id = computeClientId('');
    expect(id).toBe(`anon:${fakeUuid}`);
  });
});

describe('resolveAccessToken', () => {
  it('should prefer server token over session config token', () => {
    const serverToken = 'server-123';
    const sessionConfig = { FMP_ACCESS_TOKEN: 'session-456' } as any;
    const resolved = resolveAccessToken(serverToken, sessionConfig);
    expect(resolved).toBe('server-123');
  });

  it('should use session config token when server token is not provided', () => {
    const sessionConfig = { FMP_ACCESS_TOKEN: 'session-456' } as any;
    const resolved = resolveAccessToken(undefined, sessionConfig);
    expect(resolved).toBe('session-456');
  });

  it('should return undefined when neither is provided', () => {
    const resolved = resolveAccessToken(undefined, undefined);
    expect(resolved).toBeUndefined();
  });
});

describe('isValidJsonRpc', () => {
  it('should return true for valid JSON-RPC 2.0 request', () => {
    const validRequest = {
      jsonrpc: '2.0',
      method: 'test_method',
      id: 1,
      params: { key: 'value' }
    };

    expect(isValidJsonRpc(validRequest)).toBe(true);
  });

  it('should return true for valid JSON-RPC 2.0 request without params', () => {
    const validRequest = {
      jsonrpc: '2.0',
      method: 'test_method',
      id: 'test-id'
    };

    expect(isValidJsonRpc(validRequest)).toBe(true);
  });

  it('should return true for valid JSON-RPC 2.0 request with null id', () => {
    const validRequest = {
      jsonrpc: '2.0',
      method: 'test_method',
      id: null
    };

    expect(isValidJsonRpc(validRequest)).toBe(true);
  });

  it('should return false for non-object request', () => {
    expect(isValidJsonRpc(null)).toBe(false);
    expect(isValidJsonRpc(undefined)).toBe(false);
    expect(isValidJsonRpc('string')).toBe(false);
    expect(isValidJsonRpc(123)).toBe(false);
  });

  it('should return false for missing jsonrpc property', () => {
    const invalidRequest = {
      method: 'test_method',
      id: 1
    };

    expect(isValidJsonRpc(invalidRequest)).toBe(false);
  });

  it('should return false for incorrect jsonrpc version', () => {
    const invalidRequest = {
      jsonrpc: '1.0',
      method: 'test_method',
      id: 1
    };

    expect(isValidJsonRpc(invalidRequest)).toBe(false);
  });

  it('should return false for missing method property', () => {
    const invalidRequest = {
      jsonrpc: '2.0',
      id: 1
    };

    expect(isValidJsonRpc(invalidRequest)).toBe(false);
  });

  it('should return false for non-string method property', () => {
    const invalidRequest = {
      jsonrpc: '2.0',
      method: 123,
      id: 1
    };

    expect(isValidJsonRpc(invalidRequest)).toBe(false);
  });

  it('should return false for missing id property', () => {
    const invalidRequest = {
      jsonrpc: '2.0',
      method: 'test_method'
    };

    expect(isValidJsonRpc(invalidRequest)).toBe(false);
  });

  it('should return false for invalid params property', () => {
    const invalidRequest = {
      jsonrpc: '2.0',
      method: 'test_method',
      id: 1,
      params: 'string_params'
    };

    expect(isValidJsonRpc(invalidRequest)).toBe(false);
  });

  it('should return true for array params', () => {
    const validRequest = {
      jsonrpc: '2.0',
      method: 'test_method',
      id: 1,
      params: [1, 2, 3]
    };

    expect(isValidJsonRpc(validRequest)).toBe(true);
  });
});

describe('validateAndSanitizeToolsetName', () => {
  it('should validate and sanitize valid toolset name', () => {
    const result = validateAndSanitizeToolsetName('  search  ');
    
    expect(result.isValid).toBe(true);
    expect(result.sanitized).toBe('search');
    expect(result.error).toBeUndefined();
  });

  it('should reject null or undefined input', () => {
    let result = validateAndSanitizeToolsetName(null);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Invalid toolset name provided');

    result = validateAndSanitizeToolsetName(undefined);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Invalid toolset name provided');
  });

  it('should reject non-string input', () => {
    const result = validateAndSanitizeToolsetName(123);
    
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Invalid toolset name provided');
    expect(result.error).toContain('Must be a non-empty string');
  });

  it('should reject empty string after trimming', () => {
    const result = validateAndSanitizeToolsetName('   ');
    
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Empty toolset name provided');
  });

  it('should reject non-existent toolset', () => {
    const result = validateAndSanitizeToolsetName('non_existent_toolset');
    
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("Toolset 'non_existent_toolset' not found");
    expect(result.error).toContain('Available toolsets:');
  });

  it('should use custom available toolsets when provided', () => {
    const customToolsets = ['custom1', 'custom2'] as any[];
    const result = validateAndSanitizeToolsetName('invalid', customToolsets);
    
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('custom1, custom2');
  });
});

describe('validateToolSets', () => {
  it('should separate valid and invalid toolsets', () => {
    const toolSets = ['search', 'invalid_toolset', '', 'company'];
    const result = validateToolSets(toolSets);
    
    expect(result.valid).toContain('search');
    expect(result.valid).toContain('company');
    expect(result.invalid).toContain('invalid_toolset');
    expect(result.invalid).toContain('');
    expect(result.errors).toHaveLength(2);
  });

  it('should handle empty array', () => {
    const result = validateToolSets([]);
    
    expect(result.valid).toHaveLength(0);
    expect(result.invalid).toHaveLength(0);
    expect(result.errors).toHaveLength(0);
  });

  it('should handle all valid toolsets', () => {
    const toolSets = ['search', 'company'];
    const result = validateToolSets(toolSets);
    
    expect(result.valid).toEqual(['search', 'company']);
    expect(result.invalid).toHaveLength(0);
    expect(result.errors).toHaveLength(0);
  });

  it('should handle all invalid toolsets', () => {
    const toolSets = ['invalid1', 'invalid2', null, 123];
    const result = validateToolSets(toolSets);
    
    expect(result.valid).toHaveLength(0);
    expect(result.invalid).toHaveLength(4);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});

describe('validateDynamicToolDiscoveryConfig', () => {
  let consoleWarnSpy: any;

  beforeEach(() => {
    consoleWarnSpy = vi.spyOn(console, 'warn');
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  it('should return true for boolean true', () => {
    expect(validateDynamicToolDiscoveryConfig(true)).toBe(true);
  });

  it('should return false for boolean false', () => {
    expect(validateDynamicToolDiscoveryConfig(false)).toBe(false);
  });

  it('should return true for string "true" (case insensitive)', () => {
    expect(validateDynamicToolDiscoveryConfig('true')).toBe(true);
    expect(validateDynamicToolDiscoveryConfig('TRUE')).toBe(true);
    expect(validateDynamicToolDiscoveryConfig(' True ')).toBe(true);
  });

  it('should return false for string "false"', () => {
    expect(validateDynamicToolDiscoveryConfig('false')).toBe(false);
    expect(validateDynamicToolDiscoveryConfig('FALSE')).toBe(false);
    expect(validateDynamicToolDiscoveryConfig(' false ')).toBe(false);
  });

  it('should return false for empty string', () => {
    expect(validateDynamicToolDiscoveryConfig('')).toBe(false);
    expect(validateDynamicToolDiscoveryConfig('   ')).toBe(false);
  });

  it('should return false for null or undefined', () => {
    expect(validateDynamicToolDiscoveryConfig(null)).toBe(false);
    expect(validateDynamicToolDiscoveryConfig(undefined)).toBe(false);
  });

  it('should return false and warn for invalid string values', () => {
    expect(validateDynamicToolDiscoveryConfig('invalid')).toBe(false);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Invalid DYNAMIC_TOOL_DISCOVERY config value'),
      'invalid'
    );
  });

  it('should return false and warn for non-string/non-boolean values', () => {
    expect(validateDynamicToolDiscoveryConfig(123)).toBe(false);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Invalid DYNAMIC_TOOL_DISCOVERY config value (not string)'),
      123
    );
  });
});

describe('parseCommaSeparatedToolSets', () => {
  let consoleWarnSpy: any;
  let consoleErrorSpy: any;

  beforeEach(() => {
    consoleWarnSpy = vi.spyOn(console, 'warn');
    consoleErrorSpy = vi.spyOn(console, 'error');
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('should parse valid comma-separated toolsets', () => {
    const result = parseCommaSeparatedToolSets('search, company, quotes');
    
    expect(result).toContain('search');
    expect(result).toContain('company');
    expect(result).toContain('quotes');
  });

  it('should handle whitespace and trim values', () => {
    const result = parseCommaSeparatedToolSets('  search  ,  company  ');
    
    expect(result).toContain('search');
    expect(result).toContain('company');
  });

  it('should filter out empty entries and warn', () => {
    const result = parseCommaSeparatedToolSets('search,,company');
    
    expect(result).toContain('search');
    expect(result).toContain('company');
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Empty tool set found')
    );
  });

  it('should filter out invalid toolsets and warn', () => {
    const result = parseCommaSeparatedToolSets('search,invalid_toolset,company');
    
    expect(result).toContain('search');
    expect(result).toContain('company');
    expect(result).not.toContain('invalid_toolset');
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Invalid tool sets found'),
      ['invalid_toolset']
    );
  });

  it('should return empty array for null or non-string input', () => {
    expect(parseCommaSeparatedToolSets('')).toEqual([]);
    expect(parseCommaSeparatedToolSets(null as any)).toEqual([]);
    expect(parseCommaSeparatedToolSets(123 as any)).toEqual([]);
  });

  it('should handle errors gracefully', () => {
    // Test that the function handles edge cases without throwing
    expect(() => parseCommaSeparatedToolSets('search,company')).not.toThrow();
    
    // Test with edge case that might cause issues
    const result = parseCommaSeparatedToolSets('');
    expect(result).toEqual([]);
  });
});

describe('validateToolsetModules', () => {
  it('should return valid result when modules are found', () => {
    const mockGetModules = vi.fn().mockReturnValue(['module1.js', 'module2.js']);
    const toolsets = ['search', 'company'] as any[];
    
    const result = validateToolsetModules(toolsets, mockGetModules);
    
    expect(result.isValid).toBe(true);
    expect(result.modules).toEqual(['module1.js', 'module2.js']);
    expect(result.error).toBeUndefined();
    expect(mockGetModules).toHaveBeenCalledWith(toolsets);
  });

  it('should return invalid result when no modules are found', () => {
    const mockGetModules = vi.fn().mockReturnValue([]);
    const toolsets = ['search'] as any[];
    
    const result = validateToolsetModules(toolsets, mockGetModules);
    
    expect(result.isValid).toBe(false);
    expect(result.modules).toBeUndefined();
    expect(result.error).toContain('No modules found for toolsets: search');
  });

  it('should return invalid result when getModules returns null/undefined', () => {
    const mockGetModules = vi.fn().mockReturnValue(null);
    const toolsets = ['search'] as any[];
    
    const result = validateToolsetModules(toolsets, mockGetModules);
    
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('No modules found for toolsets: search');
  });

  it('should handle errors from getModulesForToolSets function', () => {
    const mockGetModules = vi.fn().mockImplementation(() => {
      throw new Error('Module loading error');
    });
    const toolsets = ['search'] as any[];
    
    const result = validateToolsetModules(toolsets, mockGetModules);
    
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Error getting modules for toolsets search: Module loading error');
  });

  it('should handle non-Error thrown values', () => {
    const mockGetModules = vi.fn().mockImplementation(() => {
      throw 'String error';
    });
    const toolsets = ['search'] as any[];
    
    const result = validateToolsetModules(toolsets, mockGetModules);
    
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Unknown error');
  });
});

describe('areStringSetsEqual', () => {
  it('should return true for same elements in same order', () => {
    expect(areStringSetsEqual(['a', 'b'], ['a', 'b'])).toBe(true);
  });

  it('should return true for same elements in different order', () => {
    expect(areStringSetsEqual(['search', 'company'], ['company', 'search'])).toBe(true);
  });

  it('should return false for different lengths', () => {
    expect(areStringSetsEqual(['a'], ['a', 'b'])).toBe(false);
  });

  it('should return false when elements differ', () => {
    expect(areStringSetsEqual(['a', 'b'], ['a', 'c'])).toBe(false);
  });

  it('should handle duplicates correctly (multiset equality)', () => {
    expect(areStringSetsEqual(['a', 'a', 'b'], ['a', 'b', 'a'])).toBe(true);
    expect(areStringSetsEqual(['a', 'a', 'b'], ['a', 'b', 'b'])).toBe(false);
  });

  it('should return false for non-arrays', () => {
    expect(areStringSetsEqual(undefined as any, ['a'])).toBe(false);
    expect(areStringSetsEqual(['a'], null as any)).toBe(false);
  });
});
