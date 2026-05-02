#!/usr/bin/env tsx

/**
 * Simple verification script to ensure the package is ready for NPM publishing
 * This script performs essential checks without complex installation testing
 */

import { readFileSync, existsSync } from "fs";
import { execSync } from "child_process";

interface PackageJson {
  name: string;
  version: string;
  mcpName?: string;
  main: string;
  bin?: Record<string, string>;
  files?: string[];
}

/**
 * Executes a command safely and returns success status
 * @param command - Command to execute
 * @returns true if command succeeded, false otherwise
 */
function safeExecute(command: string): boolean {
  try {
    execSync(command, { stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}

/**
 * Main verification function
 */
function main(): void {
  console.log("🔍 Verifying NPM publishing readiness...\n");

  let allChecks = true;

  // Check 1: package.json exists and has required fields
  console.log("1. Checking package.json configuration...");
  try {
    const packageJson: PackageJson = JSON.parse(
      readFileSync("package.json", "utf-8")
    );

    if (!packageJson.mcpName) {
      console.log("   ❌ Missing mcpName field");
      allChecks = false;
    } else if (!packageJson.mcpName.startsWith("io.github.imbenrabi/")) {
      console.log(`   ❌ Invalid mcpName format: ${packageJson.mcpName}`);
      allChecks = false;
    } else {
      console.log(`   ✅ mcpName: ${packageJson.mcpName}`);
    }

    if (!packageJson.files || !packageJson.files.includes("dist")) {
      console.log("   ❌ Missing dist in files array");
      allChecks = false;
    } else {
      console.log("   ✅ Files array includes dist");
    }

    if (!packageJson.bin || !packageJson.bin["fmp-mcp"]) {
      console.log("   ❌ Missing binary configuration");
      allChecks = false;
    } else {
      console.log("   ✅ Binary configuration present");
    }
  } catch {
    console.log("   ❌ Failed to read package.json");
    allChecks = false;
  }

  // Check 2: Build works
  console.log("\n2. Checking build process...");
  if (safeExecute("npm run build")) {
    console.log("   ✅ Build successful");
  } else {
    console.log("   ❌ Build failed");
    allChecks = false;
  }

  // Check 3: Required files exist (after build)
  console.log("\n3. Checking required files...");
  const requiredFiles = [
    "LICENSE",
    "README.md",
    "dist/index.js",
    "dist/index.d.ts",
  ];

  for (const file of requiredFiles) {
    if (existsSync(file)) {
      console.log(`   ✅ ${file}`);
    } else {
      console.log(`   ❌ Missing: ${file}`);
      allChecks = false;
    }
  }

  // Check 4: Package creation works
  console.log("\n4. Checking package creation...");
  if (safeExecute("npm pack --dry-run")) {
    console.log("   ✅ Package creation successful");
  } else {
    console.log("   ❌ Package creation failed");
    allChecks = false;
  }

  // Check 5: Version consistency
  console.log("\n5. Checking version consistency...");
  if (safeExecute("npm run version:validate")) {
    console.log("   ✅ Version consistency verified");
  } else {
    console.log("   ❌ Version inconsistency detected");
    allChecks = false;
  }

  // Summary
  console.log("\n" + "=".repeat(50));
  if (allChecks) {
    console.log("🎉 All checks passed! Package is ready for NPM publishing.");
    console.log("\n📋 Manual publishing steps:");
    console.log("1. npm login --registry https://registry.npmjs.org/");
    console.log("2. npm publish --registry https://registry.npmjs.org/");
    console.log("3. npm view financial-modeling-prep-mcp-server");
  } else {
    console.log(
      "❌ Some checks failed. Please fix the issues above before publishing."
    );
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
