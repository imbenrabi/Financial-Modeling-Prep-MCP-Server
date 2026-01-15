/**
 * Module Adapters - Toolception-compatible loaders for all FMP tool modules
 *
 * This file creates adapters for all 28 FMP tool modules, converting them
 * from the imperative registerXxxTools() pattern to toolception's declarative
 * module loader pattern.
 */

import { createModuleAdapter } from './createModuleAdapter.js';
import type { ModuleLoader } from 'toolception';

// Import all tool registration functions
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
import { registerFundTools } from '../tools/fund.js';
import { registerCommodityTools } from '../tools/commodity.js';
import { registerFundraisersTools } from '../tools/fundraisers.js';
import { registerCryptoTools } from '../tools/crypto.js';
import { registerForexTools } from '../tools/forex.js';
import { registerStatementsTools } from '../tools/statements.js';
import { registerForm13FTools } from '../tools/form-13f.js';
import { registerIndexesTools } from '../tools/indexes.js';
import { registerInsiderTradesTools } from '../tools/insider-trades.js';
import { registerMarketPerformanceTools } from '../tools/market-performance.js';
import { registerMarketHoursTools } from '../tools/market-hours.js';
import { registerNewsTools } from '../tools/news.js';
import { registerTechnicalIndicatorsTools } from '../tools/technical-indicators.js';
import { registerQuotesTools } from '../tools/quotes.js';
import { registerEarningsTranscriptTools } from '../tools/earnings-transcript.js';
import { registerSECFilingsTools } from '../tools/sec-filings.js';
import { registerGovernmentTradingTools } from '../tools/government-trading.js';
import { registerBulkTools } from '../tools/bulk.js';

/**
 * Record of all module adapters
 * Maps module name to toolception-compatible loader function
 */
export const MODULE_ADAPTERS: Record<string, ModuleLoader> = {
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
  fund: createModuleAdapter('fund', registerFundTools),
  commodity: createModuleAdapter('commodity', registerCommodityTools),
  fundraisers: createModuleAdapter('fundraisers', registerFundraisersTools),
  crypto: createModuleAdapter('crypto', registerCryptoTools),
  forex: createModuleAdapter('forex', registerForexTools),
  statements: createModuleAdapter('statements', registerStatementsTools),
  'form-13f': createModuleAdapter('form-13f', registerForm13FTools),
  indexes: createModuleAdapter('indexes', registerIndexesTools),
  'insider-trades': createModuleAdapter('insider-trades', registerInsiderTradesTools),
  'market-performance': createModuleAdapter('market-performance', registerMarketPerformanceTools),
  'market-hours': createModuleAdapter('market-hours', registerMarketHoursTools),
  news: createModuleAdapter('news', registerNewsTools),
  'technical-indicators': createModuleAdapter('technical-indicators', registerTechnicalIndicatorsTools),
  quotes: createModuleAdapter('quotes', registerQuotesTools),
  'earnings-transcript': createModuleAdapter('earnings-transcript', registerEarningsTranscriptTools),
  'sec-filings': createModuleAdapter('sec-filings', registerSECFilingsTools),
  'government-trading': createModuleAdapter('government-trading', registerGovernmentTradingTools),
  bulk: createModuleAdapter('bulk', registerBulkTools),
};

/**
 * Get all module adapter names
 */
export function getModuleNames(): string[] {
  return Object.keys(MODULE_ADAPTERS);
}

/**
 * Get module adapter by name
 */
export function getModuleAdapter(name: string): ModuleLoader | undefined {
  return MODULE_ADAPTERS[name];
}

/**
 * Get count of available modules
 */
export function getModuleCount(): number {
  return Object.keys(MODULE_ADAPTERS).length;
}
