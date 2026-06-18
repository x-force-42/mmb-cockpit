import { Inbox, RefreshCw, ServerCrash } from "lucide-react";
import { useProjetos } from "@/api/queries/projetos";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProjetoRow } from "../components/ProjetoRow";

export function ProjetosListPage() {
  const query = useProjetos();

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="text-xl font-semibold">Projetos</h1>
        <p className="text-sm text-muted-foreground">
          Targets registrados no andaime, com KPIs agregados por projeto.
        </p>
      </header>

      {query.isLoading ? (
        <TableLoadingSkeleton />
      ) : query.isError ? (
        <ProjetosError onRetry={() => query.refetch()} />
      ) : query.data && query.data.items.length === 0 ? (
        <ProjetosEmpty />
      ) : query.data ? (
        <div className="overflow-hidden rounded-md border bg-background shadow-xs [&_tr>*:first-child]:pl-4 [&_tr>*:last-child]:pr-4">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-muted/60 backdrop-blur-sm">
              <TableRow className="hover:bg-transparent">
                <TableHead>Nome</TableHead>
                <TableHead className="w-40">Slug</TableHead>
                <TableHead className="w-28 text-right">Ciclos</TableHead>
                <TableHead className="w-32 text-right">Custo total</TableHead>
                <TableHead className="w-8" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {query.data.items.map((p) => (
                <ProjetoRow key={p.id} projeto={p} />
              ))}
            </TableBody>
          </Table>
        </div>
      ) : null}
    </div>
  );
}

function TableLoadingSkeleton() {
  return (
    <div
      role="status"
      aria-label="Carregando projetos"
      className="flex flex-col gap-2 rounded-md border bg-background p-3"
    >
      <Skeleton className="h-9 w-full" />
      {Array.from({ length: 4 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: skeleton rows são intercambiáveis
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  );
}

function ProjetosError({ onRetry }: { onRetry: () => void }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start gap-3 space-y-0">
        <ServerCrash className="size-5 shrink-0 text-destructive" aria-hidden />
        <div className="flex flex-col gap-1">
          <CardTitle>Não consegui carregar os projetos</CardTitle>
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

function ProjetosEmpty() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-3 py-12 text-center">
        <div
          aria-hidden
          className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground"
        >
          <Inbox className="size-7" />
        </div>
        <CardTitle className="text-base">Nenhum projeto registrado</CardTitle>
        <CardDescription className="max-w-sm">
          Nenhum target apareceu ainda no registry do andaime.
        </CardDescription>
      </CardContent>
    </Card>
  );
}
