/**
 * Deterministic Financial Simulation Engine
 *
 * All financial mathematics are handled here — no AI is used for numbers.
 * The engine guarantees:
 *   1. All three statements (P&L, BS, CFS) are internally consistent
 *   2. Balance Sheet always balances (Assets = Liabilities + Equity)
 *   3. Parameter changes propagate realistically through variable/fixed cost splits
 *   4. Working-capital, capex, and financing flows are logically linked
 *
 * The AI layer is only used for qualitative analysis (commentary, suggestions, risk).
 */

import type {
  SimulationParameters,
  SimulationResult,
  FinancialStatementItem,
  BalanceSheet,
  SensitivityDataPoint,
} from './types';
import { DEFAULT_PARAMETERS } from './types';

// ─── Baseline (Original) Constants ──────────────────────────────

const B = {
  // P&L
  revenue: 22_500_000,
  cogs: 12_300_000, // positive value
  sga: 4_200_000,
  rd: 800_000,
  da: 1_700_000,
  interestExpense: 440_000,
  otherIncome: 120_000,
  taxRate: 0.22, // 700K / 3,180K
  netIncome: 2_480_000,
  grossProfit: 10_200_000,
  ebit: 3_500_000,

  // BS
  cash: 5_200_000,
  ar: 3_400_000,
  inventory: 2_100_000,
  prepaid: 450_000,
  ppe: 15_800_000,
  intangibles: 2_200_000,
  goodwill: 1_850_000,
  ap: 2_800_000,
  shortTermDebt: 1_200_000,
  accruedExpenses: 950_000,
  longTermDebt: 8_000_000,
  deferredTax: 650_000,
  commonStock: 5_000_000,
  retainedEarnings: 10_400_000,
  apic: 2_000_000,

  // CF
  totalCapex: 1_500_000, // maintenance + growth
  acquisitions: 1_000_000,
  debtRepayment: 800_000,
  dividends: 600_000,
  cashFromOps: 4_100_000,

  // Derived
  totalDebt: 9_200_000, // 1.2M + 8M
  effectiveRate: 0.04783, // 440K / 9.2M
} as const;

const D = DEFAULT_PARAMETERS;

// ─── Internal result type ───────────────────────────────────────

interface EngineNumbers {
  // P&L
  revenue: number;
  cogs: number;
  grossProfit: number;
  sga: number;
  rd: number;
  da: number;
  totalOpex: number;
  ebit: number;
  interestExpense: number;
  otherIncome: number;
  ebt: number;
  tax: number;
  netIncome: number;

  // BS
  cash: number;
  ar: number;
  inventory: number;
  prepaid: number;
  currentAssets: number;
  ppe: number;
  intangibles: number;
  goodwill: number;
  nonCurrentAssets: number;
  totalAssets: number;
  ap: number;
  shortTermDebt: number;
  accruedExpenses: number;
  currentLiabilities: number;
  longTermDebt: number;
  deferredTax: number;
  nonCurrentLiabilities: number;
  totalLiabilities: number;
  commonStock: number;
  retainedEarnings: number;
  apic: number;
  totalEquity: number;

  // CF
  cfOps: number;
  cfInvesting: number;
  cfFinancing: number;
  netCashChange: number;
  wcChanges: number;
  capex: number;

  // Ratios
  grossMargin: number;
  operatingMargin: number;
  netMargin: number;
  roe: number;
  roa: number;
  currentRatio: number;
  debtToEquity: number;
  interestCoverage: number;
  assetTurnover: number;
  cashConversionCycle: number;
}

// ─── Helper: safe division ──────────────────────────────────────

function safeDiv(num: number, den: number, fallback = 0): number {
  return den !== 0 ? num / den : fallback;
}

function round(n: number): number {
  return Math.round(n);
}

function pct(n: number, decimals = 1): number {
  return Number((n * 100).toFixed(decimals));
}

// ─── Core Engine ────────────────────────────────────────────────

export function computeSimulation(params: SimulationParameters): EngineNumbers {
  // ── 1. REVENUE ──────────────────────────────────────────────
  // Revenue is driven by demand-side and supply-side factors.
  // Each factor contributes a percentage delta from baseline.
  let revenueDelta = 0;

  // Production capacity: baseline 80%. Capacity constrains max output.
  // Going from 80→100 = 25% more capacity, ~40% of which converts to revenue (if demand exists).
  const capacityPct = (params.productionCapacity - D.productionCapacity) / D.productionCapacity;
  revenueDelta += capacityPct * 0.35;

  // Market demand index: baseline 100. Direct demand driver.
  const demandPct = (params.marketDemand - D.marketDemand) / D.marketDemand;
  revenueDelta += demandPct * 0.55;

  // Sales conversion rate: baseline 10%. Better conversion → more revenue from same pipeline.
  const conversionPct = (params.salesConversion - D.salesConversion) / D.salesConversion;
  revenueDelta += conversionPct * 0.12;

  // Customer churn: baseline 5%. More churn = losing recurring revenue.
  const churnDelta = (params.customerChurn - D.customerChurn) / 100;
  revenueDelta -= churnDelta * 0.7;

  // Discount strategy: baseline 5%. Higher discount → volume uplift < price loss (net negative).
  // Each +1% discount ≈ -0.6% net revenue (price elasticity ~0.4).
  const discountDelta = params.discount - D.discount;
  revenueDelta -= discountDelta * 0.006;

  // Consumer confidence: baseline 100. Discretionary spending driver.
  const confidencePct = (params.consumerConfidence - D.consumerConfidence) / D.consumerConfidence;
  revenueDelta += confidencePct * 0.20;

  // GDP growth: baseline 2.1%. Revenue elasticity to GDP ≈ 2-3x.
  const gdpDelta = params.gdpGrowth - D.gdpGrowth;
  revenueDelta += gdpDelta * 0.022;

  // Competition index: baseline 50 (neutral). Higher = more competition → less market share.
  const competitionPct = (params.competitionIndex - D.competitionIndex) / D.competitionIndex;
  revenueDelta -= competitionPct * 0.18;

  // Customer sentiment: baseline 100. Brand/loyalty driver.
  const sentimentPct = (params.customerSentiment - D.customerSentiment) / D.customerSentiment;
  revenueDelta += sentimentPct * 0.15;

  // PMI: baseline 50. >50 = expansion. Economic activity proxy.
  const pmiPct = (params.pmi - D.pmi) / D.pmi;
  revenueDelta += pmiPct * 0.12;

  // Unemployment: baseline 4%. Higher → less consumer spending.
  const unemployDelta = params.unemploymentRate - D.unemploymentRate;
  revenueDelta -= unemployDelta * 0.018;

  // Cyber-attack downtime: baseline 0. Lost revenue days.
  revenueDelta -= params.cyberAttackDowntime / 365;

  // Revenue shock: direct percentage impact (stress test).
  revenueDelta += params.revenueShock / 100;

  // Forex: baseline ~87. For a company with ~10-15% export exposure,
  // weaker INR (higher rate) slightly boosts USD-reported revenue.
  const forexPct = (params.forexRate - D.forexRate) / D.forexRate;
  revenueDelta += forexPct * 0.08;

  const revenue = round(B.revenue * (1 + revenueDelta) + params.newProductImpact);

  // ── 2. COST OF GOODS SOLD ──────────────────────────────────
  // COGS has a variable component (~70%, scales with revenue volume)
  // and a semi-fixed component (~30%, changes with cost drivers only).
  const revenueRatio = revenue / B.revenue;

  // Normalize COGS breakdown to always sum to 100 for weighting.
  const cogsTotal = params.cogsMaterials + params.cogsLabor + params.cogsOverhead;
  const matWeight = cogsTotal > 0 ? params.cogsMaterials / cogsTotal : 0.4;
  const labWeight = cogsTotal > 0 ? params.cogsLabor / cogsTotal : 0.3;
  // overheadWeight implied as remainder

  let costMultiplier = 1.0;

  // Commodity index: baseline 100. Impacts materials portion of COGS.
  const commodityPct = (params.commodityIndex - D.commodityIndex) / D.commodityIndex;
  costMultiplier += commodityPct * matWeight * 0.85;

  // Freight rates: baseline 100. Impacts logistics/distribution (~12% of COGS).
  const freightPct = (params.freightRates - D.freightRates) / D.freightRates;
  costMultiplier += freightPct * 0.12;

  // Salary inflation: baseline 3%. Impacts labor portion of COGS.
  const salaryPct = (params.salaryInflation - D.salaryInflation) / D.salaryInflation;
  costMultiplier += salaryPct * labWeight * 0.55;

  // Headcount change: baseline 0%. Direct impact on labor costs.
  const headcountDelta = params.headcountChange / 100;
  costMultiplier += headcountDelta * labWeight * 0.70;

  // Supply disruption: baseline 0%. Increases costs (expediting, alt-sourcing).
  const disruptionDelta = params.supplyDisruption / 100;
  costMultiplier += disruptionDelta * 0.35;

  // General inflation: baseline 2.5%. Raises all input costs modestly.
  const inflationPct = (params.inflationRate - D.inflationRate) / D.inflationRate;
  costMultiplier += inflationPct * 0.18;

  // Supplier lead time: baseline 30 days. Longer → higher expediting/carrying costs.
  const leadTimePct = (params.supplierLeadTime - D.supplierLeadTime) / D.supplierLeadTime;
  costMultiplier += leadTimePct * 0.04;

  // Inventory turnover: baseline 5.86. Higher turnover → slightly lower waste/carrying costs.
  const turnoverPct = (params.inventoryTurnover - D.inventoryTurnover) / D.inventoryTurnover;
  costMultiplier -= turnoverPct * 0.025;

  // COGS = variable (scales with revenue AND cost drivers) + semi-fixed (cost drivers only)
  const variableCogs = B.cogs * 0.70 * revenueRatio * costMultiplier;
  const fixedCogs = B.cogs * 0.30 * costMultiplier;
  const cogs = round(variableCogs + fixedCogs);

  const grossProfit = revenue - cogs;

  // ── 3. OPERATING EXPENSES ──────────────────────────────────

  // SG&A: ~60% is people cost, rest is rent/marketing/admin.
  let sgaMultiplier = 1.0;
  sgaMultiplier += salaryPct * 0.55;          // salary inflation on people portion
  sgaMultiplier += headcountDelta * 0.45;     // headcount changes affect SG&A headcount
  sgaMultiplier += inflationPct * 0.12;       // general inflation on non-people costs
  const sga = round(B.sga * sgaMultiplier + params.esgPenalty);

  // R&D: directly controllable via parameter.
  const rd = params.rdExpenditure;

  // D&A: User-set depreciation schedule, adjusted for capex changes.
  // If capex changes from baseline, additional assets depreciate at ~10%/yr (10-yr life).
  const newCapex = params.capexMaintenance + params.capexGrowth;
  const capexDelta = newCapex - B.totalCapex;
  const da = round(params.depreciation + Math.max(0, capexDelta) * 0.10);

  const totalOpex = sga + rd + da;
  const ebit = grossProfit - totalOpex;

  // ── 4. BELOW-THE-LINE ──────────────────────────────────────

  // Interest expense: scales with policy rate and credit spread changes.
  // Company rate = base effective rate + Δ(policy rate) + Δ(credit spread).
  const rateShift =
    (params.interestRate - D.interestRate) / 100 +
    (params.creditSpread - D.creditSpread) / 100;
  const newEffectiveRate = Math.max(0, B.effectiveRate + rateShift);
  const interestExpense = round(B.totalDebt * newEffectiveRate);

  // Bond yield spread: a wider spread signals recession risk, light extra cost.
  const spreadDelta = params.bondYieldSpread - D.bondYieldSpread;
  const spreadCost = round(Math.abs(spreadDelta) * 50_000); // ~$50K per 1% inversion
  const adjustedInterest = interestExpense + (spreadDelta < 0 ? spreadCost : 0);

  const otherIncome = B.otherIncome;
  const ebt = ebit - adjustedInterest + otherIncome;

  // Tax: standard corporate rate. No benefit if EBT ≤ 0 (carry forward, not recognized).
  const tax = ebt > 0 ? round(ebt * B.taxRate) : 0;
  const netIncome = ebt - tax;

  // ── 5. BALANCE SHEET ───────────────────────────────────────
  //
  // Working capital items derive from the days parameters:
  //   AR  = Revenue / 365 × arDays
  //   Inv = COGS / 365 × inventoryDays
  //   AP  = COGS / 365 × apDays
  //
  // PPE = base + Δcapex − Δdepreciation
  // Retained Earnings = base + (NI_sim − NI_base)
  // Cash = plug to balance the balance sheet

  const dailyRevenue = revenue / 365;
  const dailyCogs = cogs / 365;

  const ar = round(dailyRevenue * params.arDays);
  const inventory = round(dailyCogs * params.inventoryDays);
  const prepaid = B.prepaid;

  // PPE: opening PPE + capex − D&A.
  // Opening PPE = closing(baseline) − baseline_capex + baseline_DA
  //             = 15,800,000 − 1,500,000 + 1,700,000 = 16,000,000
  const ppeOpening = B.ppe - B.totalCapex + B.da;
  const ppe = round(ppeOpening + newCapex - da);

  const intangibles = B.intangibles;
  const goodwill = B.goodwill;
  const nonCurrentAssets = ppe + intangibles + goodwill;

  const ap = round(dailyCogs * params.apDays);
  const shortTermDebt = B.shortTermDebt;
  const accruedExpenses = B.accruedExpenses;
  const currentLiabilities = ap + shortTermDebt + accruedExpenses;

  // Long-term debt: if growth capex increased, assume 50% debt-financed.
  const growthCapexDelta = Math.max(0, params.capexGrowth - D.capexGrowth);
  const newDebt = growthCapexDelta * 0.50;
  const longTermDebt = round(B.longTermDebt + newDebt);
  const deferredTax = B.deferredTax;
  const nonCurrentLiabilities = longTermDebt + deferredTax;
  const totalLiabilities = currentLiabilities + nonCurrentLiabilities;

  const commonStock = B.commonStock;
  const apic = B.apic;
  // RE = base + delta in net income (simulated year vs baseline year)
  const retainedEarnings = round(B.retainedEarnings + (netIncome - B.netIncome));
  const totalEquity = commonStock + retainedEarnings + apic;

  // Cash is the balance-sheet plug: TotalL&E − all other assets
  const nonCashAssets = ar + inventory + prepaid + nonCurrentAssets;
  const totalLiabAndEquity = totalLiabilities + totalEquity;
  const cash = totalLiabAndEquity - nonCashAssets;

  const currentAssets = cash + ar + inventory + prepaid;
  const totalAssets = currentAssets + nonCurrentAssets;

  // ── 6. CASH FLOW STATEMENT ─────────────────────────────────
  //
  // Derived from P&L and balance-sheet movements to ensure consistency.
  // Net Cash Change = newCash − baseCash.
  // CFI and CFF are calculated explicitly; CFO is the residual.
  // Working-capital changes absorb any rounding.

  const capex = -(params.capexMaintenance + params.capexGrowth);
  const acquisitions = -B.acquisitions;
  const cfInvesting = capex + acquisitions;

  // Financing: scheduled debt repayment always occurs;
  // if LTD increased (e.g. debt-financed growth capex), that's new borrowing.
  const newBorrowing = Math.max(0, longTermDebt - B.longTermDebt);
  const cfFinancing = -B.debtRepayment + newBorrowing - B.dividends;

  const netCashChange = cash - B.cash;
  const cfOps = netCashChange - cfInvesting - cfFinancing;
  const wcChanges = cfOps - netIncome - da;

  // ── 7. RATIOS ──────────────────────────────────────────────

  const grossMargin = pct(safeDiv(grossProfit, revenue));
  const operatingMargin = pct(safeDiv(ebit, revenue));
  const netMarginPct = pct(safeDiv(netIncome, revenue));
  const roe = pct(safeDiv(netIncome, totalEquity));
  const roa = pct(safeDiv(netIncome, totalAssets));
  const currentRatiov = Number(safeDiv(currentAssets, currentLiabilities).toFixed(2));
  const debtToEquity = Number(safeDiv(B.shortTermDebt + longTermDebt, totalEquity).toFixed(2));
  const interestCoverage = Number(safeDiv(ebit, adjustedInterest).toFixed(2));
  const assetTurnover = Number(safeDiv(revenue, totalAssets).toFixed(2));
  const cashConversionCycle = round(params.arDays + params.inventoryDays - params.apDays);

  return {
    revenue,
    cogs,
    grossProfit,
    sga,
    rd,
    da,
    totalOpex,
    ebit,
    interestExpense: adjustedInterest,
    otherIncome,
    ebt,
    tax,
    netIncome,

    cash,
    ar,
    inventory,
    prepaid,
    currentAssets,
    ppe,
    intangibles,
    goodwill,
    nonCurrentAssets,
    totalAssets,
    ap,
    shortTermDebt,
    accruedExpenses,
    currentLiabilities,
    longTermDebt,
    deferredTax,
    nonCurrentLiabilities,
    totalLiabilities,
    commonStock,
    retainedEarnings,
    apic,
    totalEquity,

    cfOps,
    cfInvesting,
    cfFinancing,
    netCashChange,
    wcChanges,
    capex,

    grossMargin,
    operatingMargin,
    netMargin: netMarginPct,
    roe,
    roa,
    currentRatio: currentRatiov,
    debtToEquity,
    interestCoverage,
    assetTurnover,
    cashConversionCycle,
  };
}

// ─── Sensitivity Analysis ───────────────────────────────────────
//
// For each important parameter, run the engine at low / high extremes
// and measure the delta vs the base run.

export function computeSensitivity(
  baseParams: SimulationParameters,
  baseResult: EngineNumbers,
): SensitivityDataPoint[] {
  const tests: { parameter: string; key: keyof SimulationParameters; low: number; high: number }[] = [
    { parameter: 'Market Demand', key: 'marketDemand', low: 80, high: 120 },
    { parameter: 'Production Capacity', key: 'productionCapacity', low: 60, high: 100 },
    { parameter: 'Commodity Prices', key: 'commodityIndex', low: 80, high: 130 },
    { parameter: 'Interest Rate', key: 'interestRate', low: 3.0, high: 8.0 },
    { parameter: 'Inflation Rate', key: 'inflationRate', low: 1.0, high: 5.0 },
  ];

  return tests.map((t) => {
    const lowR = computeSimulation({ ...baseParams, [t.key]: t.low });
    const highR = computeSimulation({ ...baseParams, [t.key]: t.high });
    const baseRev = Math.abs(baseResult.revenue) || 1;
    const baseNI = Math.abs(baseResult.netIncome) || 1;
    const baseCF = Math.abs(baseResult.cfOps) || 1;

    return {
      parameter: t.parameter,
      lowValue: t.low,
      baseValue: baseParams[t.key] as number,
      highValue: t.high,
      revenueImpact: Number(((highR.revenue - lowR.revenue) / baseRev * 100).toFixed(1)),
      netIncomeImpact: Number(((highR.netIncome - lowR.netIncome) / baseNI * 100).toFixed(1)),
      cashFlowImpact: Number(((highR.cfOps - lowR.cfOps) / baseCF * 100).toFixed(1)),
    };
  });
}

// ─── Health Score ───────────────────────────────────────────────

function computeHealthScore(e: EngineNumbers): { score: number; riskLevel: 'low' | 'medium' | 'high' | 'critical' } {
  let score = 50; // Start neutral

  // Profitability (max ±20 pts)
  if (e.grossMargin >= 45) score += 5;
  else if (e.grossMargin >= 35) score += 2;
  else if (e.grossMargin < 25) score -= 5;

  if (e.operatingMargin >= 15) score += 5;
  else if (e.operatingMargin >= 10) score += 2;
  else if (e.operatingMargin < 5) score -= 5;

  if (e.netMargin >= 10) score += 5;
  else if (e.netMargin >= 5) score += 2;
  else if (e.netMargin < 0) score -= 10;

  if (e.roe >= 14) score += 5;
  else if (e.roe >= 10) score += 2;
  else if (e.roe < 5) score -= 5;

  // Liquidity (max ±10 pts)
  if (e.currentRatio >= 2.0) score += 5;
  else if (e.currentRatio >= 1.5) score += 3;
  else if (e.currentRatio < 1.0) score -= 10;

  // Leverage (max ±10 pts)
  if (e.debtToEquity <= 0.5) score += 5;
  else if (e.debtToEquity <= 1.0) score += 2;
  else if (e.debtToEquity > 2.0) score -= 10;

  if (e.interestCoverage >= 8) score += 5;
  else if (e.interestCoverage >= 3) score += 2;
  else if (e.interestCoverage < 1.5) score -= 10;

  // Growth (revenue vs baseline, max ±10 pts)
  const revenueGrowth = (e.revenue - B.revenue) / B.revenue;
  if (revenueGrowth > 0.05) score += 5;
  else if (revenueGrowth > 0) score += 2;
  else if (revenueGrowth < -0.05) score -= 5;
  else if (revenueGrowth < -0.15) score -= 10;

  // Cash flow (max ±5 pts)
  if (e.cfOps > 0) score += 3;
  else score -= 5;

  // Net income sign (max ±5 pts)
  if (e.netIncome > B.netIncome) score += 3;
  else if (e.netIncome < 0) score -= 8;

  score = Math.max(0, Math.min(100, score));

  let riskLevel: 'low' | 'medium' | 'high' | 'critical';
  if (score >= 72) riskLevel = 'low';
  else if (score >= 52) riskLevel = 'medium';
  else if (score >= 32) riskLevel = 'high';
  else riskLevel = 'critical';

  return { score, riskLevel };
}

// ─── Waterfall Data (Net Income Bridge) ─────────────────────────

function buildWaterfall(e: EngineNumbers): SimulationResult['waterfallData'] {
  const revenueImpact = e.revenue - B.revenue;
  const cogsImpact = -(e.cogs - B.cogs); // negative COGS increase = decrease to NI
  const sgaImpact = -(e.sga - B.sga);
  const rdImpact = -(e.rd - B.rd);
  const daImpact = -(e.da - B.da);
  const interestImpact = -(e.interestExpense - B.interestExpense);
  const taxImpact = -(e.tax - (B.netIncome > 0 ? round(B.ebit - B.interestExpense + B.otherIncome) * B.taxRate : 0));

  return [
    { name: 'Original Net Income', value: B.netIncome, type: 'total' as const },
    { name: 'Revenue Change', value: revenueImpact, type: revenueImpact >= 0 ? 'increase' as const : 'decrease' as const },
    { name: 'COGS Change', value: cogsImpact, type: cogsImpact >= 0 ? 'increase' as const : 'decrease' as const },
    { name: 'SG&A Change', value: sgaImpact, type: sgaImpact >= 0 ? 'increase' as const : 'decrease' as const },
    { name: 'R&D Change', value: rdImpact, type: rdImpact >= 0 ? 'increase' as const : 'decrease' as const },
    { name: 'D&A Change', value: daImpact, type: daImpact >= 0 ? 'increase' as const : 'decrease' as const },
    { name: 'Interest Change', value: interestImpact, type: interestImpact >= 0 ? 'increase' as const : 'decrease' as const },
    { name: 'Tax Change', value: -(e.tax - round(3_180_000 * B.taxRate)), type: (e.tax <= round(3_180_000 * B.taxRate)) ? 'increase' as const : 'decrease' as const },
    { name: 'Simulated Net Income', value: e.netIncome, type: 'total' as const },
  ];
}

// ─── Assemble SimulationResult ──────────────────────────────────

export function buildSimulationResult(
  params: SimulationParameters,
  engine: EngineNumbers,
  sensitivity: SensitivityDataPoint[],
): Omit<SimulationResult, 'simulationAnalysis' | 'suggestions' | 'riskAssessment'> {
  const { score, riskLevel } = computeHealthScore(engine);

  // P&L
  const simulatedProfitAndLoss: FinancialStatementItem[] = [
    { item: 'Revenue', amount: engine.revenue },
    { item: 'Cost of Goods Sold', amount: -engine.cogs },
    { item: 'Gross Profit', amount: engine.grossProfit, isTotal: true },
    { item: 'Selling, General & Admin', amount: -engine.sga },
    { item: 'Research & Development', amount: -engine.rd },
    { item: 'Depreciation & Amortization', amount: -engine.da },
    { item: 'Total Operating Expenses', amount: -engine.totalOpex, isTotal: true },
    { item: 'Operating Income (EBIT)', amount: engine.ebit, isTotal: true },
    { item: 'Interest Expense', amount: -engine.interestExpense },
    { item: 'Other Income / (Expense)', amount: engine.otherIncome },
    { item: 'Earnings Before Tax (EBT)', amount: engine.ebt, isTotal: true },
    { item: 'Income Tax Expense', amount: -engine.tax },
    { item: 'Net Income', amount: engine.netIncome, isTotal: true },
  ];

  // Balance Sheet
  const simulatedBalanceSheet: BalanceSheet = {
    assets: [
      { item: 'Cash and Equivalents', amount: engine.cash },
      { item: 'Accounts Receivable', amount: engine.ar },
      { item: 'Inventory', amount: engine.inventory },
      { item: 'Prepaid Expenses', amount: engine.prepaid },
      { item: 'Current Assets', amount: engine.currentAssets, isTotal: true },
      { item: 'Property, Plant & Equipment', amount: engine.ppe },
      { item: 'Intangible Assets', amount: engine.intangibles },
      { item: 'Goodwill', amount: engine.goodwill },
      { item: 'Non-Current Assets', amount: engine.nonCurrentAssets, isTotal: true },
      { item: 'Total Assets', amount: engine.totalAssets, isTotal: true },
    ],
    liabilities: [
      { item: 'Accounts Payable', amount: engine.ap },
      { item: 'Short-term Debt', amount: engine.shortTermDebt },
      { item: 'Accrued Expenses', amount: engine.accruedExpenses },
      { item: 'Current Liabilities', amount: engine.currentLiabilities, isTotal: true },
      { item: 'Long-term Debt', amount: engine.longTermDebt },
      { item: 'Deferred Tax Liabilities', amount: engine.deferredTax },
      { item: 'Non-Current Liabilities', amount: engine.nonCurrentLiabilities, isTotal: true },
      { item: 'Total Liabilities', amount: engine.totalLiabilities, isTotal: true },
    ],
    equity: [
      { item: 'Common Stock', amount: engine.commonStock },
      { item: 'Retained Earnings', amount: engine.retainedEarnings },
      { item: 'Additional Paid-in Capital', amount: engine.apic },
      { item: 'Total Equity', amount: engine.totalEquity, isTotal: true },
      { item: 'Total Liabilities & Equity', amount: engine.totalAssets, isTotal: true },
    ],
  };

  // Cash Flow
  const simulatedCashFlow: FinancialStatementItem[] = [
    { item: 'Net Income', amount: engine.netIncome },
    { item: 'Depreciation & Amortization', amount: engine.da },
    { item: 'Changes in Working Capital', amount: round(engine.wcChanges) },
    { item: 'Cash from Operations', amount: round(engine.cfOps), isTotal: true },
    { item: 'Capital Expenditures', amount: engine.capex },
    { item: 'Acquisitions', amount: -B.acquisitions },
    { item: 'Cash from Investing', amount: round(engine.cfInvesting), isTotal: true },
    { item: 'Debt Repayment', amount: -B.debtRepayment },
    { item: 'New Borrowings', amount: Math.max(0, round(engine.longTermDebt - B.longTermDebt)) },
    { item: 'Dividends Paid', amount: -B.dividends },
    { item: 'Cash from Financing', amount: round(engine.cfFinancing), isTotal: true },
    { item: 'Net Change in Cash', amount: round(engine.netCashChange), isTotal: true },
  ];

  // Key Metrics
  const keyMetrics = [
    { name: 'Revenue', original: B.revenue, simulated: engine.revenue },
    { name: 'Gross Profit', original: B.grossProfit, simulated: engine.grossProfit },
    { name: 'EBIT', original: B.ebit, simulated: engine.ebit },
    { name: 'Net Income', original: B.netIncome, simulated: engine.netIncome },
    { name: 'Total Assets', original: B.cash + B.ar + B.inventory + B.prepaid + B.ppe + B.intangibles + B.goodwill, simulated: engine.totalAssets },
    { name: 'Operating Cash Flow', original: B.cashFromOps, simulated: round(engine.cfOps) },
    { name: 'Free Cash Flow', original: B.cashFromOps - B.totalCapex, simulated: round(engine.cfOps + engine.capex) },
  ];

  // Economic Trends (pass-through of macro inputs for display)
  const economicTrends = [
    { name: 'GDP Growth', value: params.gdpGrowth },
    { name: 'Inflation Rate', value: params.inflationRate },
    { name: 'Interest Rate', value: params.interestRate },
    { name: 'Unemployment', value: params.unemploymentRate },
    { name: 'Consumer Confidence', value: params.consumerConfidence },
    { name: 'PMI', value: params.pmi },
    { name: 'Forex (USD/INR)', value: params.forexRate },
    { name: 'Commodity Index', value: params.commodityIndex },
  ];

  // Financial Ratios
  const financialRatios = [
    { name: 'Gross Margin', original: 45.3, simulated: engine.grossMargin, unit: '%' },
    { name: 'Operating Margin', original: 15.6, simulated: engine.operatingMargin, unit: '%' },
    { name: 'Net Margin', original: 11.0, simulated: engine.netMargin, unit: '%' },
    { name: 'ROE', original: 14.3, simulated: engine.roe, unit: '%' },
    { name: 'ROA', original: 8.0, simulated: engine.roa, unit: '%' },
    { name: 'Current Ratio', original: 2.25, simulated: engine.currentRatio, unit: 'x' },
    { name: 'Debt/Equity', original: 0.53, simulated: engine.debtToEquity, unit: 'x' },
    { name: 'Interest Coverage', original: 7.95, simulated: engine.interestCoverage, unit: 'x' },
    { name: 'Asset Turnover', original: 0.73, simulated: engine.assetTurnover, unit: 'x' },
    { name: 'Cash Conversion Cycle', original: 34, simulated: engine.cashConversionCycle, unit: 'days' },
  ];

  // Waterfall
  const waterfallData = buildWaterfall(engine);

  // Parameter summary
  const changedParams: string[] = [];
  const entries = Object.entries(params) as [keyof SimulationParameters, number][];
  for (const [k, v] of entries) {
    const def = D[k];
    if (typeof v === 'number' && typeof def === 'number' && Math.abs(v - def) > 0.01) {
      changedParams.push(`${k}: ${def} → ${v}`);
    }
  }
  const simulationParameters = changedParams.length > 0
    ? `Modified parameters: ${changedParams.join('; ')}`
    : 'All parameters at baseline (no changes).';

  return {
    simulationParameters,
    simulatedBalanceSheet,
    simulatedProfitAndLoss,
    simulatedCashFlow,
    keyMetrics,
    economicTrends,
    financialRatios,
    waterfallData,
    sensitivityData: sensitivity,
    overallScore: score,
    riskLevel,
  };
}

// ─── Main Entry Point ───────────────────────────────────────────

export function runFullSimulation(
  params: SimulationParameters,
): Omit<SimulationResult, 'simulationAnalysis' | 'suggestions' | 'riskAssessment'> {
  const engine = computeSimulation(params);
  const sensitivity = computeSensitivity(params, engine);
  return buildSimulationResult(params, engine, sensitivity);
}
