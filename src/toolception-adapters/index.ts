/**
 * Toolception Adapters
 *
 * This module provides adapters to bridge FMP's existing tool registration
 * pattern with toolception's module loader pattern.
 */

export { ToolCollector, type McpToolDefinition } from './ToolCollector.js';
export {
  createModuleAdapter,
  type RegisterToolsFunction
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
