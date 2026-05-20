import {
  Bot,
  CircleCheck,
  CircleDollarSign,
  Clock,
  Cpu,
  ExternalLink,
  GitBranch,
  GitCompare,
  GitPullRequest,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
      <Kpi label="Duração" value={duration} icon={Clock} mono={!isRunning} />
      <Kpi
        label="Custo"
        value={formatUSD(ciclo.cost_usd)}
        icon={CircleDollarSign}
        accent="text-kpi-custo"
        mono
      />
      <Kpi label="Tokens (in / out)" value={tokensLabel} icon={Cpu} mono />
      <Kpi label="Diff" value={diff} icon={GitCompare} />
      <Kpi
        label="Status"
        icon={CircleCheck}
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
        icon={Bot}
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
        icon={GitBranch}
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
        icon={GitPullRequest}
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
  icon: Icon,
  accent,
  mono,
}: {
  label: string;
  value: React.ReactNode;
  icon: LucideIcon;
  accent?: string;
  mono?: boolean;
}) {
  return (
    <Card className="gap-1 py-3">
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 px-3 pb-1">
        <CardTitle className="text-xs font-normal text-muted-foreground">
          {label}
        </CardTitle>
        <Icon className={cn("size-4", accent ?? "text-muted-foreground")} aria-hidden />
      </CardHeader>
      <CardContent className="px-3 pt-0">
        <div
          className={cn(
            "text-base font-medium",
            mono && "font-mono tabular-nums",
          )}
        >
          {value}
        </div>
      </CardContent>
    </Card>
  );
}
