'use server';

import { generateQualitativeAnalysis } from '@/ai/flows/natural-language-simulation';
import type { SimulationParameters, SimulationResult } from './types';
import { runFullSimulation } from './simulation-engine';

/**
 * Run a simulation: deterministic engine for numbers, AI for qualitative commentary.
 *
 * If the AI call fails, the numbers still return with placeholder text so the
 * user always gets a consistent financial model.
 */
export async function handleNaturalLanguageQuery(
  query: string,
  sliderParameters: SimulationParameters,
): Promise<{ data: SimulationResult | null; error: string | null }> {
  try {
    // 1. Deterministic engine — always succeeds
    const engineResult = runFullSimulation(sliderParameters);

    // 2. AI qualitative layer — best-effort
    let analysis = 'Simulation completed. Adjust parameters to explore scenarios.';
    let suggestions = 'Try adjusting market demand, production capacity, or interest rates to see the impact on financial statements.';
    let riskAssessment = `Overall risk level: ${engineResult.riskLevel}. Health score: ${engineResult.overallScore}/100.`;

    try {
      const aiResult = await generateQualitativeAnalysis({
        naturalLanguageQuery: query || undefined,
        parameterSummary: engineResult.simulationParameters,
        revenueChange: ((engineResult.keyMetrics[0]?.simulated ?? 0) - (engineResult.keyMetrics[0]?.original ?? 0)) / (engineResult.keyMetrics[0]?.original || 1) * 100,
        netIncomeChange: ((engineResult.keyMetrics[3]?.simulated ?? 0) - (engineResult.keyMetrics[3]?.original ?? 0)) / (engineResult.keyMetrics[3]?.original || 1) * 100,
        grossMargin: engineResult.financialRatios[0]?.simulated ?? 0,
        operatingMargin: engineResult.financialRatios[1]?.simulated ?? 0,
        netMargin: engineResult.financialRatios[2]?.simulated ?? 0,
        currentRatio: engineResult.financialRatios[5]?.simulated ?? 0,
        debtToEquity: engineResult.financialRatios[6]?.simulated ?? 0,
        interestCoverage: engineResult.financialRatios[7]?.simulated ?? 0,
        healthScore: engineResult.overallScore,
        riskLevel: engineResult.riskLevel,
      });

      if (aiResult) {
        analysis = aiResult.simulationAnalysis;
        suggestions = aiResult.suggestions;
        riskAssessment = aiResult.riskAssessment;
      }
    } catch (aiErr) {
      console.warn('AI qualitative analysis failed (numbers are still valid):', aiErr);
    }

    const fullResult: SimulationResult = {
      ...engineResult,
      simulationAnalysis: analysis,
      suggestions,
      riskAssessment,
    };

    return { data: fullResult, error: null };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { data: null, error: `Failed to run simulation: ${errorMessage}` };
  }
}
