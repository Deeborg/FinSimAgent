'use server';

/**
 * @fileOverview A business strategy suggestion AI agent.
 *
 * - getBusinessStrategySuggestions - A function that provides business strategy suggestions based on simulation results.
 * - BusinessStrategySuggestionsInput - The input type for the getBusinessStrategySuggestions function.
 * - BusinessStrategySuggestionsOutput - The return type for the getBusinessStrategySuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BusinessStrategySuggestionsInputSchema = z.object({
  simulationResults: z.string().describe('The results from the financial simulation, including impacts on price, interest rates, and forex rates.'),
});

export type BusinessStrategySuggestionsInput = z.infer<typeof BusinessStrategySuggestionsInputSchema>;

const BusinessStrategySuggestionsOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('A list of actionable suggestions to optimize business strategies based on the simulation results.'),
});

export type BusinessStrategySuggestionsOutput = z.infer<typeof BusinessStrategySuggestionsOutputSchema>;

export async function getBusinessStrategySuggestions(
  input: BusinessStrategySuggestionsInput
): Promise<BusinessStrategySuggestionsOutput> {
  return businessStrategySuggestionsFlow(input);
}

const businessStrategySuggestionsPrompt = ai.definePrompt({
  name: 'businessStrategySuggestionsPrompt',
  input: {schema: BusinessStrategySuggestionsInputSchema},
  output: {schema: BusinessStrategySuggestionsOutputSchema},
  prompt: `You are an expert business consultant specializing in financial optimization.

  Based on the following simulation results, provide a list of actionable suggestions on how to optimize business strategies to improve the company's financial performance.

  Simulation Results: {{{simulationResults}}}

  Focus on providing clear, concise, and practical advice that the company can implement immediately.
  Consider impacts on pricing, cost structure, investment strategy, and market positioning.
  Ensure suggestions align with improving profitability, managing risks, and achieving sustainable growth.
  Limit the number of suggestions to no more than 5.
  `,
});

const businessStrategySuggestionsFlow = ai.defineFlow(
  {
    name: 'businessStrategySuggestionsFlow',
    inputSchema: BusinessStrategySuggestionsInputSchema,
    outputSchema: BusinessStrategySuggestionsOutputSchema,
  },
  async input => {
    const {output} = await businessStrategySuggestionsPrompt(input);
    return output!;
  }
);
