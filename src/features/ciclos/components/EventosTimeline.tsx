import {
  AlertTriangle,
  ArrowDownToLine,
  ArrowUpFromLine,
  CircleAlert,
  CircleDot,
  GitPullRequest,
  HeartCrack,
  Sparkles,
  StickyNote,
  XCircle,
} from "lucide-react";
import { useEventosCiclo } from "@/api/queries/ciclos";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateTime, formatEventoKind } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Evento, EventoKind, EventoSeverity } from "@/types/api";

interface Props {
  cicloId: string;
}

const KIND_ICON: Record<EventoKind, React.ComponentType<{ className?: string }>> = {
  state_change: CircleDot,
  msg_send: ArrowUpFromLine,
  msg_receive: ArrowDownToLine,
  heartbeat_loss: HeartCrack,
  atomic_spawn: Sparkles,
  atomic_deregister: XCircle,
  pr_opened: GitPullRequest,
  journal_warn: AlertTriangle,
  journal_error: CircleAlert,
  journal_critical: CircleAlert,
};

const SEVERITY_CLASS: Record<EventoSeverity, string> = {
  info: "text-muted-foreground",
  warn: "text-amber-600 dark:text-amber-400",
  error: "text-destructive",
  critical: "text-fuchsia-700 dark:text-fuchsia-400",
};

function severityClass(severity: EventoSeverity | null): string {
  return severity ? SEVERITY_CLASS[severity] : SEVERITY_CLASS.info;
}

function payloadSummary(evt: Evento): string {
  if (evt.kind === "state_change") {
    const from = evt.payload.from as string | null | undefined;
    const to = evt.payload.to as string | undefined;
    const origin = evt.payload.abort_origin as string | undefined;
    const arrow = `${from ?? "—"} → ${to ?? "?"}`;
    return origin ? `${arrow} (origem: ${origin})` : arrow;
  }
  if (evt.kind === "msg_send" || evt.kind === "msg_receive") {
    const from = evt.payload.from as string | undefined;
    const to = evt.payload.to as string | undefined;
    const summary = evt.payload.summary as string | undefined;
    const head = [from, to].filter(Boolean).join(" → ");
    return summary ? `${head}: ${summary}` : head;
  }
  if (evt.kind === "heartbeat_loss") {
    const agent = evt.payload.agent_id as string | undefined;
    const last = evt.payload.last_seen_at as string | undefined;
    return `agent ${agent ?? "?"} · último ping ${last ?? "?"}`;
  }
  if (evt.kind === "atomic_spawn" || evt.kind === "atomic_deregister") {
    const agent = evt.payload.agent_id as string | undefined;
    const worktree = evt.payload.worktree as string | undefined;
    const reason = evt.payload.reason as string | undefined;
    return [agent, worktree, reason].filter(Boolean).join(" · ");
  }
  if (evt.kind === "pr_opened") {
    const n = evt.payload.pr_number as number | undefined;
    const url = evt.payload.pr_url as string | undefined;
    return url ? `PR #${n} · ${url}` : `PR #${n ?? "?"}`;
  }
  if (
    evt.kind === "journal_warn" ||
    evt.kind === "journal_error" ||
    evt.kind === "journal_critical"
  ) {
    const slug = evt.payload.slug as string | undefined;
    const msg = evt.payload.msg as string | undefined;
    return [slug, msg].filter(Boolean).join(" — ");
  }
  return "";
}

export function EventosTimeline({ cicloId }: Props) {
  const query = useEventosCiclo(cicloId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Eventos</CardTitle>
      </CardHeader>
      <CardContent>
        {query.isLoading ? (
          <Skeleton className="h-32" />
        ) : query.isError ? (
          <p className="text-sm text-destructive">
            Não consegui carregar os eventos deste ciclo.
          </p>
        ) : query.data && query.data.items.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Sem eventos registrados.
          </p>
        ) : query.data ? (
          <ol className="flex flex-col gap-3">
            {query.data.items.map((evt) => {
              const Icon = KIND_ICON[evt.kind] ?? StickyNote;
              return (
                <li key={evt.id} className="flex items-start gap-3 text-sm">
                  <Icon
                    className={cn("mt-0.5 size-4 shrink-0", severityClass(evt.severity))}
                  />
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <span className="font-medium">
                        {formatEventoKind(evt.kind)}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground tabular-nums">
                        {formatDateTime(evt.ts)}
                      </span>
                    </div>
                    {payloadSummary(evt) ? (
                      <p className="break-words text-xs text-muted-foreground">
                        {payloadSummary(evt)}
                      </p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
        ) : null}
      </CardContent>
    </Card>
  );
}
