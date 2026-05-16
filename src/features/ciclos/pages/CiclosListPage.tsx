import { useMemo, useState } from "react";
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
import type { CiclosListOrder, CiclosListQuery } from "@/types/api";
import { CiclosFilters } from "../components/CiclosFilters";
import { CiclosTable } from "../components/CiclosTable";
import { Pagination } from "../components/Pagination";

const DEFAULT_LIMIT = 25;

const INITIAL_FILTERS: CiclosListQuery = {
  limit: DEFAULT_LIMIT,
  offset: 0,
  order: "planner_invoked_at:desc",
};

export function CiclosListPage() {
  const [filters, setFilters] = useState<CiclosListQuery>(INITIAL_FILTERS);
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
        <Skeleton className="h-96" />
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

function CiclosError({ onRetry }: { onRetry: () => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Não consegui carregar os ciclos</CardTitle>
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

function CiclosEmpty() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nenhum ciclo encontrado</CardTitle>
        <CardDescription>
          Limpe os filtros ou aguarde o master invocar um planner.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
