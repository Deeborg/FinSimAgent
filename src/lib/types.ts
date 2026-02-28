export type FinancialStatementItem = {
  item: string;
  amount: number;
  isTotal?: boolean;
};

export type BalanceSheet = {
  assets: FinancialStatementItem[];
  liabilities: FinancialStatementItem[];
  equity: FinancialStatementItem[];
};

export type SimulationResult = {
  simulationParameters: string;
  simulationAnalysis: string;
  suggestions: string;
  simulatedBalanceSheet: BalanceSheet;
  simulatedProfitAndLoss: FinancialStatementItem[];
  simulatedCashFlow: FinancialStatementItem[];
  keyMetrics: {
    name: string;
    original: number;
    simulated: number;
  }[];
  economicTrends: {
    name: string;
    value: number;
  }[];
};

export type SimulationParameters = {
  productionCapacity: number;
  inventoryTurnover: number;
  supplierLeadTime: number;
  cogsMaterials: number;
  cogsLabor: number;
  cogsOverhead: number;
  salaryInflation: number;
  headcountChange: number;
  capexMaintenance: number;
  capexGrowth: number;
  depreciation: number;
  rdExpenditure: number;
  salesConversion: number;
  customerChurn: number;
  arDays: number;
  apDays: number;
  inventoryDays: number;
  discount: number;
  newProductImpact: number;
  marketDemand: number;
  competitionIndex: number;
  commodityIndex: number;
  supplyDisruption: number;
  freightRates: number;
  customerSentiment: number;
  inflationRate: number;
  interestRate: number;
  unemploymentRate: number;
  gdpGrowth: number;
  consumerConfidence: number;
  pmi: number;
  bondYieldSpread: number;
  creditSpread: number;
  revenueShock: number;
  cyberAttackDowntime: number;
  esgPenalty: number;
  forexRate: number;
};
