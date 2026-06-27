import { TOOL_SETS } from "../constants/toolSets.js";
import type { ToolSet } from "../types.js";

/**
 * Result type for toolset name validation
 */
interface ToolsetNameValidationResult {
  isValid: boolean;
  sanitized?: ToolSet;
  error?: string;
}

/**
 * Result type for tool sets array validation
 */
interface ToolSetsValidationResult {
  valid: ToolSet[];
  invalid: unknown[];
  errors: string[];
}

/**
 * Validates and sanitizes a single toolset name
 * @param toolsetName - The toolset name to validate
 * @param availableToolsets - Optional array of available toolsets for validation
 * @returns Validation result with sanitized name if valid
 *
 * @example
 * ```typescript
 * const result = validateAndSanitizeToolsetName("  search  ");
 * if (result.isValid) {
 *   console.log(result.sanitized); // "search"
 * } else {
 *   console.error(result.error);
 * }
 * ```
 */
export function validateAndSanitizeToolsetName(
  toolsetName: unknown,
  availableToolsets?: ToolSet[]
): ToolsetNameValidationResult {
  // Check if toolset name is provided and is a string
  if (!toolsetName || typeof toolsetName !== 'string') {
    const available = availableToolsets || Object.keys(TOOL_SETS) as ToolSet[];
    return {
      isValid: false,
      error: `Invalid toolset name provided. Must be a non-empty string. Available toolsets: ${available.join(', ')}`
    };
  }

  // Sanitize by trimming whitespace
  const sanitized = toolsetName.trim() as ToolSet;
  
  // Check if sanitized name is empty
  if (sanitized.length === 0) {
    const available = availableToolsets || Object.keys(TOOL_SETS) as ToolSet[];
    return {
      isValid: false,
      error: `Empty toolset name provided. Available toolsets: ${available.join(', ')}`
    };
  }

  // Check if toolset exists in definitions
  if (!TOOL_SETS[sanitized]) {
    const available = availableToolsets || Object.keys(TOOL_SETS) as ToolSet[];
    return {
      isValid: false,
      error: `Toolset '${sanitized}' not found. Available toolsets: ${available.join(', ')}`
    };
  }

  return {
    isValid: true,
    sanitized
  };
}

/**
 * Validates an array of toolset names
 * @param toolSets - Array of toolset names to validate
 * @returns Validation result with separated valid and invalid entries
 *
 * @example
 * ```typescript
 * const result = validateToolSets(["search", "", "invalid", "quotes"]);
 * console.log(result.valid);   // ["search", "quotes"]
 * console.log(result.invalid); // ["", "invalid"]
 * console.log(result.errors);  // ["Empty tool set found", "Toolset 'invalid' not found..."]
 * ```
 */
export function validateToolSets(toolSets: unknown[]): ToolSetsValidationResult {
  const valid: ToolSet[] = [];
  const invalid: unknown[] = [];
  const errors: string[] = [];

  for (const toolset of toolSets) {
    const result = validateAndSanitizeToolsetName(toolset);
    
    if (result.isValid && result.sanitized) {
      valid.push(result.sanitized);
    } else {
      invalid.push(toolset);
      if (result.error) {
        errors.push(result.error);
      }
    }
  }

  return { valid, invalid, errors };
}

/**
 * Validates a dynamic tool discovery configuration value
 * @param value - The configuration value to validate
 * @returns True if the value represents enabled dynamic tool discovery
 *
 * @example
 * ```typescript
 * validateDynamicToolDiscoveryConfig("true");     // true
 * validateDynamicToolDiscoveryConfig("TRUE");     // true
 * validateDynamicToolDiscoveryConfig("false");    // false
 * validateDynamicToolDiscoveryConfig("invalid");  // false (logs warning)
 * ```
 */
export function validateDynamicToolDiscoveryConfig(value: unknown): boolean {
  if (value === undefined || value === null) {
    return false;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value !== 'string') {
    console.warn(`Invalid DYNAMIC_TOOL_DISCOVERY config value (not string):`, value);
    return false;
  }

  const trimmedValue = value.trim().toLowerCase();
  
  if (trimmedValue === 'true') {
    return true;
  } else if (trimmedValue === 'false' || trimmedValue === '') {
    return false;
  } else {
    console.warn(`Invalid DYNAMIC_TOOL_DISCOVERY config value, expected "true" or "false":`, value);
    return false;
  }
}

/**
 * Parses a comma-separated string of toolset names with validation
 * @param input - Comma-separated string of toolset names
 * @returns Array of valid toolset names (invalid ones are filtered out with warnings)
 *
 * @example
 * ```typescript
 * const toolsets = parseCommaSeparatedToolSets("search, company, invalid, quotes");
 * console.log(toolsets); // ["search", "company", "quotes"] (invalid is filtered out)
 * ```
 */
export function parseCommaSeparatedToolSets(input: string): ToolSet[] {
  if (!input || typeof input !== 'string') {
    return [];
  }

  try {
    const rawToolSets = input
      .split(",")
      .map(s => s.trim())
      .filter(s => {
        if (s.length === 0) {
          console.warn(`Empty tool set found in comma-separated list, ignoring`);
          return false;
        }
        return true;
      });

    const validation = validateToolSets(rawToolSets);
    
    // Log warnings for invalid toolsets
    if (validation.invalid.length > 0) {
      console.warn(`Invalid tool sets found and ignored:`, validation.invalid);
      validation.errors.forEach(error => console.warn(error));
    }

    return validation.valid;
  } catch (error) {
    console.error(`Error parsing comma-separated tool sets: "${input}"`, error);
    return [];
  }
}

/**
 * Validates that modules exist for given toolset names
 * @param toolsetNames - Array of toolset names to check
 * @param getModulesForToolSets - Function to get modules for toolsets
 * @returns Validation result indicating if modules were found
 *
 * @example
 * ```typescript
 * const result = validateToolsetModules(["search"], getModulesForToolSets);
 * if (!result.isValid) {
 *   console.error(result.error);
 * }
 * ```
 */
export function validateToolsetModules(
  toolsetNames: ToolSet[],
  getModulesForToolSets: (toolsets: ToolSet[]) => string[]
): { isValid: boolean; modules?: string[]; error?: string } {
  try {
    const modules = getModulesForToolSets(toolsetNames);
    
    if (!modules || modules.length === 0) {
      return {
        isValid: false,
        error: `No modules found for toolsets: ${toolsetNames.join(', ')}. This may indicate a configuration error.`
      };
    }

    return {
      isValid: true,
      modules
    };
  } catch (error) {
    return {
      isValid: false,
      error: `Error getting modules for toolsets ${toolsetNames.join(', ')}: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Compares two arrays of strings for order-insensitive equality.
 * Treats inputs as multisets: element counts must match.
 */
export function areStringSetsEqual(a: string[], b: string[]): boolean {
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  const sa = [...a].toSorted();
  const sb = [...b].toSorted();
  return sa.every((v, i) => v === sb[i]);
}