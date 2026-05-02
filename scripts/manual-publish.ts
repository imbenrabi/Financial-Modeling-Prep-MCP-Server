#!/usr/bin/env tsx

/**
 * Manual publishing workflow for NPM and MCP Registry
 * This script provides a comprehensive, step-by-step publishing process with error handling and rollback capabilities.
 */

import { execSync, spawn } from 'child_process';
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { program } from 'commander';

interface PublishingState {
  npmPublished: boolean;
  registrySubmitted: boolean;
  gitTagCreated: boolean;
  backupFiles: Map<string, string>;
}

interface PublishOptions {
  dryRun: boolean;
  skipNpm: boolean;
  skipRegistry: boolean;
  skipValidation: boolean;
  force: boolean;
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
 * Executes a shell command and returns the output.
 * @param command - The command to execute.
 * @param options - Execution options.
 * @returns The command output as a string.
 */
function executeCommand(command: string, options: { silent?: boolean; cwd?: string } = {}): string {
  try {
    const result = execSync(command, {
      encoding: 'utf-8',
      stdio: options.silent ? 'pipe' : 'inherit',
      cwd: options.cwd || process.cwd()
    });
    return typeof result === 'string' ? result : '';
  } catch (error: any) {
    throw new Error(`Command failed: ${command}\n${error.message}`, { cause: error });
  }
}

/**
 * Executes a command interactively and returns success status.
 * @param command - The command to execute.
 * @param args - Command arguments.
 * @param options - Execution options.
 * @returns Promise resolving to success status.
 */
function executeInteractive(command: string, args: string[] = [], options: { cwd?: string } = {}): Promise<boolean> {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      cwd: options.cwd || process.cwd()
    });

    child.on('close', (code) => {
      resolve(code === 0);
    });

    child.on('error', () => {
      resolve(false);
    });
  });
}

/**
 * Prompts user for confirmation.
 * @param message - The confirmation message.
 * @returns Promise resolving to user's choice.
 */
function promptConfirmation(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    process.stdout.write(`${message} (y/N): `);
    
    process.stdin.once('data', (data) => {
      const input = data.toString().trim().toLowerCase();
      resolve(input === 'y' || input === 'yes');
    });
  });
}

/**
 * Creates a backup of important files before publishing.
 * @param state - The publishing state to track backups.
 */
function createBackups(state: PublishingState): void {
  console.log('📋 Creating backups of important files...');
  
  const filesToBackup = ['package.json', 'server.json', 'CHANGELOG.md'];
  
  for (const file of filesToBackup) {
    if (existsSync(file)) {
      const content = readFileSync(file, 'utf-8');
      state.backupFiles.set(file, content);
      console.log(`  ✅ Backed up ${file}`);
    }
  }
}

/**
 * Restores files from backup.
 * @param state - The publishing state containing backups.
 */
function restoreBackups(state: PublishingState): void {
  console.log('🔄 Restoring files from backup...');
  
  for (const [file, content] of state.backupFiles) {
    try {
      writeFileSync(file, content, 'utf-8');
      console.log(`  ✅ Restored ${file}`);
    } catch (error) {
      console.error(`  ❌ Failed to restore ${file}: ${getErrorMessage(error)}`);
    }
  }
}

/**
 * Validates the current environment and configuration.
 * @param options - Publishing options.
 */
async function validateEnvironment(options: PublishOptions): Promise<void> {
  console.log('🔍 Validating environment and configuration...\n');
  
  if (!options.skipValidation) {
    // Check version consistency
    console.log('1. Checking version consistency...');
    try {
      executeCommand('npm run version:validate', { silent: true });
      console.log('   ✅ Version consistency validated');
    } catch (error) {
      throw new Error(`Version validation failed: ${getErrorMessage(error)}`, { cause: error });
    }
    
    // Verify NPM readiness
    console.log('2. Verifying NPM publishing readiness...');
    try {
      executeCommand('npm run verify:npm-ready', { silent: true });
      console.log('   ✅ NPM publishing readiness verified');
    } catch (error) {
      throw new Error(`NPM readiness check failed: ${getErrorMessage(error)}`, { cause: error });
    }
    
    // Check if mcp-publisher is available
    if (!options.skipRegistry) {
      console.log('3. Checking MCP publisher availability...');
      try {
        executeCommand('which mcp-publisher', { silent: true });
        console.log('   ✅ mcp-publisher CLI found');
      } catch (error) {
        console.log('   ⚠️  mcp-publisher CLI not found');
        console.log('   📋 Install with: npm install -g @modelcontextprotocol/publisher');
        
        const shouldContinue = await promptConfirmation('Continue without registry publishing?');
        if (!shouldContinue) {
          throw new Error('MCP publisher CLI not available', { cause: error });
        }
        options.skipRegistry = true;
      }
    }
    
    // Check authentication status
    if (!options.skipRegistry) {
      console.log('4. Checking MCP registry authentication...');
      try {
        executeCommand('mcp-publisher whoami', { silent: true });
        console.log('   ✅ MCP registry authentication verified');
      } catch (error) {
        console.log('   ⚠️  Not authenticated with MCP registry');
        console.log('   📋 Login with: mcp-publisher login github');
        
        const shouldLogin = await promptConfirmation('Login to MCP registry now?');
        if (shouldLogin) {
          const loginSuccess = await executeInteractive('mcp-publisher', ['login', 'github']);
          if (!loginSuccess) {
            throw new Error('MCP registry authentication failed', { cause: error });
          }
        } else {
          options.skipRegistry = true;
        }
      }
    }
  }
  
  console.log('\n✅ Environment validation completed\n');
}

/**
 * Publishes the package to NPM.
 * @param state - The publishing state.
 * @param options - Publishing options.
 */
async function publishToNpm(state: PublishingState, options: PublishOptions): Promise<void> {
  if (options.skipNpm) {
    console.log('⏭️  Skipping NPM publishing');
    return;
  }
  
  console.log('📦 Publishing to NPM...');
  
  try {
    if (options.dryRun) {
      console.log('🔍 Dry run: Would publish to NPM');
      executeCommand('npm publish --dry-run', { silent: false });
    } else {
      // Check if already published
      const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'));
      try {
        executeCommand(`npm view ${packageJson.name}@${packageJson.version}`, { silent: true });
        console.log(`⚠️  Package ${packageJson.name}@${packageJson.version} already exists on NPM`);
        
        if (!options.force) {
          const shouldContinue = await promptConfirmation('Continue anyway?');
          if (!shouldContinue) {
            throw new Error('Package already published');
          }
        }
      } catch {
        // Package doesn't exist, which is good
      }
      
      executeCommand('npm publish --access public');
      state.npmPublished = true;
      console.log('✅ Successfully published to NPM');
    }
  } catch (error) {
    throw new Error(`NPM publishing failed: ${getErrorMessage(error)}`, { cause: error });
  }
}

/**
 * Submits the server to MCP Registry.
 * @param state - The publishing state.
 * @param options - Publishing options.
 */
async function submitToRegistry(state: PublishingState, options: PublishOptions): Promise<void> {
  if (options.skipRegistry) {
    console.log('⏭️  Skipping MCP registry submission');
    return;
  }
  
  console.log('🌐 Submitting to MCP Registry...');
  
  try {
    if (options.dryRun) {
      console.log('🔍 Dry run: Would submit to MCP registry');
      // In dry run mode, we'll just check if server.json exists and is valid JSON
      if (!existsSync('server.json')) {
        throw new Error('server.json file not found');
      }
      try {
        JSON.parse(readFileSync('server.json', 'utf-8'));
        console.log('   ✅ server.json is valid JSON');
      } catch (error) {
        throw new Error(`server.json is not valid JSON: ${getErrorMessage(error)}`, { cause: error });
      }
    } else {
      executeCommand('mcp-publisher publish server.json');
      state.registrySubmitted = true;
      console.log('✅ Successfully submitted to MCP Registry');
    }
  } catch (error) {
    throw new Error(`MCP registry submission failed: ${getErrorMessage(error)}`, { cause: error });
  }
}

/**
 * Verifies the published package and registry entry.
 * @param options - Publishing options.
 */
async function verifyPublication(options: PublishOptions): Promise<void> {
  if (options.dryRun) {
    console.log('⏭️  Skipping verification (dry run)');
    return;
  }
  
  console.log('🔍 Verifying publication...');
  
  const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'));
  
  // Verify NPM publication
  if (!options.skipNpm) {
    console.log('1. Verifying NPM publication...');
    try {
      const npmInfo = executeCommand(`npm view ${packageJson.name}@${packageJson.version} --json`, { silent: true });
      const npmData = JSON.parse(npmInfo);
      
      if (npmData.version === packageJson.version) {
        console.log(`   ✅ Package ${packageJson.name}@${packageJson.version} available on NPM`);
      } else {
        console.log(`   ⚠️  Version mismatch on NPM: expected ${packageJson.version}, found ${npmData.version}`);
      }
    } catch (error) {
      console.log(`   ❌ Failed to verify NPM publication: ${getErrorMessage(error)}`);
    }
  }
  
  // Verify registry entry
  if (!options.skipRegistry) {
    console.log('2. Verifying MCP registry entry...');
    try {
      // Check if server appears in registry search
      const registryName = packageJson.mcpName || `io.github.imbenrabi/${packageJson.name}`;
      executeCommand(`mcp-publisher search ${registryName}`, { silent: true });
      console.log(`   ✅ Server ${registryName} found in MCP registry`);
    } catch (error) {
      console.log(`   ⚠️  Registry verification failed: ${getErrorMessage(error)}`);
      console.log('   📋 Registry updates may take a few minutes to propagate');
    }
  }
  
  console.log('\n✅ Publication verification completed');
}

/**
 * Performs rollback operations in case of failure.
 * @param state - The publishing state.
 * @param error - The error that triggered the rollback.
 */
async function performRollback(state: PublishingState, error: Error): Promise<void> {
  console.log('\n🚨 Publishing failed, initiating rollback...');
  console.log(`❌ Error: ${error.message}\n`);
  
  let rollbackActions: string[] = [];
  
  // Restore file backups
  if (state.backupFiles.size > 0) {
    restoreBackups(state);
    rollbackActions.push('Restored file backups');
  }
  
  // Note: We cannot automatically unpublish from NPM due to NPM policies
  if (state.npmPublished) {
    console.log('⚠️  Cannot automatically unpublish from NPM');
    console.log('📋 If needed, manually deprecate with: npm deprecate <package>@<version> "reason"');
    rollbackActions.push('NPM package remains published (manual action required)');
  }
  
  // Registry rollback is typically not needed as failed submissions don't create entries
  if (state.registrySubmitted) {
    console.log('📋 Registry entry may need manual removal if partially created');
    rollbackActions.push('Registry entry may need manual cleanup');
  }
  
  if (rollbackActions.length > 0) {
    console.log('\n🔄 Rollback actions performed:');
    rollbackActions.forEach(action => console.log(`  - ${action}`));
  }
  
  console.log('\n📋 Manual cleanup may be required. Check the error above for details.');
}

/**
 * Displays troubleshooting information for common issues.
 */
function displayTroubleshooting(): void {
  console.log('\n🔧 Troubleshooting Common Issues:\n');
  
  console.log('📦 NPM Publishing Issues:');
  console.log('  - Authentication: npm login --registry https://registry.npmjs.org/');
  console.log('  - Package exists: Check version number or use --force flag');
  console.log('  - Permission denied: Ensure you have publish rights to the package');
  console.log('  - Network issues: Check internet connection and NPM registry status');
  
  console.log('\n🌐 MCP Registry Issues:');
  console.log('  - Authentication: mcp-publisher login github');
  console.log('  - Schema validation: Check server.json format against schema');
  console.log('  - NPM validation: Ensure package is published to NPM first');
  console.log('  - Network issues: Check MCP registry service status');
  
  console.log('\n🔢 Version Issues:');
  console.log('  - Inconsistent versions: npm run version:sync <version>');
  console.log('  - Invalid SemVer: Use format x.y.z (e.g., 1.2.3)');
  console.log('  - CHANGELOG format: Follow Keep a Changelog format');
  
  console.log('\n🔍 Validation Issues:');
  console.log('  - Build failures: npm run build');
  console.log('  - Test failures: npm test');
  console.log('  - Missing files: Check package.json files array');
  console.log('  - Schema errors: Validate server.json with mcp-publisher validate');
  
  console.log('\n📞 Getting Help:');
  console.log('  - MCP Registry docs: https://docs.modelcontextprotocol.io/registry/');
  console.log('  - NPM publishing guide: https://docs.npmjs.com/packages-and-modules/');
  console.log('  - Project issues: https://github.com/imbenrabi/Financial-Modeling-Prep-MCP-Server/issues');
}

/**
 * Main publishing workflow function.
 * @param options - Publishing options.
 */
async function runPublishingWorkflow(options: PublishOptions): Promise<void> {
  const state: PublishingState = {
    npmPublished: false,
    registrySubmitted: false,
    gitTagCreated: false,
    backupFiles: new Map()
  };
  
  try {
    console.log('🚀 Starting manual publishing workflow...\n');
    
    if (options.dryRun) {
      console.log('🔍 Running in DRY RUN mode - no actual publishing will occur\n');
    }
    
    // Step 1: Create backups
    createBackups(state);
    
    // Step 2: Validate environment
    await validateEnvironment(options);
    
    // Step 3: Show publishing plan
    const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'));
    console.log('📋 Publishing Plan:');
    console.log(`  Package: ${packageJson.name}@${packageJson.version}`);
    console.log(`  MCP Name: ${packageJson.mcpName}`);
    console.log(`  NPM Publishing: ${options.skipNpm ? 'SKIPPED' : 'ENABLED'}`);
    console.log(`  Registry Submission: ${options.skipRegistry ? 'SKIPPED' : 'ENABLED'}`);
    console.log(`  Dry Run: ${options.dryRun ? 'YES' : 'NO'}\n`);
    
    if (!options.dryRun && !options.force) {
      const shouldContinue = await promptConfirmation('Proceed with publishing?');
      if (!shouldContinue) {
        console.log('❌ Publishing cancelled by user');
        return;
      }
    }
    
    // Step 4: Publish to NPM
    await publishToNpm(state, options);
    
    // Step 5: Submit to MCP Registry
    await submitToRegistry(state, options);
    
    // Step 6: Verify publication
    await verifyPublication(options);
    
    // Success!
    console.log('\n🎉 Publishing workflow completed successfully!');
    
    if (!options.dryRun) {
      console.log('\n📋 Next Steps:');
      console.log('1. Verify package installation: npm install -g financial-modeling-prep-mcp-server');
      console.log('2. Check registry listing: https://registry.modelcontextprotocol.io/');
      console.log('3. Test server functionality: fmp-mcp --help');
      console.log('4. Update documentation if needed');
    }
    
  } catch (error) {
    await performRollback(state, error as Error);
    displayTroubleshooting();
    process.exit(1);
  }
}

// Configure CLI program
program
  .name('manual-publish')
  .description('Manual publishing workflow for NPM and MCP Registry')
  .version('1.0.0');

program
  .command('publish')
  .description('Run the complete publishing workflow')
  .option('-d, --dry-run', 'Show what would be published without making changes')
  .option('--skip-npm', 'Skip NPM publishing')
  .option('--skip-registry', 'Skip MCP registry submission')
  .option('--skip-validation', 'Skip environment validation checks')
  .option('-f, --force', 'Force publishing without confirmation prompts')
  .action(async (options) => {
    await runPublishingWorkflow(options);
  });

program
  .command('troubleshoot')
  .description('Display troubleshooting information')
  .action(() => {
    displayTroubleshooting();
  });

program
  .command('validate')
  .description('Validate environment and configuration only')
  .action(async () => {
    try {
      await validateEnvironment({ 
        dryRun: false, 
        skipNpm: false, 
        skipRegistry: false, 
        skipValidation: false, 
        force: false 
      });
      console.log('✅ All validations passed!');
    } catch (error) {
      console.error('❌ Validation failed:', getErrorMessage(error));
      displayTroubleshooting();
      process.exit(1);
    }
  });

// Parse command line arguments
if (import.meta.url === `file://${process.argv[1]}`) {
  program.parse();
}

export { runPublishingWorkflow };