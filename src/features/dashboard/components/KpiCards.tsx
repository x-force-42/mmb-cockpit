import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber, formatPercent, formatUSD } from "@/lib/format";
import type { MetricasOverview } from "@/types/api";

interface Props {
  data: MetricasOverview;
}

interface Kpi {
  label: string;
  value: string;
}

export function KpiCards({ data }: Props) {
  const kpis: Kpi[] = [
    { label: "Total ciclos", value: formatNumber(data.ciclos_total) },
    { label: "Épicos", value: formatNumber(data.epicos_total) },
    { label: "Custo total", value: formatUSD(data.custo_total_usd) },
    { label: "Taxa de abort", value: formatPercent(data.taxa_abort) },
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
