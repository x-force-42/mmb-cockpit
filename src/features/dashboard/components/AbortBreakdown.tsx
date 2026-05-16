import {
  Ban,
  Clock,
  Cpu,
  HeartCrack,
  TimerOff,
  UserX,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatAbortOrigin, formatNumber } from "@/lib/format";
import type {
  AbortBreakdown as AbortBreakdownData,
  AbortOrigin,
} from "@/types/api";

interface Props {
  data: AbortBreakdownData;
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

const ORIGIN_ORDER: AbortOrigin[] = [
  "heartbeat",
  "manual",
  "self",
  "master",
  "worker-exit",
  "worker-timeout",
  "stale",
];

export function AbortBreakdown({ data }: Props) {
  const total = ORIGIN_ORDER.reduce((acc, o) => acc + (data[o] ?? 0), 0);
  if (total === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Origem dos aborts</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {ORIGIN_ORDER.map((origin) => {
            const count = data[origin] ?? 0;
            if (count === 0) return null;
            const Icon = ORIGIN_ICON[origin];
            return (
              <li
                key={origin}
                className="flex items-center gap-3 rounded-md border bg-background px-3 py-2 text-sm"
              >
                <Icon className="size-4 text-destructive" aria-hidden />
                <span className="flex-1">{formatAbortOrigin(origin)}</span>
                <span className="font-mono tabular-nums">
                  {formatNumber(count)}
                </span>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
