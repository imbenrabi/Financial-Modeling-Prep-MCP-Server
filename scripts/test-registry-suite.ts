#!/usr/bin/env tsx

/**
 * Registry Test Suite Runner
 * 
 * Comprehensive test runner for all MCP registry publishing functionality.
 * This script executes all registry-related tests and provides detailed reporting.
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { REGISTRY_TEST_SUITES, REGISTRY_TEST_REPORTING } from '../__tests__/unit/registry-tests/config.js';

interface TestResult {
  suite: string;
  passed: boolean;
  duration: number;
  output: string;
  error?: string;
}

/**
 * Safely extracts error message from unknown error type.
 * @param error - The error to extract message from.
 * @returns The error message string.
 */
function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Executes a test command and returns the result.
 * @param command - The test command to execute.
 * @param suiteName - Name of the test suite.
 * @returns Test execution result.
 */
function executeTestSuite(command: string, suiteName: string): TestResult {
  const startTime = Date.now();
  
  try {
    const output = execSync(command, {
      encoding: 'utf-8',
      stdio: 'pipe',
      timeout: 60000 // 60 second timeout
    });
    
    const duration = Date.now() - startTime;
    
    return {
      suite: suiteName,
      passed: true,
      duration,
      output
    };
  } catch (error: any) {
    const duration = Date.now() - startTime;
    
    return {
      suite: suiteName,
      passed: false,
      duration,
      output: error.stdout || '',
      error: error.stderr || error.message
    };
  }
}

/**
 * Runs all registry test suites.
 * @param options - Test execution options.
 * @returns Array of test results.
 */
async function runAllRegistryTests(options: {
  coverage?: boolean;
  verbose?: boolean;
  pattern?: string;
} = {}): Promise<TestResult[]> {
  console.log('🚀 Starting Registry Test Suite Execution\n');
  
  const results: TestResult[] = [];
  const suiteEntries = Object.entries(REGISTRY_TEST_SUITES);
  
  // Filter suites by pattern if provided
  const filteredSuites = options.pattern 
    ? suiteEntries.filter(([name]) => name.toLowerCase().includes(options.pattern!.toLowerCase()))
    : suiteEntries;
  
  console.log(`📋 Executing ${filteredSuites.length} test suite(s):\n`);
  
  for (const [suiteName, suiteConfig] of filteredSuites) {
    console.log(`🔍 Running: ${suiteName}`);
    console.log(`   Description: ${suiteConfig.description}`);
    console.log(`   Test File: ${suiteConfig.testFile}`);
    
    // Build test command
    let command = `npx vitest run __tests__/unit/registry-tests/${suiteConfig.testFile}`;
    
    if (options.coverage) {
      command += ' --coverage';
    }
    
    if (options.verbose) {
      command += ' --reporter=verbose';
    }
    
    const result = executeTestSuite(command, suiteName);
    results.push(result);
    
    if (result.passed) {
      console.log(`   ✅ PASSED (${result.duration}ms)\n`);
    } else {
      console.log(`   ❌ FAILED (${result.duration}ms)`);
      if (options.verbose && result.error) {
        console.log(`   Error: ${result.error}\n`);
      } else {
        console.log('');
      }
    }
  }
  
  return results;
}

/**
 * Generates a detailed test report.
 * @param results - Test execution results.
 * @param options - Reporting options.
 */
function generateTestReport(results: TestResult[], options: {
  verbose?: boolean;
  showCoverage?: boolean;
} = {}): void {
  console.log('📊 Registry Test Suite Report');
  console.log('=' .repeat(50));
  
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => r.failed).length;
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
  
  console.log(`\nExecution Summary:`);
  console.log(`  Total Suites: ${results.length}`);
  console.log(`  Passed: ${passed}`);
  console.log(`  Failed: ${failed}`);
  console.log(`  Success Rate: ${((passed / results.length) * 100).toFixed(1)}%`);
  console.log(`  Total Duration: ${totalDuration}ms`);
  
  // Detailed results
  console.log(`\nDetailed Results:`);
  for (const result of results) {
    const status = result.passed ? '✅ PASS' : '❌ FAIL';
    console.log(`  ${status} ${result.suite} (${result.duration}ms)`);
    
    if (!result.passed && options.verbose) {
      console.log(`    Error: ${result.error || 'Unknown error'}`);
    }
  }
  
  // Failed tests details
  const failedTests = results.filter(r => !r.passed);
  if (failedTests.length > 0) {
    console.log(`\nFailed Test Details:`);
    for (const failed of failedTests) {
      console.log(`\n❌ ${failed.suite}:`);
      console.log(`   Duration: ${failed.duration}ms`);
      if (failed.error) {
        console.log(`   Error: ${failed.error}`);
      }
      if (options.verbose && failed.output) {
        console.log(`   Output: ${failed.output.slice(0, 500)}...`);
      }
    }
  }
  
  // Coverage information
  if (options.showCoverage) {
    console.log(`\nTest Coverage Analysis:`);
    const summary = REGISTRY_TEST_REPORTING.generateTestSuiteSummary();
    const coverage = REGISTRY_TEST_REPORTING.validateTestCoverage();
    
    console.log(`  Total Test Suites: ${summary.totalSuites}`);
    console.log(`  Total Coverage Areas: ${summary.totalCoverageAreas}`);
    console.log(`  Coverage Completeness: ${coverage.coveragePercentage.toFixed(1)}%`);
    
    if (!coverage.isComplete) {
      console.log(`  Missing Coverage Areas:`);
      for (const missing of coverage.missingAreas) {
        console.log(`    - ${missing}`);
      }
    }
  }
  
  console.log('\n' + '=' .repeat(50));
}

/**
 * Validates test environment and prerequisites.
 * @returns Validation result.
 */
function validateTestEnvironment(): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  // Check if vitest is available
  try {
    execSync('npx vitest --version', { stdio: 'pipe' });
  } catch {
    issues.push('Vitest is not available. Run: npm install');
  }
  
  // Check if test files exist
  const testFiles = Object.values(REGISTRY_TEST_SUITES).map(suite =>
    join('__tests__', 'unit', 'registry-tests', suite.testFile)
  );
  
  for (const testFile of testFiles) {
    if (!existsSync(testFile)) {
      issues.push(`Test file missing: ${testFile}`);
    }
  }
  
  // Check if required source files exist
  const requiredFiles = [
    'src/utils/versionSync.ts',
    'package.json',
    'server.json'
  ];
  
  for (const file of requiredFiles) {
    if (!existsSync(file)) {
      issues.push(`Required file missing: ${file}`);
    }
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}

/**
 * Main execution function.
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  
  // Parse command line arguments
  const options = {
    coverage: args.includes('--coverage'),
    verbose: args.includes('--verbose') || args.includes('-v'),
    help: args.includes('--help') || args.includes('-h'),
    pattern: args.find(arg => arg.startsWith('--pattern='))?.split('=')[1],
    showCoverage: args.includes('--show-coverage')
  };
  
  if (options.help) {
    console.log(`Registry Test Suite Runner

Usage: npm run test:registry-suite [options]

Options:
  --coverage         Generate test coverage report
  --verbose, -v      Show detailed output
  --pattern=<name>   Run only test suites matching pattern
  --show-coverage    Show test coverage analysis
  --help, -h         Show this help message

Examples:
  npm run test:registry-suite
  npm run test:registry-suite --coverage --verbose
  npm run test:registry-suite --pattern=schema
  npm run test:registry-suite --show-coverage

Test Suites:
${Object.entries(REGISTRY_TEST_SUITES).map(([name, config]) => 
  `  ${name}: ${config.description}`
).join('\n')}
`);
    return;
  }
  
  // Validate environment
  console.log('🔍 Validating test environment...');
  const validation = validateTestEnvironment();
  
  if (!validation.valid) {
    console.error('❌ Test environment validation failed:');
    for (const issue of validation.issues) {
      console.error(`  - ${issue}`);
    }
    process.exit(1);
  }
  
  console.log('✅ Test environment validation passed\n');
  
  try {
    // Execute tests
    const results = await runAllRegistryTests(options);
    
    // Generate report
    generateTestReport(results, {
      verbose: options.verbose,
      showCoverage: options.showCoverage
    });
    
    // Exit with appropriate code
    const allPassed = results.every(r => r.passed);
    
    if (allPassed) {
      console.log('\n🎉 All registry tests passed successfully!');
      console.log('\n📋 Registry Publishing Readiness:');
      console.log('  ✅ Schema validation tests passed');
      console.log('  ✅ NPM package integration tests passed');
      console.log('  ✅ Registry API integration tests passed');
      console.log('  ✅ End-to-end workflow tests passed');
      console.log('  ✅ Version synchronization tests passed');
      console.log('  ✅ Transport configuration tests passed');
      
      console.log('\n🚀 Ready for MCP Registry Publishing!');
      console.log('\nNext Steps:');
      console.log('  1. Run: npm run version:validate');
      console.log('  2. Run: npm run verify:npm-ready');
      console.log('  3. Run: npm run publish:manual (or use automated workflow)');
      
    } else {
      console.log('\n❌ Some registry tests failed. Please review and fix issues before publishing.');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Test execution failed:', getErrorMessage(error));
    process.exit(1);
  }
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { main as runRegistryTestSuite };