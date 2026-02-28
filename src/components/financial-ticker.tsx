'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';

type TickerItem = {
  name: string;
  value: string;
  change: string;
  isPositive: boolean;
};

const tickerData: TickerItem[] = [
  { name: 'NIFTY', value: '₹26,046.95', change: '+0.7%', isPositive: true },
  { name: 'SENSEX', value: '₹85,267.66', change: '+0.5%', isPositive: true },
  { name: 'S&P 500', value: '$4,512.34', change: '+0.5%', isPositive: true },
  { name: 'NASDAQ', value: '$14,034.97', change: '+0.8%', isPositive: true },
  { name: 'DOW J', value: '$34,837.71', change: '-0.2%', isPositive: false },
  { name: 'Crude Oil', value: '$57.55', change: '+1.2%', isPositive: true },
  { name: 'Gold INR', value: '₹13,823', change: '-0.5%', isPositive: false },
  { name: 'USD/EUR', value: '0.92', change: '+0.1%', isPositive: true },
  { name: 'USD/INR', value: '90.57', change: '+0.0%', isPositive: true },
  { name: 'CPI YoY', value: '3.7%', change: '+0.1%', isPositive: false },
  { name: 'GDP Growth', value: '2.1%', change: '-0.3%', isPositive: false },
  { name: 'Fed Rate', value: '5.50%', change: '0.0%', isPositive: true },
  { name: 'BTC/USD', value: '25,845.50', change: '-2.5%', isPositive: false },
];

export default function FinancialTicker() {
  const duplicatedData = useMemo(() => [...tickerData, ...tickerData], []);

  return (
    <div className="relative w-full overflow-hidden glass-subtle rounded-md py-1.5 px-2">
      <div className="animate-marquee whitespace-nowrap flex">
        {duplicatedData.map((item, index) => (
          <div key={index} className="mx-3 flex items-center gap-2 text-[11px]">
            <span className="font-semibold text-foreground/60">{item.name}</span>
            <span className="font-mono text-foreground/80">{item.value}</span>
            <div className={cn(
              "flex items-center gap-0.5",
              item.isPositive ? "text-emerald-400" : "text-red-400"
            )}>
              {item.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              <span className="font-mono">{item.change}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
