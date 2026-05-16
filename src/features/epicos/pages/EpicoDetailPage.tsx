import { Link, useParams } from "react-router-dom";
import { ApiError } from "@/api/client";
import { useEpico } from "@/api/queries/epicos";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CiclosTable } from "@/features/ciclos/components/CiclosTable";
import { formatDateTime } from "@/lib/format";
import type { EpicoDetail } from "@/types/api";
import { EpicoStatusBadge } from "../components/EpicoStatusBadge";

export function EpicoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const query = useEpico(id);

  if (query.isLoading) return <DetailSkeleton />;

  if (query.isError) {
    const status =
      query.error instanceof ApiError ? query.error.status : undefined;
    if (status === 404) return <NotFound />;
    return <GenericError onRetry={() => query.refetch()} />;
  }

  const epico = query.data;
  if (!epico) return <NotFound />;

  return (
    <div className="flex flex-col gap-4">
      <Breadcrumb epico={epico} />
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-3">
            <CardTitle className="text-lg font-semibold">
              {epico.slug}
            </CardTitle>
            <EpicoStatusBadge status={epico.status} />
          </div>
          <CardDescription className="font-mono text-xs">
            Iniciado em {formatDateTime(epico.started_at)}
            {epico.closed_at
              ? ` · Fechado em ${formatDateTime(epico.closed_at)}`
              : ""}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              Intenção
            </div>
            <p className="mt-1 text-sm leading-relaxed">{epico.intencao}</p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span>
              <strong className="font-medium text-foreground">
                {epico.ciclos_total}
              </strong>{" "}
              ciclos
            </span>
            <span>
              <strong className="font-medium text-foreground">
                {epico.ciclos_completos}
              </strong>{" "}
              completos
            </span>
            {epico.ciclos_abortados > 0 ? (
              <span className="text-destructive">
                <strong className="font-medium">
                  {epico.ciclos_abortados}
                </strong>{" "}
                abortados
              </span>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium">Ciclos deste épico</h2>
        {epico.ciclos.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Sem ciclos registrados</CardTitle>
              <CardDescription>
                Este épico ainda não rodou nenhum ciclo.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <CiclosTable ciclos={epico.ciclos} hideEpicoColumn />
        )}
      </section>
    </div>
  );
}

function Breadcrumb({ epico }: { epico: EpicoDetail }) {
  return (
    <nav className="text-sm text-muted-foreground" aria-label="breadcrumb">
      <Link to="/epicos" className="hover:text-foreground">
        Épicos
      </Link>
      <span className="px-1">›</span>
      <span className="font-mono text-xs">{epico.slug}</span>
    </nav>
  );
}

function DetailSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-4 w-64" />
      <Skeleton className="h-40" />
      <Skeleton className="h-72" />
    </div>
  );
}

function NotFound() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Épico não encontrado</CardTitle>
        <CardDescription>
          Talvez o id esteja errado ou o épico foi removido.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild variant="outline">
          <Link to="/epicos">Voltar para a lista</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function GenericError({ onRetry }: { onRetry: () => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Não consegui carregar este épico</CardTitle>
        <CardDescription>
          A API do mmb-logger pode estar fora do ar ou inacessível.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={onRetry}>Tentar de novo</Button>
      </CardContent>
    </Card>
  );
}
