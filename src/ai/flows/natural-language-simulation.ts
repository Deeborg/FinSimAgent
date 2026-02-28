'use server';

/**
 * @fileOverview Lightweight Genkit flow for QUALITATIVE financial analysis only.
 *
 * All numbers (P&L, BS, CFS, ratios, sensitivity) are computed by the
 * deterministic simulation engine in `lib/simulation-engine.ts`.
 * This flow receives the pre-computed numerical summary and generates:
 *   - A narrative analysis
 *   - Strategic suggestions
 *   - Risk assessment
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// ─── Input: a compact numerical summary of the simulation ──────

const QualitativeInputSchema = z.object({
  naturalLanguageQuery: z
    .string()
    .optional()
    .describe('Optional free-text scenario description from the user.'),
  parameterSummary: z.string().describe('A text summary of which parameters changed from baseline.'),
  revenueChange: z.number().describe('Revenue % change from baseline.'),
  netIncomeChange: z.number().describe('Net income % change from baseline.'),
  grossMargin: z.number().describe('Simulated gross margin %.'),
  operatingMargin: z.number().describe('Simulated operating margin %.'),
  netMargin: z.number().describe('Simulated net margin %.'),
  currentRatio: z.number().describe('Simulated current ratio (x).'),
  debtToEquity: z.number().describe('Simulated debt-to-equity ratio (x).'),
  interestCoverage: z.number().describe('Simulated interest coverage ratio (x).'),
  healthScore: z.number().describe('Overall financial health score 0-100.'),
  riskLevel: z.enum(['low', 'medium', 'high', 'critical']).describe('Risk level.'),
});
export type QualitativeInput = z.infer<typeof QualitativeInputSchema>;

// ─── Output: three text blocks ─────────────────────────────────

const QualitativeOutputSchema = z.object({
  simulationAnalysis: z
    .string()
    .describe(
      'A 3-5 sentence executive summary covering revenue impact, cost structure, margin trends, cash-flow implications, and balance-sheet health.',
    ),
  suggestions: z
    .string()
    .describe(
      '3-5 actionable, numbered strategic recommendations to optimise the financials. Each recommendation should be specific and tied to a parameter the user can adjust.',
    ),
  riskAssessment: z
    .string()
    .describe(
      'A concise risk assessment covering key financial risks (liquidity, leverage, profitability, market), their likelihood, and one mitigation idea per risk.',
    ),
});
export type QualitativeOutput = z.infer<typeof QualitativeOutputSchema>;

// ─── Prompt ────────────────────────────────────────────────────

const qualitativePrompt = ai.definePrompt({
  name: 'qualitativeFinancialAnalysisPrompt',
  input: { schema: QualitativeInputSchema },
  output: { schema: QualitativeOutputSchema },
  prompt: `You are a senior financial analyst providing a concise qualitative assessment of a simulation run.

## Pre-computed Results (use these numbers — do NOT recalculate)
- Parameter changes: {{{parameterSummary}}}
- Revenue change: {{revenueChange}}%
- Net income change: {{netIncomeChange}}%
- Gross margin: {{grossMargin}}% | Operating margin: {{operatingMargin}}% | Net margin: {{netMargin}}%
- Current ratio: {{currentRatio}}x | Debt/equity: {{debtToEquity}}x | Interest coverage: {{interestCoverage}}x
- Health score: {{healthScore}}/100 | Risk level: {{riskLevel}}

{{#if naturalLanguageQuery}}
## User's Scenario Note
"{{naturalLanguageQuery}}"
Factor this context into your analysis.
{{/if}}

## Your Task

1. **simulationAnalysis** — Write a 3-5 sentence executive summary. Cover:
   - What drove the revenue / income change
   - How margins and cost structure shifted
   - Cash-flow and balance-sheet implications
   - Overall outlook (positive / cautious / negative)

2. **suggestions** — Provide 3-5 numbered, actionable recommendations the user can implement via the simulation sliders (e.g., "Reduce discount to 3% to recover margin", "Increase production capacity to capture demand upside").

3. **riskAssessment** — Identify 2-4 key risks with likelihood (low/medium/high) and one mitigation action each. Consider: liquidity squeeze, over-leverage, margin compression, demand contraction, input-cost inflation.

Keep the tone professional and data-driven. Reference the numbers provided.`,
});

// ─── Flow ──────────────────────────────────────────────────────

const qualitativeFlow = ai.defineFlow(
  {
    name: 'qualitativeFinancialAnalysisFlow',
    inputSchema: QualitativeInputSchema,
    outputSchema: QualitativeOutputSchema,
  },
  async (input) => {
    const { output } = await qualitativePrompt(input);
    return output!;
  },
);

export async function generateQualitativeAnalysis(
  input: QualitativeInput,
): Promise<QualitativeOutput> {
  return qualitativeFlow(input);
}
