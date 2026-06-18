import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/format";

interface Props {
  title: string;
  data: Record<string, number>;
  labelFor?: (key: string) => string;
  emptyLabel: string;
}

export function ProjetoBreakdown({ title, data, labelFor, emptyLabel }: Props) {
  const entries = Object.entries(data).filter(([, v]) => v > 0);
  const total = entries.reduce((acc, [, v]) => acc + v, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <p className="text-sm text-muted-foreground">{emptyLabel}</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {entries.map(([key, count]) => {
              const pct = total > 0 ? (count / total) * 100 : 0;
              return (
                <li key={key} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm">
                      {labelFor ? labelFor(key) : key}
                    </span>
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
