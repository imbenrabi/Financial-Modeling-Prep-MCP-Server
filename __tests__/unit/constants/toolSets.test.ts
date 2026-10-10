import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { TOOL_SETS } from '../../../src/constants/toolSets.js';
import { MODULE_ADAPTERS } from '../../../src/toolception-adapters/moduleAdapters.js';

/**
 * Toolception 0.8.0 rejects a catalog that registers the same tool name twice
 * (code-rabi/toolception#33), which would fail initialize in ALL_TOOLS mode.
 * These tests keep every module in one toolset and every tool name unique.
 */

/** Maps each module to the tool sets that list it. */
function moduleOwners(): Map<string, string[]> {
  const owners = new Map<string, string[]>();
  for (const [toolSet, def] of Object.entries(TOOL_SETS)) {
    for (const module of def.modules) {
      owners.set(module, [...(owners.get(module) ?? []), toolSet]);
    }
  }
  return owners;
}

describe('TOOL_SETS catalog', () => {
  beforeAll(() => {
    // Module adapters log one line per loaded module.
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('only references modules that have an adapter', () => {
    const missing = [...moduleOwners().keys()].filter((module) => !(module in MODULE_ADAPTERS));

    expect(missing).toEqual([]);
  });

  it('lists every adapter module in exactly one toolset', () => {
    const owners = moduleOwners();

    const unreferenced = Object.keys(MODULE_ADAPTERS).filter((module) => !owners.has(module));
    const shared = [...owners].filter(([, toolSets]) => toolSets.length > 1);

    expect(unreferenced).toEqual([]);
    expect(shared).toEqual([]);
  });

  it('registers every tool name once across all toolsets', async () => {
    const owners = new Map<string, string[]>();
    for (const [toolSet, def] of Object.entries(TOOL_SETS)) {
      for (const module of def.modules) {
        const loader = MODULE_ADAPTERS[module];
        expect(loader, `adapter for module '${module}'`).toBeDefined();
        for (const { name } of await loader({})) {
          owners.set(name, [...(owners.get(name) ?? []), `${toolSet}/${module}`]);
        }
      }
    }

    const duplicates = [...owners]
      .filter(([, sources]) => sources.length > 1)
      .map(([name, sources]) => `${name}: ${sources.join(', ')}`);

    expect(owners.size).toBeGreaterThan(0);
    expect(duplicates).toEqual([]);
  });
});
