import {
  AlertTriangle,
  Ban,
  Clock,
  Cpu,
  HeartCrack,
  TimerOff,
  UserX,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatAbortOrigin, formatDateTime } from "@/lib/format";
import type { AbortOrigin, CicloDetail } from "@/types/api";

interface Props {
  ciclo: CicloDetail;
}

const ORIGIN_ICON: Record<
  AbortOrigin,
  React.ComponentType<{ className?: string }>
> = {
  heartbeat: HeartCrack,
  manual: UserX,
  self: Ban,
  master: Cpu,
  "worker-exit": XCircle,
  "worker-timeout": TimerOff,
  stale: Clock,
};

export function AbortCard({ ciclo }: Props) {
  if (ciclo.status !== "abortado" || !ciclo.abort_origin) return null;
  const Icon = ORIGIN_ICON[ciclo.abort_origin] ?? AlertTriangle;

  return (
    <Card className="border-destructive/40 bg-destructive/5">
      <CardHeader className="flex flex-row items-start gap-3 space-y-0">
        <Icon className="size-5 shrink-0 text-destructive" aria-hidden />
        <div className="flex flex-col gap-0.5">
          <CardTitle className="text-sm font-semibold text-destructive">
            Ciclo abortado · {formatAbortOrigin(ciclo.abort_origin)}
          </CardTitle>
          {ciclo.abort_at ? (
            <span className="text-xs text-muted-foreground">
              {formatDateTime(ciclo.abort_at)}
            </span>
          ) : null}
        </div>
      </CardHeader>
      <CardContent>
        {ciclo.abort_reason ? (
          <p className="text-sm leading-relaxed">{ciclo.abort_reason}</p>
        ) : (
          <p className="text-sm text-muted-foreground">Sem razão registrada.</p>
        )}
      </CardContent>
    </Card>
  );
}
