'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Bot, Loader2 } from 'lucide-react';
import { handleNaturalLanguageQuery } from '@/lib/actions';
import type { SimulationParameters, SimulationResult } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from './ui/scroll-area';

type SimulationControlsProps = {
  onSimulate: (result: SimulationResult | null, loading: boolean, error: string | null) => void;
  isLoading: boolean;
};

export default function SimulationControls({ onSimulate, isLoading }: SimulationControlsProps) {
  // --- STATE FOR ALL SLIDERS ---

  // Operational Parameters
  const [productionCapacity, setProductionCapacity] = useState([80]);
  const [inventoryTurnover, setInventoryTurnover] = useState([5]);
  const [supplierLeadTime, setSupplierLeadTime] = useState([30]);
  const [cogsMaterials, setCogsMaterials] = useState([40]);
  const [cogsLabor, setCogsLabor] = useState([30]);
  const [cogsOverhead, setCogsOverhead] = useState([30]);
  const [salaryInflation, setSalaryInflation] = useState([3]);
  const [headcountChange, setHeadcountChange] = useState([0]);
  const [capexMaintenance, setCapexMaintenance] = useState([1000000]);
  const [capexGrowth, setCapexGrowth] = useState([500000]);
  const [depreciation, setDepreciation] = useState([500000]);
  const [rdExpenditure, setRdExpenditure] = useState([800000]);
  const [salesConversion, setSalesConversion] = useState([10]);
  const [customerChurn, setCustomerChurn] = useState([5]);
  const [arDays, setArDays] = useState([45]);
  const [apDays, setApDays] = useState([30]);
  const [inventoryDays, setInventoryDays] = useState([60]);

  // Pricing & Revenue Mechanics
  const [discount, setDiscount] = useState([5]);
  const [newProductImpact, setNewProductImpact] = useState([0]);

  // Micro-Economic Parameters
  const [marketDemand, setMarketDemand] = useState([95]);
  const [competitionIndex, setCompetitionIndex] = useState([75]);
  const [commodityIndex, setCommodityIndex] = useState([100]);
  const [supplyDisruption, setSupplyDisruption] = useState([2]);
  const [freightRates, setFreightRates] = useState([100]);
  const [customerSentiment, setCustomerSentiment] = useState([100]);
  
  // Macro-Economic Parameters
  const [inflationRate, setInflationRate] = useState([2.5]);
  const [interestRate, setInterestRate] = useState([5.5]);
  const [unemploymentRate, setUnemploymentRate] = useState([4]);
  const [gdpGrowth, setGdpGrowth] = useState([2.1]);
  const [consumerConfidence, setConsumerConfidence] = useState([100]);
  const [pmi, setPmi] = useState([50]);
  const [forexRate, setForexRate] = useState([90.58]);


  // Financial Market Parameters
  const [bondYieldSpread, setBondYieldSpread] = useState([0.762]);
  const [creditSpread, setCreditSpread] = useState([2]);

  // Risk & Stress Testing
  const [revenueShock, setRevenueShock] = useState([0]);
  const [cyberAttackDowntime, setCyberAttackDowntime] = useState([0]);
  const [esgPenalty, setEsgPenalty] = useState([0]);

  const [naturalQuery, setNaturalQuery] = useState('');
  const { toast } = useToast();

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
      onSimulate(null, false, result.error);
       toast({
        variant: "destructive",
        title: "Simulation Failed",
        description: result.error,
      });
    } else {
      onSimulate(result.data, false, null);
    }
  };

  return (
    <Card className="glass flex flex-col">
      <CardHeader>
        <CardTitle>Create Simulation</CardTitle>
        <CardDescription>Adjust parameters or use natural language to run a simulation.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-6 overflow-hidden">
        <ScrollArea className="flex-1 pr-4">
          <Accordion type="multiple" defaultValue={['operational']} className="w-full">
            <AccordionItem value="operational">
              <AccordionTrigger>Operational Parameters</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                 <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Production Capacity (%)</Label>
                    <span className="text-sm font-mono">{productionCapacity[0]}%</span>
                  </div>
                  <Slider defaultValue={productionCapacity} max={100} step={1} onValueChange={setProductionCapacity} />
                </div>
                 <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Inventory Turnover</Label>
                    <span className="text-sm font-mono">{inventoryTurnover[0]}</span>
                  </div>
                  <Slider defaultValue={inventoryTurnover} max={20} step={0.5} onValueChange={setInventoryTurnover} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Supplier Lead Times (days)</Label>
                    <span className="text-sm font-mono">{supplierLeadTime[0]}</span>
                  </div>
                  <Slider defaultValue={supplierLeadTime} max={90} step={1} onValueChange={setSupplierLeadTime} />
                </div>
                <div className="space-y-2">
                  <Label>COGS Breakdown (%)</Label>
                  <div className='flex gap-4'>
                    <div className='flex-1 space-y-1'>
                      <div className="flex justify-between text-xs">
                        <Label>Materials</Label>
                        <span className="font-mono">{cogsMaterials[0]}%</span>
                      </div>
                      <Slider defaultValue={cogsMaterials} max={100} step={1} onValueChange={setCogsMaterials} />
                    </div>
                    <div className='flex-1 space-y-1'>
                       <div className="flex justify-between text-xs">
                        <Label>Labor</Label>
                        <span className="font-mono">{cogsLabor[0]}%</span>
                      </div>
                      <Slider defaultValue={cogsLabor} max={100} step={1} onValueChange={setCogsLabor} />
                    </div>
                    <div className='flex-1 space-y-1'>
                       <div className="flex justify-between text-xs">
                        <Label>Overhead</Label>
                        <span className="font-mono">{cogsOverhead[0]}%</span>
                      </div>
                      <Slider defaultValue={cogsOverhead} max={100} step={1} onValueChange={setCogsOverhead} />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Salary Inflation (%)</Label>
                    <span className="text-sm font-mono">{salaryInflation[0]}%</span>
                  </div>
                  <Slider defaultValue={salaryInflation} max={10} step={0.1} onValueChange={setSalaryInflation} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Headcount Change (%)</Label>
                    <span className="text-sm font-mono">{headcountChange[0]}%</span>
                  </div>
                  <Slider defaultValue={headcountChange} min={-50} max={50} step={1} onValueChange={setHeadcountChange} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Maintenance Capex</Label>
                    <span className="text-sm font-mono">{(capexMaintenance[0]/1000000).toFixed(1)}M</span>
                  </div>
                  <Slider defaultValue={capexMaintenance} min={0} max={5000000} step={100000} onValueChange={setCapexMaintenance} />
                </div>
                 <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Growth Capex</Label>
                    <span className="text-sm font-mono">{(capexGrowth[0]/1000000).toFixed(1)}M</span>
                  </div>
                  <Slider defaultValue={capexGrowth} min={0} max={10000000} step={100000} onValueChange={setCapexGrowth} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Depreciation Schedule</Label>
                    <span className="text-sm font-mono">{(depreciation[0]/1000000).toFixed(1)}M</span>
                  </div>
                  <Slider defaultValue={depreciation} min={0} max={2000000} step={50000} onValueChange={setDepreciation} />
                </div>
                 <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>R&D Expenditure</Label>
                    <span className="text-sm font-mono">{(rdExpenditure[0]/1000000).toFixed(1)}M</span>
                  </div>
                  <Slider defaultValue={rdExpenditure} min={0} max={5000000} step={100000} onValueChange={setRdExpenditure} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Sales Pipeline Conversion (%)</Label>
                    <span className="text-sm font-mono">{salesConversion[0]}%</span>
                  </div>
                  <Slider defaultValue={salesConversion} max={100} step={1} onValueChange={setSalesConversion} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Customer Churn Probability (%)</Label>
                    <span className="text-sm font-mono">{customerChurn[0]}%</span>
                  </div>
                  <Slider defaultValue={customerChurn} max={100} step={1} onValueChange={setCustomerChurn} />
                </div>
                <div className="space-y-2">
                  <Label>AR/AP/Inventory Days</Label>
                  <div className='flex gap-4'>
                    <div className='flex-1 space-y-1'>
                      <div className="flex justify-between text-xs">
                        <Label>AR Days (DSO)</Label>
                        <span className="font-mono">{arDays[0]}</span>
                      </div>
                      <Slider defaultValue={arDays} max={120} step={1} onValueChange={setArDays} />
                    </div>
                    <div className='flex-1 space-y-1'>
                       <div className="flex justify-between text-xs">
                        <Label>AP Days (DPO)</Label>
                        <span className="font-mono">{apDays[0]}</span>
                      </div>
                      <Slider defaultValue={apDays} max={120} step={1} onValueChange={setApDays} />
                    </div>
                    <div className='flex-1 space-y-1'>
                       <div className="flex justify-between text-xs">
                        <Label>Inventory Days (DIO)</Label>
                        <span className="font-mono">{inventoryDays[0]}</span>
                      </div>
                      <Slider defaultValue={inventoryDays} max={180} step={1} onValueChange={setInventoryDays} />
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="pricing-revenue">
              <AccordionTrigger>Pricing & Revenue Mechanics</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Discount Strategy Change (%)</Label>
                    <span className="text-sm font-mono">{discount[0]}%</span>
                  </div>
                  <Slider defaultValue={discount} max={50} step={1} onValueChange={setDiscount} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>New Product Launch Impact (M)</Label>
                    <span className="text-sm font-mono">{(newProductImpact[0]/1000000).toFixed(1)}M</span>
                  </div>
                  <Slider defaultValue={newProductImpact} max={50000000} step={1000000} onValueChange={setNewProductImpact} />
                </div>
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="micro-economic">
              <AccordionTrigger>Micro-Economic Parameters</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                 <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Market Demand Index</Label>
                    <span className="text-sm font-mono">{marketDemand[0]}</span>
                  </div>
                  <Slider defaultValue={marketDemand} max={120} step={1} onValueChange={setMarketDemand} />
                </div>
                 <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Competition Index</Label>
                    <span className="text-sm font-mono">{competitionIndex[0]}</span>
                  </div>
                  <Slider defaultValue={competitionIndex} max={100} step={1} onValueChange={setCompetitionIndex} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Commodity Index</Label>
                    <span className="text-sm font-mono">{commodityIndex[0]}</span>
                  </div>
                  <Slider defaultValue={commodityIndex} min={50} max={150} step={1} onValueChange={setCommodityIndex} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Supply Chain Disruption Probability (%)</Label>
                    <span className="text-sm font-mono">{supplyDisruption[0]}%</span>
                  </div>
                  <Slider defaultValue={supplyDisruption} max={20} step={1} onValueChange={setSupplyDisruption} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Freight Rate Changes (Index)</Label>
                    <span className="text-sm font-mono">{freightRates[0]}</span>
                  </div>
                  <Slider defaultValue={freightRates} min={50} max={200} step={1} onValueChange={setFreightRates} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Customer Sentiment Index</Label>
                    <span className="text-sm font-mono">{customerSentiment[0]}</span>
                  </div>
                  <Slider defaultValue={customerSentiment} min={50} max={150} step={1} onValueChange={setCustomerSentiment} />
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="macro-economic">
              <AccordionTrigger>Macro-Economic Parameters</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                 <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Inflation Rate (%)</Label>
                     <span className="text-sm font-mono">{inflationRate[0]}%</span>
                  </div>
                  <Slider defaultValue={inflationRate} max={10} step={0.1} onValueChange={setInflationRate} />
                </div>
                 <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Interest Rate (%)</Label>
                     <span className="text-sm font-mono">{interestRate[0]}%</span>
                  </div>
                  <Slider defaultValue={interestRate} max={15} step={0.1} onValueChange={setInterestRate} />
                </div>
                 <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Unemployment Rate (%)</Label>
                    <span className="text-sm font-mono">{unemploymentRate[0]}%</span>
                  </div>
                  <Slider defaultValue={unemploymentRate} max={15} step={0.1} onValueChange={setUnemploymentRate} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>GDP Growth (%)</Label>
                    <span className="text-sm font-mono">{gdpGrowth[0]}%</span>
                  </div>
                  <Slider defaultValue={gdpGrowth} max={10} step={0.1} onValueChange={setGdpGrowth} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Consumer Confidence Index</Label>
                    <span className="text-sm font-mono">{consumerConfidence[0]}</span>
                  </div>
                  <Slider defaultValue={consumerConfidence} min={50} max={150} step={1} onValueChange={setConsumerConfidence} />
                </div>
                 <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>PMI (Purchasing Managers Index)</Label>
                    <span className="text-sm font-mono">{pmi[0]}</span>
                  </div>
                  <Slider defaultValue={pmi} min={30} max={70} step={1} onValueChange={setPmi} />
                </div>
                 <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Forex Rate (USD vs INR)</Label>
                    <span className="text-sm font-mono">{forexRate[0]}</span>
                  </div>
                  <Slider defaultValue={forexRate} min={0} max={120} step={0.1} onValueChange={setForexRate} />
                </div>                
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="financial-market">
              <AccordionTrigger>Financial Market Parameters</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                 <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Bond Yield Curve Spread (2Y/10Y %)</Label>
                     <span className="text-sm font-mono">{bondYieldSpread[0]}%</span>
                  </div>
                  <Slider defaultValue={bondYieldSpread} min={-1} max={5} step={0.01} onValueChange={setBondYieldSpread} />
                </div>
                 <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Credit Spreads (%)</Label>
                     <span className="text-sm font-mono">{creditSpread[0]}%</span>
                  </div>
                  <Slider defaultValue={creditSpread} max={10} step={0.1} onValueChange={setCreditSpread} />
                </div>
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="risk-stress">
              <AccordionTrigger>Risk & Stress Testing Parameters</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                 <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Revenue Shock (%)</Label>
                     <span className="text-sm font-mono">{revenueShock[0]}%</span>
                  </div>
                  <Slider defaultValue={revenueShock} min={-50} max={50} step={5} onValueChange={setRevenueShock} />
                </div>
                 <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Cyber-Attack Downtime (days)</Label>
                     <span className="text-sm font-mono">{cyberAttackDowntime[0]}</span>
                  </div>
                  <Slider defaultValue={cyberAttackDowntime} max={30} step={1} onValueChange={setCyberAttackDowntime} />
                </div>
                 <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>ESG Penalties / Carbon Cost</Label>
                    <span className="text-sm font-mono">{(esgPenalty[0]/1000000).toFixed(1)}M</span>
                  </div>
                  <Slider defaultValue={esgPenalty} max={5000000} step={100000} onValueChange={setEsgPenalty} />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ScrollArea>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t">
          <div className="space-y-2">
            <Label htmlFor="natural-language" className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              <span>Natural Language Simulation</span>
            </Label>
            <Textarea 
              id="natural-language"
              placeholder="e.g., What's the impact if GDP growth increases by only 3% and we acquire a competitor?"
              value={naturalQuery}
              onChange={(e) => setNaturalQuery(e.target.value)}
              className="min-h-[100px] bg-background/50"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : 'Run AI Simulation'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
