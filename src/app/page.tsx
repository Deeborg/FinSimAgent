'use client';

import { useState } from 'react';
import Header from '@/components/header';
import FinancialTicker from '@/components/financial-ticker';
import FinancialStatements from '@/components/financial-statements';
import SimulationDashboard from '@/components/simulation-dashboard';
import type { SimulationResult } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SimulationCharts from '@/components/simulation-charts';

export default function Home() {
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSimulation = (result: SimulationResult | null, loading: boolean, errorMsg: string | null) => {
    setSimulationResult(result);
    setIsLoading(loading);
    setError(errorMsg);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 space-y-6 container mx-auto">
        <FinancialTicker />
        <SimulationCharts simulationResult={simulationResult} isLoading={isLoading} />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
          <FinancialStatements
            title="Original Financials"
            simulatedData={null}
          />
          {isLoading ? (
            <Card className="glass h-full"><CardHeader><CardTitle>Simulated Financials</CardTitle></CardHeader><CardContent><p>Loading...</p></CardContent></Card>
          ) : error ? (
             <Card className="glass h-full"><CardHeader><CardTitle>Simulated Financials</CardTitle></CardHeader><CardContent><p className="text-destructive">{error}</p></CardContent></Card>
          ) : simulationResult ? (
            <FinancialStatements
              title="Simulated Financials"
              simulatedData={{
                balanceSheet: simulationResult.simulatedBalanceSheet,
                pnl: simulationResult.simulatedProfitAndLoss,
                cashFlow: simulationResult.simulatedCashFlow,
              }}
            />
          ) : (
            <Card className="glass h-full">
              <CardHeader><CardTitle>Simulated Financials</CardTitle></CardHeader>
              <CardContent className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">Run a simulation to see the impact here.</p>
              </CardContent>
            </Card>
          )}
        </div>
        <SimulationDashboard
          onSimulate={handleSimulation}
          isLoading={isLoading}
          simulationResult={simulationResult}
          error={error}
        />
      </main>
    </div>
  );
}
