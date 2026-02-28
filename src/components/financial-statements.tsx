'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { BalanceSheet, FinancialStatementItem, SimulationParameters } from "@/lib/types";
import { ORIGINAL_BALANCE_SHEET, ORIGINAL_PNL, ORIGINAL_CASH_FLOW } from "@/lib/types";
import { formatCompactNumber, formatDelta, cn } from "@/lib/utils";
import { getLineItemExplanation } from "@/lib/line-item-explanations";
import { TrendingUp, TrendingDown, Minus, FileSpreadsheet, Receipt, Banknote, Info } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

type FinancialStatementsProps = {
  simulatedData: {
    balanceSheet: BalanceSheet;
    pnl: FinancialStatementItem[];
    cashFlow: FinancialStatementItem[];
  } | null;
  /** Pass the simulation parameters so info buttons can explain what drove each change */
  parameters?: SimulationParameters | null;
};

export default function FinancialStatements({ simulatedData, parameters = null }: FinancialStatementsProps) {
  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="pnl" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 bg-card/50 border border-border/30 rounded-lg p-1 mb-3">
          <TabsTrigger value="pnl" className="data-[state=active]:bg-primary/15 data-[state=active]:text-primary rounded-md text-xs gap-1.5">
            <Receipt className="h-3 w-3" /> P&L
          </TabsTrigger>
          <TabsTrigger value="balance-sheet" className="data-[state=active]:bg-primary/15 data-[state=active]:text-primary rounded-md text-xs gap-1.5">
            <FileSpreadsheet className="h-3 w-3" /> Balance Sheet
          </TabsTrigger>
          <TabsTrigger value="cash-flow" className="data-[state=active]:bg-primary/15 data-[state=active]:text-primary rounded-md text-xs gap-1.5">
            <Banknote className="h-3 w-3" /> Cash Flow
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="pnl" className="mt-0">
            <ComparisonTable
              originalData={ORIGINAL_PNL}
              simulatedData={simulatedData?.pnl ?? null}
              parameters={parameters}
            />
          </TabsContent>

          <TabsContent value="balance-sheet" className="mt-0 space-y-4">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-blue-400 mb-2 px-1">Assets</h4>
              <ComparisonTable
                originalData={ORIGINAL_BALANCE_SHEET.assets}
                simulatedData={simulatedData?.balanceSheet.assets ?? null}
                parameters={parameters}
              />
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-red-400 mb-2 px-1">Liabilities</h4>
              <ComparisonTable
                originalData={ORIGINAL_BALANCE_SHEET.liabilities}
                simulatedData={simulatedData?.balanceSheet.liabilities ?? null}
                parameters={parameters}
              />
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2 px-1">Equity</h4>
              <ComparisonTable
                originalData={ORIGINAL_BALANCE_SHEET.equity}
                simulatedData={simulatedData?.balanceSheet.equity ?? null}
                parameters={parameters}
              />
            </div>
          </TabsContent>

          <TabsContent value="cash-flow" className="mt-0">
            <ComparisonTable
              originalData={ORIGINAL_CASH_FLOW}
              simulatedData={simulatedData?.cashFlow ?? null}
              parameters={parameters}
            />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}

function ComparisonTable({
  originalData,
  simulatedData,
  parameters,
}: {
  originalData: FinancialStatementItem[];
  simulatedData: FinancialStatementItem[] | null;
  parameters?: SimulationParameters | null;
}) {
  // Build lookup for simulated amounts by item name
  const simulatedMap = new Map<string, number>();
  simulatedData?.forEach(item => simulatedMap.set(item.item, item.amount));

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-border/30 hover:bg-transparent">
          <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Item</TableHead>
          <TableHead className="text-right text-[10px] uppercase tracking-wider text-muted-foreground font-semibold w-[100px]">Original</TableHead>
          {simulatedData && (
            <>
              <TableHead className="text-right text-[10px] uppercase tracking-wider text-muted-foreground font-semibold w-[100px]">Simulated</TableHead>
              <TableHead className="text-right text-[10px] uppercase tracking-wider text-muted-foreground font-semibold w-[80px]">Delta</TableHead>
            </>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {originalData.map((row) => {
          const simAmount = simulatedMap.get(row.item);
          const hasSim = simAmount !== undefined;
          const delta = hasSim ? formatDelta(row.amount, simAmount) : null;
          const isInvertedItem = row.item.toLowerCase().includes('cost') || 
                                  row.item.toLowerCase().includes('expense') ||
                                  row.item.toLowerCase().includes('tax') ||
                                  row.item.toLowerCase().includes('depreciation') ||
                                  row.item.toLowerCase().includes('debt');
          const deltaIsGood = delta ? (isInvertedItem ? delta.value < 0 : delta.value > 0) : null;
          const deltaIsBad = delta ? (isInvertedItem ? delta.value > 0 : delta.value < 0) : null;

          // Generate explanation for this line item
          const explanation = getLineItemExplanation(
            row.item,
            row.amount,
            hasSim ? simAmount : null,
            parameters ?? null,
          );

          return (
            <TableRow
              key={row.item}
              className={cn(
                "border-border/20 transition-colors",
                row.isTotal ? "bg-muted/10 font-semibold" : "hover:bg-muted/5",
                hasSim && delta && delta.value !== 0 && (deltaIsGood ? "bg-emerald-500/[0.03]" : deltaIsBad ? "bg-red-500/[0.03]" : "")
              )}
            >
              <TableCell className={cn("text-xs py-1.5", row.isTotal && "font-semibold text-foreground")}>
                <div className="flex items-center gap-1.5">
                  {/* Info popover button */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        className={cn(
                          "flex-shrink-0 rounded-full p-0.5 transition-colors outline-none focus-visible:ring-1 focus-visible:ring-primary",
                          explanation.narrative
                            ? "text-primary/70 hover:text-primary hover:bg-primary/10"
                            : "text-muted-foreground/40 hover:text-muted-foreground/70 hover:bg-muted/20"
                        )}
                        aria-label={`Info about ${row.item}`}
                      >
                        <Info className="h-3 w-3" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      side="right"
                      align="start"
                      className="w-80 max-h-[400px] overflow-y-auto text-xs space-y-2.5 p-3 bg-card border-border/50"
                    >
                      {/* Item name */}
                      <div className="font-semibold text-sm text-foreground">{row.item}</div>

                      {/* Definition */}
                      <p className="text-muted-foreground leading-relaxed">{explanation.definition}</p>

                      {/* Drivers */}
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-semibold mb-1">
                          Driven by
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {explanation.drivers.map((driver) => (
                            <span
                              key={driver}
                              className="inline-block px-1.5 py-0.5 rounded text-[10px] bg-primary/10 text-primary/80 border border-primary/10"
                            >
                              {driver}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Narrative (only when simulation has been run and there's a change) */}
                      {explanation.narrative && (
                        <div className="border-t border-border/30 pt-2">
                          <div className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-semibold mb-1.5">
                            Simulation Impact
                          </div>
                          <div className="whitespace-pre-line text-foreground/90 leading-relaxed text-[11px]">
                            {explanation.narrative}
                          </div>
                        </div>
                      )}

                      {/* No-change note */}
                      {hasSim && !explanation.narrative && (
                        <div className="border-t border-border/30 pt-2">
                          <p className="text-muted-foreground/60 italic text-[11px]">
                            No change from baseline — this item is unaffected by the current parameter settings.
                          </p>
                        </div>
                      )}
                    </PopoverContent>
                  </Popover>

                  {/* Item name */}
                  {row.isTotal ? row.item : <span className="text-foreground/80">{row.item}</span>}
                </div>
              </TableCell>
              <TableCell className={cn("text-right font-mono text-xs py-1.5", row.isTotal && "font-semibold")}>
                {formatCompactNumber(row.amount)}
              </TableCell>
              {simulatedData && (
                <>
                  <TableCell className={cn(
                    "text-right font-mono text-xs py-1.5",
                    row.isTotal && "font-semibold",
                    hasSim && delta && delta.value !== 0 && (deltaIsGood ? "text-emerald-400" : deltaIsBad ? "text-red-400" : "")
                  )}>
                    {hasSim ? formatCompactNumber(simAmount) : '—'}
                  </TableCell>
                  <TableCell className="text-right py-1.5">
                    {hasSim && delta && delta.value !== 0 ? (
                      <div className={cn(
                        "inline-flex items-center gap-0.5 text-[10px] font-mono px-1.5 py-0.5 rounded-full",
                        deltaIsGood ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"
                      )}>
                        {deltaIsGood ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                        {delta.percent > 0 ? '+' : ''}{delta.percent.toFixed(1)}%
                      </div>
                    ) : hasSim ? (
                      <Minus className="h-3 w-3 text-muted-foreground/30 ml-auto" />
                    ) : null}
                  </TableCell>
                </>
              )}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

