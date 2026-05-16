import { useState } from "react";
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
import type { EpicosListQuery } from "@/types/api";
import { EpicosFilters } from "../components/EpicosFilters";
import { EpicosTable } from "../components/EpicosTable";

const DEFAULT_LIMIT = 25;

const INITIAL_FILTERS: EpicosListQuery = {
  limit: DEFAULT_LIMIT,
  offset: 0,
};

export function EpicosListPage() {
  const [filters, setFilters] = useState<EpicosListQuery>(INITIAL_FILTERS);
  const query = useEpicos(filters);

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
        <Skeleton className="h-96" />
      ) : query.isError ? (
        <EpicosError onRetry={() => query.refetch()} />
      ) : query.data && query.data.items.length === 0 ? (
        <EpicosEmpty />
      ) : query.data ? (
        <div className="flex flex-col gap-3">
          <EpicosTable epicos={query.data.items} />
          <Pagination
            total={query.data.total}
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

function EpicosError({ onRetry }: { onRetry: () => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Não consegui carregar os épicos</CardTitle>
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

function EpicosEmpty() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nenhum épico encontrado</CardTitle>
        <CardDescription>
          Limpe os filtros ou registre uma intenção nova.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
