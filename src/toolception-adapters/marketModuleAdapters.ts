/**
 * Market & instrument module adapters — second chunk of toolception-compatible loaders.
 *
 * Split out from moduleAdapters.ts to keep the module-registry fan-out below
 * the sentrux no_god_files threshold. The composition happens in moduleAdapters.ts.
 */

import { createModuleAdapter } from './createModuleAdapter.js';
import type { ModuleLoader } from 'toolception';

import { registerFundTools } from '../tools/fund.js';
import { registerCommodityTools } from '../tools/commodity.js';
import { registerFundraisersTools } from '../tools/fundraisers.js';
import { registerCryptoTools } from '../tools/crypto.js';
import { registerForexTools } from '../tools/forex.js';
import { registerStatementsTools } from '../tools/statements.js';
import { registerForm13FTools } from '../tools/form-13f.js';
import { registerIndexesTools } from '../tools/indexes.js';
import { registerInsiderTradesTools } from '../tools/insider-trades.js';

export const MARKET_MODULE_ADAPTERS: Record<string, ModuleLoader> = {
  fund: createModuleAdapter('fund', registerFundTools),
  commodity: createModuleAdapter('commodity', registerCommodityTools),
  fundraisers: createModuleAdapter('fundraisers', registerFundraisersTools),
  crypto: createModuleAdapter('crypto', registerCryptoTools),
  forex: createModuleAdapter('forex', registerForexTools),
  statements: createModuleAdapter('statements', registerStatementsTools),
  'form-13f': createModuleAdapter('form-13f', registerForm13FTools),
  indexes: createModuleAdapter('indexes', registerIndexesTools),
  'insider-trades': createModuleAdapter('insider-trades', registerInsiderTradesTools),
};
