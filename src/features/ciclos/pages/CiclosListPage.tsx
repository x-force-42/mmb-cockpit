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
import { usePersistedFilters } from "@/lib/usePersistedFilters";
import type { CiclosListOrder, CiclosListQuery } from "@/types/api";
import { CiclosFilters } from "../components/CiclosFilters";
import { CiclosTable } from "../components/CiclosTable";
import { Pagination } from "../components/Pagination";

const DEFAULT_LIMIT = 25;
const FILTERS_KEY = "mmb-cockpit:filters:ciclos:v1";

const INITIAL_FILTERS: CiclosListQuery = {
  limit: DEFAULT_LIMIT,
  offset: 0,
  order: "planner_invoked_at:desc",
};

export function CiclosListPage() {
  const [filters, setFilters] = usePersistedFilters<CiclosListQuery>(
    FILTERS_KEY,
    INITIAL_FILTERS,
  );
  const query = useCiclos(filters);
  const epicosQuery = useEpicos();

  const epicoSlugById = useMemo(() => {
    const map: Record<string, string> = {};
    for (const e of epicosQuery.data?.items ?? []) {
      map[e.id] = e.slug;
    }
    return map;
  }, [epicosQuery.data]);

  const toggleDateOrder = () => {
    const next: CiclosListOrder =
      filters.order === "planner_invoked_at:desc"
        ? "planner_invoked_at:asc"
        : "planner_invoked_at:desc";
    setFilters((f) => ({ ...f, order: next, offset: 0 }));
  };

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="text-xl font-semibold">Ciclos</h1>
        <p className="text-sm text-muted-foreground">
          Cada ciclo é uma invocação do planner orquestrada pelo master.
        </p>
      </header>

      <CiclosFilters
        filters={filters}
        onChange={setFilters}
        onClear={() => setFilters(INITIAL_FILTERS)}
      />

      {query.isLoading ? (
        <TableLoadingSkeleton />
      ) : query.isError ? (
        <CiclosError onRetry={() => query.refetch()} />
      ) : query.data && query.data.items.length === 0 ? (
        <CiclosEmpty />
      ) : query.data ? (
        <div className="flex flex-col gap-3">
          <CiclosTable
            ciclos={query.data.items}
            order={filters.order ?? "planner_invoked_at:desc"}
            onToggleDateOrder={toggleDateOrder}
            epicoSlugById={epicoSlugById}
          />
          <Pagination
            total={query.data.total}
            limit={query.data.limit}
            offset={query.data.offset}
            onChange={(offset) => setFilters((f) => ({ ...f, offset }))}
            emptyLabel="Nenhum ciclo"
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
      aria-label="Carregando ciclos"
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

function CiclosError({ onRetry }: { onRetry: () => void }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start gap-3 space-y-0">
        <ServerCrash className="size-5 shrink-0 text-destructive" aria-hidden />
        <div className="flex flex-col gap-1">
          <CardTitle>Não consegui carregar os ciclos</CardTitle>
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

function CiclosEmpty() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-3 py-12 text-center">
        <div
          aria-hidden
          className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground"
        >
          <Inbox className="size-7" />
        </div>
        <CardTitle className="text-base">Nenhum ciclo encontrado</CardTitle>
        <CardDescription className="max-w-sm">
          Limpe os filtros ou aguarde o master invocar um planner.
        </CardDescription>
      </CardContent>
    </Card>
  );
}
