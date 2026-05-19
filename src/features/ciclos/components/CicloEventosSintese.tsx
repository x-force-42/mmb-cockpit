import {
  AlertOctagon,
  AlertTriangle,
  CircleAlert,
  Mail,
  Sparkles,
} from "lucide-react";
import { useMemo } from "react";
import { useEventosCiclo } from "@/api/queries/ciclos";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface Props {
  cicloId: string;
}

type Tone = "info" | "warn" | "error" | "critical";

const TONE_CLASS: Record<Tone, string> = {
  info: "bg-muted/50 text-foreground",
  warn:
    "bg-amber-50 text-amber-900 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:ring-amber-900/60",
  error:
    "bg-destructive/10 text-destructive ring-destructive/30",
  critical:
    "bg-fuchsia-100 text-fuchsia-900 ring-fuchsia-300 dark:bg-fuchsia-950/40 dark:text-fuchsia-200 dark:ring-fuchsia-900/60",
};

export function CicloEventosSintese({ cicloId }: Props) {
  const query = useEventosCiclo(cicloId);

  const counts = useMemo(() => {
    const items = query.data?.items ?? [];
    let msg = 0;
    let atomic = 0;
    let warn = 0;
    let error = 0;
    let critical = 0;
    for (const e of items) {
      if (e.kind === "msg_send" || e.kind === "msg_receive") msg += 1;
      else if (e.kind === "atomic_spawn") atomic += 1;
      else if (e.kind === "journal_warn") warn += 1;
      else if (e.kind === "journal_error") error += 1;
      else if (e.kind === "journal_critical") critical += 1;
    }
    return { msg, atomic, warn, error, critical };
  }, [query.data]);

  if (query.isLoading) {
    return (
      <section aria-label="Síntese de eventos">
        <Skeleton className="h-16 w-full" />
      </section>
    );
  }
  if (query.isError) {
    return (
      <section aria-label="Síntese de eventos">
        <p className="text-sm text-destructive">
          Não consegui carregar a síntese de eventos.
        </p>
      </section>
    );
  }

  return (
    <section
      aria-label="Síntese de eventos"
      className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5"
    >
      <CountCard
        tone="info"
        Icon={Mail}
        label="Mensagens"
        value={counts.msg}
      />
      <CountCard
        tone="info"
        Icon={Sparkles}
        label="Atômicos"
        value={counts.atomic}
      />
      <CountCard
        tone="warn"
        Icon={AlertTriangle}
        label="Warns"
        value={counts.warn}
      />
      <CountCard
        tone="error"
        Icon={CircleAlert}
        label="Errors"
        value={counts.error}
      />
      {counts.critical > 0 ? (
        <CountCard
          tone="critical"
          Icon={AlertOctagon}
          label="Críticos"
          value={counts.critical}
        />
      ) : null}
    </section>
  );
}

function CountCard({
  tone,
  Icon,
  label,
  value,
}: {
  tone: Tone;
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
}) {
  return (
    <Card
      data-tone={tone}
      className={cn("gap-1 py-3 ring-1 ring-foreground/10", TONE_CLASS[tone])}
    >
      <CardContent className="flex items-center gap-2 px-3">
        <Icon className="size-4 shrink-0" aria-hidden />
        <div className="flex flex-col">
          <span className="text-xs opacity-80">{label}</span>
          <span className="text-base font-semibold tabular-nums">{value}</span>
        </div>
      </CardContent>
    </Card>
  );
}
