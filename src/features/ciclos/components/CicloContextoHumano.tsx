import { useState } from "react";
import { Link } from "react-router-dom";
import { useEpico } from "@/api/queries/epicos";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { CicloDetail } from "@/types/api";

const BRIEFING_PREVIEW_CHARS = 600;

interface Props {
  ciclo: CicloDetail;
}

export function CicloContextoHumano({ ciclo }: Props) {
  const epicoQuery = useEpico(ciclo.epico_id);
  const epico = epicoQuery.data;

  const briefing = ciclo.briefing_md ?? "";
  const needsExpansion = briefing.length > BRIEFING_PREVIEW_CHARS;
  const [expanded, setExpanded] = useState(false);
  const shown =
    !needsExpansion || expanded
      ? briefing
      : `${briefing.slice(0, BRIEFING_PREVIEW_CHARS).trimEnd()}…`;

  return (
    <Card>
      <CardContent className="flex flex-col gap-3 px-4">
        <ContextLine label="Projeto">
          <span className="font-mono text-xs">{ciclo.project}</span>
        </ContextLine>

        <ContextLine label="Épico">
          {epico ? (
            <Link
              to={`/epicos/${epico.id}`}
              className="font-medium hover:underline"
            >
              {epico.intencao || epico.slug}
            </Link>
          ) : epicoQuery.isLoading ? (
            <span className="text-muted-foreground">Carregando…</span>
          ) : (
            <span className="font-mono text-xs text-muted-foreground">
              {ciclo.epico_id}
            </span>
          )}
        </ContextLine>

        <ContextLine label="Instrução">
          <span>{ciclo.instruction}</span>
        </ContextLine>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-muted-foreground">Briefing</span>
          {briefing ? (
            <pre
              data-testid="ciclo-briefing"
              className="overflow-x-auto rounded-md bg-muted p-3 text-sm leading-relaxed whitespace-pre-wrap"
            >
              {shown}
            </pre>
          ) : (
            <p className="text-sm text-muted-foreground">
              Sem briefing registrado.
            </p>
          )}
          {needsExpansion ? (
            <Button
              variant="ghost"
              size="sm"
              className="w-fit"
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? "Ocultar" : "Ver completo"}
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

function ContextLine({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="text-sm">{children}</div>
    </div>
  );
}
