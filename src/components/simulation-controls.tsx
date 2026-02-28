'use client';

import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Bot, Loader2, RotateCcw, Sparkles } from 'lucide-react';
import { handleNaturalLanguageQuery } from '@/lib/actions';
import type { SimulationParameters, SimulationResult } from '@/lib/types';
import { DEFAULT_PARAMETERS } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from './ui/scroll-area';

type SimulationControlsProps = {
  onSimulate: (result: SimulationResult | null, loading: boolean, error: string | null, params?: SimulationParameters) => void;
  isLoading: boolean;
};

function SliderControl({ label, value, onChange, min = 0, max = 100, step = 1, unit = '', formatValue }: {
  label: string; value: number[]; onChange: (v: number[]) => void;
  min?: number; max?: number; step?: number; unit?: string;
  formatValue?: (v: number) => string;
}) {
  const displayVal = formatValue ? formatValue(value[0]) : `${value[0]}${unit}`;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <Label className="text-[11px] text-foreground/70">{label}</Label>
        <span className="text-[10px] font-mono text-primary/80 bg-primary/5 px-1.5 py-0.5 rounded">{displayVal}</span>
      </div>
      <Slider defaultValue={value} min={min} max={max} step={step} onValueChange={onChange} className="py-0.5" />
    </div>
  );
}

export default function SimulationControls({ onSimulate, isLoading }: SimulationControlsProps) {
  const [productionCapacity, setProductionCapacity] = useState([DEFAULT_PARAMETERS.productionCapacity]);
  const [inventoryTurnover, setInventoryTurnover] = useState([DEFAULT_PARAMETERS.inventoryTurnover]);
  const [supplierLeadTime, setSupplierLeadTime] = useState([DEFAULT_PARAMETERS.supplierLeadTime]);
  const [cogsMaterials, setCogsMaterials] = useState([DEFAULT_PARAMETERS.cogsMaterials]);
  const [cogsLabor, setCogsLabor] = useState([DEFAULT_PARAMETERS.cogsLabor]);
  const [cogsOverhead, setCogsOverhead] = useState([DEFAULT_PARAMETERS.cogsOverhead]);
  const [salaryInflation, setSalaryInflation] = useState([DEFAULT_PARAMETERS.salaryInflation]);
  const [headcountChange, setHeadcountChange] = useState([DEFAULT_PARAMETERS.headcountChange]);
  const [capexMaintenance, setCapexMaintenance] = useState([DEFAULT_PARAMETERS.capexMaintenance]);
  const [capexGrowth, setCapexGrowth] = useState([DEFAULT_PARAMETERS.capexGrowth]);
  const [depreciation, setDepreciation] = useState([DEFAULT_PARAMETERS.depreciation]);
  const [rdExpenditure, setRdExpenditure] = useState([DEFAULT_PARAMETERS.rdExpenditure]);
  const [salesConversion, setSalesConversion] = useState([DEFAULT_PARAMETERS.salesConversion]);
  const [customerChurn, setCustomerChurn] = useState([DEFAULT_PARAMETERS.customerChurn]);
  const [arDays, setArDays] = useState([DEFAULT_PARAMETERS.arDays]);
  const [apDays, setApDays] = useState([DEFAULT_PARAMETERS.apDays]);
  const [inventoryDays, setInventoryDays] = useState([DEFAULT_PARAMETERS.inventoryDays]);
  const [discount, setDiscount] = useState([DEFAULT_PARAMETERS.discount]);
  const [newProductImpact, setNewProductImpact] = useState([DEFAULT_PARAMETERS.newProductImpact]);
  const [marketDemand, setMarketDemand] = useState([DEFAULT_PARAMETERS.marketDemand]);
  const [competitionIndex, setCompetitionIndex] = useState([DEFAULT_PARAMETERS.competitionIndex]);
  const [commodityIndex, setCommodityIndex] = useState([DEFAULT_PARAMETERS.commodityIndex]);
  const [supplyDisruption, setSupplyDisruption] = useState([DEFAULT_PARAMETERS.supplyDisruption]);
  const [freightRates, setFreightRates] = useState([DEFAULT_PARAMETERS.freightRates]);
  const [customerSentiment, setCustomerSentiment] = useState([DEFAULT_PARAMETERS.customerSentiment]);
  const [inflationRate, setInflationRate] = useState([DEFAULT_PARAMETERS.inflationRate]);
  const [interestRate, setInterestRate] = useState([DEFAULT_PARAMETERS.interestRate]);
  const [unemploymentRate, setUnemploymentRate] = useState([DEFAULT_PARAMETERS.unemploymentRate]);
  const [gdpGrowth, setGdpGrowth] = useState([DEFAULT_PARAMETERS.gdpGrowth]);
  const [consumerConfidence, setConsumerConfidence] = useState([DEFAULT_PARAMETERS.consumerConfidence]);
  const [pmi, setPmi] = useState([DEFAULT_PARAMETERS.pmi]);
  const [forexRate, setForexRate] = useState([DEFAULT_PARAMETERS.forexRate]);
  const [bondYieldSpread, setBondYieldSpread] = useState([DEFAULT_PARAMETERS.bondYieldSpread]);
  const [creditSpread, setCreditSpread] = useState([DEFAULT_PARAMETERS.creditSpread]);
  const [revenueShock, setRevenueShock] = useState([DEFAULT_PARAMETERS.revenueShock]);
  const [cyberAttackDowntime, setCyberAttackDowntime] = useState([DEFAULT_PARAMETERS.cyberAttackDowntime]);
  const [esgPenalty, setEsgPenalty] = useState([DEFAULT_PARAMETERS.esgPenalty]);
  const [naturalQuery, setNaturalQuery] = useState('');
  const { toast } = useToast();

  const resetAll = () => {
    setProductionCapacity([DEFAULT_PARAMETERS.productionCapacity]);
    setInventoryTurnover([DEFAULT_PARAMETERS.inventoryTurnover]);
    setSupplierLeadTime([DEFAULT_PARAMETERS.supplierLeadTime]);
    setCogsMaterials([DEFAULT_PARAMETERS.cogsMaterials]);
    setCogsLabor([DEFAULT_PARAMETERS.cogsLabor]);
    setCogsOverhead([DEFAULT_PARAMETERS.cogsOverhead]);
    setSalaryInflation([DEFAULT_PARAMETERS.salaryInflation]);
    setHeadcountChange([DEFAULT_PARAMETERS.headcountChange]);
    setCapexMaintenance([DEFAULT_PARAMETERS.capexMaintenance]);
    setCapexGrowth([DEFAULT_PARAMETERS.capexGrowth]);
    setDepreciation([DEFAULT_PARAMETERS.depreciation]);
    setRdExpenditure([DEFAULT_PARAMETERS.rdExpenditure]);
    setSalesConversion([DEFAULT_PARAMETERS.salesConversion]);
    setCustomerChurn([DEFAULT_PARAMETERS.customerChurn]);
    setArDays([DEFAULT_PARAMETERS.arDays]);
    setApDays([DEFAULT_PARAMETERS.apDays]);
    setInventoryDays([DEFAULT_PARAMETERS.inventoryDays]);
    setDiscount([DEFAULT_PARAMETERS.discount]);
    setNewProductImpact([DEFAULT_PARAMETERS.newProductImpact]);
    setMarketDemand([DEFAULT_PARAMETERS.marketDemand]);
    setCompetitionIndex([DEFAULT_PARAMETERS.competitionIndex]);
    setCommodityIndex([DEFAULT_PARAMETERS.commodityIndex]);
    setSupplyDisruption([DEFAULT_PARAMETERS.supplyDisruption]);
    setFreightRates([DEFAULT_PARAMETERS.freightRates]);
    setCustomerSentiment([DEFAULT_PARAMETERS.customerSentiment]);
    setInflationRate([DEFAULT_PARAMETERS.inflationRate]);
    setInterestRate([DEFAULT_PARAMETERS.interestRate]);
    setUnemploymentRate([DEFAULT_PARAMETERS.unemploymentRate]);
    setGdpGrowth([DEFAULT_PARAMETERS.gdpGrowth]);
    setConsumerConfidence([DEFAULT_PARAMETERS.consumerConfidence]);
    setPmi([DEFAULT_PARAMETERS.pmi]);
    setForexRate([DEFAULT_PARAMETERS.forexRate]);
    setBondYieldSpread([DEFAULT_PARAMETERS.bondYieldSpread]);
    setCreditSpread([DEFAULT_PARAMETERS.creditSpread]);
    setRevenueShock([DEFAULT_PARAMETERS.revenueShock]);
    setCyberAttackDowntime([DEFAULT_PARAMETERS.cyberAttackDowntime]);
    setEsgPenalty([DEFAULT_PARAMETERS.esgPenalty]);
    setNaturalQuery('');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSimulate(null, true, null);

    const sliderParameters: SimulationParameters = {
      productionCapacity: productionCapacity[0],
      inventoryTurnover: inventoryTurnover[0],
      supplierLeadTime: supplierLeadTime[0],
      cogsMaterials: cogsMaterials[0],
      cogsLabor: cogsLabor[0],
      cogsOverhead: cogsOverhead[0],
      salaryInflation: salaryInflation[0],
      headcountChange: headcountChange[0],
      capexMaintenance: capexMaintenance[0],
      capexGrowth: capexGrowth[0],
      depreciation: depreciation[0],
      rdExpenditure: rdExpenditure[0],
      salesConversion: salesConversion[0],
      customerChurn: customerChurn[0],
      arDays: arDays[0],
      apDays: apDays[0],
      inventoryDays: inventoryDays[0],
      discount: discount[0],
      newProductImpact: newProductImpact[0],
      marketDemand: marketDemand[0],
      competitionIndex: competitionIndex[0],
      commodityIndex: commodityIndex[0],
      supplyDisruption: supplyDisruption[0],
      freightRates: freightRates[0],
      customerSentiment: customerSentiment[0],
      inflationRate: inflationRate[0],
      interestRate: interestRate[0],
      unemploymentRate: unemploymentRate[0],
      gdpGrowth: gdpGrowth[0],
      consumerConfidence: consumerConfidence[0],
      pmi: pmi[0],
      bondYieldSpread: bondYieldSpread[0],
      creditSpread: creditSpread[0],
      revenueShock: revenueShock[0],
      cyberAttackDowntime: cyberAttackDowntime[0],
      esgPenalty: esgPenalty[0],
      forexRate: forexRate[0],
    };

    const result = await handleNaturalLanguageQuery(naturalQuery, sliderParameters);

    if (result.error) {
      onSimulate(null, false, result.error, sliderParameters);
      toast({ variant: "destructive", title: "Simulation Failed", description: result.error });
    } else {
      onSimulate(result.data, false, null, sliderParameters);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Simulation Engine</span>
        </div>
        <button onClick={resetAll} className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
          <RotateCcw className="h-3 w-3" /> Reset
        </button>
      </div>

      {/* Scrollable Controls */}
      <ScrollArea className="flex-1 pr-2">
        <Accordion type="multiple" defaultValue={['ai-query']} className="w-full space-y-1">
          {/* AI Query Section - Always visible at top */}
          <AccordionItem value="ai-query" className="border-border/20 glass-subtle rounded-lg px-3">
            <AccordionTrigger className="text-xs font-semibold py-2 hover:no-underline">
              <span className="flex items-center gap-2">
                <Bot className="h-3.5 w-3.5 text-primary" /> AI Scenario Query
              </span>
            </AccordionTrigger>
            <AccordionContent className="pb-3">
              <Textarea
                placeholder="e.g., What if GDP grows 3% and we acquire a competitor for $5M?"
                value={naturalQuery}
                onChange={(e) => setNaturalQuery(e.target.value)}
                className="min-h-[60px] text-xs bg-background/50 border-border/30 resize-none"
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="operational" className="border-border/20 glass-subtle rounded-lg px-3">
            <AccordionTrigger className="text-xs font-semibold py-2 hover:no-underline">Operational</AccordionTrigger>
            <AccordionContent className="space-y-3 pt-2 pb-3">
              <SliderControl label="Production Capacity" value={productionCapacity} onChange={setProductionCapacity} max={100} unit="%" />
              <SliderControl label="Inventory Turnover" value={inventoryTurnover} onChange={setInventoryTurnover} min={1} max={20} step={0.1} />
              <SliderControl label="Supplier Lead Time" value={supplierLeadTime} onChange={setSupplierLeadTime} max={90} unit=" days" />
              <div className="space-y-1.5">
                <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">COGS Breakdown</Label>
                <div className="grid grid-cols-3 gap-2">
                  <SliderControl label="Materials" value={cogsMaterials} onChange={setCogsMaterials} max={100} unit="%" />
                  <SliderControl label="Labor" value={cogsLabor} onChange={setCogsLabor} max={100} unit="%" />
                  <SliderControl label="Overhead" value={cogsOverhead} onChange={setCogsOverhead} max={100} unit="%" />
                </div>
              </div>
              <SliderControl label="Salary Inflation" value={salaryInflation} onChange={setSalaryInflation} max={10} step={0.1} unit="%" />
              <SliderControl label="Headcount Change" value={headcountChange} onChange={setHeadcountChange} min={-50} max={50} unit="%" />
              <SliderControl label="Maintenance Capex" value={capexMaintenance} onChange={setCapexMaintenance} max={5000000} step={100000} formatValue={(v) => `${(v/1e6).toFixed(1)}M`} />
              <SliderControl label="Growth Capex" value={capexGrowth} onChange={setCapexGrowth} max={10000000} step={100000} formatValue={(v) => `${(v/1e6).toFixed(1)}M`} />
              <SliderControl label="Depreciation (D&A)" value={depreciation} onChange={setDepreciation} max={5000000} step={100000} formatValue={(v) => `${(v/1e6).toFixed(1)}M`} />
              <SliderControl label="R&D Expenditure" value={rdExpenditure} onChange={setRdExpenditure} max={5000000} step={100000} formatValue={(v) => `${(v/1e6).toFixed(1)}M`} />
              <SliderControl label="Sales Conversion" value={salesConversion} onChange={setSalesConversion} max={100} unit="%" />
              <SliderControl label="Customer Churn" value={customerChurn} onChange={setCustomerChurn} max={100} unit="%" />
              <div className="space-y-1.5">
                <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Working Capital (Days)</Label>
                <div className="grid grid-cols-3 gap-2">
                  <SliderControl label="AR (DSO)" value={arDays} onChange={setArDays} max={120} />
                  <SliderControl label="AP (DPO)" value={apDays} onChange={setApDays} max={120} />
                  <SliderControl label="Inv (DIO)" value={inventoryDays} onChange={setInventoryDays} max={180} />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="pricing" className="border-border/20 glass-subtle rounded-lg px-3">
            <AccordionTrigger className="text-xs font-semibold py-2 hover:no-underline">Pricing & Revenue</AccordionTrigger>
            <AccordionContent className="space-y-3 pt-2 pb-3">
              <SliderControl label="Discount Strategy" value={discount} onChange={setDiscount} max={50} unit="%" />
              <SliderControl label="New Product Impact" value={newProductImpact} onChange={setNewProductImpact} max={50000000} step={1000000} formatValue={(v) => `${(v/1e6).toFixed(1)}M`} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="micro" className="border-border/20 glass-subtle rounded-lg px-3">
            <AccordionTrigger className="text-xs font-semibold py-2 hover:no-underline">Micro-Economic</AccordionTrigger>
            <AccordionContent className="space-y-3 pt-2 pb-3">
              <SliderControl label="Market Demand Index" value={marketDemand} onChange={setMarketDemand} max={150} />
              <SliderControl label="Competition Index" value={competitionIndex} onChange={setCompetitionIndex} max={100} />
              <SliderControl label="Commodity Index" value={commodityIndex} onChange={setCommodityIndex} min={50} max={150} />
              <SliderControl label="Supply Disruption" value={supplyDisruption} onChange={setSupplyDisruption} max={20} unit="%" />
              <SliderControl label="Freight Rates Index" value={freightRates} onChange={setFreightRates} min={50} max={200} />
              <SliderControl label="Customer Sentiment" value={customerSentiment} onChange={setCustomerSentiment} min={50} max={150} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="macro" className="border-border/20 glass-subtle rounded-lg px-3">
            <AccordionTrigger className="text-xs font-semibold py-2 hover:no-underline">Macro-Economic</AccordionTrigger>
            <AccordionContent className="space-y-3 pt-2 pb-3">
              <SliderControl label="Inflation Rate" value={inflationRate} onChange={setInflationRate} max={10} step={0.1} unit="%" />
              <SliderControl label="Interest Rate" value={interestRate} onChange={setInterestRate} max={15} step={0.1} unit="%" />
              <SliderControl label="Unemployment Rate" value={unemploymentRate} onChange={setUnemploymentRate} max={15} step={0.1} unit="%" />
              <SliderControl label="GDP Growth" value={gdpGrowth} onChange={setGdpGrowth} min={-5} max={10} step={0.1} unit="%" />
              <SliderControl label="Consumer Confidence" value={consumerConfidence} onChange={setConsumerConfidence} min={50} max={150} />
              <SliderControl label="PMI" value={pmi} onChange={setPmi} min={30} max={70} />
              <SliderControl label="Forex Rate (USD/INR)" value={forexRate} onChange={setForexRate} min={60} max={120} step={0.1} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="financial" className="border-border/20 glass-subtle rounded-lg px-3">
            <AccordionTrigger className="text-xs font-semibold py-2 hover:no-underline">Financial Markets</AccordionTrigger>
            <AccordionContent className="space-y-3 pt-2 pb-3">
              <SliderControl label="Bond Yield Spread (2Y/10Y)" value={bondYieldSpread} onChange={setBondYieldSpread} min={-1} max={5} step={0.01} unit="%" />
              <SliderControl label="Credit Spreads" value={creditSpread} onChange={setCreditSpread} max={10} step={0.1} unit="%" />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="risk" className="border-border/20 glass-subtle rounded-lg px-3">
            <AccordionTrigger className="text-xs font-semibold py-2 hover:no-underline">Risk & Stress Test</AccordionTrigger>
            <AccordionContent className="space-y-3 pt-2 pb-3">
              <SliderControl label="Revenue Shock" value={revenueShock} onChange={setRevenueShock} min={-50} max={50} step={5} unit="%" />
              <SliderControl label="Cyber-Attack Downtime" value={cyberAttackDowntime} onChange={setCyberAttackDowntime} max={30} unit=" days" />
              <SliderControl label="ESG Penalties" value={esgPenalty} onChange={setEsgPenalty} max={5000000} step={100000} formatValue={(v) => `${(v/1e6).toFixed(1)}M`} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ScrollArea>

      {/* Submit Button */}
      <form onSubmit={handleSubmit} className="pt-3 border-t border-border/20">
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold text-xs h-9"
          disabled={isLoading}
        >
          {isLoading ? (
            <><Loader2 className="animate-spin h-3.5 w-3.5 mr-2" /> Running Simulation...</>
          ) : (
            <><Sparkles className="h-3.5 w-3.5 mr-2" /> Run AI Simulation</>
          )}
        </Button>
      </form>
    </div>
  );
}
