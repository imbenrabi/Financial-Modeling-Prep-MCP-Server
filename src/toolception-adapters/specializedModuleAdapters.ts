/**
 * Specialized module adapters — third chunk of toolception-compatible loaders.
 *
 * Split out from moduleAdapters.ts to keep the module-registry fan-out below
 * the sentrux no_god_files threshold. The composition happens in moduleAdapters.ts.
 */

import { createModuleAdapter } from './createModuleAdapter.js';
import type { ModuleLoader } from 'toolception';

import { registerMarketPerformanceTools } from '../tools/market-performance.js';
import { registerMarketHoursTools } from '../tools/market-hours.js';
import { registerNewsTools } from '../tools/news.js';
import { registerTechnicalIndicatorsTools } from '../tools/technical-indicators.js';
import { registerQuotesTools } from '../tools/quotes.js';
import { registerEarningsTranscriptTools } from '../tools/earnings-transcript.js';
import { registerSECFilingsTools } from '../tools/sec-filings.js';
import { registerGovernmentTradingTools } from '../tools/government-trading.js';
import { registerBulkTools } from '../tools/bulk.js';

export const SPECIALIZED_MODULE_ADAPTERS: Record<string, ModuleLoader> = {
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
