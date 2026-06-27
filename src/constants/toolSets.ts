import type { ToolSet, ToolSetDefinition } from "../types.js";

/**
 * Comprehensive tool sets mapping based on FMP API structure
 */
export const TOOL_SETS: Record<ToolSet, ToolSetDefinition> = {
  // Basic search and discovery
  search: {
    name: "Search & Directory",
    description:
      "Search for stocks, company information, and directory services",
    decisionCriteria: "Find companies, lookup symbols, discover investments",
    modules: ["search", "directory"],
  },

  // Core company data
  company: {
    name: "Company Profile & Info",
    description:
      "Company profiles, executives, employees, and core business information",
    decisionCriteria: "Get company details, executive info, business profiles",
    modules: ["company"],
  },

  // Real-time market data
  quotes: {
    name: "Real-time Quotes",
    description: "Real-time stock quotes, price changes, and market data",
    decisionCriteria: "Check current prices, monitor market activity, track price changes",
    modules: ["quotes"],
  },

  // Financial statements and analysis
  statements: {
    name: "Financial Statements",
    description:
      "Income statements, balance sheets, cash flow, ratios, and financial analysis",
    decisionCriteria: "Analyze financial performance, assess company health, review financial statements",
    modules: ["statements"],
  },

  // Events and calendar data
  calendar: {
    name: "Financial Calendar",
    description:
      "Earnings calendar, dividends, IPOs, stock splits, and corporate events",
    decisionCriteria: "Track earnings dates, corporate events, dividend schedules",
    modules: ["calendar", "earnings-transcript"],
  },

  // Price charts and historical data
  charts: {
    name: "Price Charts & History",
    description: "Historical price data, charts, and market movements",
    decisionCriteria: "View price history, analyze trends, examine market movements",
    modules: ["chart"],
  },

  // News and press releases
  news: {
    name: "Financial News",
    description: "Market news, press releases, and financial articles",
    decisionCriteria: "Access market news, press releases, financial articles",
    modules: ["news"],
  },

  // Analyst coverage
  analyst: {
    name: "Analyst Coverage",
    description:
      "Analyst estimates, price targets, ratings, and recommendations",
    decisionCriteria: "Get analyst ratings, price targets, research recommendations",
    modules: ["analyst"],
  },

  // Market performance metrics
  "market-performance": {
    name: "Market Performance",
    description:
      "Sector performance, market movements, gainers, losers, and most active stocks",
    decisionCriteria: "Monitor sector performance, find gainers/losers, track market activity",
    modules: ["market-performance", "market-hours"],
  },

  // Insider trading data
  "insider-trades": {
    name: "Insider Trading",
    description: "Corporate insider trading activity and ownership changes",
    decisionCriteria: "Track insider trading activity, ownership changes",
    modules: ["insider-trades"],
  },

  // Institutional ownership
  institutional: {
    name: "Institutional Holdings",
    description: "13F filings, institutional ownership, and fund holdings",
    decisionCriteria: "View institutional holdings, 13F filings, fund ownership",
    modules: ["form-13f"],
  },

  // Market indexes
  indexes: {
    name: "Market Indexes",
    description: "Stock market indexes, constituents, and index performance",
    decisionCriteria: "Access index data, constituents, benchmark performance",
    modules: ["indexes"],
  },

  // Economic data
  economics: {
    name: "Economic Data",
    description: "Treasury rates, economic indicators, and macroeconomic data",
    decisionCriteria: "Get economic indicators, treasury rates, macro data",
    modules: ["economics", "cot"],
  },

  // Cryptocurrency data
  crypto: {
    name: "Cryptocurrency",
    description: "Cryptocurrency prices, charts, and market data",
    decisionCriteria: "Access cryptocurrency prices, crypto market data",
    modules: ["crypto"],
  },

  // Foreign exchange
  forex: {
    name: "Foreign Exchange",
    description: "Currency pairs, forex rates, and foreign exchange data",
    decisionCriteria: "Get currency exchange rates, forex market data",
    modules: ["forex"],
  },

  // Commodities trading
  commodities: {
    name: "Commodities",
    description: "Commodity prices, futures, and commodity market data",
    decisionCriteria: "Track commodity prices, futures, raw materials",
    modules: ["commodity"],
  },

  // ETFs and mutual funds
  "etf-funds": {
    name: "ETFs & Mutual Funds",
    description: "ETF and mutual fund holdings, performance, and information",
    decisionCriteria: "Analyze ETF/fund holdings, performance, fund data",
    modules: ["fund", "fundraisers"],
  },

  // ESG and sustainability
  esg: {
    name: "ESG & Sustainability",
    description: "Environmental, Social, and Governance ratings and data",
    decisionCriteria: "Access ESG ratings, sustainability data, environmental scores",
    modules: ["esg"],
  },

  // Technical analysis
  "technical-indicators": {
    name: "Technical Indicators",
    description: "Technical analysis indicators like RSI, SMA, EMA, and more",
    decisionCriteria: "Calculate technical indicators, RSI, moving averages",
    modules: ["technical-indicators"],
  },

  // Government trading
  senate: {
    name: "Government Trading",
    description: "Congressional and Senate trading disclosures",
    decisionCriteria: "Track government trading, congressional disclosures",
    modules: ["government-trading"],
  },

  // SEC filings
  "sec-filings": {
    name: "SEC Filings",
    description: "SEC filings, regulatory documents, and corporate disclosures",
    decisionCriteria: "Access SEC filings, regulatory documents, 8-K/10-K forms",
    modules: ["sec-filings"],
  },

  // Earnings and transcripts
  earnings: {
    name: "Earnings & Transcripts",
    description: "Earnings reports, call transcripts, and earnings analysis",
    decisionCriteria: "Get earnings transcripts, call recordings, earnings analysis",
    modules: ["earnings-transcript"],
  },

  // Valuation models
  dcf: {
    name: "DCF Valuation",
    description: "Discounted cash flow models and company valuations",
    decisionCriteria: "Perform DCF valuation, calculate intrinsic value",
    modules: ["dcf"],
  },

  // Bulk data access
  bulk: {
    name: "Bulk Data",
    description: "Bulk data downloads for large-scale analysis",
    decisionCriteria: "Download bulk data, large datasets, batch operations",
    modules: ["bulk"],
  },
};

/**
 * Get all available tool sets for help/documentation
 */
export function getAvailableToolSets(): Array<{
  key: ToolSet;
  definition: ToolSetDefinition;
}> {
  return Object.entries(TOOL_SETS).map(([key, definition]) => ({
    key: key as ToolSet,
    definition,
  }));
}
