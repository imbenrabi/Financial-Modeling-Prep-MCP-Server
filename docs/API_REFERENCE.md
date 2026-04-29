# FMP MCP Server — API Reference

> For the complete tool catalog with all 250+ tools and return types, see [FMP_API_Tools_Documentation.md](../FMP_API_Tools_Documentation.md).

| Category | Tool Set Key | Example Tools |
|----------|-------------|---------------|
| Search | `search` | `searchSymbol`, `searchName`, `searchCIK`, `stockScreener`, `searchCUSIP` |
| Directory | `search` | `getCompanySymbols`, `getETFList`, `getExchangeList`, `getCIKList`, `getAvailableSectors` |
| Company Profile | `company` | `getCompanyProfile`, `getCompanyProfileByCIK`, `getStockPeers`, `getEmployeeCount`, `getCompanyExecutives` |
| Financial Statements | `statements` | `getIncomeStatement`, `getBalanceSheetStatement`, `getCashFlowStatement`, `getLatestFinancialStatements`, `getFinancialReportJSON` |
| Financial Metrics | `statements` | `getKeyMetrics`, `getRatios`, `getFinancialScores`, `getOwnerEarnings`, `getKeyMetricsTTM` |
| Technical Indicators | `technical-indicators` | `getSMA`, `getEMA`, `getRSI`, `getADX`, `getStandardDeviation` |
| Quotes | `quotes` | `getQuote`, `getQuoteShort`, `getStockPriceChange`, `getBatchQuotes`, `getExchangeQuotes` |
| Market Performance | `market-performance` | `getBiggestGainers`, `getBiggestLosers`, `getMostActiveStocks`, `getSectorPerformanceSnapshot` |
| Market Data | `market-performance`, `indexes` | `getIndexList`, `getIndexQuote`, `getSP500Constituents`, `getSectorPESnapshot` |
| News | `news` | `getFMPArticles`, `getGeneralNews`, `getStockNews`, `getPressReleases`, `getCryptoNews` |
| SEC Filings | `sec-filings` | `getLatest8KFilings`, `getFilingsBySymbol`, `getFilingsByCIK`, `searchCompaniesByName` |
| Insider Trading | `insider-trades` | `getLatestInsiderTrading`, `searchInsiderTrades`, `getInsiderTransactionTypes`, `getInsiderTradeStatistics` |
| Institutional Holdings | `institutional` | `getLatest13FFilings`, `getSecFilingExtract`, `getHolderPerformanceSummary`, `getPositionsSummary` |
| ETFs and Funds | `etf-funds` | `getFundHoldings`, `getFundInfo`, `getFundSectorWeighting`, `getLatestCrowdfundingCampaigns` |
| Government Trading | `senate` | `getLatestSenateDisclosures`, `getLatestHouseDisclosures`, `getSenateTrades`, `getHouseTrades` |
| Cryptocurrency | `crypto` | `getCryptocurrencyList`, `getCryptocurrencyQuote`, `getCryptocurrencyHistoricalLightChart`, `getCryptocurrencyBatchQuotes` |
| Forex | `forex` | `getForexList`, `getForexQuote`, `getForexHistoricalFullChart`, `getForexBatchQuotes` |
| Earnings | `earnings`, `calendar` | `getLatestEarningsTranscripts`, `getEarningsTranscript`, `getEarningsCalendar`, `getEarningsTranscriptDates` |
| Special Data | `dcf`, `bulk` | `getDCFValuation`, `getLeveredDCFValuation`, `calculateCustomDCF`, `getCompanyProfilesBulk` |
| Commodities | `commodities` | `listCommodities` |
| Economics | `economics` | `getTreasuryRates`, `getEconomicIndicators`, `getEconomicCalendar`, `getMarketRiskPremium` |
| Calendar | `calendar` | `getDividendsCalendar`, `getIPOCalendar`, `getStockSplitCalendar`, `getIPODisclosures` |
| Analyst Coverage | `analyst` | `getAnalystEstimates`, `getRatingsSnapshot`, `getPriceTargetSummary`, `getStockGrades` |
| Charts | `charts` | `getLightChart`, `getFullChart`, `getIntradayChart`, `getUnadjustedChart` |
| Indexes | `indexes` | `getAllIndexQuotes`, `getNasdaqConstituents`, `getDowJonesConstituents`, `getHistoricalIndexFullChart` |
| ESG | `esg` | `getESGDisclosures`, `getESGRatings`, `getESGBenchmarks` |

> **Dynamic Mode:** In `DYNAMIC_TOOL_DISCOVERY` mode, only 5 meta-tools are available initially. Additional tool sets are loaded on demand based on user queries.
