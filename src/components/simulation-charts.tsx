'use client';

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { SimulationResult } from '@/lib/types';
import { formatCompactNumber } from '@/lib/utils';
import { Skeleton } from './ui/skeleton';
import { TrendingUp, Zap, Activity } from 'lucide-react';

type SimulationChartsProps = {
  simulationResult: SimulationResult | null;
  isLoading: boolean;
};

const chartConfig: ChartConfig = {
  original: {
    label: 'Original',
    color: 'hsl(var(--secondary-foreground) / 0.5)',
  },
  simulated: {
    label: 'Simulated',
    color: 'hsl(var(--primary))',
  },
  gdp: { label: 'GDP Growth', color: 'hsl(var(--chart-1))' },
  inflation: { label: 'Inflation', color: 'hsl(var(--chart-2))' },
  interest: { label: 'Interest Rate', color: 'hsl(var(--chart-3))' },
};

export default function SimulationCharts({ simulationResult, isLoading }: SimulationChartsProps) {
  if (isLoading) {
    return <LoadingState />;
  }
  
  if (!simulationResult) {
    return <InitialState />;
  }

  const { keyMetrics, economicTrends } = simulationResult;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
       <Card className="glass">
        <CardHeader>
           <CardTitle className="flex items-center gap-2"><TrendingUp/> Key Metrics</CardTitle>
          <CardDescription>Original vs. Simulated</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <BarChart data={keyMetrics} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
              <YAxis tickFormatter={(value) => formatCompactNumber(value)} tickLine={false} axisLine={false} width={50} />
              <Tooltip
                cursor={false}
                content={<ChartTooltipContent
                    formatter={(value) => formatCompactNumber(Number(value))}
                    indicator="dot" 
                />}
              />
              <Legend content={<></>} />
              <Bar dataKey="original" fill="var(--color-original)" radius={4} />
              <Bar dataKey="simulated" fill="var(--color-simulated)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Zap/> Economic Factors</CardTitle>
          <CardDescription>Key economic drivers in this simulation.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
             <BarChart data={economicTrends} layout="vertical" margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} width={80} />
                <XAxis type="number" dataKey="value" tickFormatter={(value) => `${value}%`} tickLine={false} axisLine={false} />
                <Tooltip
                    cursor={false}
                    content={<ChartTooltipContent
                        formatter={(value, name) => (
                          <div className="flex flex-col">
                            <span>{name}</span>
                            <span className="font-bold">{value}%</span>
                          </div>
                        )}
                        indicator="dot" 
                    />}
                />
                <Bar dataKey="value" fill="var(--color-interest)" radius={4}>
                </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      
      <Card className="glass">
        <CardHeader>
           <CardTitle className="flex items-center gap-2"><Activity/> Analysis Summary</CardTitle>
           <CardDescription>AI-generated summary of the results.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm text-foreground/80 h-[250px] overflow-y-auto">
             <p>{simulationResult.simulationAnalysis}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


function InitialState() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="glass">
         <CardHeader>
           <CardTitle className="flex items-center gap-2"><TrendingUp/> Key Metrics</CardTitle>
          <CardDescription>Original vs. Simulated</CardDescription>
        </CardHeader>
        <CardContent className="h-[250px] flex items-center justify-center">
          <p className="text-muted-foreground text-sm">Run a simulation to see charts.</p>
        </CardContent>
      </Card>
      <Card className="glass">
         <CardHeader>
          <CardTitle className="flex items-center gap-2"><Zap/> Economic Factors</CardTitle>
          <CardDescription>Key economic drivers in this simulation.</CardDescription>
        </CardHeader>
        <CardContent className="h-[250px] flex items-center justify-center">
          <p className="text-muted-foreground text-sm">Run a simulation to see charts.</p>
        </CardContent>
      </Card>
      <Card className="glass">
         <CardHeader>
           <CardTitle className="flex items-center gap-2"><Activity/> Analysis Summary</CardTitle>
           <CardDescription>AI-generated summary of the results.</CardDescription>
        </CardHeader>
        <CardContent className="h-[250px] flex items-center justify-center">
          <p className="text-muted-foreground text-sm">Run a simulation to see analysis.</p>
        </CardContent>
      </Card>
    </div>
  )
}

function LoadingState() {
   return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="glass">
         <CardHeader>
           <Skeleton className="h-6 w-3/4" />
           <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="h-[250px]">
           <Skeleton className="h-full w-full" />
        </CardContent>
      </Card>
      <Card className="glass">
         <CardHeader>
           <Skeleton className="h-6 w-3/4" />
           <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="h-[250px]">
           <Skeleton className="h-full w-full" />
        </CardContent>
      </Card>
      <Card className="glass">
         <CardHeader>
           <Skeleton className="h-6 w-3/4" />
           <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="h-[250px]">
           <Skeleton className="h-full w-full" />
        </CardContent>
      </Card>
    </div>
  )
}
