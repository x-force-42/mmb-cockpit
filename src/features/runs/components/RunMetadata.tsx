import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime, formatDuration, formatUSD } from "@/lib/format";
import type { RunDetail } from "@/types/api";
import { PhaseBadge } from "./PhaseBadge";

interface Props {
  run: RunDetail;
}

function totalCost(run: RunDetail): number | null {
  const g = run.garagem_cost_usd ?? 0;
  const m = run.meeseeks_cost_usd ?? 0;
  if (run.garagem_cost_usd == null && run.meeseeks_cost_usd == null) {
    return null;
  }
  return g + m;
}

export function RunMetadata({ run }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Metadados</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
          <Field label="Tarefa">
            <span className="font-medium">{run.task_raw}</span>
          </Field>
          <Field label="Fase terminal">
            <PhaseBadge phase={run.terminal_phase} />
          </Field>
          <Field label="Projeto">{run.project_slug}</Field>
          <Field label="ID da run">
            <span className="font-mono text-xs">{run.id}</span>
          </Field>
          <Field label="Início">{formatDateTime(run.started_at)}</Field>
          <Field label="Fim">
            {run.finished_at ? formatDateTime(run.finished_at) : "—"}
          </Field>
          <Field label="Duração total">
            {formatDuration(run.total_elapsed_s)}
          </Field>
          <Field label="Custo total">{formatUSD(totalCost(run))}</Field>
          <Field label="Garagem">
            {run.garagem_outcome ?? "—"} ·{" "}
            {formatDuration(run.garagem_elapsed_s)}
            {" · "}
            {formatUSD(run.garagem_cost_usd)}
          </Field>
          <Field label="Meeseeks">
            {run.meeseeks_outcome ?? "—"} ·{" "}
            {formatDuration(run.meeseeks_elapsed_s)} ·{" "}
            {formatUSD(run.meeseeks_cost_usd)}
          </Field>
        </dl>
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}
