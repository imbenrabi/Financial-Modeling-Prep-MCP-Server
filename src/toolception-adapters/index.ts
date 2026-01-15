/**
 * Toolception Adapters
 *
 * This module provides adapters to bridge FMP's existing tool registration
 * pattern with toolception's module loader pattern.
 */

export { ToolCollector, type McpToolDefinition, type ToolRegistrar } from './ToolCollector.js';
export {
  createModuleAdapter,
  type RegisterToolsFunction,
  type ModuleLoaderContext
} from './createModuleAdapter.js';
export type { ModuleLoader } from 'toolception';
export {
  ModeConfigMapper,
  type ToolceptionConfig,
  type ToolSetCatalog
} from './ModeConfigMapper.js';
export {
  MODULE_ADAPTERS,
  getModuleNames,
  getModuleAdapter,
  getModuleCount
} from './moduleAdapters.js';
