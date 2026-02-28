'use client';

import SimulationControls from './simulation-controls';
import SimulationResults from './simulation-results';
import type { SimulationResult } from '@/lib/types';

type SimulationDashboardProps = {
  onSimulate: (result: SimulationResult | null, loading: boolean, error: string | null) => void;
  isLoading: boolean;
  simulationResult: SimulationResult | null;
  error: string | null;
};

export default function SimulationDashboard({ onSimulate, isLoading, simulationResult, error }: SimulationDashboardProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      <SimulationControls onSimulate={onSimulate} isLoading={isLoading} />
      <SimulationResults result={simulationResult} isLoading={isLoading} error={error} />
    </div>
  );
}
