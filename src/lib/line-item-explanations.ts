/**
 * Line-Item Explanation Generator
 *
 * For every line item in the three financial statements, this module
 * provides a natural-language explanation of:
 *   1. What the item represents
 *   2. Which simulation parameters drive it
 *   3. How those parameters affected the simulated value (when a delta exists)
 *
 * The explanations mirror the exact logic in `simulation-engine.ts`.
 */

import type { SimulationParameters } from './types';
import { DEFAULT_PARAMETERS } from './types';
import { formatCurrency } from './utils';

// ─── Types ──────────────────────────────────────────────────────

export interface LineItemExplanation {
  /** Short definition of the item */
  definition: string;
  /** Which slider parameters affect this item */
  drivers: string[];
  /** Dynamic narrative explaining the simulated change (only when delta ≠ 0) */
  narrative: string | null;
}

// ─── Helpers ────────────────────────────────────────────────────

const D = DEFAULT_PARAMETERS;

function changed(params: SimulationParameters, key: keyof SimulationParameters): boolean {
  return Math.abs((params[key] as number) - (D[key] as number)) > 0.01;
}

function dir(params: SimulationParameters, key: keyof SimulationParameters): 'increased' | 'decreased' {
  return (params[key] as number) > (D[key] as number) ? 'increased' : 'decreased';
}

function val(params: SimulationParameters, key: keyof SimulationParameters): string {
  return `${D[key]} → ${params[key]}`;
}

function deltaPct(original: number, simulated: number): string {
  if (original === 0) return 'N/A';
  const pct = ((simulated - original) / Math.abs(original)) * 100;
  return `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`;
}

function deltaStr(original: number, simulated: number): string {
  const diff = simulated - original;
  return `${diff >= 0 ? '+' : ''}${formatCurrency(diff)} (${deltaPct(original, simulated)})`;
}

// ─── Narrative Builders ─────────────────────────────────────────

function revenueNarrative(p: SimulationParameters, orig: number, sim: number): string | null {
  if (Math.abs(sim - orig) < 1) return null;
  const parts: string[] = [];
  if (changed(p, 'marketDemand')) parts.push(`Market Demand ${dir(p, 'marketDemand')} (${val(p, 'marketDemand')}) — the strongest top-line driver`);
  if (changed(p, 'productionCapacity')) parts.push(`Production Capacity ${dir(p, 'productionCapacity')} (${val(p, 'productionCapacity')}%) — constrains max output`);
  if (changed(p, 'salesConversion')) parts.push(`Sales Conversion ${dir(p, 'salesConversion')} (${val(p, 'salesConversion')}%)`);
  if (changed(p, 'customerChurn')) parts.push(`Customer Churn ${dir(p, 'customerChurn')} (${val(p, 'customerChurn')}%) — erodes recurring revenue`);
  if (changed(p, 'discount')) parts.push(`Discount ${dir(p, 'discount')} (${val(p, 'discount')}%) — price concessions reduce net revenue`);
  if (changed(p, 'consumerConfidence')) parts.push(`Consumer Confidence ${dir(p, 'consumerConfidence')} (${val(p, 'consumerConfidence')})`);
  if (changed(p, 'gdpGrowth')) parts.push(`GDP Growth ${dir(p, 'gdpGrowth')} (${val(p, 'gdpGrowth')}%)`);
  if (changed(p, 'competitionIndex')) parts.push(`Competition ${dir(p, 'competitionIndex')} (${val(p, 'competitionIndex')}) — more competition reduces market share`);
  if (changed(p, 'customerSentiment')) parts.push(`Customer Sentiment ${dir(p, 'customerSentiment')} (${val(p, 'customerSentiment')})`);
  if (changed(p, 'pmi')) parts.push(`PMI ${dir(p, 'pmi')} (${val(p, 'pmi')})`);
  if (changed(p, 'unemploymentRate')) parts.push(`Unemployment ${dir(p, 'unemploymentRate')} (${val(p, 'unemploymentRate')}%) — higher unemployment suppresses demand`);
  if (p.cyberAttackDowntime > 0) parts.push(`Cyber-attack downtime of ${p.cyberAttackDowntime} days reduced selling days`);
  if (changed(p, 'revenueShock')) parts.push(`Revenue Shock applied at ${p.revenueShock}%`);
  if (changed(p, 'forexRate')) parts.push(`Forex ${dir(p, 'forexRate')} (${val(p, 'forexRate')}) — impacts export-denominated revenue`);
  if (p.newProductImpact > 0) parts.push(`New Product launch added ${formatCurrency(p.newProductImpact)} in incremental revenue`);
  if (parts.length === 0) parts.push('All revenue drivers are at baseline — rounding may cause minor differences');
  return `Revenue changed by ${deltaStr(orig, sim)}. Key factors:\n• ${parts.join('\n• ')}`;
}

function cogsNarrative(p: SimulationParameters, orig: number, sim: number): string | null {
  if (Math.abs(sim - orig) < 1) return null;
  const parts: string[] = [];
  parts.push('70% of COGS is variable (scales with revenue volume), 30% is semi-fixed');
  if (changed(p, 'commodityIndex')) parts.push(`Commodity Index ${dir(p, 'commodityIndex')} (${val(p, 'commodityIndex')}) — raises material input costs`);
  if (changed(p, 'freightRates')) parts.push(`Freight Rates ${dir(p, 'freightRates')} (${val(p, 'freightRates')}) — affects logistics costs`);
  if (changed(p, 'salaryInflation')) parts.push(`Salary Inflation ${dir(p, 'salaryInflation')} (${val(p, 'salaryInflation')}%) — pushes up labor costs within COGS`);
  if (changed(p, 'headcountChange')) parts.push(`Headcount ${dir(p, 'headcountChange')} (${val(p, 'headcountChange')}%) — directly impacts labor cost`);
  if (changed(p, 'supplyDisruption')) parts.push(`Supply Disruption at ${p.supplyDisruption}% — forces expediting and alt-sourcing premiums`);
  if (changed(p, 'inflationRate')) parts.push(`General Inflation ${dir(p, 'inflationRate')} (${val(p, 'inflationRate')}%) — raises all input costs`);
  if (changed(p, 'supplierLeadTime')) parts.push(`Supplier Lead Time ${dir(p, 'supplierLeadTime')} (${val(p, 'supplierLeadTime')} days)`);
  if (changed(p, 'inventoryTurnover')) parts.push(`Inventory Turnover ${dir(p, 'inventoryTurnover')} (${val(p, 'inventoryTurnover')}) — higher turnover reduces waste`);
  return `COGS changed by ${deltaStr(orig, sim)}.\n• ${parts.join('\n• ')}`;
}

function sgaNarrative(p: SimulationParameters, orig: number, sim: number): string | null {
  if (Math.abs(sim - orig) < 1) return null;
  const parts: string[] = [];
  parts.push('SG&A is ~60% people costs (salary/headcount) and ~40% rent/marketing/admin');
  if (changed(p, 'salaryInflation')) parts.push(`Salary Inflation ${dir(p, 'salaryInflation')} (${val(p, 'salaryInflation')}%) — affects the people-cost portion`);
  if (changed(p, 'headcountChange')) parts.push(`Headcount Change ${dir(p, 'headcountChange')} (${val(p, 'headcountChange')}%) — scales sales & admin staff`);
  if (changed(p, 'inflationRate')) parts.push(`General Inflation ${dir(p, 'inflationRate')} (${val(p, 'inflationRate')}%) — raises non-people costs`);
  if (p.esgPenalty > 0) parts.push(`ESG Penalties of ${formatCurrency(p.esgPenalty)} added directly to SG&A`);
  return `SG&A changed by ${deltaStr(orig, sim)}.\n• ${parts.join('\n• ')}`;
}

function rdNarrative(p: SimulationParameters, orig: number, sim: number): string | null {
  if (Math.abs(sim - orig) < 1) return null;
  return `R&D changed by ${deltaStr(orig, sim)}.\n• R&D Expenditure is directly controlled by the slider (${formatCurrency(D.rdExpenditure)} → ${formatCurrency(p.rdExpenditure)}).`;
}

function daNarrative(p: SimulationParameters, orig: number, sim: number): string | null {
  if (Math.abs(sim - orig) < 1) return null;
  const parts: string[] = [];
  parts.push(`Depreciation parameter set to ${formatCurrency(p.depreciation)} (baseline: ${formatCurrency(D.depreciation)})`);
  const newCapex = p.capexMaintenance + p.capexGrowth;
  const baseCapex = D.capexMaintenance + D.capexGrowth;
  if (newCapex > baseCapex) parts.push(`Additional capex of ${formatCurrency(newCapex - baseCapex)} adds ~10%/yr incremental depreciation (new assets have ~10-yr useful life)`);
  return `D&A changed by ${deltaStr(orig, sim)}.\n• ${parts.join('\n• ')}`;
}

function interestNarrative(p: SimulationParameters, orig: number, sim: number): string | null {
  if (Math.abs(sim - orig) < 1) return null;
  const parts: string[] = [];
  parts.push(`Applied to $9.2M total debt (short-term $1.2M + long-term $8M)`);
  if (changed(p, 'interestRate')) parts.push(`Policy Interest Rate ${dir(p, 'interestRate')} (${val(p, 'interestRate')}%) — shifts the company's effective borrowing rate`);
  if (changed(p, 'creditSpread')) parts.push(`Credit Spread ${dir(p, 'creditSpread')} (${val(p, 'creditSpread')}%) — widens/narrows the risk premium on debt`);
  if (changed(p, 'bondYieldSpread')) {
    const delta = p.bondYieldSpread - D.bondYieldSpread;
    if (delta < 0) parts.push(`Bond Yield Spread inverted (${val(p, 'bondYieldSpread')}%) — signals recession risk, adds incremental cost`);
  }
  return `Interest Expense changed by ${deltaStr(orig, sim)}.\n• ${parts.join('\n• ')}`;
}

function arNarrative(p: SimulationParameters, orig: number, sim: number): string | null {
  if (Math.abs(sim - orig) < 1) return null;
  const parts: string[] = [];
  parts.push(`AR = (Revenue / 365) × AR Days`);
  if (changed(p, 'arDays')) parts.push(`AR Days (DSO) ${dir(p, 'arDays')} (${val(p, 'arDays')}) — longer collection period means more outstanding receivables`);
  parts.push(`Revenue changes also proportionally scale AR`);
  return `Accounts Receivable changed by ${deltaStr(orig, sim)}.\n• ${parts.join('\n• ')}`;
}

function inventoryNarrative(p: SimulationParameters, orig: number, sim: number): string | null {
  if (Math.abs(sim - orig) < 1) return null;
  const parts: string[] = [];
  parts.push(`Inventory = (COGS / 365) × Inventory Days`);
  if (changed(p, 'inventoryDays')) parts.push(`Inventory Days (DIO) ${dir(p, 'inventoryDays')} (${val(p, 'inventoryDays')}) — more days = higher inventory holding`);
  parts.push(`COGS changes also proportionally scale Inventory`);
  return `Inventory changed by ${deltaStr(orig, sim)}.\n• ${parts.join('\n• ')}`;
}

function apNarrative(p: SimulationParameters, orig: number, sim: number): string | null {
  if (Math.abs(sim - orig) < 1) return null;
  const parts: string[] = [];
  parts.push(`AP = (COGS / 365) × AP Days`);
  if (changed(p, 'apDays')) parts.push(`AP Days (DPO) ${dir(p, 'apDays')} (${val(p, 'apDays')}) — longer payment terms mean more outstanding payables`);
  parts.push(`COGS changes also proportionally scale AP`);
  return `Accounts Payable changed by ${deltaStr(orig, sim)}.\n• ${parts.join('\n• ')}`;
}

function ppeNarrative(p: SimulationParameters, orig: number, sim: number): string | null {
  if (Math.abs(sim - orig) < 1) return null;
  const parts: string[] = [];
  const newCapex = p.capexMaintenance + p.capexGrowth;
  const baseCapex = D.capexMaintenance + D.capexGrowth;
  parts.push(`PP&E = Opening PP&E + Capex − D&A`);
  if (newCapex !== baseCapex) parts.push(`Total Capex ${newCapex > baseCapex ? 'increased' : 'decreased'} (${formatCurrency(baseCapex)} → ${formatCurrency(newCapex)})`);
  if (changed(p, 'depreciation')) parts.push(`Depreciation schedule changed (${formatCurrency(D.depreciation)} → ${formatCurrency(p.depreciation)})`);
  return `PP&E changed by ${deltaStr(orig, sim)}.\n• ${parts.join('\n• ')}`;
}

function longTermDebtNarrative(p: SimulationParameters, orig: number, sim: number): string | null {
  if (Math.abs(sim - orig) < 1) return null;
  const growthDelta = Math.max(0, p.capexGrowth - D.capexGrowth);
  return `Long-term Debt changed by ${deltaStr(orig, sim)}.\n• Growth Capex increase of ${formatCurrency(growthDelta)} is assumed to be 50% debt-financed, adding ${formatCurrency(growthDelta * 0.5)} in new borrowings.`;
}

function retainedEarningsNarrative(_p: SimulationParameters, orig: number, sim: number): string | null {
  if (Math.abs(sim - orig) < 1) return null;
  return `Retained Earnings changed by ${deltaStr(orig, sim)}.\n• RE = Base RE + (Simulated Net Income − Baseline Net Income). Changes in profitability flow directly through to equity.`;
}

function cashNarrative(_p: SimulationParameters, orig: number, sim: number): string | null {
  if (Math.abs(sim - orig) < 1) return null;
  return `Cash changed by ${deltaStr(orig, sim)}.\n• Cash is the balance-sheet plug — it absorbs the net effect of all other balance-sheet changes to ensure Total Assets = Total Liabilities + Equity.`;
}

function cfOpsNarrative(_p: SimulationParameters, orig: number, sim: number): string | null {
  if (Math.abs(sim - orig) < 1) return null;
  return `Cash from Operations changed by ${deltaStr(orig, sim)}.\n• CFO = Net Income + D&A + Working Capital Changes. All P&L and balance-sheet changes propagate here.`;
}

function cfInvestingNarrative(p: SimulationParameters, orig: number, sim: number): string | null {
  if (Math.abs(sim - orig) < 1) return null;
  return `Cash from Investing changed by ${deltaStr(orig, sim)}.\n• Driven by Maintenance Capex (${formatCurrency(p.capexMaintenance)}) + Growth Capex (${formatCurrency(p.capexGrowth)}) + fixed Acquisitions.`;
}

function capexNarrative(p: SimulationParameters, orig: number, sim: number): string | null {
  if (Math.abs(sim - orig) < 1) return null;
  return `Capital Expenditures changed by ${deltaStr(orig, sim)}.\n• Maintenance Capex: ${formatCurrency(D.capexMaintenance)} → ${formatCurrency(p.capexMaintenance)}\n• Growth Capex: ${formatCurrency(D.capexGrowth)} → ${formatCurrency(p.capexGrowth)}`;
}

function taxNarrative(_p: SimulationParameters, orig: number, sim: number): string | null {
  if (Math.abs(sim - orig) < 1) return null;
  return `Tax changed by ${deltaStr(orig, sim)}.\n• Effective tax rate is 22% applied to EBT (Earnings Before Tax). Tax tracks changes in pre-tax profitability. If EBT is negative, tax is zero (loss carry-forward).`;
}

function wcNarrative(_p: SimulationParameters, orig: number, sim: number): string | null {
  if (Math.abs(sim - orig) < 1) return null;
  return `Working Capital Changes shifted by ${deltaStr(orig, sim)}.\n• Reflects movements in AR, Inventory, AP, and Prepaid balances between baseline and simulated balance sheets. Absorbs rounding to keep CFO consistent with BS and P&L.`;
}

function cfFinancingNarrative(p: SimulationParameters, orig: number, sim: number): string | null {
  if (Math.abs(sim - orig) < 1) return null;
  const parts: string[] = [];
  parts.push(`CFF = New Borrowings − Debt Repayment − Dividends`);
  const growthDelta = Math.max(0, p.capexGrowth - D.capexGrowth);
  if (growthDelta > 0) parts.push(`New debt of ${formatCurrency(growthDelta * 0.5)} raised to finance growth capex`);
  return `Cash from Financing changed by ${deltaStr(orig, sim)}.\n• ${parts.join('\n• ')}`;
}

// ─── Static Definitions ─────────────────────────────────────────

const DEFINITIONS: Record<string, { definition: string; drivers: string[] }> = {
  // P&L
  'Revenue': {
    definition: 'Total sales generated from goods and services in the period.',
    drivers: ['Market Demand', 'Production Capacity', 'Sales Conversion', 'Customer Churn', 'Discount', 'Consumer Confidence', 'GDP Growth', 'Competition Index', 'Customer Sentiment', 'PMI', 'Unemployment Rate', 'Cyber-Attack Downtime', 'Revenue Shock', 'Forex Rate', 'New Product Impact'],
  },
  'Cost of Goods Sold': {
    definition: 'Direct costs attributable to producing goods sold (materials, labor, overhead). 70% is variable (scales with volume), 30% is semi-fixed.',
    drivers: ['Revenue Volume', 'Commodity Index', 'Freight Rates', 'Salary Inflation', 'Headcount Change', 'Supply Disruption', 'Inflation Rate', 'Supplier Lead Time', 'Inventory Turnover', 'COGS Mix (Materials/Labor/Overhead)'],
  },
  'Gross Profit': {
    definition: 'Revenue minus Cost of Goods Sold — measures core production profitability.',
    drivers: ['All Revenue drivers', 'All COGS drivers'],
  },
  'Selling, General & Admin': {
    definition: 'Operating expenses for selling, marketing, rent, and G&A. ~60% people costs, ~40% non-people.',
    drivers: ['Salary Inflation', 'Headcount Change', 'Inflation Rate', 'ESG Penalties'],
  },
  'Research & Development': {
    definition: 'Investment in new products, technology, and innovation.',
    drivers: ['R&D Expenditure (direct slider)'],
  },
  'Depreciation & Amortization': {
    definition: 'Non-cash charge allocating the cost of fixed and intangible assets over their useful lives.',
    drivers: ['Depreciation Schedule', 'Maintenance Capex', 'Growth Capex'],
  },
  'Total Operating Expenses': {
    definition: 'Sum of SG&A + R&D + D&A.',
    drivers: ['All SG&A drivers', 'R&D Expenditure', 'Depreciation & Capex parameters'],
  },
  'Operating Income (EBIT)': {
    definition: 'Earnings Before Interest & Tax — core operating profitability.',
    drivers: ['All Revenue and Cost drivers'],
  },
  'Interest Expense': {
    definition: 'Cost of servicing $9.2M total debt at the effective borrowing rate.',
    drivers: ['Interest Rate', 'Credit Spread', 'Bond Yield Spread'],
  },
  'Other Income / (Expense)': {
    definition: 'Non-operating income from investments, foreign exchange, etc.',
    drivers: ['Fixed at baseline ($120K) — not affected by simulation parameters'],
  },
  'Earnings Before Tax (EBT)': {
    definition: 'EBIT minus Interest plus Other Income.',
    drivers: ['All operating and financing parameters'],
  },
  'Income Tax Expense': {
    definition: 'Corporate income tax at an effective rate of 22% on positive EBT.',
    drivers: ['All parameters that affect EBT (tax scales proportionally)'],
  },
  'Net Income': {
    definition: 'Bottom-line profit after all expenses and taxes.',
    drivers: ['All simulation parameters flow through here'],
  },

  // Balance Sheet — Assets
  'Cash and Equivalents': {
    definition: 'Liquid cash and short-term investments. Acts as the balance-sheet "plug" to ensure Assets = Liabilities + Equity.',
    drivers: ['All parameters (cash absorbs net effect of all BS changes)'],
  },
  'Accounts Receivable': {
    definition: 'Amounts owed by customers for goods/services already delivered.',
    drivers: ['AR Days (DSO)', 'Revenue (higher sales → more outstanding receivables)'],
  },
  'Inventory': {
    definition: 'Goods held for sale or in production, valued at cost.',
    drivers: ['Inventory Days (DIO)', 'COGS (higher production cost → higher inventory value)'],
  },
  'Prepaid Expenses': {
    definition: 'Payments made in advance for services (insurance, rent, etc.).',
    drivers: ['Fixed at baseline — not affected by simulation parameters'],
  },
  'Current Assets': {
    definition: 'Sum of Cash + AR + Inventory + Prepaid Expenses.',
    drivers: ['All working capital parameters'],
  },
  'Property, Plant & Equipment': {
    definition: 'Tangible long-term assets (factories, machinery, buildings). PP&E = Opening + Capex − D&A.',
    drivers: ['Maintenance Capex', 'Growth Capex', 'Depreciation Schedule'],
  },
  'Intangible Assets': {
    definition: 'Non-physical assets like patents, trademarks, and software.',
    drivers: ['Fixed at baseline — not affected by simulation parameters'],
  },
  'Goodwill': {
    definition: 'Premium paid over fair value in past acquisitions.',
    drivers: ['Fixed at baseline — not affected by simulation parameters'],
  },
  'Non-Current Assets': {
    definition: 'Sum of PP&E + Intangibles + Goodwill.',
    drivers: ['Capex and Depreciation parameters'],
  },
  'Total Assets': {
    definition: 'Sum of Current + Non-Current Assets. Must equal Total Liabilities + Equity.',
    drivers: ['All parameters affect Total Assets through various channels'],
  },

  // Balance Sheet — Liabilities
  'Accounts Payable': {
    definition: 'Amounts owed to suppliers for goods and services received but not yet paid.',
    drivers: ['AP Days (DPO)', 'COGS (higher purchases → more outstanding payables)'],
  },
  'Short-term Debt': {
    definition: 'Debt obligations due within one year.',
    drivers: ['Fixed at baseline ($1.2M) — not affected by simulation parameters'],
  },
  'Accrued Expenses': {
    definition: 'Expenses incurred but not yet paid (wages, utilities, taxes).',
    drivers: ['Fixed at baseline ($950K) — not affected by simulation parameters'],
  },
  'Current Liabilities': {
    definition: 'Sum of AP + Short-term Debt + Accrued Expenses.',
    drivers: ['AP Days', 'COGS volume'],
  },
  'Long-term Debt': {
    definition: 'Debt obligations due beyond one year.',
    drivers: ['Growth Capex (increases above baseline are 50% debt-financed)'],
  },
  'Deferred Tax Liabilities': {
    definition: 'Tax obligations deferred to future periods due to timing differences.',
    drivers: ['Fixed at baseline ($650K) — not affected by simulation parameters'],
  },
  'Non-Current Liabilities': {
    definition: 'Sum of Long-term Debt + Deferred Tax.',
    drivers: ['Growth Capex (via Long-term Debt)'],
  },
  'Total Liabilities': {
    definition: 'Sum of Current + Non-Current Liabilities.',
    drivers: ['AP Days, COGS volume, Growth Capex'],
  },

  // Balance Sheet — Equity
  'Common Stock': {
    definition: 'Par value of shares issued to investors.',
    drivers: ['Fixed at baseline ($5M) — not affected by simulation parameters'],
  },
  'Retained Earnings': {
    definition: 'Cumulative profits retained in the business. RE = Base RE + (Simulated NI − Baseline NI).',
    drivers: ['All parameters that affect Net Income'],
  },
  'Additional Paid-in Capital': {
    definition: 'Capital received from investors above par value of stock.',
    drivers: ['Fixed at baseline ($2M) — not affected by simulation parameters'],
  },
  'Total Equity': {
    definition: 'Common Stock + Retained Earnings + APIC — represents shareholder value.',
    drivers: ['Net Income (via Retained Earnings)'],
  },
  'Total Liabilities & Equity': {
    definition: 'Must equal Total Assets (accounting identity). Validates the balance sheet balances.',
    drivers: ['All parameters — this is a check figure'],
  },

  // Cash Flow
  'Net Change in Cash': {
    definition: 'Total change in cash position = Operating + Investing + Financing cash flows.',
    drivers: ['All parameters'],
  },
  'Cash from Operations': {
    definition: 'Cash generated from core business operations (= NI + D&A + WC Changes).',
    drivers: ['All P&L parameters + Working Capital Days (AR, Inventory, AP)'],
  },
  'Capital Expenditures': {
    definition: 'Cash spent on acquiring or maintaining physical assets.',
    drivers: ['Maintenance Capex', 'Growth Capex'],
  },
  'Acquisitions': {
    definition: 'Cash spent on acquiring other businesses.',
    drivers: ['Fixed at baseline ($1M) — not affected by simulation parameters'],
  },
  'Cash from Investing': {
    definition: 'Cash used for Capex + Acquisitions. Typically negative (cash outflow).',
    drivers: ['Maintenance Capex', 'Growth Capex'],
  },
  'Debt Repayment': {
    definition: 'Scheduled repayment of existing debt obligations.',
    drivers: ['Fixed at baseline ($800K/yr) — not affected by simulation parameters'],
  },
  'New Borrowings': {
    definition: 'New debt raised to finance growth investments.',
    drivers: ['Growth Capex (50% of growth capex increase is debt-financed)'],
  },
  'Equity Issuance': {
    definition: 'Cash received from issuing new shares.',
    drivers: ['Fixed at zero — not affected by simulation parameters'],
  },
  'Dividends Paid': {
    definition: 'Cash distributed to shareholders as dividends.',
    drivers: ['Fixed at baseline ($600K) — not affected by simulation parameters'],
  },
  'Cash from Financing': {
    definition: 'Net cash from debt and equity activities (= New Borrowings − Repayments − Dividends).',
    drivers: ['Growth Capex (via new borrowings)'],
  },
  'Changes in Working Capital': {
    definition: 'Cash impact of changes in AR, Inventory, AP, and Prepaid balances between periods.',
    drivers: ['AR Days', 'Inventory Days', 'AP Days', 'Revenue', 'COGS'],
  },
};

// ─── Narrative dispatch ─────────────────────────────────────────

type NarrativeFn = (p: SimulationParameters, orig: number, sim: number) => string | null;

const NARRATIVE_MAP: Record<string, NarrativeFn> = {
  'Revenue': revenueNarrative,
  'Cost of Goods Sold': cogsNarrative,
  'Selling, General & Admin': sgaNarrative,
  'Research & Development': rdNarrative,
  'Depreciation & Amortization': daNarrative,
  'Interest Expense': interestNarrative,
  'Income Tax Expense': taxNarrative,
  'Accounts Receivable': arNarrative,
  'Inventory': inventoryNarrative,
  'Accounts Payable': apNarrative,
  'Property, Plant & Equipment': ppeNarrative,
  'Long-term Debt': longTermDebtNarrative,
  'Retained Earnings': retainedEarningsNarrative,
  'Cash and Equivalents': cashNarrative,
  'Cash from Operations': cfOpsNarrative,
  'Cash from Investing': cfInvestingNarrative,
  'Cash from Financing': cfFinancingNarrative,
  'Capital Expenditures': capexNarrative,
  'Changes in Working Capital': wcNarrative,
  'Net Change in Cash': (_p, orig, sim) => {
    if (Math.abs(sim - orig) < 1) return null;
    return `Net Cash Change shifted by ${deltaStr(orig, sim)}.\n• This is the sum of Operating (${formatCurrency(0)}) + Investing + Financing cash flows. All parameter changes flow through here.`;
  },
};

// For subtotal/total rows, build a generic narrative
function genericTotalNarrative(name: string, orig: number, sim: number): string | null {
  if (Math.abs(sim - orig) < 1) return null;
  return `${name} changed by ${deltaStr(orig, sim)}.\n• This is a subtotal — the change reflects the net impact of its component line items above.`;
}

// ─── Public API ─────────────────────────────────────────────────

/**
 * Generate a natural-language explanation for a financial statement line item.
 *
 * @param itemName  The line item name (must match the `item` field in FinancialStatementItem)
 * @param originalAmount  The baseline amount
 * @param simulatedAmount  The simulated amount (null if no simulation has been run)
 * @param params  The simulation parameters used (null if no simulation has been run)
 */
export function getLineItemExplanation(
  itemName: string,
  originalAmount: number,
  simulatedAmount: number | null,
  params: SimulationParameters | null,
): LineItemExplanation {
  const def = DEFINITIONS[itemName];

  const definition = def?.definition ?? 'Financial statement line item.';
  const drivers = def?.drivers ?? ['See simulation engine documentation'];

  let narrative: string | null = null;

  if (simulatedAmount !== null && params !== null) {
    const narrativeFn = NARRATIVE_MAP[itemName];
    if (narrativeFn) {
      narrative = narrativeFn(params, originalAmount, simulatedAmount);
    } else if (Math.abs(simulatedAmount - originalAmount) > 1) {
      // Fallback for totals and items without a specific narrative
      narrative = genericTotalNarrative(itemName, originalAmount, simulatedAmount);
    }
  }

  return { definition, drivers, narrative };
}
