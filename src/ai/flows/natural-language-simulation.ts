'use server';

/**
 * @fileOverview Implements a Genkit flow for translating natural language simulation requests into simulation configurations and running the simulation.
 *
 * - naturalLanguageSimulation - A function that handles the natural language simulation process.
 * - NaturalLanguageSimulationInput - The input type for the naturalLanguageSimulation function.
 * - NaturalLanguageSimulationOutput - The return type for the naturalLanguageSimulation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FinancialStatementItemSchema = z.object({
  item: z.string(),
  amount: z.number().describe('The value as a number, without currency symbols or formatting.'),
  isTotal: z.boolean().optional(),
});

const BalanceSheetSchema = z.object({
  assets: z.array(FinancialStatementItemSchema),
  liabilities: z.array(FinancialStatementItemSchema),
  equity: z.array(FinancialStatementItemSchema),
});

const NaturalLanguageSimulationInputSchema = z.object({
  naturalLanguageQuery: z
    .string()
    .optional()
    .describe("A natural language query describing any additional changes for the simulation, e.g., '...and we acquire a competitor for $5M'"),
  productionCapacity: z.number().describe('Production Capacity (%)'),
  inventoryTurnover: z.number().describe('Inventory Turnover'),
  supplierLeadTime: z.number().describe('Supplier Lead Times (days)'),
  cogsMaterials: z.number().describe('Cost of Goods Sold - Materials (%)'),
  cogsLabor: z.number().describe('Cost of Goods Sold - Labor (%)'),
  cogsOverhead: z.number().describe('Cost of Goods Sold - Overhead (%)'),
  salaryInflation: z.number().describe('Salary Inflation (%)'),
  headcountChange: z.number().describe('Headcount Change (%)'),
  capexMaintenance: z.number().describe('Maintenance Capex'),
  capexGrowth: z.number().describe('Growth Capex'),
  depreciation: z.number().describe('Depreciation Schedule'),
  rdExpenditure: z.number().describe('R&D Expenditure'),
  salesConversion: z.number().describe('Sales Pipeline Conversion (%)'),
  customerChurn: z.number().describe('Customer Churn Probability (%)'),
  arDays: z.number().describe('Accounts Receivable Days (DSO)'),
  apDays: z.number().describe('Accounts Payable Days (DPO)'),
  inventoryDays: z.number().describe('Inventory Days (DIO)'),
  discount: z.number().describe('Discount Strategy Change (%)'),
  newProductImpact: z.number().describe('New Product Launch Impact'),
  marketDemand: z.number().describe('Market Demand Index'),
  competitionIndex: z.number().describe('Competition Index'),
  commodityIndex: z.number().describe('Commodity Index'),
  supplyDisruption: z.number().describe('Supply Chain Disruption Probability (%)'),
  freightRates: z.number().describe('Freight Rate Changes (Index)'),
  customerSentiment: z.number().describe('Customer Sentiment Index'),
  inflationRate: z.number().describe('Inflation Rate (%)'),
  interestRate: z.number().describe('Policy Interest Rate (%)'),
  unemploymentRate: z.number().describe('Unemployment Rate (%)'),
  gdpGrowth: z.number().describe('GDP Growth (%)'),
  consumerConfidence: z.number().describe('Consumer Confidence Index'),
  pmi: z.number().describe('PMI (Purchasing Managers Index)'),
  bondYieldSpread: z.number().describe('Bond Yield Curve Spread (2Y/10Y %)'),
  creditSpread: z.number().describe('Credit Spreads (%)'),
  revenueShock: z.number().describe('Revenue Shock (%)'),
  cyberAttackDowntime: z.number().describe('Cyber-Attack Downtime (days)'),
  esgPenalty: z.number().describe('ESG Penalties / Carbon Cost'),
});
export type NaturalLanguageSimulationInput = z.infer<typeof NaturalLanguageSimulationInputSchema>;

const NaturalLanguageSimulationOutputSchema = z.object({
  simulationParameters: z.string().describe('The simulation parameters extracted and used, combining both slider values and the natural language query.'),
  simulationAnalysis: z.string().describe('A summary analysis of the simulation results.'),
  suggestions: z.string().describe('Suggestions on how to optimize business strategies based on the simulation results.'),
  simulatedBalanceSheet: BalanceSheetSchema,
  simulatedProfitAndLoss: z.array(FinancialStatementItemSchema),
  simulatedCashFlow: z.array(FinancialStatementItemSchema),
  keyMetrics: z.array(z.object({
    name: z.string().describe("The name of the key metric (e.g., 'Revenue', 'Net Income')."),
    original: z.number().describe('The original value of the metric.'),
    simulated: z.number().describe('The simulated value of the metric.'),
  })).describe('An array of key financial metrics comparing original vs. simulated values.'),
  economicTrends: z.array(z.object({
    name: z.string().describe("The name of the economic indicator (e.g., 'GDP Growth', 'Inflation Rate')."),
    value: z.number().describe('The value of the indicator used in the simulation.'),
  })).describe('An array of key economic indicators and their values used in the simulation.'),
});
export type NaturalLanguageSimulationOutput = z.infer<typeof NaturalLanguageSimulationOutputSchema>;

export async function naturalLanguageSimulation(input: NaturalLanguageSimulationInput): Promise<NaturalLanguageSimulationOutput> {
  return naturalLanguageSimulationFlow(input);
}

const naturalLanguageSimulationPrompt = ai.definePrompt({
  name: 'naturalLanguageSimulationPrompt',
  input: {schema: NaturalLanguageSimulationInputSchema},
  output: {schema: NaturalLanguageSimulationOutputSchema},
  prompt: `You are a financial simulation expert. Your task is to take a set of simulation parameters (from sliders) and a natural language query from the user, combine them, run a simulation, and provide the results along with strategic suggestions.

The user's current financials are (all values are in numbers, not strings):
Balance Sheet:
- Assets: Cash and Equivalents: 5200000, Accounts Receivable: 3400000, Inventory: 2100000, Property, Plant, and Equipment: 15800000. Total: 26500000
- Liabilities: Accounts Payable: 2800000, Long-term Debt: 8000000. Total: 10800000
- Equity: Shareholder Equity: 15700000. Total Liabilities & Equity: 26500000

Profit & Loss:
- Revenue: 22500000
- Cost of Goods Sold: -12300000
- Gross Profit: 10200000
- Operating Expenses: -6700000
- Operating Income (EBIT): 3500000
- Taxes: -700000
- Net Income: 2800000

Cash Flow:
- Cash from Operations: 4100000
- Cash from Investing: -2500000
- Cash from Financing: 500000
- Net Change in Cash: 2100000

The user has provided the following parameters from the sliders:
- Production Capacity: {{{productionCapacity}}}%
- Inventory Turnover: {{{inventoryTurnover}}}
- Supplier Lead Time: {{{supplierLeadTime}}} days
- COGS Breakdown: {{{cogsMaterials}}}% Materials, {{{cogsLabor}}}% Labor, {{{cogsOverhead}}}% Overhead
- Salary Inflation: {{{salaryInflation}}}%
- Headcount Change: {{{headcountChange}}}%
- Maintenance Capex: {{{capexMaintenance}}}
- Growth Capex: {{{capexGrowth}}}
- Depreciation: {{{depreciation}}}
- R&D Expenditure: {{{rdExpenditure}}}
- Sales Conversion: {{{salesConversion}}}%
- Customer Churn: {{{customerChurn}}}%
- AR/AP/Inventory Days: {{{arDays}}} (DSO), {{{apDays}}} (DPO), {{{inventoryDays}}} (DIO)
- Discount Strategy: {{{discount}}}%
- New Product Impact: {{{newProductImpact}}}
- Market Demand Index: {{{marketDemand}}}
- Competition Index: {{{competitionIndex}}}
- Commodity Index: {{{commodityIndex}}}
- Supply Disruption Probability: {{{supplyDisruption}}}%
- Freight Rates Index: {{{freightRates}}}
- Customer Sentiment Index: {{{customerSentiment}}}
- Inflation Rate: {{{inflationRate}}}%
- Interest Rate: {{{interestRate}}}%
- Unemployment Rate: {{{unemploymentRate}}}%
- GDP Growth: {{{gdpGrowth}}}%
- Consumer Confidence Index: {{{consumerConfidence}}}
- PMI: {{{pmi}}}
- Bond Yield Spread: {{{bondYieldSpread}}}%
- Credit Spread: {{{creditSpread}}}%
- Revenue Shock: {{{revenueShock}}}%
- Cyber-Attack Downtime: {{{cyberAttackDowntime}}} days
- ESG Penalty: {{{esgPenalty}}}

Natural Language Query: {{{naturalLanguageQuery}}}

1.  **Synthesize Inputs**: Combine the parameters from the sliders with any additional instructions or overrides from the natural language query. The natural language query might contain scenarios that are not covered by the sliders (e.g., M&A activity) or might ask to modify a slider value further. Use all available information.
2.  **Simulate Impact**: Based on the combined parameters, simulate the impact on the company's business and finances.
3.  **Generate Financials**: Generate the *complete* new Balance Sheet, Profit & Loss statement, and Cash Flow statement based on the simulation. The structure must match the original statements exactly, including all line items and totals. **All 'amount' fields must be numbers, not strings.**
4.  **Analyze and Summarize**: Provide a concise analysis of the simulation's impact.
5.  **Provide Suggestions**: Offer actionable strategic suggestions based on the results.
6.  **Summarize Parameters**: List the key parameters that were ultimately used for the simulation in a single string, especially noting how the natural language query influenced the final parameters.
7.  **Extract Key Metrics**: Create a 'keyMetrics' array comparing original and simulated values for at least 'Revenue', 'Net Income', and 'Total Assets'.
8.  **Extract Economic Trends**: Create an 'economicTrends' array with the values used for 'GDP Growth', 'Inflation Rate', and 'Interest Rate'.
`,
});

const naturalLanguageSimulationFlow = ai.defineFlow(
  {
    name: 'naturalLanguageSimulationFlow',
    inputSchema: NaturalLanguageSimulationInputSchema,
    outputSchema: NaturalLanguageSimulationOutputSchema,
  },
  async input => {
    const {output} = await naturalLanguageSimulationPrompt(input);
    return output!;
  }
);
