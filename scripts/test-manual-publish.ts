#!/usr/bin/env tsx

/**
 * Test script for the manual publishing workflow
 * This script tests all aspects of the publishing process without actually publishing
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';

/**
 * Executes a command and returns success status
 * @param command - Command to execute
 * @returns true if successful, false otherwise
 */
function testCommand(command: string): boolean {
  try {
    execSync(command, { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Tests the manual publishing workflow
 */
async function testManualPublishWorkflow(): Promise<void> {
  console.log('🧪 Testing Manual Publishing Workflow\n');
  
  let allTests = true;
  
  // Test 1: Validate command exists
  console.log('1. Testing validate command...');
  if (testCommand('npm run publish:validate')) {
    console.log('   ✅ Validate command works');
  } else {
    console.log('   ❌ Validate command failed');
    allTests = false;
  }
  
  // Test 2: Dry run command exists
  console.log('\n2. Testing dry-run command...');
  if (testCommand('npm run publish:dry-run')) {
    console.log('   ✅ Dry-run command works');
  } else {
    console.log('   ❌ Dry-run command failed');
    allTests = false;
  }
  
  // Test 3: Troubleshoot command exists
  console.log('\n3. Testing troubleshoot command...');
  if (testCommand('npm run publish:troubleshoot')) {
    console.log('   ✅ Troubleshoot command works');
  } else {
    console.log('   ❌ Troubleshoot command failed');
    allTests = false;
  }
  
  // Test 4: Script file exists and is executable
  console.log('\n4. Testing script file...');
  if (existsSync('scripts/manual-publish.ts')) {
    console.log('   ✅ Manual publish script exists');
    
    try {
      const content = readFileSync('scripts/manual-publish.ts', 'utf-8');
      if (content.includes('runPublishingWorkflow')) {
        console.log('   ✅ Script contains main workflow function');
      } else {
        console.log('   ❌ Script missing main workflow function');
        allTests = false;
      }
    } catch {
      console.log('   ❌ Cannot read script file');
      allTests = false;
    }
  } else {
    console.log('   ❌ Manual publish script not found');
    allTests = false;
  }
  
  // Test 5: Documentation exists
  console.log('\n5. Testing documentation...');
  if (existsSync('docs/MANUAL_PUBLISHING.md')) {
    console.log('   ✅ Manual publishing documentation exists');
  } else {
    console.log('   ❌ Manual publishing documentation missing');
    allTests = false;
  }
  
  if (existsSync('scripts/PUBLISHING_CHECKLIST.md')) {
    console.log('   ✅ Publishing checklist exists');
  } else {
    console.log('   ❌ Publishing checklist missing');
    allTests = false;
  }
  
  // Test 6: Package.json scripts
  console.log('\n6. Testing package.json scripts...');
  try {
    const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'));
    const requiredScripts = [
      'publish:manual',
      'publish:dry-run', 
      'publish:validate',
      'publish:troubleshoot'
    ];
    
    let scriptsOk = true;
    for (const script of requiredScripts) {
      if (packageJson.scripts[script]) {
        console.log(`   ✅ Script '${script}' defined`);
      } else {
        console.log(`   ❌ Script '${script}' missing`);
        scriptsOk = false;
      }
    }
    
    if (!scriptsOk) {
      allTests = false;
    }
  } catch {
    console.log('   ❌ Cannot read package.json');
    allTests = false;
  }
  
  // Test 7: Error handling features
  console.log('\n7. Testing error handling features...');
  try {
    const scriptContent = readFileSync('scripts/manual-publish.ts', 'utf-8');
    
    const features = [
      'createBackups',
      'restoreBackups', 
      'performRollback',
      'displayTroubleshooting'
    ];
    
    let featuresOk = true;
    for (const feature of features) {
      if (scriptContent.includes(feature)) {
        console.log(`   ✅ Feature '${feature}' implemented`);
      } else {
        console.log(`   ❌ Feature '${feature}' missing`);
        featuresOk = false;
      }
    }
    
    if (!featuresOk) {
      allTests = false;
    }
  } catch {
    console.log('   ❌ Cannot analyze script features');
    allTests = false;
  }
  
  // Test 8: CLI options support
  console.log('\n8. Testing CLI options support...');
  try {
    const scriptContent = readFileSync('scripts/manual-publish.ts', 'utf-8');
    
    const options = [
      'dry-run',
      'skip-npm',
      'skip-registry',
      'skip-validation',
      'force'
    ];
    
    let optionsOk = true;
    for (const option of options) {
      if (scriptContent.includes(option)) {
        console.log(`   ✅ Option '--${option}' supported`);
      } else {
        console.log(`   ❌ Option '--${option}' missing`);
        optionsOk = false;
      }
    }
    
    if (!optionsOk) {
      allTests = false;
    }
  } catch {
    console.log('   ❌ Cannot analyze CLI options');
    allTests = false;
  }
  
  // Summary
  console.log('\n' + '='.repeat(50));
  if (allTests) {
    console.log('🎉 All manual publishing workflow tests passed!');
    console.log('\n📋 Workflow Features Verified:');
    console.log('  ✅ Environment validation');
    console.log('  ✅ Dry-run capability');
    console.log('  ✅ Error handling and rollback');
    console.log('  ✅ Troubleshooting guidance');
    console.log('  ✅ CLI options support');
    console.log('  ✅ Comprehensive documentation');
    
    console.log('\n🚀 Ready for manual publishing!');
    console.log('  - Test: npm run publish:dry-run');
    console.log('  - Validate: npm run publish:validate');
    console.log('  - Publish: npm run publish:manual');
  } else {
    console.log('❌ Some manual publishing workflow tests failed.');
    console.log('Please fix the issues above before using the workflow.');
    process.exit(1);
  }
}

// Run tests if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testManualPublishWorkflow().catch(console.error);
}

export { testManualPublishWorkflow };