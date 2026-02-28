'use client';

import { TrendingUp, TrendingDown, DollarSign, BarChart3, Wallet, PiggyBank, Shield, Activity } from 'lucide-react';
import type { SimulationResult } from '@/lib/types';
import { formatCurrency, formatPercent, formatDelta, cn } from '@/lib/utils';

type KpiCardsProps = {
  simulationResult: SimulationResult | null;
  isLoading: boolean;
};

const kpiConfig = [
  { key: 'Revenue', icon: DollarSign, color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
  { key: 'Gross Profit', icon: BarChart3, color: 'text-emerald-400', bgColor: 'bg-emerald-500/10' },
  { key: 'EBIT', icon: Activity, color: 'text-violet-400', bgColor: 'bg-violet-500/10' },
  { key: 'Net Income', icon: PiggyBank, color: 'text-cyan-400', bgColor: 'bg-cyan-500/10' },
  { key: 'Total Assets', icon: Wallet, color: 'text-amber-400', bgColor: 'bg-amber-500/10' },
  { key: 'Operating Cash Flow', icon: Shield, color: 'text-pink-400', bgColor: 'bg-pink-500/10' },
];

export default function KpiCards({ simulationResult, isLoading }: KpiCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
      {kpiConfig.map((kpi) => {
        const metric = simulationResult?.keyMetrics.find(m => m.name === kpi.key);
        const Icon = kpi.icon;

        if (isLoading) {
          return (
            <div key={kpi.key} className="stat-card animate-pulse">
              <div className="flex items-center gap-2 mb-2">
                <div className={cn('p-1.5 rounded-md', kpi.bgColor)}>
                  <Icon className={cn('h-3.5 w-3.5', kpi.color)} />
                </div>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium truncate">{kpi.key}</span>
              </div>
              <div className="h-5 bg-muted/30 rounded w-3/4 mb-1" />
              <div className="h-3 bg-muted/20 rounded w-1/2" />
            </div>
          );
        }

        if (!metric) {
          return (
            <div key={kpi.key} className="stat-card">
              <div className="flex items-center gap-2 mb-2">
                <div className={cn('p-1.5 rounded-md', kpi.bgColor)}>
                  <Icon className={cn('h-3.5 w-3.5', kpi.color)} />
                </div>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium truncate">{kpi.key}</span>
              </div>
              <div className="text-lg font-semibold font-mono text-muted-foreground">—</div>
              <div className="text-[10px] text-muted-foreground/50">Awaiting simulation</div>
            </div>
          );
        }

        const delta = formatDelta(metric.original, metric.simulated);
        const isPositive = delta.percent > 0;
        const isNegative = delta.percent < 0;

        return (
          <div key={kpi.key} className="stat-card group">
            <div className="flex items-center gap-2 mb-2">
              <div className={cn('p-1.5 rounded-md', kpi.bgColor)}>
                <Icon className={cn('h-3.5 w-3.5', kpi.color)} />
              </div>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium truncate">{kpi.key}</span>
            </div>
            <div className="text-lg font-bold font-mono tracking-tight">
              {formatCurrency(metric.simulated)}
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              {isPositive && <TrendingUp className="h-3 w-3 text-emerald-400" />}
              {isNegative && <TrendingDown className="h-3 w-3 text-red-400" />}
              <span className={cn(
                'text-[10px] font-mono font-medium',
                isPositive ? 'text-emerald-400' : isNegative ? 'text-red-400' : 'text-muted-foreground'
              )}>
                {formatPercent(delta.percent)}
              </span>
              <span className="text-[10px] text-muted-foreground/50">
                from {formatCurrency(metric.original)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
