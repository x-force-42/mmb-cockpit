import {
  Activity,
  CircleDollarSign,
  type LucideIcon,
  Target,
  TrendingDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber, formatPercent, formatUSD } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { MetricasOverview } from "@/types/api";

interface Props {
  data: MetricasOverview;
}

interface Kpi {
  label: string;
  value: string;
  icon: LucideIcon;
  accent: string;
}

export function KpiCards({ data }: Props) {
  const kpis: Kpi[] = [
    {
      label: "Total ciclos",
      value: formatNumber(data.ciclos_total),
      icon: Activity,
      accent: "text-kpi-ciclos",
    },
    {
      label: "Épicos",
      value: formatNumber(data.epicos_total),
      icon: Target,
      accent: "text-kpi-epicos",
    },
    {
      label: "Custo total",
      value: formatUSD(data.custo_total_usd),
      icon: CircleDollarSign,
      accent: "text-kpi-custo",
    },
    {
      label: "Taxa de abort",
      value: formatPercent(data.taxa_abort),
      icon: TrendingDown,
      accent: "text-kpi-abort",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
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
