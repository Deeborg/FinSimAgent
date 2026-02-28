'use client';

import { useState } from 'react';
import Header from '@/components/header';
import FinancialTicker from '@/components/financial-ticker';
import FinancialStatements from '@/components/financial-statements';
import SimulationControls from '@/components/simulation-controls';
import SimulationCharts from '@/components/simulation-charts';
import KpiCards from '@/components/kpi-cards';
import AiAnalysisPanel from '@/components/ai-analysis-panel';
import type { SimulationParameters, SimulationResult } from '@/lib/types';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Home() {
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [simulationParams, setSimulationParams] = useState<SimulationParameters | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSimulation = (result: SimulationResult | null, loading: boolean, errorMsg: string | null, params?: SimulationParameters) => {
    setSimulationResult(result);
    setIsLoading(loading);
    setError(errorMsg);
    if (params) setSimulationParams(params);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Top Bar */}
      <Header />
      <FinancialTicker />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar — Controls */}
        <aside className={cn(
          "flex-shrink-0 border-r border-border/30 bg-[hsl(var(--sidebar))] transition-all duration-300 ease-in-out flex flex-col",
          sidebarOpen ? "w-[320px]" : "w-0"
        )}>
          {sidebarOpen && (
            <div className="flex-1 overflow-hidden flex flex-col p-3">
              <SimulationControls onSimulate={handleSimulation} isLoading={isLoading} />
            </div>
          )}
        </aside>

        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex-shrink-0 w-6 flex items-center justify-center border-r border-border/20 bg-card/30 hover:bg-card/60 transition-colors"
          title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {sidebarOpen ? (
            <PanelLeftClose className="h-3.5 w-3.5 text-muted-foreground" />
          ) : (
            <PanelLeftOpen className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </button>

        {/* Center — Dashboard */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* KPI Row */}
            <KpiCards simulationResult={simulationResult} isLoading={isLoading} />

            {/* Charts */}
            <SimulationCharts simulationResult={simulationResult} isLoading={isLoading} />

            {/* Financial Statements - Full Width */}
            <div className="glass rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3 px-1">
                <div className="w-1 h-4 rounded-full bg-gradient-to-b from-primary to-accent" />
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Financial Statements — Original vs Simulated</span>
                {!simulationResult && !isLoading && (
                  <span className="text-[10px] text-muted-foreground/40 ml-2">(Run simulation to compare)</span>
                )}
              </div>
              <FinancialStatements
                simulatedData={simulationResult ? {
                  balanceSheet: simulationResult.simulatedBalanceSheet,
                  pnl: simulationResult.simulatedProfitAndLoss,
                  cashFlow: simulationResult.simulatedCashFlow,
                } : null}
                parameters={simulationParams}
              />
            </div>
          </div>
        </main>

        {/* Right Panel — AI Analysis */}
        <aside className="flex-shrink-0 w-[300px] border-l border-border/30 bg-[hsl(var(--sidebar))] p-3 overflow-hidden flex flex-col">
          <AiAnalysisPanel
            simulationResult={simulationResult}
            isLoading={isLoading}
            error={error}
          />
        </aside>
      </div>
    </div>
  );
}
