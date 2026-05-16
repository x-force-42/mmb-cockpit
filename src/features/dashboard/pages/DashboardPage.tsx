import { useState } from "react";
import { useMetricasOverview } from "@/api/queries/metricas";
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
import { AbortBreakdown } from "../components/AbortBreakdown";
import { CiclosPorDiaChart } from "../components/CiclosPorDiaChart";
import { CustoPorDiaChart } from "../components/CustoPorDiaChart";
import { KpiCards } from "../components/KpiCards";
import { StatusBreakdown } from "../components/StatusBreakdown";

const WINDOW_OPTIONS = [7, 30, 90] as const;
type WindowDays = (typeof WINDOW_OPTIONS)[number];

export function DashboardPage() {
  const [windowDays, setWindowDays] = useState<WindowDays>(30);
  const query = useMetricasOverview(windowDays);

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Visão consolidada dos ciclos do andaime.
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
      ) : query.data && query.data.ciclos_total === 0 ? (
        <DashboardEmpty />
      ) : query.data ? (
        <div className="flex flex-col gap-4">
          <KpiCards data={query.data} />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <CiclosPorDiaChart data={query.data.ciclos_por_dia} />
            <CustoPorDiaChart data={query.data.custo_por_dia} />
          </div>
          <StatusBreakdown data={query.data.status_breakdown} />
          <AbortBreakdown data={query.data.abort_breakdown} />
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
          A API do mmb-logger pode estar fora do ar ou inacessível.
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
        <CardTitle>Sem ciclos ainda</CardTitle>
        <CardDescription>
          Nenhum ciclo na janela selecionada. Aumente o período ou aguarde o
          master invocar um planner.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
