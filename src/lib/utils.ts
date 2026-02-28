import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(value: number, decimals = 0) {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatCurrency(value: number, decimals = 0) {
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  if (abs >= 1_000_000_000) {
    return `${sign}$${(abs / 1_000_000_000).toFixed(1)}B`;
  }
  if (abs >= 1_000_000) {
    return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
  }
  if (abs >= 1_000) {
    return `${sign}$${(abs / 1_000).toFixed(0)}K`;
  }
  return `${sign}$${abs.toFixed(decimals)}`;
}

export function formatCompactNumber(value: number) {
  if (Math.abs(value) >= 1_000_000_000) {
    return (value / 1_000_000_000).toFixed(1) + 'B';
  }
  if (Math.abs(value) >= 1_000_000) {
    return (value / 1_000_000).toFixed(1) + 'M';
  }
  if (Math.abs(value) >= 1_000) {
    return (value / 1_000).toFixed(1) + 'K';
  }
  return value.toString();
}

export function formatPercent(value: number, decimals = 1) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
}

export function formatDelta(original: number, simulated: number) {
  if (original === 0) return { value: 0, percent: 0 };
  const value = simulated - original;
  const percent = ((simulated - original) / Math.abs(original)) * 100;
  return { value, percent };
}

export function getDeltaColor(delta: number, invertColors = false) {
  if (delta === 0) return 'text-muted-foreground';
  const isPositive = invertColors ? delta < 0 : delta > 0;
  return isPositive ? 'text-emerald-400' : 'text-red-400';
}

export function getDeltaBg(delta: number, invertColors = false) {
  if (delta === 0) return 'bg-muted/20';
  const isPositive = invertColors ? delta < 0 : delta > 0;
  return isPositive ? 'bg-emerald-500/10' : 'bg-red-500/10';
}

export function getRiskColor(level: 'low' | 'medium' | 'high' | 'critical') {
  switch (level) {
    case 'low': return 'text-emerald-400';
    case 'medium': return 'text-yellow-400';
    case 'high': return 'text-orange-400';
    case 'critical': return 'text-red-400';
  }
}

export function getScoreColor(score: number) {
  if (score >= 80) return 'text-emerald-400';
  if (score >= 60) return 'text-yellow-400';
  if (score >= 40) return 'text-orange-400';
  return 'text-red-400';
}

export function getScoreGradient(score: number) {
  if (score >= 80) return 'from-emerald-500 to-emerald-400';
  if (score >= 60) return 'from-yellow-500 to-yellow-400';
  if (score >= 40) return 'from-orange-500 to-orange-400';
  return 'from-red-500 to-red-400';
}
