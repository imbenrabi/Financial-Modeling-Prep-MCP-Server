# Financial Modeling Prep MCP (Model Context Protocol)

[![smithery badge](https://smithery.ai/badge/@imbenrabi/financial-modeling-prep-mcp)](https://smithery.ai/server/@imbenrabi/financial-modeling-prep-mcp-server)

A Model Context Protocol (MCP) implementation for Financial Modeling Prep, enabling AI assistants to access and analyze financial data, stock information, company fundamentals, and market insights.

## Usage

### HTTP Server

The server now runs as an HTTP server that exposes a Model Context Protocol endpoint. To connect to it:

```bash
# Install and run the server
npx -y fmp-mcp --fmp-token=YOUR_FMP_ACCESS_TOKEN
```

Or with environment variables:

```bash
# Set your API token as an environment variable
export FMP_ACCESS_TOKEN=YOUR_FMP_ACCESS_TOKEN

# Run the server
npx -y fmp-mcp
```

The server will start on port 3000 by default. You can change the port with the PORT environment variable:

```bash
PORT=4000 npx -y fmp-mcp --fmp-token=YOUR_FMP_ACCESS_TOKEN
```

To send requests to the server, use the `/mcp` endpoint with JSON-RPC formatted requests.

## Available Tools

This MCP provides the following tools for AI assistants to access financial data:

### Search Tools

- **searchSymbol**: Search for stock symbols by name or ticker
- **searchName**: Search for companies by name
- **searchCIK**: Search for companies by CIK number
- **searchCUSIP**: Search for securities by CUSIP number
- **searchISIN**: Search for securities by ISIN number
- **stockScreener**: Screen stocks based on various criteria
- **searchExchangeVariants**: Search for symbol variants across different exchanges
- **searchCompaniesByName**: Search for companies by name
- **searchCompaniesBySymbol**: Search for companies by symbol
- **searchCompaniesByCIK**: Search for companies by CIK number

### Directory and Symbol Lists

- **getCompanySymbols**: Get a list of all company symbols
- **getFinancialStatementSymbols**: Get symbols with available financial statements
- **getETFList**: Get a list of all ETFs
- **getActivelyTradingList**: Get a list of actively trading stocks
- **getEarningsTranscriptList**: Get a list of companies with earnings transcripts
- **getAvailableExchanges**: Get a list of all available exchanges
- **getAvailableSectors**: Get a list of all available sectors
- **getAvailableIndustries**: Get a list of all available industries
- **getAvailableCountries**: Get a list of all available countries
- **getAvailableTranscriptSymbols**: Get a list of symbols with available transcripts
- **getCIKList**: Get a list of all CIK numbers
- **getSymbolChanges**: Get a list of symbol changes
- **getAllIndustryClassification**: Get all industry classifications
- **getIndustryClassificationList**: Get a list of industry classifications

### Company Information

- **getCompanyProfile**: Get detailed company profile information
- **getCompanyExecutives**: Get information about company executives
- **getCompanyDescription**: Get company description
- **getCompanyOutlook**: Get company outlook information
- **getCompanyRating**: Get company rating information
- **getHistoricalRating**: Get historical company ratings
- **getCompanyUpgradesDowngrades**: Get company upgrades and downgrades
- **getCompanyGrade**: Get company grade information
- **getCompanyPeers**: Get companies similar to a given company
- **getMarketCap**: Get company market capitalization
- **getHistoricalMarketCap**: Get historical market capitalization
- **getSharesFloat**: Get company shares float information
- **getHistoricalSharesFloat**: Get historical shares float information
- **getEarningsSurprises**: Get historical earnings surprises
- **getEarningCallTranscript**: Get specific earnings call transcript
- **getEarningCallTranscriptsBySymbol**: Get all earnings call transcripts for a symbol
- **getCompanyNotes**: Get company notes
- **getCompanyProfileByCIK**: Get company profile by CIK
- **getCompanySECProfile**: Get company SEC profile
- **getDelistedCompanies**: Get a list of delisted companies
- **getEmployeeCount**: Get employee count for a company
- **getHistoricalEmployeeCount**: Get historical employee count
- **getBatchMarketCap**: Get batch market cap data
- **getAllShareFloat**: Get all share float data
- **getLatestMergersAcquisitions**: Get latest mergers and acquisitions
- **searchMergersAcquisitions**: Search mergers and acquisitions
- **getExecutiveCompensation**: Get executive compensation data
- **getExecutiveCompensationBenchmark**: Get executive compensation benchmark data
- **getAcquisitionOwnership**: Get acquisition ownership data

### Financial Statements

- **getIncomeStatement**: Get company income statements
- **getBalanceSheet**: Get company balance sheet statements
- **getBalanceSheetStatement**: Get company balance sheet statements
- **getCashFlowStatement**: Get company cash flow statements
- **getIncomeStatementAsReported**: Get income statements as reported
- **getBalanceSheetAsReported**: Get balance sheet statements as reported
- **getBalanceSheetStatementAsReported**: Get balance sheet statements as reported
- **getCashFlowStatementAsReported**: Get cash flow statements as reported
- **getFullFinancialStatementAsReported**: Get full financial statements as reported
- **getFinancialStatementFullAsReported**: Get full financial statements as reported
- **getFinancialReportDates**: Get dates of available financial reports
- **getFinancialReportsDates**: Get dates of available financial reports
- **getLatestFinancialStatements**: Get latest financial statements
- **getIncomeStatementTTM**: Get trailing twelve months income statements
- **getBalanceSheetStatementTTM**: Get trailing twelve months balance sheet statements
- **getCashFlowStatementTTM**: Get trailing twelve months cash flow statements
- **getIncomeStatementGrowth**: Get income statement growth
- **getBalanceSheetStatementGrowth**: Get balance sheet statement growth
- **getCashFlowStatementGrowth**: Get cash flow statement growth
- **getFinancialStatementGrowth**: Get financial statement growth
- **getFinancialReportJSON**: Get financial report in JSON format
- **getFinancialReportXLSX**: Get financial report in XLSX format
- **getRevenueProductSegmentation**: Get revenue product segmentation
- **getRevenueGeographicSegmentation**: Get revenue geographic segmentation

### Financial Metrics and Analysis

- **getKeyMetrics**: Get key financial metrics for a company
- **getKeyMetricsTTM**: Get key metrics for trailing twelve months
- **getFinancialRatios**: Get financial ratios for a company
- **getFinancialRatiosTTM**: Get financial ratios for trailing twelve months
- **getFinancialGrowth**: Get financial growth metrics
- **getIncomeStatementGrowth**: Get income statement growth metrics
- **getBalanceSheetGrowth**: Get balance sheet growth metrics
- **getCashFlowStatementGrowth**: Get cash flow statement growth metrics
- **getDiscountedCashFlow**: Get discounted cash flow valuation
- **getHistoricalDCF**: Get historical DCF valuations
- **getAdvancedDCF**: Get advanced DCF valuation
- **getLeveredDCF**: Get levered DCF valuation
- **getEnterpriseValue**: Get enterprise value for a company
- **getFinancialScore**: Get financial score for a company
- **getOwnerEarnings**: Get owner earnings for a company

### Technical Indicators

- **getSMA**: Get Simple Moving Average (SMA) indicator
- **getEMA**: Get Exponential Moving Average (EMA) indicator
- **getWMA**: Get Weighted Moving Average (WMA) indicator
- **getDEMA**: Get Double Exponential Moving Average (DEMA) indicator
- **getTEMA**: Get Triple Exponential Moving Average (TEMA) indicator
- **getWilliams**: Get Williams %R indicator
- **getADX**: Get Average Directional Index (ADX) indicator
- **getStandardDeviation**: Get Standard Deviation indicator
- **getRSI**: Get Relative Strength Index (RSI) indicator

### Quotes and Price Data

- **getQuote**: Get current stock quote information
- **getBatchQuotes**: Get quotes for multiple symbols
- **getQuoteShort**: Get abbreviated stock quote information
- **getBatchQuotesShort**: Get abbreviated quotes for multiple symbols
- **getHistoricalPrice**: Get historical price data
- **getHistoricalPriceChart**: Get historical price chart data
- **getHistoricalDailyPrice**: Get historical daily price data
- **getHistoricalStockSplits**: Get historical stock splits
- **getHistoricalDividends**: Get historical dividends
- **getTechnicalIndicator**: Get technical indicators for a stock
- **getLightChart**: Get light version of price chart
- **getFullChart**: Get full version of price chart
- **getUnadjustedChart**: Get unadjusted price chart
- **getDividendAdjustedChart**: Get dividend-adjusted price chart
- **getIntradayChart**: Get intraday price chart
- **getAftermarketQuote**: Get aftermarket quote
- **getAftermarketTrade**: Get aftermarket trade data
- **getBatchAftermarketQuote**: Get batch aftermarket quotes
- **getBatchAftermarketTrade**: Get batch aftermarket trade data
- **getStockPriceChange**: Get stock price change information

### Market Indexes and Performance

- **getIndexList**: Get a list of all market indexes
- **getIndexQuotes**: Get quotes for market indexes
- **getIndexQuote**: Get quote for a specific index
- **getIndexShortQuote**: Get abbreviated quote for an index
- **getAllIndexQuotes**: Get quotes for all market indexes
- **getSP500Constituents**: Get S&P 500 constituent companies
- **getHistoricalSP500Changes**: Get historical S&P 500 changes
- **getNasdaqConstituents**: Get NASDAQ constituent companies
- **getDowJonesConstituents**: Get Dow Jones constituent companies
- **getHistoricalNasdaqChanges**: Get historical NASDAQ changes
- **getHistoricalDowJonesChanges**: Get historical Dow Jones changes
- **getSectorPerformance**: Get sector performance data
- **getHistoricalSectorPerformance**: Get historical sector performance
- **getBiggestGainers**: Get biggest gaining stocks
- **getBiggestLosers**: Get biggest losing stocks
- **getMostActiveStocks**: Get most active stocks
- **getHistoricalIndexFullChart**: Get historical index full chart
- **getHistoricalIndexLightChart**: Get historical index light chart
- **getIndex1MinuteData**: Get 1-minute index data
- **getIndex5MinuteData**: Get 5-minute index data
- **getIndex1HourData**: Get 1-hour index data
- **getSectorPerformanceSnapshot**: Get sector performance snapshot
- **getSectorPESnapshot**: Get sector PE ratio snapshot
- **getIndustryPerformanceSnapshot**: Get industry performance snapshot
- **getIndustryPerformanceSummary**: Get industry performance summary
- **getIndustryPESnapshot**: Get industry PE ratio snapshot
- **getHistoricalIndustryPerformance**: Get historical industry performance
- **getHistoricalIndustryPE**: Get historical industry PE ratios
- **getHistoricalSectorPE**: Get historical sector PE ratios

### Market Data

- **getMarketHours**: Get market hours for a specific exchange
- **getExchangeMarketHours**: Get market hours for a specific exchange
- **getAllExchangeMarketHours**: Get market hours for all exchanges
- **getEarningsCalendar**: Get earnings announcement calendar
- **getIPOCalendar**: Get initial public offering calendar
- **getStockSplitCalendar**: Get stock split calendar
- **getDividendCalendar**: Get dividend calendar
- **getEconomicCalendar**: Get economic events calendar
- **getIPODisclosures**: Get IPO disclosures
- **getIPOProspectuses**: Get IPO prospectuses

### News and Press Releases

- **getFMPArticles**: Get financial news articles from FMP
- **getGeneralNews**: Get general financial news
- **getStockNews**: Get news for specific stocks
- **getStockNewsSentiment**: Get news with sentiment analysis
- **getPressReleases**: Get company press releases
- **searchStockNews**: Search stock news
- **searchPressReleases**: Search press releases
- **getCryptoNews**: Get cryptocurrency news
- **searchCryptoNews**: Search cryptocurrency news
- **getForexNews**: Get forex news
- **searchForexNews**: Search forex news

### SEC Filings

- **getLatestFinancialFilings**: Get latest financial filings
- **getFilingsBySymbol**: Get filings by symbol
- **getFilingsByCIK**: Get filings by CIK
- **getFilingsByFormType**: Get filings by form type
- **getLatest8KFilings**: Get latest 8-K filings
- **getSecFilingExtract**: Get SEC filing extract
- **getFilingExtractAnalyticsByHolder**: Get filing extract analytics by holder

### Insider and Institutional Trading

- **getInsiderTrading**: Get insider trading data
- **getInsiderRoster**: Get insider roster for a company
- **getInsiderRosterStatistics**: Get statistics on insider roster
- **getInsiderTransactionTypes**: Get types of insider transactions
- **getInsiderOwnership**: Get insider ownership information
- **getInstitutionalOwnership**: Get institutional ownership data
- **getInstitutionalHolders**: Get institutional holders for a company
- **getInstitutionalHoldersList**: Get list of institutional holders
- **getInstitutionalHolderPortfolioDates**: Get portfolio dates for institutional holders
- **get13FFilings**: Get 13F filings
- **get13FDates**: Get dates of 13F filings
- **getForm13FFilingDates**: Get 13F filing dates
- **getLatestInsiderTrading**: Get latest insider trading data
- **searchInsiderTrades**: Search insider trades
- **searchInsiderTradesByReportingName**: Search insider trades by reporting name
- **getInsiderTradeStatistics**: Get insider trade statistics
- **getLatestInstitutionalFilings**: Get latest institutional filings
- **getHolderPerformanceSummary**: Get holder performance summary
- **getHolderIndustryBreakdown**: Get holder industry breakdown
- **getPositionsSummary**: Get positions summary

### ETFs and Funds

- **getETFHolder**: Get ETF holder information
- **getETFSectorWeighting**: Get ETF sector weightings
- **getETFCountryWeighting**: Get ETF country weightings
- **getETFExposure**: Get ETF exposure to stocks
- **getFundInfo**: Get fund information
- **getFundHolder**: Get fund holder information
- **getFundSectorWeighting**: Get fund sector weightings
- **getFundHoldings**: Get fund holdings
- **getFundCountryAllocation**: Get fund country allocation
- **getFundAssetExposure**: Get fund asset exposure
- **getFundDisclosure**: Get fund disclosure
- **searchFundDisclosures**: Search fund disclosures
- **getFundDisclosureDates**: Get fund disclosure dates
- **getETFHoldersBulk**: Get ETF holders in bulk
- **getETFQuotes**: Get ETF quotes
- **getMutualFundQuotes**: Get mutual fund quotes

### Government Trading

- **getGovernmentTradingList**: Get government trading list
- **getSenateTrading**: Get senate trading data
- **getHouseTrading**: Get house trading data
- **getSenateTrades**: Get senate trades
- **getSenateTradesByName**: Get senate trades by name
- **getHouseTrades**: Get house trades
- **getHouseTradesByName**: Get house trades by name
- **getLatestSenateDisclosures**: Get latest senate disclosures
- **getLatestHouseDisclosures**: Get latest house disclosures

### Cryptocurrency and Forex

- **getCryptocurrencyList**: Get a list of cryptocurrencies
- **getCryptocurrencyQuote**: Get cryptocurrency quote
- **getCryptocurrencyShortQuote**: Get abbreviated cryptocurrency quote
- **getCryptocurrencyBatchQuotes**: Get quotes for multiple cryptocurrencies
- **getHistoricalCryptocurrencyPrice**: Get historical cryptocurrency price data
- **getCryptocurrencyHistoricalLightChart**: Get light historical cryptocurrency chart
- **getCryptocurrencyHistoricalFullChart**: Get full historical cryptocurrency chart
- **getCryptocurrency1MinuteData**: Get 1-minute cryptocurrency data
- **getCryptocurrency5MinuteData**: Get 5-minute cryptocurrency data
- **getCryptocurrency1HourData**: Get 1-hour cryptocurrency data
- **getCryptoQuotes**: Get cryptocurrency quotes
- **getForexList**: Get a list of forex pairs
- **getForexQuote**: Get forex pair quote
- **getForexShortQuote**: Get abbreviated forex quote
- **getForexBatchQuotes**: Get quotes for multiple forex pairs
- **getHistoricalForexPrice**: Get historical forex price data
- **getForexHistoricalLightChart**: Get light historical forex chart
- **getForexHistoricalFullChart**: Get full historical forex chart
- **getForex1MinuteData**: Get 1-minute forex data
- **getForex5MinuteData**: Get 5-minute forex data
- **getForex1HourData**: Get 1-hour forex data
- **getForexQuotes**: Get forex quotes
- **getExchangeQuotes**: Get exchange quotes

### Earnings

- **getEarningsReports**: Get earnings reports
- **getEarningsTranscript**: Get earnings transcript
- **getEarningsTranscriptDates**: Get earnings transcript dates
- **getLatestEarningsTranscripts**: Get latest earnings transcripts
- **getEarningsSurprisesBulk**: Get bulk earnings surprises

### Special Data Sets

- **getCOTList**: Get Commitment of Traders (COT) list
- **getCOTReport**: Get COT report for a specific symbol
- **getCOTReports**: Get COT reports for a specific symbol
- **getCOTAnalysis**: Get COT analysis for a specific symbol
- **getGovernmentTradingList**: Get government trading list
- **getSenateTrading**: Get senate trading data
- **getHouseTrading**: Get house trading data
- **getESGData**: Get Environmental, Social, and Governance data
- **getESGRatings**: Get ESG ratings
- **getESGBenchmark**: Get ESG benchmark data
- **getESGDisclosures**: Get ESG disclosures
- **getESGBenchmarks**: Get ESG benchmarks

### Commodities

- **getCommodityPrice**: Get commodity price
- **getCommodityHistoricalPrices**: Get historical commodity prices
- **getCommodityQuote**: Get commodity quote
- **getCommodityQuotes**: Get commodity quotes
- **getCommodityContract**: Get commodity contract information
- **getCommodityMarketData**: Get commodity market data
- **getCommodityNews**: Get commodity news
- **getCommodityForecast**: Get commodity forecast
- **getCommoditySupplyDemand**: Get commodity supply and demand data

### Economics

- **getEconomicIndicators**: Get economic indicators
- **getTreasuryRates**: Get treasury rates
- **getMarketRiskPremium**: Get market risk premium

### Fundraisers

- **getLatestCrowdfundingCampaigns**: Get latest crowdfunding campaigns
- **searchCrowdfundingCampaigns**: Search crowdfunding campaigns
- **getCrowdfundingCampaignsByCIK**: Get crowdfunding campaigns by CIK
- **getLatestEquityOfferings**: Get latest equity offerings
- **searchEquityOfferings**: Search equity offerings
- **getEquityOfferingsByCIK**: Get equity offerings by CIK

### Bulk Data Tools

- **getCompanyProfilesBulk**: Get bulk company profiles
- **getStockRatingsBulk**: Get bulk stock ratings
- **getDCFValuationsBulk**: Get bulk DCF valuations
- **getFinancialScoresBulk**: Get bulk financial scores
- **getPriceTargetSummariesBulk**: Get bulk price target summaries
- **getUpgradesDowngradesConsensusBulk**: Get bulk upgrades/downgrades consensus
- **getKeyMetricsTTMBulk**: Get bulk key metrics TTM
- **getRatiosTTMBulk**: Get bulk ratios TTM
- **getStockPeersBulk**: Get bulk stock peers
- **getEODDataBulk**: Get bulk end-of-day price data
- **getIncomeStatementsBulk**: Get bulk income statements
- **getIncomeStatementGrowthBulk**: Get bulk income statement growth data
- **getBalanceSheetStatementsBulk**: Get bulk balance sheet statements
- **getBalanceSheetGrowthBulk**: Get bulk balance sheet growth data
- **getCashFlowStatementsBulk**: Get bulk cash flow statements
- **getCashFlowGrowthBulk**: Get bulk cash flow growth data
- **getFinancialRatiosBulk**: Get bulk financial ratios
- **getKeyMetricsBulk**: Get bulk key metrics
- **getFinancialGrowthBulk**: Get bulk financial growth data

Most tools accept optional parameters such as:

- `symbol`: Stock ticker symbol
- `period`: Time period (annual, quarterly)
- `limit`: Number of results to return
- `from` and `to`: Date range in YYYY-MM-DD format

## Obtaining a Financial Modeling Prep Access Token

To get a Financial Modeling Prep access token:

1. Visit the [Financial Modeling Prep website](https://site.financialmodelingprep.com/)
2. Click on "Sign Up" to create an account
3. Verify your email address
4. After signing in, navigate to your Dashboard to find your API key
5. For more data access, consider upgrading to a paid plan (Starter, Premium, Ultimate, or Enterprise)

Financial Modeling Prep offers different pricing tiers with varying levels of data access and API call limits. For more information, visit the [FMP Pricing page](https://site.financialmodelingprep.com/pricing).

## Contributing

Contributions are welcome! Here's how you can contribute:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Every pull request triggers a GitHub Actions workflow that verifies the build process.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/imbenrabi/Financial-Modeling-Prep-MCP-Server
cd fmp-mcp-server

# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode with your API key
FMP_ACCESS_TOKEN=your_api_key npm run dev

# Or specify the API key directly
npm run dev -- --fmp-token=your_api_key
```

The development server will start on port 3000 by default. You can configure the port using the PORT environment variable:

```bash
PORT=4000 FMP_ACCESS_TOKEN=your_api_key npm run dev
```

### Release Process

To publish a new version to NPM:

1. Update the version in `package.json`
2. Create a new GitHub release with a tag like `v1.0.1`
3. The GitHub Actions workflow will automatically build and publish the package to NPM

Make sure you have the `NPM_TOKEN` secret configured in your GitHub repository settings.

## License

This project is licensed under the [Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License](https://creativecommons.org/licenses/by-nc-nd/4.0/deed.en)
