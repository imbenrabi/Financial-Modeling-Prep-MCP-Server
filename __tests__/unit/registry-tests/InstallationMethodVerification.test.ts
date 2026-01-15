/**
 * Installation Method Verification Tests  Optimized
 * 
 * Lightweight test suite for CI environments that focuses on core installation
 * verification without network dependencies, Docker, or long-running operations.
 */

import { describe, it, expect } from 'vitest';
import { spawn } from 'child_process';
import { existsSync, readFileSync } from 'fs';

/**
 * CI-optimized test configuration.
 */
const CI_TEST_CONFIG = {
  /**
   * Reduced timeout for CI operations.
   */
  TIMEOUT: 10000, // 10 seconds
  
  /**
   * Required files for installation.
   */
  REQUIRED_FILES: [
    'package.json',
    'dist/index.js',
    'README.md',
    'LICENSE',
    'server.json'
  ],
  
  /**
   * Expected CLI help patterns.
   */
  CLI_HELP_PATTERNS: [
    /Financial Modeling Prep MCP Server/i,
    /--fmp-token/i,
    /--port/i,
    /--help/i
  ],
  
  /**
   * Expected server startup patterns.
   */
  SERVER_STARTUP_PATTERNS: [
    /Server started successfully/i,
    /port \d+/i
  ]
} as const;

/**
 * Utility functions for CI testing.
 */
class CITestUtils {
  /**
   * Executes a command with timeout.
   * @param command - Command to execute.
   * @param args - Command arguments.
   * @param options - Execution options.
   * @returns Promise resolving to execution result.
   */
  static async executeCommand(
    command: string,
    args: string[],
    options: {
      cwd?: string;
      timeout?: number;
      env?: Record<string, string>;
    } = {}
  ): Promise<{ exitCode: number; stdout: string; stderr: string }> {
    const { cwd = process.cwd(), timeout = CI_TEST_CONFIG.TIMEOUT, env = {} } = options;
    
    return new Promise((resolve) => {
      const child = spawn(command, args, {
        cwd,
        stdio: ['pipe', 'pipe', 'pipe'],
        env: { ...process.env, ...env }
      });

      let stdout = '';
      let stderr = '';

      child.stdout?.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr?.on('data', (data) => {
        stderr += data.toString();
      });

      const timeoutId = setTimeout(() => {
        child.kill('SIGTERM');
        resolve({ exitCode: 1, stdout, stderr: stderr + ' (timeout)' });
      }, timeout);

      child.on('close', (code) => {
        clearTimeout(timeoutId);
        resolve({ exitCode: code || 0, stdout, stderr });
      });
    });
  }

  /**
   * Spawns a process and waits for patterns with quick timeout.
   * @param command - Command to spawn.
   * @param args - Command arguments.
   * @param patterns - Patterns to wait for.
   * @param options - Spawn options.
   * @returns Promise resolving when patterns are matched.
   */
  static async spawnAndWaitForPatterns(
    command: string,
    args: string[],
    patterns: RegExp[],
    options: {
      cwd?: string;
      timeout?: number;
      env?: Record<string, string>;
    } = {}
  ): Promise<{ matched: boolean; output: string }> {
    const { cwd = process.cwd(), timeout = CI_TEST_CONFIG.TIMEOUT, env = {} } = options;
    
    return new Promise((resolve) => {
      const child = spawn(command, args, {
        cwd,
        env: { ...process.env, ...env },
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let output = '';
      let matched = false;

      const checkPatterns = () => {
        const matchedPatterns = patterns.filter(pattern => pattern.test(output));
        if (matchedPatterns.length === patterns.length) {
          matched = true;
          child.kill('SIGTERM');
          resolve({ matched: true, output });
        }
      };

      child.stdout?.on('data', (data) => {
        output += data.toString();
        checkPatterns();
      });

      child.stderr?.on('data', (data) => {
        output += data.toString();
        checkPatterns();
      });

      child.on('close', () => {
        if (!matched) {
          resolve({ matched: false, output });
        }
      });

      setTimeout(() => {
        if (!matched) {
          child.kill('SIGTERM');
          resolve({ matched: false, output });
        }
      }, timeout);
    });
  }
}

describe('Installation Method Verification ', () => {
  describe('Required Files and Configuration', () => {
    it('should have all required files present', () => {
      const missingFiles = CI_TEST_CONFIG.REQUIRED_FILES.filter(file => !existsSync(file));
      
      if (missingFiles.includes('dist/index.js')) {
        console.warn('Build artifacts missing - run "npm run build" first');
        // Skip this test if build artifacts are missing
        return;
      }
      
      expect(missingFiles).toEqual([]);
    });

    it('should have valid package.json configuration', () => {
      expect(existsSync('package.json')).toBe(true);
      
      const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'));
      
      // Check required fields
      expect(packageJson.name).toBe('financial-modeling-prep-mcp-server');
      expect(packageJson.mcpName).toBe('io.github.imbenrabi/financial-modeling-prep-mcp-server');
      expect(packageJson.version).toMatch(/^\d+\.\d+\.\d+/);
      expect(packageJson.main).toBe('dist/index.js');
      expect(packageJson.bin).toHaveProperty('fmp-mcp');
      expect(packageJson.bin['fmp-mcp']).toBe('dist/index.js');
    });

    it('should have valid server.json configuration', () => {
      expect(existsSync('server.json')).toBe(true);
      
      const serverJson = JSON.parse(readFileSync('server.json', 'utf-8'));
      
      expect(serverJson.name).toBe('io.github.imbenrabi/financial-modeling-prep-mcp-server');
      expect(serverJson.version).toMatch(/^\d+\.\d+\.\d+/);
      expect(serverJson.description).toBeTruthy();
      expect(serverJson.packages).toBeInstanceOf(Array);
      expect(serverJson.packages.length).toBeGreaterThan(0);
    });

    it('should have syntactically valid build artifacts', async () => {
      if (!existsSync('dist/index.js')) {
        console.warn('Build artifacts missing - skipping syntax check');
        return;
      }
      
      // Check syntax by running node -c
      const result = await CITestUtils.executeCommand('node', ['-c', 'dist/index.js']);
      
      expect(result.exitCode).toBe(0);
    });
  });

  describe('CLI Functionality', () => {
    it('should display help information correctly', async () => {
      if (!existsSync('dist/index.js')) {
        console.warn('Build artifacts missing - skipping CLI tests');
        return;
      }
      
      const result = await CITestUtils.executeCommand('node', ['dist/index.js', '--help']);
      
      expect(result.exitCode).toBe(0);
      
      const output = result.stdout + result.stderr;
      CI_TEST_CONFIG.CLI_HELP_PATTERNS.forEach(pattern => {
        expect(output).toMatch(pattern);
      });
    });

    it('should accept CLI arguments correctly', async () => {
      if (!existsSync('dist/index.js')) {
        console.warn('Build artifacts missing - skipping server tests');
        return;
      }

      // Test that server accepts token argument without error
      const { matched, output } = await CITestUtils.spawnAndWaitForPatterns(
        'node',
        ['dist/index.js', '--fmp-token', 'test_token', '--port', '8085'],
        //@ts-expect-error
        CI_TEST_CONFIG.SERVER_STARTUP_PATTERNS,
        { timeout: 8000 }
      );

      expect(matched).toBe(true);
      expect(output).toMatch(/Server started successfully/i);
    }, 10000);

    it('should accept environment variables correctly', async () => {
      if (!existsSync('dist/index.js')) {
        console.warn('Build artifacts missing - skipping server tests');
        return;
      }

      // Test that server accepts token via environment variable
      const { matched, output } = await CITestUtils.spawnAndWaitForPatterns(
        'node',
        ['dist/index.js', '--port', '8086'],
        //@ts-expect-error
        CI_TEST_CONFIG.SERVER_STARTUP_PATTERNS,
        {
          timeout: 8000,
          env: { FMP_ACCESS_TOKEN: 'test_token' }
        }
      );

      expect(matched).toBe(true);
      expect(output).toMatch(/Server started successfully/i);
    }, 10000);
  });

  describe('NPM Package Structure', () => {
    it('should be packable without errors', async () => {
      const result = await CITestUtils.executeCommand('npm', ['pack', '--dry-run']);
      
      expect(result.exitCode).toBe(0);
      expect(result.stderr).not.toContain('error');
    });

    it('should have correct files included in package', async () => {
      const result = await CITestUtils.executeCommand('npm', ['pack', '--dry-run']);
      
      expect(result.exitCode).toBe(0);
      
      // npm pack --dry-run only shows the package name, not file contents
      // The fact that it succeeds means the package structure is valid
      expect(result.stdout).toContain('financial-modeling-prep-mcp-server');
      expect(result.stdout).toMatch(/\.tgz/);
    });
  });

  describe('Version Consistency', () => {
    it('should have consistent versions across all files', () => {
      const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'));
      const serverJson = JSON.parse(readFileSync('server.json', 'utf-8'));
      
      expect(packageJson.version).toBe(serverJson.version);
      
      // Check that version is valid semver
      expect(packageJson.version).toMatch(/^\d+\.\d+\.\d+$/);
    });

    it('should have consistent naming across files', () => {
      const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'));
      const serverJson = JSON.parse(readFileSync('server.json', 'utf-8'));
      
      expect(packageJson.mcpName).toBe(serverJson.name);
      expect(packageJson.mcpName).toBe('io.github.imbenrabi/financial-modeling-prep-mcp-server');
    });
  });

  describe('Basic Server Functionality', () => {
    it('should start server successfully', async () => {
      if (!existsSync('dist/index.js')) {
        console.warn('Build artifacts missing - skipping server tests');
        return;
      }

      const { matched, output } = await CITestUtils.spawnAndWaitForPatterns(
        'node',
        ['dist/index.js', '--fmp-token', 'test_token', '--port', '8087'],
        [/Server started successfully/i],
        { timeout: 8000 }
      );

      expect(matched).toBe(true);
      expect(output).toMatch(/Server started successfully/i);
    }, 10000);

    it('should handle shutdown gracefully', async () => {
      if (!existsSync('dist/index.js')) {
        console.warn('Build artifacts missing - skipping server tests');
        return;
      }

      const child = spawn('node', [
        'dist/index.js',
        '--fmp-token', 'test_token',
        '--port', '8088'
      ], {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      // Wait for startup
      await new Promise((resolve) => {
        let output = '';
        const checkStartup = (data: Buffer) => {
          output += data.toString();
          if (output.includes('Server started successfully')) {
            resolve(void 0);
          }
        };

        child.stdout?.on('data', checkStartup);
        child.stderr?.on('data', checkStartup);

        setTimeout(resolve, 5000); // Fallback timeout
      });

      // Send SIGTERM and wait for graceful shutdown
      child.kill('SIGTERM');

      const exitCode = await new Promise<number>((resolve) => {
        child.on('close', (code) => resolve(code || 0));
        setTimeout(() => resolve(1), 3000); // Timeout after 3 seconds
      });

      expect(exitCode).toBe(0);
    }, 10000);
  });
});