import { Link, useParams } from "react-router-dom";
import { ApiError } from "@/api/client";
import { useCiclo } from "@/api/queries/ciclos";
import { useEpicos } from "@/api/queries/epicos";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { CicloDetail } from "@/types/api";
import { AbortCard } from "../components/AbortCard";
import { CicloContextoHumano } from "../components/CicloContextoHumano";
import { CicloEventosSintese } from "../components/CicloEventosSintese";
import { CicloKpiCards } from "../components/CicloKpiCards";
import { CicloReviewForm } from "../components/CicloReviewForm";
import { EventosTimeline } from "../components/EventosTimeline";

export function CicloDetailPage() {
  const { id } = useParams<{ id: string }>();
  const query = useCiclo(id);
  const epicosQuery = useEpicos();

  if (query.isLoading) return <DetailSkeleton />;

  if (query.isError) {
    const status =
      query.error instanceof ApiError ? query.error.status : undefined;
    if (status === 404) return <NotFound />;
    return <GenericError onRetry={() => query.refetch()} />;
  }

  const ciclo = query.data;
  if (!ciclo) return <NotFound />;

  const epicoSlug =
    epicosQuery.data?.items.find((e) => e.id === ciclo.epico_id)?.slug ?? null;

  return (
    <div className="flex flex-col gap-4">
      <Breadcrumb ciclo={ciclo} epicoSlug={epicoSlug} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex flex-col gap-4">
          <CicloKpiCards ciclo={ciclo} />

          <CicloEventosSintese cicloId={ciclo.id} />

          <CicloContextoHumano ciclo={ciclo} />

          {ciclo.status === "abortado" ? <AbortCard ciclo={ciclo} /> : null}

          <EventosTimeline cicloId={ciclo.id} />
        </div>

        <aside className="lg:sticky lg:top-4 lg:self-start">
          <CicloReviewForm ciclo={ciclo} />
        </aside>
      </div>
    </div>
  );
}

function Breadcrumb({
  ciclo,
  epicoSlug,
}: {
  ciclo: CicloDetail;
  epicoSlug: string | null;
}) {
  return (
    <nav className="text-sm text-muted-foreground" aria-label="breadcrumb">
      <Link to="/ciclos" className="hover:text-foreground">
        Ciclos
      </Link>
      <span className="px-1">›</span>
      {epicoSlug ? (
        <Link
          to={`/epicos/${ciclo.epico_id}`}
          className="hover:text-foreground"
        >
          {epicoSlug}
        </Link>
      ) : (
        <span>{ciclo.epico_id.slice(0, 8)}</span>
      )}
      <span className="px-1">›</span>
      <span className="font-mono text-xs">{ciclo.id.slice(0, 8)}</span>
    </nav>
  );
}

function DetailSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-4 w-64" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders intercambiáveis
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
      <Skeleton className="h-16" />
      <Skeleton className="h-40" />
    </div>
  );
}

function NotFound() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ciclo não encontrado</CardTitle>
        <CardDescription>
          Talvez o id esteja errado ou o ciclo foi removido.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild variant="outline">
          <Link to="/ciclos">Voltar para a lista</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function GenericError({ onRetry }: { onRetry: () => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Não consegui carregar este ciclo</CardTitle>
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
