import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  formatDuration,
  formatNumber,
  formatPercent,
  formatUSD,
} from "@/lib/format";
import type { MetricsOverview } from "@/types/api";

interface Props {
  data: MetricsOverview;
}

interface Kpi {
  label: string;
  value: string;
}

export function KpiCards({ data }: Props) {
  const kpis: Kpi[] = [
    { label: "Total de runs", value: formatNumber(data.runs_total) },
    { label: "Custo total", value: formatUSD(data.custo_total_usd) },
    { label: "Tempo médio", value: formatDuration(data.tempo_medio_s) },
    { label: "Taxa de pushback", value: formatPercent(data.taxa_pushback) },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <Card key={kpi.label}>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-normal text-muted-foreground">
              {kpi.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{kpi.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
