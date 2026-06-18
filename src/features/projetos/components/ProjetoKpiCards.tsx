import {
  Activity,
  CircleDollarSign,
  type LucideIcon,
  Timer,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDuration, formatNumber, formatUSD } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ProjetoMetricas } from "@/types/api";

interface Props {
  data: ProjetoMetricas;
}

interface Kpi {
  label: string;
  value: string;
  icon: LucideIcon;
  accent: string;
}

export function ProjetoKpiCards({ data }: Props) {
  const kpis: Kpi[] = [
    {
      label: "Custo total",
      value: formatUSD(data.custo_total_usd),
      icon: CircleDollarSign,
      accent: "text-kpi-custo",
    },
    {
      label: "Ciclos",
      value: formatNumber(data.ciclos_count),
      icon: Activity,
      accent: "text-kpi-ciclos",
    },
    {
      label: "Tempo médio por ciclo",
      value: formatDuration(data.tempo_medio_ciclo_segundos),
      icon: Timer,
      accent: "text-kpi-epicos",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <Card
            key={kpi.label}
            className="shadow-xs transition-shadow hover:shadow-sm"
          >
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-xs font-normal text-muted-foreground">
                {kpi.label}
              </CardTitle>
              <Icon className={cn("size-4", kpi.accent)} aria-hidden />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold tabular-nums">
                {kpi.value}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
