import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { BalanceSheet, FinancialStatementItem } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

const originalBalanceSheetData: BalanceSheet = {
  assets: [
    { item: 'Cash and Equivalents', amount: 5200000 },
    { item: 'Accounts Receivable', amount: 3400000 },
    { item: 'Inventory', amount: 2100000 },
    { item: 'Property, Plant, and Equipment', amount: 15800000 },
    { item: 'Total Assets', amount: 26500000, isTotal: true },
  ],
  liabilities: [
    { item: 'Accounts Payable', amount: 2800000 },
    { item: 'Long-term Debt', amount: 8000000 },
    { item: 'Total Liabilities', amount: 10800000, isTotal: true },
  ],
  equity: [
    { item: 'Shareholder Equity', amount: 15700000 },
    { item: 'Total Liabilities & Equity', amount: 26500000, isTotal: true },
  ],
};

const originalProfitAndLossData: FinancialStatementItem[] = [
  { item: 'Revenue', amount: 22500000 },
  { item: 'Cost of Goods Sold', amount: -12300000 },
  { item: 'Gross Profit', amount: 10200000, isTotal: true },
  { item: 'Operating Expenses', amount: -6700000 },
  { item: 'Operating Income (EBIT)', amount: 3500000, isTotal: true },
  { item: 'Taxes', amount: -700000 },
  { item: 'Net Income', amount: 2800000, isTotal: true },
];

const originalCashFlowData: FinancialStatementItem[] = [
    { item: 'Cash from Operations', amount: 4100000 },
    { item: 'Cash from Investing', amount: -2500000 },
    { item: 'Cash from Financing', amount: 500000 },
    { item: 'Net Change in Cash', amount: 2100000, isTotal: true },
];

type FinancialStatementsProps = {
  title: string;
  simulatedData: {
    balanceSheet: BalanceSheet;
    pnl: FinancialStatementItem[];
    cashFlow: FinancialStatementItem[];
  } | null;
};

export default function FinancialStatements({ title, simulatedData }: FinancialStatementsProps) {
  const balanceSheetData = simulatedData ? simulatedData.balanceSheet : originalBalanceSheetData;
  const profitAndLossData = simulatedData ? simulatedData.pnl : originalProfitAndLossData;
  const cashFlowData = simulatedData ? simulatedData.cashFlow : originalCashFlowData;

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="balance-sheet">
          <TabsList className="grid w-full grid-cols-3 bg-transparent border-b rounded-none p-0 mb-4">
            <TabsTrigger value="balance-sheet" className="data-[state=active]:bg-primary/10 data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary">Balance Sheet</TabsTrigger>
            <TabsTrigger value="pnl" className="data-[state=active]:bg-primary/10 data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary">Profit & Loss</TabsTrigger>
            <TabsTrigger value="cash-flow" className="data-[state=active]:bg-primary/10 data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary">Cash Flow</TabsTrigger>
          </TabsList>
          
          <TabsContent value="balance-sheet">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-primary">Assets</h3>
                <StatementTable data={balanceSheetData.assets} />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-primary">Liabilities</h3>
                <StatementTable data={balanceSheetData.liabilities} />
                <h3 className="text-lg font-semibold mt-4 mb-2 text-primary">Equity</h3>
                <StatementTable data={balanceSheetData.equity} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pnl">
            <StatementTable data={profitAndLossData} hasHeader={false} />
          </TabsContent>

          <TabsContent value="cash-flow">
            <StatementTable data={cashFlowData} hasHeader={false} />
          </TabsContent>

        </Tabs>
      </CardContent>
    </Card>
  );
}

function StatementTable({ data, hasHeader = true }: { data: { item: string, amount: number, isTotal?: boolean }[], hasHeader?: boolean }) {
  return (
    <Table>
      {hasHeader && (
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
      )}
      <TableBody>
        {data.map((row) => (
          <TableRow key={row.item} className={row.isTotal ? "font-bold border-t" : ""}>
            <TableCell>{row.item}</TableCell>
            <TableCell className="text-right font-mono">{formatNumber(row.amount)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
