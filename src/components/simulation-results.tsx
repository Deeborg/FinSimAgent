import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, CheckCircle, Lightbulb } from "lucide-react";
import type { SimulationResult } from "@/lib/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type SimulationResultsProps = {
  result: SimulationResult | null;
  isLoading: boolean;
  error: string | null;
};

export default function SimulationResults({ result, isLoading, error }: SimulationResultsProps) {
  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
       <Card className="glass h-full flex flex-col">
        <CardHeader>
          <CardTitle>Simulation Analysis</CardTitle>
          <CardDescription>An error occurred during the simulation.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
           <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return <InitialState />;
  }

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle>Simulation Analysis</CardTitle>
        <CardDescription>Analysis and suggestions based on your query.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><CheckCircle className="text-positive" /> Impact Analysis</h3>
          <p className="text-sm text-foreground/80 whitespace-pre-wrap">{result.simulationAnalysis}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><Lightbulb className="text-suggestion" /> Strategic Suggestions</h3>
          <p className="text-sm text-foreground/80 whitespace-pre-wrap">{result.suggestions}</p>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-2 text-foreground/60">Simulation Parameters:</h4>
          <p className="text-xs text-foreground/50 font-mono bg-muted/50 p-2 rounded-md">{result.simulationParameters}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button>Save Simulation</Button>
      </CardFooter>
    </Card>
  );
}

function InitialState() {
  return (
    <Card className="glass h-full flex flex-col items-center justify-center">
       <CardHeader>
        <CardTitle>Simulation Analysis</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-muted-foreground">Your simulation analysis will appear here.</p>
      </CardContent>
    </Card>
  );
}

function LoadingState() {
  return (
    <Card className="glass">
      <CardHeader>
        <Skeleton className="h-8 w-3/5" />
        <Skeleton className="h-4 w-4/5" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-16 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-16 w-full" />
        </div>
      </CardContent>
      <CardFooter>
          <Skeleton className="h-10 w-32" />
      </CardFooter>
    </Card>
  );
}
