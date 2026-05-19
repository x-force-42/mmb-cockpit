import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  formatAbortOrigin,
  formatCompact,
  formatDurationBetween,
  formatUSD,
} from "@/lib/format";
import { cn } from "@/lib/utils";
import type { CicloDetail } from "@/types/api";
import { CicloStatusBadge } from "./CicloStatusBadge";

interface Props {
  ciclo: CicloDetail;
}

export function CicloKpiCards({ ciclo }: Props) {
  const endTs =
    ciclo.closed_complete_at ?? ciclo.closed_partial_at ?? ciclo.abort_at;
  const isRunning = endTs == null;
  const duration = isRunning
    ? "em andamento"
    : formatDurationBetween(ciclo.planner_invoked_at, endTs);

  const tokensIn = formatCompact(ciclo.tokens_input);
  const tokensOut = formatCompact(ciclo.tokens_output);
  const tokensLabel =
    ciclo.tokens_input == null && ciclo.tokens_output == null
      ? "—"
      : `${tokensIn} / ${tokensOut}`;

  const diff =
    ciclo.diff_files == null
      ? "—"
      : `+${ciclo.diff_added ?? 0} / −${ciclo.diff_deleted ?? 0} em ${ciclo.diff_files} arquivos`;

  const prBadge =
    ciclo.merged_to_main === 1
      ? { label: "merged", className: "bg-status-success text-status-success-foreground" }
      : ciclo.pr_url
        ? { label: "aberto", className: "bg-status-warning text-status-warning-foreground" }
        : { label: "—", className: "" };

  return (
    <section
      aria-label="Indicadores do ciclo"
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
    >
      <Kpi label="Duração" value={duration} mono={!isRunning} />
      <Kpi label="Custo" value={formatUSD(ciclo.cost_usd)} mono />
      <Kpi label="Tokens (in / out)" value={tokensLabel} mono />
      <Kpi label="Diff" value={diff} />
      <Kpi
        label="Status"
        value={
          <div className="flex flex-wrap items-center gap-2">
            <CicloStatusBadge status={ciclo.status} />
            {ciclo.status === "abortado" && ciclo.abort_origin ? (
              <span className="text-xs text-muted-foreground">
                {formatAbortOrigin(ciclo.abort_origin)}
              </span>
            ) : null}
          </div>
        }
      />
      <Kpi
        label="Modelo Claude"
        value={
          ciclo.model ? (
            <span className="font-mono text-xs">{ciclo.model}</span>
          ) : (
            "—"
          )
        }
      />
      <Kpi
        label="Andaime"
        value={
          ciclo.andaime_version ? (
            <span className="font-mono text-xs">{ciclo.andaime_version}</span>
          ) : (
            "—"
          )
        }
      />
      <Kpi
        label="Pull request"
        value={
          ciclo.pr_url && ciclo.pr_number ? (
            <a
              href={ciclo.pr_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 hover:underline"
            >
              <Badge variant="secondary" className={cn(prBadge.className)}>
                {prBadge.label}
              </Badge>
              <span className="font-mono text-xs">#{ciclo.pr_number}</span>
              <ExternalLink className="size-3" aria-hidden />
            </a>
          ) : (
            <Badge variant="outline">—</Badge>
          )
        }
      />
    </section>
  );
}

function Kpi({
  label,
  value,
  mono,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <Card className="gap-1 py-3">
      <CardContent className="flex flex-col gap-1 px-3">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span
          className={cn(
            "text-base font-medium",
            mono && "font-mono tabular-nums",
          )}
        >
          {value}
        </span>
      </CardContent>
    </Card>
  );
}
