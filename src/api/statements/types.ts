export type Period = "Q1" | "Q2" | "Q3" | "Q4" | "FY";

interface BaseStatement {
  date: string;
  symbol: string;
  reportedCurrency: string;
  cik: string;
  filingDate: string;
  acceptedDate: string;
  fiscalYear: string;
  period: Period;
}

export interface IncomeStatement extends BaseStatement {
  revenue: number;
  costOfRevenue: number;
  grossProfit: number;
  researchAndDevelopmentExpenses: number;
  generalAndAdministrativeExpenses: number;
  sellingAndMarketingExpenses: number;
  sellingGeneralAndAdministrativeExpenses: number;
  otherExpenses: number;
  operatingExpenses: number;
  costAndExpenses: number;
  netInterestIncome: number;
  interestIncome: number;
  interestExpense: number;
  depreciationAndAmortization: number;
  ebitda: number;
  ebit: number;
  nonOperatingIncomeExcludingInterest: number;
  operatingIncome: number;
  totalOtherIncomeExpensesNet: number;
  incomeBeforeTax: number;
  incomeTaxExpense: number;
  netIncomeFromContinuingOperations: number;
  netIncomeFromDiscontinuedOperations: number;
  otherAdjustmentsToNetIncome: number;
  netIncome: number;
  netIncomeDeductions: number;
  bottomLineNetIncome: number;
  eps: number;
  epsDiluted: number;
  weightedAverageShsOut: number;
  weightedAverageShsOutDil: number;
}

export interface BalanceSheetStatement extends BaseStatement {
  cashAndCashEquivalents: number;
  shortTermInvestments: number;
  cashAndShortTermInvestments: number;
  netReceivables: number;
  accountsReceivables: number;
  otherReceivables: number;
  inventory: number;
  prepaids: number;
  otherCurrentAssets: number;
  totalCurrentAssets: number;
  propertyPlantEquipmentNet: number;
  goodwill: number;
  intangibleAssets: number;
  goodwillAndIntangibleAssets: number;
  longTermInvestments: number;
  taxAssets: number;
  otherNonCurrentAssets: number;
  totalNonCurrentAssets: number;
  otherAssets: number;
  totalAssets: number;
  totalPayables: number;
  accountPayables: number;
  otherPayables: number;
  accruedExpenses: number;
  shortTermDebt: number;
  capitalLeaseObligationsCurrent: number;
  taxPayables: number;
  deferredRevenue: number;
  otherCurrentLiabilities: number;
  totalCurrentLiabilities: number;
  longTermDebt: number;
  deferredRevenueNonCurrent: number;
  deferredTaxLiabilitiesNonCurrent: number;
  otherNonCurrentLiabilities: number;
  totalNonCurrentLiabilities: number;
  otherLiabilities: number;
  capitalLeaseObligations: number;
  totalLiabilities: number;
  treasuryStock: number;
  preferredStock: number;
  commonStock: number;
  retainedEarnings: number;
  additionalPaidInCapital: number;
  accumulatedOtherComprehensiveIncomeLoss: number;
  otherTotalStockholdersEquity: number;
  totalStockholdersEquity: number;
  totalEquity: number;
  minorityInterest: number;
  totalLiabilitiesAndTotalEquity: number;
  totalInvestments: number;
  totalDebt: number;
  netDebt: number;
}

export interface CashFlowStatement extends BaseStatement {
  netIncome: number;
  depreciationAndAmortization: number;
  deferredIncomeTax: number;
  stockBasedCompensation: number;
  changeInWorkingCapital: number;
  accountsReceivables: number;
  inventory: number;
  accountsPayables: number;
  otherWorkingCapital: number;
  otherNonCashItems: number;
  netCashProvidedByOperatingActivities: number;
  investmentsInPropertyPlantAndEquipment: number;
  acquisitionsNet: number;
  purchasesOfInvestments: number;
  salesMaturitiesOfInvestments: number;
  otherInvestingActivities: number;
  netCashProvidedByInvestingActivities: number;
  netDebtIssuance: number;
  longTermNetDebtIssuance: number;
  shortTermNetDebtIssuance: number;
  netStockIssuance: number;
  netCommonStockIssuance: number;
  commonStockIssuance: number;
  commonStockRepurchased: number;
  netPreferredStockIssuance: number;
  netDividendsPaid: number;
  commonDividendsPaid: number;
  preferredDividendsPaid: number;
  otherFinancingActivities: number;
  netCashProvidedByFinancingActivities: number;
  effectOfForexChangesOnCash: number;
  netChangeInCash: number;
  cashAtEndOfPeriod: number;
  cashAtBeginningOfPeriod: number;
  operatingCashFlow: number;
  capitalExpenditure: number;
  freeCashFlow: number;
  incomeTaxesPaid: number;
  interestPaid: number;
}

export interface IncomeStatementGrowth extends BaseStatement {
  growthRevenue: number;
  growthCostOfRevenue: number;
  growthGrossProfit: number;
  growthGrossProfitRatio: number;
  growthResearchAndDevelopmentExpenses: number;
  growthGeneralAndAdministrativeExpenses: number;
  growthSellingAndMarketingExpenses: number;
  growthOtherExpenses: number;
  growthOperatingExpenses: number;
  growthCostAndExpenses: number;
  growthInterestIncome: number;
  growthInterestExpense: number;
  growthDepreciationAndAmortization: number;
  growthEBITDA: number;
  growthOperatingIncome: number;
  growthIncomeBeforeTax: number;
  growthIncomeTaxExpense: number;
  growthNetIncome: number;
  growthEPS: number;
  growthEPSDiluted: number;
  growthWeightedAverageShsOut: number;
  growthWeightedAverageShsOutDil: number;
  growthEBIT: number;
  growthNonOperatingIncomeExcludingInterest: number;
  growthNetInterestIncome: number;
  growthTotalOtherIncomeExpensesNet: number;
  growthNetIncomeFromContinuingOperations: number;
  growthOtherAdjustmentsToNetIncome: number;
  growthNetIncomeDeductions: number;
}

export interface BalanceSheetStatementGrowth extends BaseStatement {
  growthCashAndCashEquivalents: number;
  growthShortTermInvestments: number;
  growthCashAndShortTermInvestments: number;
  growthNetReceivables: number;
  growthInventory: number;
  growthOtherCurrentAssets: number;
  growthTotalCurrentAssets: number;
  growthPropertyPlantEquipmentNet: number;
  growthGoodwill: number;
  growthIntangibleAssets: number;
  growthGoodwillAndIntangibleAssets: number;
  growthLongTermInvestments: number;
  growthTaxAssets: number;
  growthOtherNonCurrentAssets: number;
  growthTotalNonCurrentAssets: number;
  growthOtherAssets: number;
  growthTotalAssets: number;
  growthAccountPayables: number;
  growthShortTermDebt: number;
  growthTaxPayables: number;
  growthDeferredRevenue: number;
  growthOtherCurrentLiabilities: number;
  growthTotalCurrentLiabilities: number;
  growthLongTermDebt: number;
  growthDeferredRevenueNonCurrent: number;
  growthDeferredTaxLiabilitiesNonCurrent: number;
  growthOtherNonCurrentLiabilities: number;
  growthTotalNonCurrentLiabilities: number;
  growthOtherLiabilities: number;
  growthTotalLiabilities: number;
  growthPreferredStock: number;
  growthCommonStock: number;
  growthRetainedEarnings: number;
  growthAccumulatedOtherComprehensiveIncomeLoss: number;
  growthOthertotalStockholdersEquity: number;
  growthTotalStockholdersEquity: number;
  growthMinorityInterest: number;
  growthTotalEquity: number;
  growthTotalLiabilitiesAndStockholdersEquity: number;
  growthTotalInvestments: number;
  growthTotalDebt: number;
  growthNetDebt: number;
  growthAccountsReceivables: number;
  growthOtherReceivables: number;
  growthPrepaids: number;
  growthTotalPayables: number;
  growthOtherPayables: number;
  growthAccruedExpenses: number;
  growthCapitalLeaseObligationsCurrent: number;
  growthAdditionalPaidInCapital: number;
  growthTreasuryStock: number;
}

export interface CashFlowStatementGrowth extends BaseStatement {
  growthNetIncome: number;
  growthDepreciationAndAmortization: number;
  growthDeferredIncomeTax: number;
  growthStockBasedCompensation: number;
  growthChangeInWorkingCapital: number;
  growthAccountsReceivables: number;
  growthInventory: number;
  growthAccountsPayables: number;
  growthOtherWorkingCapital: number;
  growthOtherNonCashItems: number;
  growthNetCashProvidedByOperatingActivites: number;
  growthInvestmentsInPropertyPlantAndEquipment: number;
  growthAcquisitionsNet: number;
  growthPurchasesOfInvestments: number;
  growthSalesMaturitiesOfInvestments: number;
  growthOtherInvestingActivites: number;
  growthNetCashUsedForInvestingActivites: number;
  growthDebtRepayment: number;
  growthCommonStockIssued: number;
  growthCommonStockRepurchased: number;
  growthDividendsPaid: number;
  growthOtherFinancingActivites: number;
  growthNetCashUsedProvidedByFinancingActivities: number;
  growthEffectOfForexChangesOnCash: number;
  growthNetChangeInCash: number;
  growthCashAtEndOfPeriod: number;
  growthCashAtBeginningOfPeriod: number;
  growthOperatingCashFlow: number;
  growthCapitalExpenditure: number;
  growthFreeCashFlow: number;
  growthNetDebtIssuance: number;
  growthLongTermNetDebtIssuance: number;
  growthShortTermNetDebtIssuance: number;
  growthNetStockIssuance: number;
  growthPreferredDividendsPaid: number;
  growthIncomeTaxesPaid: number;
  growthInterestPaid: number;
}

export interface FinancialStatementGrowth extends BaseStatement {
  revenueGrowth: number;
  grossProfitGrowth: number;
  ebitgrowth: number;
  operatingIncomeGrowth: number;
  netIncomeGrowth: number;
  epsgrowth: number;
  epsdilutedGrowth: number;
  weightedAverageSharesGrowth: number;
  weightedAverageSharesDilutedGrowth: number;
  dividendsPerShareGrowth: number;
  operatingCashFlowGrowth: number;
  receivablesGrowth: number;
  inventoryGrowth: number;
  assetGrowth: number;
  bookValueperShareGrowth: number;
  debtGrowth: number;
  rdexpenseGrowth: number;
  sgaexpensesGrowth: number;
  freeCashFlowGrowth: number;
  tenYRevenueGrowthPerShare: number;
  fiveYRevenueGrowthPerShare: number;
  threeYRevenueGrowthPerShare: number;
  tenYOperatingCFGrowthPerShare: number;
  fiveYOperatingCFGrowthPerShare: number;
  threeYOperatingCFGrowthPerShare: number;
  tenYNetIncomeGrowthPerShare: number;
  fiveYNetIncomeGrowthPerShare: number;
  threeYNetIncomeGrowthPerShare: number;
  tenYShareholdersEquityGrowthPerShare: number;
  fiveYShareholdersEquityGrowthPerShare: number;
  threeYShareholdersEquityGrowthPerShare: number;
  tenYDividendperShareGrowthPerShare: number;
  fiveYDividendperShareGrowthPerShare: number;
  threeYDividendperShareGrowthPerShare: number;
  ebitdaGrowth: number | null;
  growthCapitalExpenditure: number | null;
  tenYBottomLineNetIncomeGrowthPerShare: number | null;
  fiveYBottomLineNetIncomeGrowthPerShare: number | null;
  threeYBottomLineNetIncomeGrowthPerShare: number | null;
}

export interface FinancialReportDate {
  symbol: string;
  fiscalYear: number;
  period: Period;
  linkXlsx: string;
  linkJson: string;
}

export interface LatestFinancialStatement {
  symbol: string;
  calendarYear: number;
  period: Period;
  date: string;
  dateAdded: string;
}

// Financial Reports Form 10-K JSON API
interface FinancialReportItem {
  [key: string]: string[] | number[] | any[];
}

export interface FinancialReport10K {
  symbol: string;
  period: string;
  year: string;
  [key: string]: string | string[] | FinancialReportItem[] | any;
}

// Revenue Product Segmentation API
export interface RevenueProductSegmentation {
  symbol: string;
  fiscalYear: number;
  period: string;
  reportedCurrency: string | null;
  date: string;
  data: {
    [productCategory: string]: number;
  };
}

// Revenue Geographic Segments API
export interface RevenueGeographicSegmentation {
  symbol: string;
  fiscalYear: number;
  period: string;
  reportedCurrency: string | null;
  date: string;
  data: {
    [region: string]: number;
  };
}

// As Reported Statements API
interface AsReportedStatement {
  symbol: string;
  fiscalYear: number;
  period: string;
  reportedCurrency: string | null;
  date: string;
  data: {
    [key: string]: number | string | null;
  };
}

export interface AsReportedIncomeStatement extends AsReportedStatement {}
export interface AsReportedBalanceSheet extends AsReportedStatement {}
export interface AsReportedCashFlowStatement extends AsReportedStatement {}
export interface AsReportedFinancialStatement extends AsReportedStatement {}

export interface KeyMetrics {
  symbol: string;
  date: string;
  fiscalYear: string;
  period: string;
  reportedCurrency: string;
  marketCap: number;
  enterpriseValue: number;
  evToSales: number;
  evToOperatingCashFlow: number;
  evToFreeCashFlow: number;
  evToEBITDA: number;
  netDebtToEBITDA: number;
  currentRatio: number;
  incomeQuality: number;
  grahamNumber: number;
  grahamNetNet: number;
  taxBurden: number;
  interestBurden: number;
  workingCapital: number;
  investedCapital: number;
  returnOnAssets: number; 
  operatingReturnOnAssets: number;
  returnOnTangibleAssets: number;
  returnOnEquity: number;
  returnOnInvestedCapital: number;
  returnOnCapitalEmployed: number;
  earningsYield: number;
  freeCashFlowYield: number;  
  capexToOperatingCashFlow: number;
  capexToDepreciation: number;
  capexToRevenue: number;
  salesGeneralAndAdministrativeToRevenue: number;
  researchAndDevelopementToRevenue: number;
  stockBasedCompensationToRevenue: number;
  intangiblesToTotalAssets: number; 
  averageReceivables: number;
  averagePayables: number;
  averageInventory: number;
  daysOfSalesOutstanding: number;
  daysOfPayablesOutstanding: number;
  daysOfInventoryOutstanding: number;
  operatingCycle: number; 
  cashConversionCycle: number;
  freeCashFlowToEquity: number;
  freeCashFlowToFirm: number;
  tangibleAssetValue: number;
  netCurrentAssetValue: number;
}

export interface Ratios {
  symbol: string;
  date: string;
  fiscalYear: string;
  period: string;
  reportedCurrency: string;
  grossProfitMargin: number;
  ebitMargin: number;
  ebitdaMargin: number;
  operatingProfitMargin: number;
  pretaxProfitMargin: number;
  continuousOperationsProfitMargin: number;
  netProfitMargin: number;
  bottomLineProfitMargin: number;
  receivablesTurnover: number;
  payablesTurnover: number;
  inventoryTurnover: number;
  fixedAssetTurnover: number;
  assetTurnover: number;
  currentRatio: number;
  quickRatio: number;
  solvencyRatio: number;
  cashRatio: number;
  priceToEarningsRatio: number;
  priceToEarningsGrowthRatio: number;
  forwardPriceToEarningsGrowthRatio: number;
  priceToBookRatio: number;
  priceToSalesRatio: number;
  priceToFreeCashFlowRatio: number;
  priceToOperatingCashFlowRatio: number;
  debtToAssetsRatio: number;
  debtToEquityRatio: number;
  debtToCapitalRatio: number;
  longTermDebtToCapitalRatio: number;
  financialLeverageRatio: number;
  workingCapitalTurnoverRatio: number;
  operatingCashFlowRatio: number;
  operatingCashFlowSalesRatio: number;
  freeCashFlowOperatingCashFlowRatio: number;
  debtServiceCoverageRatio: number;
  interestCoverageRatio: number;
  shortTermOperatingCashFlowCoverageRatio: number;
  operatingCashFlowCoverageRatio: number;
  capitalExpenditureCoverageRatio: number;
  dividendPaidAndCapexCoverageRatio: number;
  dividendPayoutRatio: number;
  dividendYield: number;
  dividendYieldPercentage: number;
  revenuePerShare: number;
  netIncomePerShare: number;
  interestDebtPerShare: number;
  cashPerShare: number;
  bookValuePerShare: number;
  tangibleBookValuePerShare: number;
  shareholdersEquityPerShare: number;
  operatingCashFlowPerShare: number;
  capexPerShare: number;
  freeCashFlowPerShare: number;
  netIncomePerEBT: number;
  ebtPerEbit: number;
  priceToFairValue: number;
  debtToMarketCap: number;
  effectiveTaxRate: number;
  enterpriseValueMultiple: number;
}

export interface KeyMetricsTTM {
  symbol: string;
  marketCap: number;
  enterpriseValueTTM: number;
  evToSalesTTM: number;
  evToOperatingCashFlowTTM: number;
  evToFreeCashFlowTTM: number;
  evToEBITDATTM: number;
  netDebtToEBITDATTM: number;
  currentRatioTTM: number;
  incomeQualityTTM: number;
  grahamNumberTTM: number;
  grahamNetNetTTM: number;
  taxBurdenTTM: number;
  interestBurdenTTM: number;
  workingCapitalTTM: number;
  investedCapitalTTM: number;
  returnOnAssetsTTM: number;
  operatingReturnOnAssetsTTM: number;
  returnOnTangibleAssetsTTM: number;
  returnOnEquityTTM: number;
  returnOnInvestedCapitalTTM: number;
  returnOnCapitalEmployedTTM: number;
  earningsYieldTTM: number;
  freeCashFlowYieldTTM: number;
  capexToOperatingCashFlowTTM: number;
  capexToDepreciationTTM: number;
  capexToRevenueTTM: number;
  salesGeneralAndAdministrativeToRevenueTTM: number;
  researchAndDevelopementToRevenueTTM: number;
  stockBasedCompensationToRevenueTTM: number;
  intangiblesToTotalAssetsTTM: number;
  averageReceivablesTTM: number;
  averagePayablesTTM: number;
  averageInventoryTTM: number;
  daysOfSalesOutstandingTTM: number;
  daysOfPayablesOutstandingTTM: number;
  daysOfInventoryOutstandingTTM: number;
  operatingCycleTTM: number;
  cashConversionCycleTTM: number;
  freeCashFlowToEquityTTM: number;
  freeCashFlowToFirmTTM: number;
  tangibleAssetValueTTM: number;
  netCurrentAssetValueTTM: number;
}

export interface FinancialRatiosTTM {
  symbol: string;
  date: string;
  fiscalYear: string;
  period: string;
  reportedCurrency: string;
  grossProfitMarginTTM: number;
  ebitMarginTTM: number;
  ebitdaMarginTTM: number;
  operatingProfitMarginTTM: number;
  pretaxProfitMarginTTM: number;
  continuousOperationsProfitMarginTTM: number;
  netProfitMarginTTM: number;
  bottomLineProfitMarginTTM: number;
  receivablesTurnoverTTM: number;
  payablesTurnoverTTM: number;
  inventoryTurnoverTTM: number;
  fixedAssetTurnoverTTM: number;
  assetTurnoverTTM: number;
  currentRatioTTM: number;
  quickRatioTTM: number;
  solvencyRatioTTM: number;
  cashRatioTTM: number;
  priceToEarningsRatioTTM: number;
  priceToEarningsGrowthRatioTTM: number;
  forwardPriceToEarningsGrowthRatioTTM: number;
  priceToBookRatioTTM: number;
  priceToSalesRatioTTM: number;
  priceToFreeCashFlowRatioTTM: number;
  priceToOperatingCashFlowRatioTTM: number;
  debtToAssetsRatioTTM: number;
  debtToEquityRatioTTM: number;
  debtToCapitalRatioTTM: number;
  longTermDebtToCapitalRatioTTM: number;
  financialLeverageRatioTTM: number;
  workingCapitalTurnoverRatioTTM: number;
  operatingCashFlowRatioTTM: number;
  operatingCashFlowSalesRatioTTM: number;
  freeCashFlowOperatingCashFlowRatioTTM: number;
  debtServiceCoverageRatioTTM: number;
  interestCoverageRatioTTM: number;
  shortTermOperatingCashFlowCoverageRatioTTM: number;
  operatingCashFlowCoverageRatioTTM: number;
  capitalExpenditureCoverageRatioTTM: number;
  dividendPaidAndCapexCoverageRatioTTM: number;
  dividendPayoutRatioTTM: number;
  dividendYieldTTM: number;
  enterpriseValueTTM: number;
  revenuePerShareTTM: number;
  netIncomePerShareTTM: number;
  interestDebtPerShareTTM: number;
  cashPerShareTTM: number;
  bookValuePerShareTTM: number;
  tangibleBookValuePerShareTTM: number;
  shareholdersEquityPerShareTTM: number;
  operatingCashFlowPerShareTTM: number;
  capexPerShareTTM: number;
  freeCashFlowPerShareTTM: number;
  netIncomePerEBTTTM: number;
  ebtPerEbitTTM: number;
  priceToFairValueTTM: number;
  debtToMarketCapTTM: number;
  effectiveTaxRateTTM: number;
  enterpriseValueMultipleTTM: number;
}

export interface FinancialScores {
  symbol: string;
  reportedCurrency: string;
  altmanZScore: number;
  piotroskiScore: number;
  workingCapital: number;
  totalAssets: number;
  retainedEarnings: number;
  ebit: number;
  marketCap: number;
  totalLiabilities: number;
  revenue: number;
}

export interface OwnerEarnings {
  symbol: string;
  reportedCurrency: string;
  fiscalYear: string;
  period: string;
  date: string;
  averagePPE: number;
  maintenanceCapex: number;
  ownersEarnings: number;
  growthCapex: number;
  ownersEarningsPerShare: number;
}
