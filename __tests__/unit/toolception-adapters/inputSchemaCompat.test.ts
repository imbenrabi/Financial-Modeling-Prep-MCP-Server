import { describe, it, expect } from 'vitest';
import { MODULE_ADAPTERS } from '../../../src/toolception-adapters/moduleAdapters.js';

/**
 * Toolception (from code-rabi/toolception#26) registers a tool with its own
 * schema only when inputSchema is a Zod schema or a raw shape whose values are
 * all Zod schemas. Anything else falls back to an open passthrough object:
 * clients stop seeing the parameters and arguments are no longer validated.
 * This guards every FMP tool against silently landing on that fallback.
 */
const isZodSchema = (value: unknown): boolean =>
  typeof value === 'object' && value !== null && ('_def' in value || '_zod' in value);

const isZodInputSchema = (schema: unknown): boolean => {
  if (typeof schema !== 'object' || schema === null) return false;
  if (isZodSchema(schema)) return true;
  return Object.values(schema).every(isZodSchema);
};

/**
 * The server registers 253 tools today. A much lower count means module
 * loading broke, which would make an empty non-Zod list pass trivially.
 */
const MIN_EXPECTED_TOOLS = 250;

describe('toolception input schema compatibility', () => {
  it('gives every tool a Zod input schema', async () => {
    const nonZodTools: string[] = [];
    let toolCount = 0;

    for (const [moduleName, loader] of Object.entries(MODULE_ADAPTERS)) {
      const tools = await loader({ accessToken: 'test-token' });
      for (const tool of tools) {
        toolCount++;
        if (!isZodInputSchema(tool.inputSchema)) {
          nonZodTools.push(`${moduleName}.${tool.name}`);
        }
      }
    }

    expect(toolCount).toBeGreaterThan(MIN_EXPECTED_TOOLS);
    expect(nonZodTools).toEqual([]);
  });
});
