// src/ai/flows/impact-simulation.ts
'use server';
/**
 * @fileOverview Simulates the impact of changes in parameters on a company's finances.
 *
 * - simulateImpact - Simulates the impact of changes in parameters on a company's finances.
 * - ImpactSimulationInput - The input type for the simulateImpact function.
 * - ImpactSimulationOutput - The return type for the simulateImpact function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImpactSimulationInputSchema = z.object({
  scenario: z
    .string()
    .describe(
      'A natural language description of the economic scenario to simulate. For example: What is the impact on our company if GDP growth increases by only 3%?'
    ),
  currentBalanceSheet: z.string().describe('The current balance sheet of the company.'),
  currentProfitAndLossStatement: z
    .string()
    .describe('The current profit and loss statement of the company.'),
  currentCashFlowStatement: z.string().describe('The current cash flow statement of the company.'),
});
export type ImpactSimulationInput = z.infer<typeof ImpactSimulationInputSchema>;

const ImpactSimulationOutputSchema = z.object({
  impactAnalysis: z
    .string()
    .describe(
      'A detailed analysis of the impact of the scenario on the company’s finances, including key metrics and potential outcomes.'
    ),
  suggestedActions: z
    .string()
    .describe(
      'Suggestions on how to optimize business strategies based on the simulation results.'
    ),
});
export type ImpactSimulationOutput = z.infer<typeof ImpactSimulationOutputSchema>;

export async function simulateImpact(input: ImpactSimulationInput): Promise<ImpactSimulationOutput> {
  return impactSimulationFlow(input);
}

const impactSimulationPrompt = ai.definePrompt({
  name: 'impactSimulationPrompt',
  input: {schema: ImpactSimulationInputSchema},
  output: {schema: ImpactSimulationOutputSchema},
  prompt: `You are a financial expert tasked with analyzing the impact of economic scenarios on a company's finances.

  Analyze the provided financial statements and the described economic scenario to determine the potential impact on the company's business and finances. Provide a detailed analysis, including key metrics and potential outcomes.

Current Balance Sheet: {{{currentBalanceSheet}}}
Current Profit and Loss Statement: {{{currentProfitAndLossStatement}}}
Current Cash Flow Statement: {{{currentCashFlowStatement}}}

Scenario: {{{scenario}}}

Based on your analysis, suggest actions the company can take to optimize its business strategies.

Impact Analysis:
Suggested Actions: `,
});

const impactSimulationFlow = ai.defineFlow(
  {
    name: 'impactSimulationFlow',
    inputSchema: ImpactSimulationInputSchema,
    outputSchema: ImpactSimulationOutputSchema,
  },
  async input => {
    const {output} = await impactSimulationPrompt(input);
    return output!;
  }
);
