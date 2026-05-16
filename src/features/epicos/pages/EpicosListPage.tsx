import { Inbox, RefreshCw, ServerCrash } from "lucide-react";
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
        <TableLoadingSkeleton />
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
