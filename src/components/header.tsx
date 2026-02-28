'use client';

import { Activity, Cpu } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full glass-strong border-b border-border/30 z-50">
      <div className="flex h-11 items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-gradient-to-br from-primary to-accent">
            <Activity className="h-3.5 w-3.5 text-white" />
          </div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-sm font-bold tracking-tight text-foreground">
              FinSim<span className="text-primary">Agent</span>
            </h1>
            <span className="text-[9px] font-mono text-muted-foreground/50 bg-muted/30 px-1.5 py-0.5 rounded">v2.0</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/60">
            <Cpu className="h-3 w-3" />
            <span>Powered by Gemini 2.5 Flash</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-emerald-400/70 font-medium">Live</span>
          </div>
        </div>
      </div>
    </header>
  );
}
