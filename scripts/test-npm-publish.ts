#!/usr/bin/env tsx

/**
 * Test script for NPM publishing process
 * This script validates the package configuration and simulates the publishing process
 * without actually publishing to NPM.
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

interface PackageJson {
  name: string;
  version: string;
  mcpName?: string;
  main: string;
  bin?: Record<string, string>;
  files?: string[];
  scripts?: Record<string, string>;
}

/**
 * Executes a shell command and returns the output
 * @param command - The command to execute
 * @returns The command output as a string
 */
function executeCommand(command: string): string {
  try {
    return execSync(command, { encoding: 'utf-8', stdio: 'pipe' });
  } catch (error: any) {
    throw new Error(`Command failed: ${command}\n${error.message}`, { cause: error });
  }
}

/**
 * Validates the package.json configuration for NPM publishing
 * @param packageJson - The parsed package.json object
 */
function validatePackageJson(packageJson: PackageJson): void {
  console.log('📋 Validating package.json configuration...');
  
  const requiredFields = ['name', 'version', 'description', 'main'];
  const missingFields = requiredFields.filter(field => !packageJson[field as keyof PackageJson]);
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields in package.json: ${missingFields.join(', ')}`);
  }
  
  // Validate mcpName field
  if (!packageJson.mcpName) {
    throw new Error('Missing mcpName field in package.json');
  }
  
  if (!packageJson.mcpName.startsWith('io.github.imbenrabi/')) {
    throw new Error(`Invalid mcpName format: ${packageJson.mcpName}. Should start with 'io.github.imbenrabi/'`);
  }
  
  // Validate files array
  if (!packageJson.files || !Array.isArray(packageJson.files)) {
    throw new Error('Missing or invalid files array in package.json');
  }
  
  const requiredFiles = ['dist', 'LICENSE', 'README.md'];
  const missingFiles = requiredFiles.filter(file => !packageJson.files!.includes(file));
  
  if (missingFiles.length > 0) {
    throw new Error(`Missing required files in package.json files array: ${missingFiles.join(', ')}`);
  }
  
  // Validate binary configuration
  if (!packageJson.bin || !packageJson.bin['fmp-mcp']) {
    throw new Error('Missing or invalid bin configuration in package.json');
  }
  
  console.log('✅ package.json validation passed');
}

/**
 * Validates that all required files exist
 * @param packageJson - The parsed package.json object
 */
function validateRequiredFiles(packageJson: PackageJson): void {
  console.log('📁 Validating required files exist...');
  
  const requiredFiles = [
    'LICENSE',
    'README.md',
    'dist/index.js',
    'dist/index.d.ts'
  ];
  
  const missingFiles = requiredFiles.filter(file => !existsSync(file));
  
  if (missingFiles.length > 0) {
    throw new Error(`Missing required files: ${missingFiles.join(', ')}`);
  }
  
  // Validate binary file exists
  if (packageJson.bin && packageJson.bin['fmp-mcp']) {
    const binPath = packageJson.bin['fmp-mcp'];
    if (!existsSync(binPath)) {
      throw new Error(`Binary file does not exist: ${binPath}`);
    }
  }
  
  console.log('✅ Required files validation passed');
}

/**
 * Tests the build process
 */
function testBuildProcess(): void {
  console.log('🔨 Testing build process...');
  
  try {
    executeCommand('npm run build');
    console.log('✅ Build process completed successfully');
  } catch (error) {
    throw new Error(`Build process failed: ${error}`, { cause: error });
  }
}

/**
 * Tests the package creation process
 */
function testPackageCreation(): void {
  console.log('📦 Testing package creation...');
  
  try {
    const output = executeCommand('npm pack --dry-run');
    
    // Parse the output to extract package information
    const lines = output.split('\n');
    const packageSizeLine = lines.find(line => line.includes('package size:'));
    const totalFilesLine = lines.find(line => line.includes('total files:'));
    
    if (packageSizeLine) {
      console.log(`📊 ${packageSizeLine.trim()}`);
    }
    
    if (totalFilesLine) {
      console.log(`📊 ${totalFilesLine.trim()}`);
    }
    
    console.log('✅ Package creation test passed');
  } catch (error) {
    throw new Error(`Package creation failed: ${error}`, { cause: error });
  }
}

/**
 * Tests NPM registry connectivity
 */
function testNpmRegistry(): void {
  console.log('🌐 Testing NPM registry connectivity...');
  
  try {
    // Test if we can reach the NPM registry
    executeCommand('npm ping --registry https://registry.npmjs.org/');
    console.log('✅ NPM registry connectivity test passed');
  } catch {
    console.log('⚠️  NPM registry connectivity test failed (this is expected if not logged in)');
  }
}

/**
 * Validates version consistency across files
 */
function validateVersionConsistency(): void {
  console.log('🔢 Validating version consistency...');
  
  try {
    executeCommand('npm run version:validate');
    console.log('✅ Version consistency validation passed');
  } catch (error) {
    throw new Error(`Version consistency validation failed: ${error}`, { cause: error });
  }
}

/**
 * Main test function
 */
async function main(): Promise<void> {
  console.log('🚀 Starting NPM publishing test...\n');
  
  try {
    // Load and validate package.json
    const packageJsonPath = join(process.cwd(), 'package.json');
    const packageJsonContent = readFileSync(packageJsonPath, 'utf-8');
    const packageJson: PackageJson = JSON.parse(packageJsonContent);
    
    console.log(`📦 Testing package: ${packageJson.name}@${packageJson.version}`);
    console.log(`🏷️  MCP Name: ${packageJson.mcpName}\n`);
    
    // Run all validation tests
    validatePackageJson(packageJson);
    validateRequiredFiles(packageJson);
    validateVersionConsistency();
    testBuildProcess();
    testPackageCreation();
    testNpmRegistry();
    
    console.log('\n🎉 All NPM publishing tests passed!');
    console.log('\n📋 Next steps:');
    console.log('1. Login to NPM: npm login --registry https://registry.npmjs.org/');
    console.log('2. Publish package: npm publish --registry https://registry.npmjs.org/');
    console.log('3. Verify publication: npm view financial-modeling-prep-mcp-server');
    
  } catch (error) {
    console.error('\n❌ NPM publishing test failed:');
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

// Run the test if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { main as testNpmPublish };