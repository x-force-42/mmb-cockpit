import { Inbox, RefreshCw, ServerCrash } from "lucide-react";
import { useMemo } from "react";
import { useCiclos } from "@/api/queries/ciclos";
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
import { Pagination } from "@/features/ciclos/components/Pagination";
import { usePersistedFilters } from "@/lib/usePersistedFilters";
import type { EpicosListQuery } from "@/types/api";
import {
  type EpicosPageFilters,
  EpicosFilters,
} from "../components/EpicosFilters";
import { EpicosTable } from "../components/EpicosTable";

const DEFAULT_LIMIT = 25;
const FILTERS_KEY = "mmb-cockpit:filters:epicos:v1";

const INITIAL_FILTERS: EpicosPageFilters = {
  limit: DEFAULT_LIMIT,
  offset: 0,
};

export function EpicosListPage() {
  const [filters, setFilters] = usePersistedFilters<EpicosPageFilters>(
    FILTERS_KEY,
    INITIAL_FILTERS,
  );

  // O filtro `project` não é nativo da API de épicos: cruzamos com ciclos
  // pra interseção client-side. TODO: mover pro backend quando logger
  // expuser `/api/epicos?project=`.
  const { project, ...apiFilters } = filters;
  const query = useEpicos(apiFilters as EpicosListQuery);
  const ciclosByProject = useCiclos(
    project ? { project, limit: 500 } : {},
  );

  const epicoIdsByProject = useMemo<Set<string> | null>(() => {
    if (!project) return null;
    const set = new Set<string>();
    for (const c of ciclosByProject.data?.items ?? []) {
      set.add(c.epico_id);
    }
    return set;
  }, [project, ciclosByProject.data]);

  const filteredItems = useMemo(() => {
    if (!query.data) return null;
    if (!epicoIdsByProject) return query.data.items;
    return query.data.items.filter((e) => epicoIdsByProject.has(e.id));
  }, [query.data, epicoIdsByProject]);

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="text-xl font-semibold">Épicos</h1>
        <p className="text-sm text-muted-foreground">
          Intenções de longo prazo do Rick agrupando múltiplos ciclos.
        </p>
      </header>

      <EpicosFilters
        filters={filters}
        onChange={setFilters}
        onClear={() => setFilters(INITIAL_FILTERS)}
      />

      {query.isLoading ? (
        <TableLoadingSkeleton />
      ) : query.isError ? (
        <EpicosError onRetry={() => query.refetch()} />
      ) : query.data && filteredItems && filteredItems.length === 0 ? (
        <EpicosEmpty />
      ) : query.data && filteredItems ? (
        <div className="flex flex-col gap-3">
          <EpicosTable epicos={filteredItems} />
          <Pagination
            total={
              epicoIdsByProject ? filteredItems.length : query.data.total
            }
            limit={query.data.limit}
            offset={query.data.offset}
            onChange={(offset) => setFilters((f) => ({ ...f, offset }))}
            emptyLabel="Nenhum épico"
          />
        </div>
      ) : null}
    </div>
  );
}

function TableLoadingSkeleton() {
  return (
    <div
      role="status"
      aria-label="Carregando épicos"
      className="flex flex-col gap-2 rounded-md border bg-background p-3"
    >
      <Skeleton className="h-9 w-full" />
      {Array.from({ length: 6 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: skeleton rows são intercambiáveis
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  );
}

function EpicosError({ onRetry }: { onRetry: () => void }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start gap-3 space-y-0">
        <ServerCrash className="size-5 shrink-0 text-destructive" aria-hidden />
        <div className="flex flex-col gap-1">
          <CardTitle>Não consegui carregar os épicos</CardTitle>
          <CardDescription>
            A API do mmb-logger pode estar fora do ar ou inacessível.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Button onClick={onRetry}>
          <RefreshCw className="size-4" aria-hidden />
          Tentar novamente
        </Button>
      </CardContent>
    </Card>
  );
}

function EpicosEmpty() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-3 py-12 text-center">
        <div
          aria-hidden
          className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground"
        >
          <Inbox className="size-7" />
        </div>
        <CardTitle className="text-base">Nenhum épico encontrado</CardTitle>
        <CardDescription className="max-w-sm">
          Limpe os filtros ou registre uma intenção nova.
        </CardDescription>
      </CardContent>
    </Card>
  );
}
