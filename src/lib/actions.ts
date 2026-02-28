'use server';

import { naturalLanguageSimulation } from '@/ai/flows/natural-language-simulation';
import type { SimulationParameters, SimulationResult } from './types';

export async function handleNaturalLanguageQuery(query: string, sliderParameters: SimulationParameters): Promise<{ data: SimulationResult | null; error: string | null }> {
  try {
    const result = await naturalLanguageSimulation({ 
      naturalLanguageQuery: query,
      ...sliderParameters,
     });
    return { data: result, error: null };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { data: null, error: `Failed to run simulation: ${errorMessage}` };
  }
}
