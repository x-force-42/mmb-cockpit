import { useState } from "react";
import { useRuns } from "@/api/queries/runs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { RunsListOrder, RunsListQuery } from "@/types/api";
import { Pagination } from "../components/Pagination";
import { RunsFilters } from "../components/RunsFilters";
import { RunsTable } from "../components/RunsTable";

const DEFAULT_LIMIT = 25;

const INITIAL_FILTERS: RunsListQuery = {
  limit: DEFAULT_LIMIT,
  offset: 0,
  order: "started_at:desc",
};

export function RunsListPage() {
  const [filters, setFilters] = useState<RunsListQuery>(INITIAL_FILTERS);
  const query = useRuns(filters);

  const toggleDateOrder = () => {
    const next: RunsListOrder =
      filters.order === "started_at:desc"
        ? "started_at:asc"
        : "started_at:desc";
    setFilters((f) => ({ ...f, order: next, offset: 0 }));
  };

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="text-xl font-semibold">Runs</h1>
        <p className="text-sm text-muted-foreground">
          Lista completa das runs registradas pelo MMB.
        </p>
      </header>

      <RunsFilters
        filters={filters}
        onChange={setFilters}
        onClear={() => setFilters(INITIAL_FILTERS)}
      />

      {query.isLoading ? (
        <Skeleton className="h-96" />
      ) : query.isError ? (
        <RunsError onRetry={() => query.refetch()} />
      ) : query.data && query.data.items.length === 0 ? (
        <RunsEmpty />
      ) : query.data ? (
        <div className="flex flex-col gap-3">
          <RunsTable
            runs={query.data.items}
            order={filters.order ?? "started_at:desc"}
            onToggleDateOrder={toggleDateOrder}
          />
          <Pagination
            total={query.data.total}
            limit={query.data.limit}
            offset={query.data.offset}
            onChange={(offset) => setFilters((f) => ({ ...f, offset }))}
          />
        </div>
      ) : null}
    </div>
  );
}

function RunsError({ onRetry }: { onRetry: () => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Não consegui carregar as runs</CardTitle>
        <CardDescription>
          A API do MMB pode estar fora do ar ou inacessível.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={onRetry}>Tentar de novo</Button>
      </CardContent>
    </Card>
  );
}

function RunsEmpty() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nenhuma run encontrada</CardTitle>
        <CardDescription>
          Limpe os filtros ou rode alguma task no MMB.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
