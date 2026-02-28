'use client';

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, RadialBarChart, RadialBar } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { SimulationResult } from '@/lib/types';
import { ORIGINAL_RATIOS } from '@/lib/types';
import { formatCompactNumber, cn, getScoreColor, getScoreGradient } from '@/lib/utils';
import { Skeleton } from './ui/skeleton';
import { TrendingUp, Zap, Activity, GitBranch, Shield, Gauge } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

type SimulationChartsProps = {
  simulationResult: SimulationResult | null;
  isLoading: boolean;
};

const chartConfig: ChartConfig = {
  original: { label: 'Original', color: 'hsl(var(--muted-foreground) / 0.4)' },
  simulated: { label: 'Simulated', color: 'hsl(var(--primary))' },
};

export default function SimulationCharts({ simulationResult, isLoading }: SimulationChartsProps) {
  if (isLoading) return <LoadingState />;
  if (!simulationResult) return <InitialState />;

  const { keyMetrics, economicTrends, financialRatios, waterfallData, overallScore, riskLevel } = simulationResult;

  return (
    <Tabs defaultValue="metrics" className="w-full">
      <TabsList className="bg-card/50 border border-border/30 rounded-lg p-1 mb-3">
        <TabsTrigger value="metrics" className="data-[state=active]:bg-primary/15 data-[state=active]:text-primary rounded-md text-xs gap-1.5">
          <TrendingUp className="h-3 w-3" /> Metrics
        </TabsTrigger>
        <TabsTrigger value="waterfall" className="data-[state=active]:bg-primary/15 data-[state=active]:text-primary rounded-md text-xs gap-1.5">
          <GitBranch className="h-3 w-3" /> Waterfall
        </TabsTrigger>
        <TabsTrigger value="ratios" className="data-[state=active]:bg-primary/15 data-[state=active]:text-primary rounded-md text-xs gap-1.5">
          <Activity className="h-3 w-3" /> Ratios
        </TabsTrigger>
        <TabsTrigger value="economy" className="data-[state=active]:bg-primary/15 data-[state=active]:text-primary rounded-md text-xs gap-1.5">
          <Zap className="h-3 w-3" /> Economy
        </TabsTrigger>
      </TabsList>

      <TabsContent value="metrics" className="mt-0">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
          {/* Score Card */}
          <div className="glass rounded-lg p-4 flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 mb-3">
              <Gauge className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Health Score</span>
            </div>
            <div className={cn("text-4xl font-bold font-mono", getScoreColor(overallScore))}>
              {overallScore}
            </div>
            <div className="w-full mt-3 h-2 bg-muted/30 rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-1000", getScoreGradient(overallScore))}
                style={{ width: `${overallScore}%` }}
              />
            </div>
            <div className={cn(
              "mt-2 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full",
              riskLevel === 'low' ? 'bg-emerald-500/15 text-emerald-400' :
              riskLevel === 'medium' ? 'bg-yellow-500/15 text-yellow-400' :
              riskLevel === 'high' ? 'bg-orange-500/15 text-orange-400' :
              'bg-red-500/15 text-red-400'
            )}>
              {riskLevel} risk
            </div>
          </div>

          {/* Key Metrics Chart */}
          <div className="glass rounded-lg p-4 lg:col-span-3">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Key Metrics Comparison</span>
              <div className="ml-auto flex items-center gap-3">
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-muted-foreground/40" /><span className="text-[10px] text-muted-foreground">Original</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-primary" /><span className="text-[10px] text-muted-foreground">Simulated</span></div>
              </div>
            </div>
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <BarChart data={keyMetrics} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.3)" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} fontSize={10} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tickFormatter={(value) => formatCompactNumber(value)} tickLine={false} axisLine={false} width={50} fontSize={10} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip cursor={false} content={<ChartTooltipContent formatter={(value) => formatCompactNumber(Number(value))} indicator="dot" />} />
                <Bar dataKey="original" fill="var(--color-original)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="simulated" fill="var(--color-simulated)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="waterfall" className="mt-0">
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <GitBranch className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Net Income Bridge — Original to Simulated</span>
          </div>
          <ChartContainer config={chartConfig} className="h-[240px] w-full">
            <BarChart data={waterfallData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.3)" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} fontSize={9} tick={{ fill: 'hsl(var(--muted-foreground))' }} angle={-20} />
              <YAxis tickFormatter={(value) => formatCompactNumber(value)} tickLine={false} axisLine={false} width={50} fontSize={10} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip cursor={false} content={<ChartTooltipContent formatter={(value) => formatCompactNumber(Number(value))} indicator="dot" />} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {waterfallData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={
                      entry.type === 'total' ? 'hsl(var(--primary))' :
                      entry.type === 'increase' ? 'hsl(160, 70%, 45%)' :
                      'hsl(0, 72%, 51%)'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
      </TabsContent>

      <TabsContent value="ratios" className="mt-0">
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Financial Ratios — Original vs Simulated</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {financialRatios.map((ratio) => {
              const delta = ratio.original !== 0
                ? ((ratio.simulated - ratio.original) / Math.abs(ratio.original)) * 100
                : 0;
              const isInvertedRatio = ratio.name.toLowerCase().includes('debt') || ratio.name.toLowerCase().includes('cycle');
              const isGood = isInvertedRatio ? delta < 0 : delta > 0;
              const isBad = isInvertedRatio ? delta > 0 : delta < 0;

              return (
                <div key={ratio.name} className="glass-subtle rounded-lg p-3 text-center">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1">{ratio.name}</div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xs text-muted-foreground/60 font-mono">{ratio.original.toFixed(1)}{ratio.unit}</span>
                    <span className="text-xs text-muted-foreground/30">→</span>
                    <span className={cn(
                      "text-sm font-bold font-mono",
                      delta !== 0 && (isGood ? "text-emerald-400" : isBad ? "text-red-400" : "text-foreground")
                    )}>
                      {ratio.simulated.toFixed(1)}{ratio.unit}
                    </span>
                  </div>
                  {delta !== 0 && (
                    <div className={cn(
                      "text-[10px] font-mono mt-1",
                      isGood ? "text-emerald-400" : isBad ? "text-red-400" : "text-muted-foreground"
                    )}>
                      {delta > 0 ? '+' : ''}{delta.toFixed(1)}%
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="economy" className="mt-0">
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Economic Drivers</span>
          </div>
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <BarChart data={economicTrends} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border) / 0.3)" />
              <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={8} fontSize={10} width={100} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <XAxis type="number" dataKey="value" tickFormatter={(value) => `${value}%`} tickLine={false} axisLine={false} fontSize={10} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip cursor={false} content={<ChartTooltipContent formatter={(value) => `${value}%`} indicator="dot" />} />
              <Bar dataKey="value" fill="hsl(var(--chart-3))" radius={[0, 4, 4, 0]}>
                {economicTrends.map((entry, index) => (
                  <Cell key={index} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
      </TabsContent>
    </Tabs>
  );
}

function InitialState() {
  return (
    <div className="glass rounded-lg p-8 text-center">
      <div className="flex items-center justify-center gap-2 mb-2">
        <TrendingUp className="h-5 w-5 text-muted-foreground/50" />
        <span className="text-sm text-muted-foreground/70 font-medium">Charts & Analysis</span>
      </div>
      <p className="text-xs text-muted-foreground/50">Run a simulation to see interactive charts, waterfall analysis, and financial ratios.</p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="glass rounded-lg p-4">
      <div className="flex gap-3">
        <Skeleton className="h-[200px] flex-1" />
        <Skeleton className="h-[200px] flex-1" />
        <Skeleton className="h-[200px] flex-1" />
      </div>
    </div>
  );
}
