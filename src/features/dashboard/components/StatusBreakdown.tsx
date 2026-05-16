import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CicloStatusBadge } from "@/features/ciclos/components/CicloStatusBadge";
import { formatNumber } from "@/lib/format";
import type {
  CicloStatus,
  StatusBreakdown as StatusBreakdownData,
} from "@/types/api";

interface Props {
  data: StatusBreakdownData;
}

// Renderiza todos os 5 status, mesmo zerados (decisão #10).
const STATUS_ORDER: CicloStatus[] = [
  "iniciado",
  "planejado",
  "pr_aberto",
  "completo",
  "abortado",
];

export function StatusBreakdown({ data }: Props) {
  const total = STATUS_ORDER.reduce((acc, s) => acc + (data[s] ?? 0), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          Distribuição por status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-3">
          {STATUS_ORDER.map((status) => {
            const count = data[status] ?? 0;
            const pct = total > 0 ? (count / total) * 100 : 0;
            return (
              <li key={status} className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-3">
                  <CicloStatusBadge status={status} />
                  <span className="font-mono text-sm tabular-nums">
                    {formatNumber(count)}
                    <span className="ml-2 text-muted-foreground">
                      ({pct.toFixed(1)}%)
                    </span>
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
