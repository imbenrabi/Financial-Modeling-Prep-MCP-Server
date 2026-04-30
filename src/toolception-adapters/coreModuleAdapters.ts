/**
 * Core module adapters — first chunk of toolception-compatible loaders.
 *
 * Split out from moduleAdapters.ts to keep the module-registry fan-out below
 * the sentrux no_god_files threshold. The composition happens in moduleAdapters.ts.
 */

import { createModuleAdapter } from './createModuleAdapter.js';
import type { ModuleLoader } from 'toolception';

import { registerSearchTools } from '../tools/search.js';
import { registerDirectoryTools } from '../tools/directory.js';
import { registerAnalystTools } from '../tools/analyst.js';
import { registerCalendarTools } from '../tools/calendar.js';
import { registerChartTools } from '../tools/chart.js';
import { registerCompanyTools } from '../tools/company.js';
import { registerCOTTools } from '../tools/cot.js';
import { registerESGTools } from '../tools/esg.js';
import { registerEconomicsTools } from '../tools/economics.js';
import { registerDCFTools } from '../tools/dcf.js';

export const CORE_MODULE_ADAPTERS: Record<string, ModuleLoader> = {
  search: createModuleAdapter('search', registerSearchTools),
  directory: createModuleAdapter('directory', registerDirectoryTools),
  analyst: createModuleAdapter('analyst', registerAnalystTools),
  calendar: createModuleAdapter('calendar', registerCalendarTools),
  chart: createModuleAdapter('chart', registerChartTools),
  company: createModuleAdapter('company', registerCompanyTools),
  cot: createModuleAdapter('cot', registerCOTTools),
  esg: createModuleAdapter('esg', registerESGTools),
  economics: createModuleAdapter('economics', registerEconomicsTools),
  dcf: createModuleAdapter('dcf', registerDCFTools),
};
