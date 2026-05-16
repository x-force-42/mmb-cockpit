import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime, formatNumber, formatUSD } from "@/lib/format";
import type { CicloDetail } from "@/types/api";
import { CicloStatusBadge } from "./CicloStatusBadge";

interface Props {
  ciclo: CicloDetail;
}

export function CicloMetadata({ ciclo }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Metadados</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
          <Field label="Instrução">
            <span className="font-medium">{ciclo.instruction}</span>
          </Field>
          <Field label="Status">
            <CicloStatusBadge status={ciclo.status} />
          </Field>
          <Field label="Projeto">{ciclo.project}</Field>
          <Field label="ID do ciclo">
            <span className="font-mono text-xs">{ciclo.id}</span>
          </Field>
          <Field label="Planner invocado em">
            {formatDateTime(ciclo.planner_invoked_at)}
          </Field>
          <Field label="Fechamento (parcial)">
            {ciclo.closed_partial_at
              ? formatDateTime(ciclo.closed_partial_at)
              : "—"}
          </Field>
          <Field label="Fechamento (completo)">
            {ciclo.closed_complete_at
              ? formatDateTime(ciclo.closed_complete_at)
              : "—"}
          </Field>
          <Field label="Custo">{formatUSD(ciclo.cost_usd)}</Field>
          <Field label="Tokens (in / out)">
            {ciclo.tokens_input == null && ciclo.tokens_output == null
              ? "—"
              : `${formatNumber(ciclo.tokens_input)} / ${formatNumber(ciclo.tokens_output)}`}
          </Field>
          <Field label="Diff">
            {ciclo.diff_files == null
              ? "—"
              : `${ciclo.diff_files} arquivos · +${ciclo.diff_added ?? 0} / -${ciclo.diff_deleted ?? 0}`}
          </Field>
          <Field label="Pull request">
            {ciclo.pr_url && ciclo.pr_number ? (
              <a
                href={ciclo.pr_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-mono text-xs hover:underline"
              >
                #{ciclo.pr_number}
                <ExternalLink className="size-3" />
              </a>
            ) : (
              "—"
            )}
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
