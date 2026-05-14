import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PhaseBadge } from "@/features/runs/components/PhaseBadge";
import { formatNumber } from "@/lib/format";
import type {
  PhaseBreakdown as PhaseBreakdownData,
  TerminalPhase,
} from "@/types/api";

interface Props {
  data: PhaseBreakdownData;
}

export function PhaseBreakdown({ data }: Props) {
  const entries = (Object.entries(data) as [TerminalPhase, number][])
    .filter(([, n]) => n > 0)
    .sort(([, a], [, b]) => b - a);

  const total = entries.reduce((acc, [, n]) => acc + n, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          Distribuição por fase
        </CardTitle>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Sem runs na janela selecionada.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {entries.map(([phase, count]) => {
              const pct = total > 0 ? (count / total) * 100 : 0;
              return (
                <li key={phase} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-3">
                    <PhaseBadge phase={phase} />
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
        )}
      </CardContent>
    </Card>
  );
}
