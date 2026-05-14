import { useState } from "react";
import { useMetricsOverview } from "@/api/queries/metrics";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { CustoPorDiaChart } from "../components/CustoPorDiaChart";
import { KpiCards } from "../components/KpiCards";
import { PhaseBreakdown } from "../components/PhaseBreakdown";
import { RunsPorDiaChart } from "../components/RunsPorDiaChart";

const WINDOW_OPTIONS = [7, 30, 90] as const;
type WindowDays = (typeof WINDOW_OPTIONS)[number];

export function DashboardPage() {
  const [windowDays, setWindowDays] = useState<WindowDays>(30);
  const query = useMetricsOverview(windowDays);

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Visão consolidada das últimas runs do MMB.
          </p>
        </div>
        <Select
          value={String(windowDays)}
          onValueChange={(v) => setWindowDays(Number(v) as WindowDays)}
        >
          <SelectTrigger className="w-44" aria-label="Janela de tempo">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {WINDOW_OPTIONS.map((d) => (
              <SelectItem key={d} value={String(d)}>
                Últimos {d} dias
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </header>

      {query.isLoading ? (
        <DashboardSkeleton />
      ) : query.isError ? (
        <DashboardError onRetry={() => query.refetch()} />
      ) : query.data && query.data.runs_total === 0 ? (
        <DashboardEmpty />
      ) : query.data ? (
        <div className="flex flex-col gap-4">
          <KpiCards data={query.data} />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <RunsPorDiaChart data={query.data.runs_por_dia} />
            <CustoPorDiaChart data={query.data.custo_por_dia} />
          </div>
          <PhaseBreakdown data={query.data.phase_breakdown} />
        </div>
      ) : null}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Skeleton className="h-72" />
        <Skeleton className="h-72" />
      </div>
      <Skeleton className="h-40" />
    </div>
  );
}

function DashboardError({ onRetry }: { onRetry: () => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Não consegui carregar as métricas</CardTitle>
        <CardDescription>
          A API do MMB pode estar fora do ar ou inacessível.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={onRetry}>Tentar de novo</Button>
      </CardContent>
    </Card>
  );
}

function DashboardEmpty() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sem dados ainda</CardTitle>
        <CardDescription>
          Nenhuma run registrada na janela selecionada. Aumente o período ou
          rode alguma task no MMB.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
