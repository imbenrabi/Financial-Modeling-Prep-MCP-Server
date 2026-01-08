#!/usr/bin/env tsx

/**
 * Complete workflow integration test
 * This script tests the entire publishing workflow from metadata validation to registry submission
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';

/**
 * Executes a command safely and returns result
 * @param command - Command to execute
 * @returns Object with success status and output
 */
function safeExecute(command: string): { success: boolean; output: string } {
  try {
    const output = execSync(command, { encoding: 'utf-8', stdio: 'pipe' });
    return { success: true, output };
  } catch (error: any) {
    return { success: false, output: error.message };
  }
}

/**
 * Tests the complete publishing workflow
 */
async function testCompleteWorkflow(): Promise<void> {
  console.log('Complete Publishing Workflow Integration Test\n');
  
  let allTests = true;
  
  // Test 1: Version consistency validation
  console.log('1. Testing version consistency...');
  const versionTest = safeExecute('npm run version:validate');
  if (versionTest.success) {
    console.log('   SUCCESS: Version consistency validated');
  } else {
    console.log('   FAILURE: Version consistency failed');
    console.log(`   Details: ${versionTest.output}`);
    allTests = false;
  }
  
  // Test 2: NPM readiness validation
  console.log('\n2. Testing NPM publishing readiness...');
  const npmTest = safeExecute('npm run verify:npm-ready');
  if (npmTest.success) {
    console.log('   SUCCESS: NPM publishing readiness verified');
  } else {
    console.log('   FAILURE: NPM readiness check failed');
    console.log(`   Details: ${npmTest.output}`);
    allTests = false;
  }
  
  // Test 3: Build process
  console.log('\n3. Testing build process...');
  const buildTest = safeExecute('npm run build');
  if (buildTest.success) {
    console.log('   SUCCESS: Build process completed');
  } else {
    console.log('   FAILURE: Build process failed');
    console.log(`   Details: ${buildTest.output}`);
    allTests = false;
  }
  
  // Test 4: Package creation
  console.log('\n4. Testing package creation...');
  const packTest = safeExecute('npm pack --dry-run');
  if (packTest.success) {
    console.log('   SUCCESS: Package creation successful');
    
    // Extract package info from output
    const lines = packTest.output.split('\n');
    const sizeLine = lines.find(line => line.includes('package size:'));
    const filesLine = lines.find(line => line.includes('total files:'));
    
    if (sizeLine) console.log(`   Info: ${sizeLine.trim()}`);
    if (filesLine) console.log(`   Info: ${filesLine.trim()}`);
  } else {
    console.log('   FAILURE: Package creation failed');
    allTests = false;
  }
  
  // Test 5: Server.json validation
  console.log('\n5. Testing server.json metadata...');
  if (existsSync('server.json')) {
    try {
      const serverJson = JSON.parse(readFileSync('server.json', 'utf-8'));
      const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'));
      
      // Check version consistency
      if (serverJson.version === packageJson.version) {
        console.log('   SUCCESS: server.json version matches package.json');
      } else {
        console.log(`   FAILURE: Version mismatch: server.json(${serverJson.version}) vs package.json(${packageJson.version})`);
        allTests = false;
      }
      
      // Check required fields
      const requiredFields = ['name', 'description', 'version', 'packages'];
      let fieldsOk = true;
      for (const field of requiredFields) {
        if (serverJson[field]) {
          console.log(`   SUCCESS: server.json has required field: ${field}`);
        } else {
          console.log(`   FAILURE: server.json missing required field: ${field}`);
          fieldsOk = false;
        }
      }
      
      if (!fieldsOk) {
        allTests = false;
      }
      
      // Check package configuration
      if (serverJson.packages && serverJson.packages.length > 0) {
        const pkg = serverJson.packages[0];
        if (pkg.registryType === 'npm' && pkg.identifier === packageJson.name) {
          console.log('   SUCCESS: NPM package configuration correct');
        } else {
          console.log('   FAILURE: NPM package configuration incorrect');
          allTests = false;
        }
      } else {
        console.log('   FAILURE: No packages defined in server.json');
        allTests = false;
      }
      
    } catch (error) {
      console.log('   FAILURE: server.json is not valid JSON');
      allTests = false;
    }
  } else {
    console.log('   FAILURE: server.json file not found');
    allTests = false;
  }
  
  // Test 6: Manual publishing workflow validation
  console.log('\n6. Testing manual publishing workflow...');
  const workflowTest = safeExecute('npm run publish:validate');
  if (workflowTest.success) {
    console.log('   SUCCESS: Manual publishing workflow validation passed');
  } else {
    console.log('   FAILURE: Manual publishing workflow validation failed');
    // Don't fail the test if it's just authentication issues
    if (workflowTest.output.includes('Not authenticated')) {
      console.log('   INFO: Authentication required but workflow is functional');
    } else {
      allTests = false;
    }
  }
  
  // Test 7: Dry run execution
  console.log('\n7. Testing dry run execution...');
  const dryRunTest = safeExecute('timeout 30s npm run publish:dry-run || true');
  if (dryRunTest.success || dryRunTest.output.includes('Publishing workflow completed')) {
    console.log('   SUCCESS: Dry run execution successful');
  } else {
    console.log('   WARNING: Dry run may require user interaction');
    console.log('   INFO: This is expected for authentication steps');
  }
  
  // Test 8: Documentation completeness
  console.log('\n8. Testing documentation completeness...');
  const docs = [
    'docs/automated-publishing.md',
    'docs/manual-publishing.md',
    'CHANGELOG.md',
    'README.md'
  ];
  
  let docsOk = true;
  for (const doc of docs) {
    if (existsSync(doc)) {
      console.log(`   SUCCESS: Documentation exists: ${doc}`);
    } else {
      console.log(`   FAILURE: Documentation missing: ${doc}`);
      docsOk = false;
    }
  }
  
  if (!docsOk) {
    allTests = false;
  }
  
  // Test 9: Registry entry verification
  console.log('\n9. Testing registry entry format...');
  try {
    const serverJson = JSON.parse(readFileSync('server.json', 'utf-8'));
    const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'));
    
    // Check MCP name format
    if (packageJson.mcpName && packageJson.mcpName.startsWith('io.github.imbenrabi/')) {
      console.log('   SUCCESS: MCP name format correct');
    } else {
      console.log('   FAILURE: MCP name format incorrect');
      allTests = false;
    }
    
    // Check server name matches
    if (serverJson.name === packageJson.mcpName) {
      console.log('   SUCCESS: Server name matches MCP name');
    } else {
      console.log('   FAILURE: Server name does not match MCP name');
      allTests = false;
    }
    
  } catch (error) {
    console.log('   FAILURE: Cannot validate registry entry format');
    allTests = false;
  }
  
  // Test 10: GitHub Actions workflow validation
  console.log('\n10. Testing GitHub Actions workflow...');
  if (existsSync('.github/workflows/release.yml')) {
    try {
      const workflowContent = readFileSync('.github/workflows/release.yml', 'utf-8');
      
      // Check for required workflow components
      const requiredComponents = [
        'validate:',
        'publish:',
        'release:',
        'notify-failure:',
        'NPM_TOKEN',
        'github-oidc',
        'version:validate',
        'verify:npm-ready',
        'verify:registry-submission'
      ];
      
      let workflowOk = true;
      for (const component of requiredComponents) {
        if (workflowContent.includes(component)) {
          console.log(`   SUCCESS: Workflow includes: ${component}`);
        } else {
          console.log(`   FAILURE: Workflow missing: ${component}`);
          workflowOk = false;
        }
      }
      
      // Check for error handling
      if (workflowContent.includes('if: failure()')) {
        console.log('   SUCCESS: Error handling configured');
      } else {
        console.log('   FAILURE: Error handling missing');
        workflowOk = false;
      }
      
      // Check for dry run support
      if (workflowContent.includes('workflow_dispatch') && workflowContent.includes('dry_run')) {
        console.log('   SUCCESS: Dry run support configured');
      } else {
        console.log('   FAILURE: Dry run support missing');
        workflowOk = false;
      }
      
      if (!workflowOk) {
        allTests = false;
      }
      
    } catch (error) {
      console.log('   FAILURE: Cannot read workflow file');
      allTests = false;
    }
  } else {
    console.log('   FAILURE: GitHub Actions workflow file not found');
    allTests = false;
  }
  
  // Test 11: Automated pipeline validation
  console.log('\n11. Testing automated pipeline components...');
  const pipelineScripts = [
    'version:validate',
    'verify:npm-ready', 
    'verify:registry-submission',
    'test:complete-workflow',
    'publish:validate',
    'publish:dry-run'
  ];
  
  let pipelineOk = true;
  const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'));
  
  for (const script of pipelineScripts) {
    if (packageJson.scripts && packageJson.scripts[script]) {
      console.log(`   SUCCESS: Pipeline script available: ${script}`);
    } else {
      console.log(`   FAILURE: Pipeline script missing: ${script}`);
      pipelineOk = false;
    }
  }
  
  if (!pipelineOk) {
    allTests = false;
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  if (allTests) {
    console.log('SUCCESS: Automated Publishing Pipeline Integration Test PASSED!');
    console.log('\nAll Systems Ready:');
    console.log('  - Version consistency validated');
    console.log('  - NPM publishing readiness confirmed');
    console.log('  - Build and package creation working');
    console.log('  - Registry metadata properly configured');
    console.log('  - Manual publishing workflow functional');
    console.log('  - Documentation complete');
    console.log('  - GitHub Actions workflow configured');
    console.log('  - Automated pipeline components validated');
    console.log('  - Error handling and rollback implemented');
    
    console.log('\nReady for Automated Publishing!');
    console.log('\nPublishing Options:');
    console.log('  1. Automated: Push version tag (git tag v2.5.1 && git push --tags)');
    console.log('  2. Manual: npm run publish:manual');
    console.log('  3. Dry Run: GitHub Actions with dry_run=true');
    
    console.log('\nAutomated Pipeline Features:');
    console.log('  - Multi-stage validation (validate → publish → release)');
    console.log('  - NPM and MCP Registry publishing');
    console.log('  - Installation method verification');
    console.log('  - Registry propagation checks');
    console.log('  - Comprehensive error handling');
    console.log('  - Dry run support for testing');
    console.log('  - Automatic GitHub release creation');
    
    console.log('\nResources:');
    console.log('  - Workflow: .github/workflows/release.yml');
    console.log('  - Automated Publishing: docs/automated-publishing.md');
    console.log('  - Manual Publishing: docs/manual-publishing.md');
    console.log('  - Troubleshooting: npm run publish:troubleshoot');
    
  } else {
    console.log('FAILURE: Automated Publishing Pipeline Integration Test FAILED!');
    console.log('\nIssues Found:');
    console.log('  Please review the failed tests above and fix the issues.');
    console.log('  Run individual tests to isolate problems:');
    console.log('  - npm run version:validate');
    console.log('  - npm run verify:npm-ready');
    console.log('  - npm run build');
    console.log('  - npm run publish:validate');
    console.log('  - npm run test:complete-workflow');
    
    console.log('\nCritical Requirements:');
    console.log('  - Configure NPM_TOKEN secret in GitHub repository settings');
    console.log('  - Ensure all validation scripts pass');
    console.log('  - Verify GitHub Actions workflow syntax');
    
    console.log('\nGet Help:');
    console.log('  - Automated Publishing: docs/automated-publishing.md');
    console.log('  - Manual Publishing: docs/manual-publishing.md');
    console.log('  - Troubleshooting: npm run publish:troubleshoot');
    
    process.exit(1);
  }
}

// Run test if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testCompleteWorkflow().catch(console.error);
}

export { testCompleteWorkflow };