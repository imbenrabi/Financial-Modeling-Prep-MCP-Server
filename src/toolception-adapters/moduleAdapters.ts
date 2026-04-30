/**
 * Module Adapters - Toolception-compatible loaders for all FMP tool modules
 *
 * This file composes adapters from three chunked sources to keep each chunk's
 * fan-out below the sentrux no_god_files threshold. Each chunk is itself a
 * Record<moduleName, ModuleLoader>.
 */

import type { ModuleLoader } from 'toolception';
import { CORE_MODULE_ADAPTERS } from './coreModuleAdapters.js';
import { MARKET_MODULE_ADAPTERS } from './marketModuleAdapters.js';
import { SPECIALIZED_MODULE_ADAPTERS } from './specializedModuleAdapters.js';

/**
 * Record of all module adapters
 * Maps module name to toolception-compatible loader function
 */
export const MODULE_ADAPTERS: Record<string, ModuleLoader> = {
  ...CORE_MODULE_ADAPTERS,
  ...MARKET_MODULE_ADAPTERS,
  ...SPECIALIZED_MODULE_ADAPTERS,
};
