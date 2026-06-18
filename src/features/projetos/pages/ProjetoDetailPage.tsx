import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ApiError } from "@/api/client";
import { useCiclos } from "@/api/queries/ciclos";
import { useEpicos } from "@/api/queries/epicos";
import { useProjetoMetricas, useProjetos } from "@/api/queries/projetos";
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
import { formatAbortOrigin, formatCicloStatus } from "@/lib/format";
import type { AbortOrigin, CicloStatus } from "@/types/api";
import { ProjetoBreakdown } from "../components/ProjetoBreakdown";
import { ProjetoKpiCards } from "../components/ProjetoKpiCards";

export function ProjetoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const projetosQuery = useProjetos();
  const metricasQuery = useProjetoMetricas(id);

  const projeto = useMemo(
    () => projetosQuery.data?.items.find((p) => p.id === id) ?? null,
    [projetosQuery.data, id],
  );

  const ciclosQuery = useCiclos(
    projeto ? { project: projeto.slug, limit: 200 } : {},
  );
  const epicosQuery = useEpicos();

  const epicoSlugById = useMemo(() => {
    const map: Record<string, string> = {};
    for (const e of epicosQuery.data?.items ?? []) {
      map[e.id] = e.slug;
    }
    return map;
  }, [epicosQuery.data]);

  if (projetosQuery.isLoading || metricasQuery.isLoading) {
    return <DetailSkeleton />;
  }

  if (metricasQuery.isError) {
    const status =
      metricasQuery.error instanceof ApiError
        ? metricasQuery.error.status
        : undefined;
    if (status === 404) return <NotFound />;
    return <GenericError onRetry={() => metricasQuery.refetch()} />;
  }

  if (!projeto || !metricasQuery.data) return <NotFound />;

  const metricas = metricasQuery.data;

  return (
    <div className="flex flex-col gap-4">
      <Breadcrumb name={projeto.name} />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            {projeto.name}
          </CardTitle>
          <CardDescription className="font-mono text-xs">
            {projeto.slug}
            {projeto.repo_url ? (
              <>
                {" · "}
                <a
                  href={projeto.repo_url}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline"
                >
                  {projeto.repo_url.replace(/^https?:\/\//, "")}
                </a>
              </>
            ) : null}
          </CardDescription>
        </CardHeader>
      </Card>

      <ProjetoKpiCards data={metricas} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ProjetoBreakdown
          title="Distribuição por status"
          data={metricas.status_breakdown}
          labelFor={(k) => formatCicloStatus(k as CicloStatus)}
          emptyLabel="Sem ciclos registrados."
        />
        <ProjetoBreakdown
          title="Origem dos aborts"
          data={metricas.abort_breakdown}
          labelFor={(k) => formatAbortOrigin(k as AbortOrigin)}
          emptyLabel="Nenhum abort registrado."
        />
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium">Ciclos deste projeto</h2>
        {ciclosQuery.isLoading ? (
          <Skeleton className="h-40" />
        ) : ciclosQuery.data && ciclosQuery.data.items.length > 0 ? (
          <CiclosTable
            ciclos={ciclosQuery.data.items}
            epicoSlugById={epicoSlugById}
          />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Sem ciclos registrados</CardTitle>
              <CardDescription>
                Este projeto ainda não rodou nenhum ciclo.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </section>
    </div>
  );
}

function Breadcrumb({ name }: { name: string }) {
  return (
    <nav className="text-sm text-muted-foreground" aria-label="breadcrumb">
      <Link to="/projetos" className="hover:text-foreground">
        Projetos
      </Link>
      <span className="px-1">›</span>
      <span className="font-mono text-xs">{name}</span>
    </nav>
  );
}

function DetailSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-4 w-64" />
      <Skeleton className="h-20" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>
      <Skeleton className="h-60" />
    </div>
  );
}

function NotFound() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Projeto não encontrado</CardTitle>
        <CardDescription>
          Talvez o id esteja errado ou o projeto foi removido.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild variant="outline">
          <Link to="/projetos">Voltar para a lista</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function GenericError({ onRetry }: { onRetry: () => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Não consegui carregar este projeto</CardTitle>
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
