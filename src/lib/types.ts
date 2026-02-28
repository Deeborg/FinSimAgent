// ─── Core Financial Types ──────────────────────────────────────

export type FinancialStatementItem = {
  item: string;
  amount: number;
  isTotal?: boolean;
};

export type BalanceSheet = {
  assets: FinancialStatementItem[];
  liabilities: FinancialStatementItem[];
  equity: FinancialStatementItem[];
};

// ─── Sensitivity Analysis ──────────────────────────────────────

export type SensitivityDataPoint = {
  parameter: string;
  lowValue: number;
  baseValue: number;
  highValue: number;
  revenueImpact: number;
  netIncomeImpact: number;
  cashFlowImpact: number;
};

// ─── Simulation Types ──────────────────────────────────────────

export type SimulationResult = {
  simulationParameters: string;
  simulationAnalysis: string;
  suggestions: string;
  riskAssessment: string;
  simulatedBalanceSheet: BalanceSheet;
  simulatedProfitAndLoss: FinancialStatementItem[];
  simulatedCashFlow: FinancialStatementItem[];
  keyMetrics: {
    name: string;
    original: number;
    simulated: number;
  }[];
  economicTrends: {
    name: string;
    value: number;
  }[];
  financialRatios: {
    name: string;
    original: number;
    simulated: number;
    unit: string;
  }[];
  waterfallData: {
    name: string;
    value: number;
    type: 'increase' | 'decrease' | 'total';
  }[];
  sensitivityData: SensitivityDataPoint[];
  overallScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
};

export type SimulationParameters = {
  productionCapacity: number;
  inventoryTurnover: number;
  supplierLeadTime: number;
  cogsMaterials: number;
  cogsLabor: number;
  cogsOverhead: number;
  salaryInflation: number;
  headcountChange: number;
  capexMaintenance: number;
  capexGrowth: number;
  depreciation: number;
  rdExpenditure: number;
  salesConversion: number;
  customerChurn: number;
  arDays: number;
  apDays: number;
  inventoryDays: number;
  discount: number;
  newProductImpact: number;
  marketDemand: number;
  competitionIndex: number;
  commodityIndex: number;
  supplyDisruption: number;
  freightRates: number;
  customerSentiment: number;
  inflationRate: number;
  interestRate: number;
  unemploymentRate: number;
  gdpGrowth: number;
  consumerConfidence: number;
  pmi: number;
  bondYieldSpread: number;
  creditSpread: number;
  revenueShock: number;
  cyberAttackDowntime: number;
  esgPenalty: number;
  forexRate: number;
};

// ─── Scenario Types ────────────────────────────────────────────

export type SavedScenario = {
  id: string;
  name: string;
  description: string;
  parameters: SimulationParameters;
  result: SimulationResult;
  createdAt: Date;
};

// ─── Original Financial Data (baseline) ────────────────────────

export const ORIGINAL_BALANCE_SHEET: BalanceSheet = {
  assets: [
    { item: 'Cash and Equivalents', amount: 5200000 },
    { item: 'Accounts Receivable', amount: 3400000 },
    { item: 'Inventory', amount: 2100000 },
    { item: 'Prepaid Expenses', amount: 450000 },
    { item: 'Current Assets', amount: 11150000, isTotal: true },
    { item: 'Property, Plant & Equipment', amount: 15800000 },
    { item: 'Intangible Assets', amount: 2200000 },
    { item: 'Goodwill', amount: 1850000 },
    { item: 'Non-Current Assets', amount: 19850000, isTotal: true },
    { item: 'Total Assets', amount: 31000000, isTotal: true },
  ],
  liabilities: [
    { item: 'Accounts Payable', amount: 2800000 },
    { item: 'Short-term Debt', amount: 1200000 },
    { item: 'Accrued Expenses', amount: 950000 },
    { item: 'Current Liabilities', amount: 4950000, isTotal: true },
    { item: 'Long-term Debt', amount: 8000000 },
    { item: 'Deferred Tax Liabilities', amount: 650000 },
    { item: 'Non-Current Liabilities', amount: 8650000, isTotal: true },
    { item: 'Total Liabilities', amount: 13600000, isTotal: true },
  ],
  equity: [
    { item: 'Common Stock', amount: 5000000 },
    { item: 'Retained Earnings', amount: 10400000 },
    { item: 'Additional Paid-in Capital', amount: 2000000 },
    { item: 'Total Equity', amount: 17400000, isTotal: true },
    { item: 'Total Liabilities & Equity', amount: 31000000, isTotal: true },
  ],
};

export const ORIGINAL_PNL: FinancialStatementItem[] = [
  { item: 'Revenue', amount: 22500000 },
  { item: 'Cost of Goods Sold', amount: -12300000 },
  { item: 'Gross Profit', amount: 10200000, isTotal: true },
  { item: 'Selling, General & Admin', amount: -4200000 },
  { item: 'Research & Development', amount: -800000 },
  { item: 'Depreciation & Amortization', amount: -1700000 },
  { item: 'Total Operating Expenses', amount: -6700000, isTotal: true },
  { item: 'Operating Income (EBIT)', amount: 3500000, isTotal: true },
  { item: 'Interest Expense', amount: -440000 },
  { item: 'Other Income / (Expense)', amount: 120000 },
  { item: 'Earnings Before Tax (EBT)', amount: 3180000, isTotal: true },
  { item: 'Income Tax Expense', amount: -700000 },
  { item: 'Net Income', amount: 2480000, isTotal: true },
];

export const ORIGINAL_CASH_FLOW: FinancialStatementItem[] = [
  { item: 'Net Income', amount: 2480000 },
  { item: 'Depreciation & Amortization', amount: 1700000 },
  { item: 'Changes in Working Capital', amount: -80000 },
  { item: 'Cash from Operations', amount: 4100000, isTotal: true },
  { item: 'Capital Expenditures', amount: -1500000 },
  { item: 'Acquisitions', amount: -1000000 },
  { item: 'Cash from Investing', amount: -2500000, isTotal: true },
  { item: 'Debt Repayment', amount: -800000 },
  { item: 'Equity Issuance', amount: 0 },
  { item: 'Dividends Paid', amount: -600000 },
  { item: 'Cash from Financing', amount: -1400000, isTotal: true },
  { item: 'Net Change in Cash', amount: 200000, isTotal: true },
];

export const ORIGINAL_RATIOS: { name: string; value: number; unit: string }[] = [
  { name: 'Gross Margin', value: 45.3, unit: '%' },
  { name: 'Operating Margin', value: 15.6, unit: '%' },
  { name: 'Net Margin', value: 11.0, unit: '%' },
  { name: 'ROE', value: 14.3, unit: '%' },
  { name: 'ROA', value: 8.0, unit: '%' },
  { name: 'Current Ratio', value: 2.25, unit: 'x' },
  { name: 'Debt/Equity', value: 0.53, unit: 'x' },
  { name: 'Interest Coverage', value: 7.95, unit: 'x' },
  { name: 'Asset Turnover', value: 0.73, unit: 'x' },
  { name: 'Cash Conversion Cycle', value: 34, unit: 'days' }, // DSO 55 + DIO 62 − DPO 83
];

export const DEFAULT_PARAMETERS: SimulationParameters = {
  // ── Operational (prevailing baseline) ─────────────────────
  productionCapacity: 80,       // 80 % utilisation
  inventoryTurnover: 5.86,      // COGS 12.3 M / Inventory 2.1 M
  supplierLeadTime: 30,         // 30 days
  cogsMaterials: 40,            // 40 % of COGS
  cogsLabor: 30,                // 30 % of COGS
  cogsOverhead: 30,             // 30 % of COGS
  salaryInflation: 3,           // 3 % YoY
  headcountChange: 0,           // no change
  capexMaintenance: 1_000_000,  // $1 M maintenance
  capexGrowth: 500_000,         // $0.5 M growth
  depreciation: 1_700_000,      // matches baseline D&A on P&L
  rdExpenditure: 800_000,       // matches baseline R&D

  // ── Pricing & Working Capital ────────────────────────────
  salesConversion: 10,          // 10 % pipeline conversion
  customerChurn: 5,             // 5 % annual churn
  arDays: 55,                   // AR 3.4 M / (Rev 22.5 M / 365)
  apDays: 83,                   // AP 2.8 M / (COGS 12.3 M / 365)
  inventoryDays: 62,            // Inv 2.1 M / (COGS 12.3 M / 365)
  discount: 5,                  // 5 % average discount
  newProductImpact: 0,          // no new-product revenue

  // ── Micro-Economic (indices at 100 = neutral) ────────────
  marketDemand: 100,
  competitionIndex: 50,         // 50 = median competitive pressure
  commodityIndex: 100,
  supplyDisruption: 0,          // 0 % disruption (calm baseline)
  freightRates: 100,
  customerSentiment: 100,

  // ── Macro-Economic (prevailing rates, Feb 2026) ──────────
  inflationRate: 2.5,           // CPI %
  interestRate: 5.5,            // policy rate %
  unemploymentRate: 4.0,        // %
  gdpGrowth: 2.1,               // %
  consumerConfidence: 100,      // index
  pmi: 50,                      // neutral

  // ── Financial Markets ────────────────────────────────────
  bondYieldSpread: 0.76,        // 2 Y / 10 Y %
  creditSpread: 2.0,            // IG spread %

  // ── Risk / Stress ────────────────────────────────────────
  revenueShock: 0,
  cyberAttackDowntime: 0,
  esgPenalty: 0,

  // ── Forex ────────────────────────────────────────────────
  forexRate: 87.0,              // USD / INR (approx Feb 2026)
};
