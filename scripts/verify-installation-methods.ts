#!/usr/bin/env tsx

/**
 * Installation Method Verification Script
 * 
 * Simplified verification script that tests core installation functionality
 * without requiring external dependencies like Docker or network access.
 */

import { spawn } from 'child_process';
import { existsSync, readFileSync } from 'fs';

/**
 * Verification configuration.
 */
const VERIFICATION_CONFIG = {
  /**
   * Test timeout for operations.
   */
  TIMEOUT: 30000,
  
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
  HELP_PATTERNS: [
    /Financial Modeling Prep MCP Server/i,
    /--fmp-token/i,
    /--port/i,
    /--help/i
  ],
  
  /**
   * Expected server startup patterns.
   */
  STARTUP_PATTERNS: [
    /Server started successfully on port \d+/i,
  ]
} as const;

/**
 * Installation method verifier.
 */
class InstallationVerifier {
  private results: Array<{ test: string; status: 'PASS' | 'FAIL' | 'SKIP'; message: string }> = [];

  /**
   * Executes a command and returns the result.
   * @param command - Command to execute.
   * @param args - Command arguments.
   * @param options - Execution options.
   * @returns Promise resolving to execution result.
   */
  private async executeCommand(
    command: string,
    args: string[],
    options: {
      cwd?: string;
      timeout?: number;
      env?: Record<string, string>;
    } = {}
  ): Promise<{ exitCode: number; stdout: string; stderr: string }> {
    const { cwd = process.cwd(), timeout = VERIFICATION_CONFIG.TIMEOUT, env = {} } = options;
    
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
   * Spawns a process and waits for specific patterns.
   * @param command - Command to spawn.
   * @param args - Command arguments.
   * @param patterns - Patterns to wait for.
   * @param options - Spawn options.
   * @returns Promise resolving when patterns are matched.
   */
  private async spawnAndWaitForPatterns(
    command: string,
    args: string[],
    patterns: RegExp[],
    options: {
      cwd?: string;
      timeout?: number;
      env?: Record<string, string>;
    } = {}
  ): Promise<{ matched: boolean; output: string }> {
    const { cwd = process.cwd(), timeout = VERIFICATION_CONFIG.TIMEOUT, env = {} } = options;
    
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

  /**
   * Records a test result.
   * @param test - Test name.
   * @param status - Test status.
   * @param message - Test message.
   */
  private recordResult(test: string, status: 'PASS' | 'FAIL' | 'SKIP', message: string): void {
    this.results.push({ test, status, message });
    
    const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⏭️';
    console.log(`${icon} ${test}: ${message}`);
  }

  /**
   * Verifies required files exist.
   */
  private async verifyRequiredFiles(): Promise<void> {
    console.log('\n🔍 Verifying required files...');
    
    const missingFiles = VERIFICATION_CONFIG.REQUIRED_FILES.filter(file => !existsSync(file));
    
    if (missingFiles.length === 0) {
      this.recordResult('Required Files', 'PASS', 'All required files present');
    } else {
      this.recordResult('Required Files', 'FAIL', `Missing files: ${missingFiles.join(', ')}`);
    }
  }

  /**
   * Verifies package.json configuration.
   */
  private async verifyPackageJson(): Promise<void> {
    console.log('\n📦 Verifying package.json configuration...');
    
    try {
      if (!existsSync('package.json')) {
        this.recordResult('Package.json', 'FAIL', 'package.json not found');
        return;
      }

      const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'));
      
      const requiredFields = ['name', 'version', 'mcpName', 'main', 'bin'];
      const missingFields = requiredFields.filter(field => !packageJson[field]);
      
      if (missingFields.length === 0) {
        this.recordResult('Package.json Fields', 'PASS', 'All required fields present');
      } else {
        this.recordResult('Package.json Fields', 'FAIL', `Missing fields: ${missingFields.join(', ')}`);
      }

      // Verify mcpName format
      if (packageJson.mcpName === 'io.github.imbenrabi/financial-modeling-prep-mcp-server') {
        this.recordResult('MCP Name', 'PASS', 'Correct MCP name format');
      } else {
        this.recordResult('MCP Name', 'FAIL', `Invalid MCP name: ${packageJson.mcpName}`);
      }

      // Verify binary configuration
      if (packageJson.bin && packageJson.bin['fmp-mcp']) {
        this.recordResult('Binary Config', 'PASS', 'Binary configuration present');
      } else {
        this.recordResult('Binary Config', 'FAIL', 'Missing binary configuration');
      }

    } catch (error) {
      this.recordResult('Package.json', 'FAIL', `Error reading package.json: ${error}`);
    }
  }

  /**
   * Verifies CLI help functionality.
   */
  private async verifyCLIHelp(): Promise<void> {
    console.log('\n💬 Verifying CLI help functionality...');
    
    try {
      const result = await this.executeCommand('node', ['dist/index.js', '--help']);
      
      if (result.exitCode === 0) {
        const output = result.stdout + result.stderr;
        const matchedPatterns = VERIFICATION_CONFIG.HELP_PATTERNS.filter(pattern => pattern.test(output));
        
        if (matchedPatterns.length === VERIFICATION_CONFIG.HELP_PATTERNS.length) {
          this.recordResult('CLI Help', 'PASS', 'Help output contains all expected patterns');
        } else {
          this.recordResult('CLI Help', 'FAIL', `Missing help patterns: ${VERIFICATION_CONFIG.HELP_PATTERNS.length - matchedPatterns.length}`);
        }
      } else {
        this.recordResult('CLI Help', 'FAIL', `Help command failed with exit code ${result.exitCode}`);
      }
    } catch (error) {
      this.recordResult('CLI Help', 'FAIL', `Error executing help command: ${error}`);
    }
  }

  /**
   * Verifies server startup functionality.
   */
  private async verifyServerStartup(): Promise<void> {
    console.log('\n🚀 Verifying server startup...');
    
    try {
      const { matched, output: _output } = await this.spawnAndWaitForPatterns(
        'node',
        ['dist/index.js', '--fmp-token', 'test_token', '--port', '8084'],
        //@ts-ignore
        VERIFICATION_CONFIG.STARTUP_PATTERNS
      );
      
      if (matched) {
        this.recordResult('Server Startup', 'PASS', 'Server started successfully with expected output');
      } else {
        this.recordResult('Server Startup', 'FAIL', 'Server startup patterns not found in output');
      }
    } catch (error) {
      this.recordResult('Server Startup', 'FAIL', `Error starting server: ${error}`);
    }
  }

  /**
   * Verifies NPM package structure.
   */
  private async verifyNPMPackage(): Promise<void> {
    console.log('\n📋 Verifying NPM package structure...');
    
    try {
      // Check if package can be packed
      const result = await this.executeCommand('npm', ['pack', '--dry-run']);
      
      if (result.exitCode === 0) {
        this.recordResult('NPM Pack', 'PASS', 'Package can be packed successfully');
      } else {
        this.recordResult('NPM Pack', 'FAIL', `NPM pack failed: ${result.stderr}`);
      }
    } catch (error) {
      this.recordResult('NPM Pack', 'FAIL', `Error testing NPM pack: ${error}`);
    }
  }

  /**
   * Verifies build artifacts.
   */
  private async verifyBuildArtifacts(): Promise<void> {
    console.log('\n🔨 Verifying build artifacts...');
    
    if (existsSync('dist/index.js')) {
      try {
        // Try to require the built file to check for syntax errors
        const result = await this.executeCommand('node', ['-c', 'dist/index.js']);
        
        if (result.exitCode === 0) {
          this.recordResult('Build Artifacts', 'PASS', 'Built files are syntactically valid');
        } else {
          this.recordResult('Build Artifacts', 'FAIL', `Built file has syntax errors: ${result.stderr}`);
        }
      } catch (error) {
        this.recordResult('Build Artifacts', 'FAIL', `Error checking build artifacts: ${error}`);
      }
    } else {
      this.recordResult('Build Artifacts', 'FAIL', 'dist/index.js not found');
    }
  }

  /**
   * Generates a summary report.
   */
  private generateReport(): void {
    console.log('\n📊 Installation Verification Summary');
    console.log('=====================================');
    
    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    const skipped = this.results.filter(r => r.status === 'SKIP').length;
    const total = this.results.length;
    
    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log(`Skipped: ${skipped}`);
    console.log(`Success Rate: ${((passed / (total - skipped)) * 100).toFixed(1)}%`);
    
    if (failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results
        .filter(r => r.status === 'FAIL')
        .forEach(r => console.log(`  • ${r.test}: ${r.message}`));
    }
    
    console.log(`\nTimestamp: ${new Date().toISOString()}`);
    
    if (failed === 0) {
      console.log('\n🎉 All installation methods verified successfully!');
      console.log('The Financial Modeling Prep MCP Server is ready for registry publishing.');
    } else {
      console.log('\n⚠️  Some verification tests failed. Please review and fix the issues above.');
    }
  }

  /**
   * Runs all verification tests.
   */
  async run(): Promise<void> {
    console.log('🔍 Starting Installation Method Verification');
    console.log('===========================================');

    try {
      await this.verifyRequiredFiles();
      await this.verifyPackageJson();
      await this.verifyBuildArtifacts();
      await this.verifyCLIHelp();
      await this.verifyServerStartup();
      await this.verifyNPMPackage();
    } catch (error) {
      console.error('💥 Verification failed with error:', error);
    } finally {
      this.generateReport();
      
      const failed = this.results.filter(r => r.status === 'FAIL').length;
      process.exit(failed === 0 ? 0 : 1);
    }
  }
}

/**
 * Main execution function.
 */
async function main(): Promise<void> {
  const verifier = new InstallationVerifier();
  await verifier.run();
}

// Handle CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
}

export { InstallationVerifier };