'use client';

import { Brain, CheckCircle, Lightbulb, AlertTriangle, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import type { SimulationResult } from '@/lib/types';
import { cn, getRiskColor } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';
import { useState } from 'react';

type AiAnalysisPanelProps = {
  simulationResult: SimulationResult | null;
  isLoading: boolean;
  error: string | null;
};

export default function AiAnalysisPanel({ simulationResult, isLoading, error }: AiAnalysisPanelProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('analysis');

  if (isLoading) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center gap-2 mb-3 px-1">
          <Brain className="h-4 w-4 text-primary animate-pulse" />
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">AI Agent Processing...</span>
        </div>
        <div className="flex-1 space-y-3">
          <div className="glass-subtle rounded-lg p-4 shimmer">
            <div className="h-3 bg-muted/30 rounded w-3/4 mb-2" />
            <div className="h-3 bg-muted/20 rounded w-full mb-2" />
            <div className="h-3 bg-muted/20 rounded w-5/6 mb-2" />
            <div className="h-3 bg-muted/15 rounded w-2/3" />
          </div>
          <div className="glass-subtle rounded-lg p-4 shimmer">
            <div className="h-3 bg-muted/30 rounded w-1/2 mb-2" />
            <div className="h-3 bg-muted/20 rounded w-full mb-2" />
            <div className="h-3 bg-muted/15 rounded w-4/5" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-4">
        <AlertTriangle className="h-8 w-8 text-red-400 mb-3" />
        <p className="text-sm text-red-400 font-medium mb-1">Simulation Failed</p>
        <p className="text-xs text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (!simulationResult) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-4">
        <Brain className="h-8 w-8 text-muted-foreground/30 mb-3" />
        <p className="text-sm text-muted-foreground/50 font-medium">AI Analysis</p>
        <p className="text-xs text-muted-foreground/30 mt-1">Run a simulation to see AI-generated insights, risk assessment, and strategic recommendations.</p>
      </div>
    );
  }

  const sections = [
    {
      id: 'analysis',
      icon: CheckCircle,
      label: 'Impact Analysis',
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      content: simulationResult.simulationAnalysis,
    },
    {
      id: 'suggestions',
      icon: Lightbulb,
      label: 'Strategic Recommendations',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      content: simulationResult.suggestions,
    },
    {
      id: 'risk',
      icon: Shield,
      label: 'Risk Assessment',
      color: getRiskColor(simulationResult.riskLevel),
      bgColor: simulationResult.riskLevel === 'low' ? 'bg-emerald-500/10' :
               simulationResult.riskLevel === 'medium' ? 'bg-yellow-500/10' :
               simulationResult.riskLevel === 'high' ? 'bg-orange-500/10' :
               'bg-red-500/10',
      content: simulationResult.riskAssessment,
    },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3 px-1">
        <Brain className="h-4 w-4 text-primary" />
        <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">AI Agent Analysis</span>
        <div className={cn(
          "ml-auto text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full",
          simulationResult.riskLevel === 'low' ? 'bg-emerald-500/15 text-emerald-400' :
          simulationResult.riskLevel === 'medium' ? 'bg-yellow-500/15 text-yellow-400' :
          simulationResult.riskLevel === 'high' ? 'bg-orange-500/15 text-orange-400' :
          'bg-red-500/15 text-red-400'
        )}>
          {simulationResult.riskLevel} risk
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-2 pr-2">
          {sections.map((section) => {
            const Icon = section.icon;
            const isExpanded = expandedSection === section.id;

            return (
              <div key={section.id} className="glass-subtle rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                  className="w-full flex items-center gap-2 p-3 hover:bg-muted/10 transition-colors"
                >
                  <div className={cn('p-1 rounded', section.bgColor)}>
                    <Icon className={cn('h-3.5 w-3.5', section.color)} />
                  </div>
                  <span className="text-xs font-semibold text-foreground/80">{section.label}</span>
                  <div className="ml-auto">
                    {isExpanded ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />}
                  </div>
                </button>
                {isExpanded && (
                  <div className="px-3 pb-3">
                    <p className="text-xs text-foreground/70 leading-relaxed whitespace-pre-wrap">{section.content}</p>
                  </div>
                )}
              </div>
            );
          })}

          {/* Sensitivity Data */}
          {simulationResult.sensitivityData && simulationResult.sensitivityData.length > 0 && (
            <div className="glass-subtle rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-xs font-semibold text-foreground/80">Sensitivity Analysis</span>
              </div>
              <div className="space-y-2">
                {simulationResult.sensitivityData.slice(0, 5).map((item) => (
                  <div key={item.parameter} className="flex items-center gap-2 text-[10px]">
                    <span className="text-muted-foreground font-medium w-24 truncate">{item.parameter}</span>
                    <div className="flex-1 h-1.5 bg-muted/20 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          Math.abs(item.netIncomeImpact) > 10 ? 'bg-red-400' :
                          Math.abs(item.netIncomeImpact) > 5 ? 'bg-yellow-400' : 'bg-emerald-400'
                        )}
                        style={{ width: `${Math.min(Math.abs(item.netIncomeImpact) * 5, 100)}%` }}
                      />
                    </div>
                    <span className={cn(
                      "font-mono w-12 text-right",
                      item.netIncomeImpact > 0 ? 'text-emerald-400' : 'text-red-400'
                    )}>
                      {item.netIncomeImpact > 0 ? '+' : ''}{item.netIncomeImpact.toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Parameters Summary */}
          <div className="glass-subtle rounded-lg p-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">Parameters Used</span>
            <p className="text-[10px] text-muted-foreground/40 font-mono mt-1 leading-relaxed">{simulationResult.simulationParameters}</p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
