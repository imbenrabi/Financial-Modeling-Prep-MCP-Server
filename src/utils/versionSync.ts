import { readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";

/**
 * Interface representing version information across different files
 */
export interface VersionInfo {
  packageJson: string;
  serverJson: string;
  changelog?: string;
}

/**
 * Interface for validation results
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Interface for version synchronization options
 */
export interface SyncOptions {
  dryRun?: boolean;
  validateSchema?: boolean;
  updateChangelog?: boolean;
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
 * Validates if a version string follows semantic versioning (SemVer) format.
 * @param version - The version string to validate.
 * @returns True if the version is valid SemVer, false otherwise.
 */
export function isValidSemVer(version: string): boolean {
  const semverRegex =
    /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*|[0-9a-zA-Z-]*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*|[0-9a-zA-Z-]*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
  return semverRegex.test(version);
}

/**
 * Reads and parses the package.json file.
 * @param rootPath - The root path of the project.
 * @returns Promise resolving to the parsed package.json content.
 */
async function readPackageJson(rootPath: string): Promise<any> {
  const packagePath = join(rootPath, "package.json");
  const content = await readFile(packagePath, "utf-8");
  return JSON.parse(content);
}

/**
 * Reads and parses the server.json file.
 * @param rootPath - The root path of the project.
 * @returns Promise resolving to the parsed server.json content.
 */
async function readServerJson(rootPath: string): Promise<any> {
  const serverPath = join(rootPath, "server.json");
  const content = await readFile(serverPath, "utf-8");
  return JSON.parse(content);
}

/**
 * Reads the CHANGELOG.md file and extracts the latest version.
 * @param rootPath - The root path of the project.
 * @returns Promise resolving to the latest version from changelog, or undefined if not found.
 */
async function readChangelogVersion(
  rootPath: string
): Promise<string | undefined> {
  const changelogPath = join(rootPath, "CHANGELOG.md");

  if (!existsSync(changelogPath)) {
    return undefined;
  }

  const content = await readFile(changelogPath, "utf-8");

  // Look for version patterns like ## [1.2.3] or ## 1.2.3
  const versionMatch = content.match(
    /^##\s*\[?(\d+\.\d+\.\d+(?:-[a-zA-Z0-9.-]+)?(?:\+[a-zA-Z0-9.-]+)?)\]?/m
  );
  return versionMatch ? versionMatch[1] : undefined;
}

/**
 * Retrieves version information from all relevant files.
 * @param rootPath - The root path of the project (defaults to current working directory).
 * @returns Promise resolving to version information from all files.
 */
export async function getVersionInfo(
  rootPath: string = process.cwd()
): Promise<VersionInfo> {
  const [packageJson, serverJson, changelog] = await Promise.all([
    readPackageJson(rootPath),
    readServerJson(rootPath),
    readChangelogVersion(rootPath),
  ]);

  return {
    packageJson: packageJson.version,
    serverJson: serverJson.version,
    changelog,
  };
}

/**
 * Validates version consistency across all files and SemVer compliance.
 * @param rootPath - The root path of the project (defaults to current working directory).
 * @returns Promise resolving to validation results.
 */
export async function validateVersionConsistency(
  rootPath: string = process.cwd()
): Promise<ValidationResult> {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
  };

  try {
    const versionInfo = await getVersionInfo(rootPath);

    // Validate SemVer format
    if (!isValidSemVer(versionInfo.packageJson)) {
      result.errors.push(
        `package.json version "${versionInfo.packageJson}" is not valid SemVer`
      );
      result.isValid = false;
    }

    if (!isValidSemVer(versionInfo.serverJson)) {
      result.errors.push(
        `server.json version "${versionInfo.serverJson}" is not valid SemVer`
      );
      result.isValid = false;
    }

    // Validate version consistency
    if (versionInfo.packageJson !== versionInfo.serverJson) {
      result.errors.push(
        `Version mismatch: package.json (${versionInfo.packageJson}) != server.json (${versionInfo.serverJson})`
      );
      result.isValid = false;
    }

    // Check changelog version if it exists
    if (versionInfo.changelog) {
      if (!isValidSemVer(versionInfo.changelog)) {
        result.warnings.push(
          `CHANGELOG.md version "${versionInfo.changelog}" is not valid SemVer`
        );
      } else if (versionInfo.changelog !== versionInfo.packageJson) {
        result.warnings.push(
          `CHANGELOG.md version (${versionInfo.changelog}) differs from package.json (${versionInfo.packageJson})`
        );
      }
    } else {
      result.warnings.push("CHANGELOG.md not found or no version detected");
    }

    // Validate server.json package version consistency
    const serverJson = await readServerJson(rootPath);
    if (serverJson.packages && Array.isArray(serverJson.packages)) {
      for (let i = 0; i < serverJson.packages.length; i++) {
        const pkg = serverJson.packages[i];
        if (pkg.version && pkg.version !== versionInfo.serverJson) {
          result.errors.push(
            `server.json packages[${i}].version (${pkg.version}) != server.json.version (${versionInfo.serverJson})`
          );
          result.isValid = false;
        }
      }
    }
  } catch (error) {
    result.errors.push(
      `Failed to validate versions: ${getErrorMessage(error)}`
    );
    result.isValid = false;
  }

  return result;
} /**
 * 
Validates server.json against the official MCP schema.
 * @param rootPath - The root path of the project.
 * @returns Promise resolving to validation results.
 */
export async function validateServerJsonSchema(
  rootPath: string = process.cwd()
): Promise<ValidationResult> {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
  };

  try {
    const serverJson = await readServerJson(rootPath);

    // Basic schema validation checks
    const requiredFields = ["$schema", "name", "description", "version"];
    for (const field of requiredFields) {
      if (!serverJson[field]) {
        result.errors.push(`server.json missing required field: ${field}`);
        result.isValid = false;
      }
    }

    // Validate schema URL (only accept new schema format)
    const expectedSchema =
      "https://static.modelcontextprotocol.io/schemas/2025-10-17/server.schema.json";
    if (serverJson.$schema !== expectedSchema) {
      result.errors.push(
        `server.json uses schema: ${serverJson.$schema}, expected: ${expectedSchema}`
      );
      result.isValid = false;
    }

    // Validate name format (should include namespace)
    if (serverJson.name && !serverJson.name.includes("/")) {
      result.warnings.push(
        'server.json name should include namespace (e.g., "namespace/server-name")'
      );
    }

    // Validate description length (1-100 characters as per registry requirements)
    if (serverJson.description !== undefined) {
      if (
        serverJson.description.length < 1 ||
        serverJson.description.length > 100
      ) {
        result.errors.push(
          `server.json description must be 1-100 characters, got ${serverJson.description.length}`
        );
        result.isValid = false;
      }
    }

    // Validate version format
    if (serverJson.version && !isValidSemVer(serverJson.version)) {
      result.errors.push(
        `server.json version "${serverJson.version}" is not valid SemVer`
      );
      result.isValid = false;
    }

    // Validate packages array
    if (serverJson.packages && Array.isArray(serverJson.packages)) {
      for (let i = 0; i < serverJson.packages.length; i++) {
        const pkg = serverJson.packages[i];

        // Validate new schema format (camelCase only)
        if (!pkg.registryType) {
          result.errors.push(
            `server.json packages[${i}] missing registryType`
          );
          result.isValid = false;
        }

        if (!pkg.identifier) {
          result.errors.push(`server.json packages[${i}] missing identifier`);
          result.isValid = false;
        }

        if (!pkg.version) {
          result.errors.push(`server.json packages[${i}] missing version`);
          result.isValid = false;
        } else if (!isValidSemVer(pkg.version)) {
          result.errors.push(
            `server.json packages[${i}].version "${pkg.version}" is not valid SemVer`
          );
          result.isValid = false;
        }
      }
    }

    // Validate repository structure
    if (serverJson.repository) {
      const repo = serverJson.repository;
      if (!repo.url) {
        result.errors.push("server.json repository missing url field");
        result.isValid = false;
      }
      if (!repo.source) {
        result.errors.push("server.json repository missing source field");
        result.isValid = false;
      }
    }
  } catch (error) {
    result.errors.push(
      `Failed to validate server.json schema: ${getErrorMessage(error)}`
    );
    result.isValid = false;
  }

  return result;
}

/**
 * Updates the version in package.json file.
 * @param rootPath - The root path of the project.
 * @param newVersion - The new version to set.
 * @param dryRun - If true, only validates without writing changes.
 * @returns Promise resolving when update is complete.
 */
async function updatePackageJsonVersion(
  rootPath: string,
  newVersion: string,
  dryRun: boolean = false
): Promise<void> {
  const packagePath = join(rootPath, "package.json");
  const packageJson = await readPackageJson(rootPath);

  packageJson.version = newVersion;

  if (!dryRun) {
    await writeFile(
      packagePath,
      JSON.stringify(packageJson, null, 2) + "\n",
      "utf-8"
    );
  }
}

/**
 * Updates the version in server.json file and all package versions.
 * @param rootPath - The root path of the project.
 * @param newVersion - The new version to set.
 * @param dryRun - If true, only validates without writing changes.
 * @returns Promise resolving when update is complete.
 */
async function updateServerJsonVersion(
  rootPath: string,
  newVersion: string,
  dryRun: boolean = false
): Promise<void> {
  const serverPath = join(rootPath, "server.json");
  const serverJson = await readServerJson(rootPath);

  serverJson.version = newVersion;

  // Update package versions if they exist
  if (serverJson.packages && Array.isArray(serverJson.packages)) {
    for (const pkg of serverJson.packages) {
      if (pkg.version) {
        pkg.version = newVersion;
      }
    }
  }

  if (!dryRun) {
    await writeFile(
      serverPath,
      JSON.stringify(serverJson, null, 2) + "\n",
      "utf-8"
    );
  }
}

/**
 * Updates or creates CHANGELOG.md with the new version entry.
 * @param rootPath - The root path of the project.
 * @param newVersion - The new version to add.
 * @param dryRun - If true, only validates without writing changes.
 * @returns Promise resolving when update is complete.
 */
async function updateChangelogVersion(
  rootPath: string,
  newVersion: string,
  dryRun: boolean = false
): Promise<void> {
  const changelogPath = join(rootPath, "CHANGELOG.md");
  const currentDate = new Date().toISOString().split("T")[0];

  let content = "";

  if (existsSync(changelogPath)) {
    content = await readFile(changelogPath, "utf-8");

    // Check if version already exists
    const versionExists =
      content.includes(`## [${newVersion}]`) ||
      content.includes(`## ${newVersion}`);
    if (versionExists) {
      return; // Version already exists, no need to update
    }

    // Insert new version after the first heading
    const lines = content.split("\n");
    const insertIndex = lines.findIndex((line) => line.startsWith("## "));

    if (insertIndex !== -1) {
      lines.splice(
        insertIndex,
        0,
        `## [${newVersion}] - ${currentDate}`,
        "",
        "### Added",
        `- Version ${newVersion} release`,
        ""
      );
      content = lines.join("\n");
    } else {
      // No existing versions, add after title
      content =
        content +
        `\n## [${newVersion}] - ${currentDate}\n\n### Added\n- Version ${newVersion} release\n`;
    }
  } else {
    // Create new changelog
    content = `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [${newVersion}] - ${currentDate}

### Added
- Version ${newVersion} release
`;
  }

  if (!dryRun) {
    await writeFile(changelogPath, content, "utf-8");
  }
}

/**
 * Synchronizes version across all files (package.json, server.json, CHANGELOG.md).
 * @param newVersion - The new version to set across all files.
 * @param rootPath - The root path of the project (defaults to current working directory).
 * @param options - Synchronization options.
 * @returns Promise resolving to validation results after synchronization.
 */
export async function synchronizeVersion(
  newVersion: string,
  rootPath: string = process.cwd(),
  options: SyncOptions = {}
): Promise<ValidationResult> {
  const {
    dryRun = false,
    validateSchema = true,
    updateChangelog = true,
  } = options;

  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
  };

  try {
    // Validate new version format
    if (!isValidSemVer(newVersion)) {
      result.errors.push(`New version "${newVersion}" is not valid SemVer`);
      result.isValid = false;
      return result;
    }

    // Update all files
    await Promise.all(
      [
        updatePackageJsonVersion(rootPath, newVersion, dryRun),
        updateServerJsonVersion(rootPath, newVersion, dryRun),
        updateChangelog && updateChangelogVersion(rootPath, newVersion, dryRun),
      ].filter(Boolean)
    );

    if (dryRun) {
      result.warnings.push("Dry run mode: no files were actually modified");
    }

    // Validate schema if requested
    if (validateSchema) {
      const schemaValidation = await validateServerJsonSchema(rootPath);
      result.errors.push(...schemaValidation.errors);
      result.warnings.push(...schemaValidation.warnings);
      if (!schemaValidation.isValid) {
        result.isValid = false;
      }
    }

    // Final consistency validation
    if (!dryRun) {
      const consistencyValidation = await validateVersionConsistency(rootPath);
      result.errors.push(...consistencyValidation.errors);
      result.warnings.push(...consistencyValidation.warnings);
      if (!consistencyValidation.isValid) {
        result.isValid = false;
      }
    }
  } catch (error) {
    result.errors.push(
      `Failed to synchronize version: ${getErrorMessage(error)}`
    );
    result.isValid = false;
  }

  return result;
}

/**
 * Gets the current version from package.json.
 * @param rootPath - The root path of the project (defaults to current working directory).
 * @returns Promise resolving to the current version string.
 */
export async function getCurrentVersion(
  rootPath: string = process.cwd()
): Promise<string> {
  const packageJson = await readPackageJson(rootPath);
  return packageJson.version;
}
