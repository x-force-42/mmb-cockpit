import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProjetoMetricas } from "@/api/queries/projetos";
import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatNumber, formatUSD } from "@/lib/format";
import type { Projeto } from "@/types/api";

interface Props {
  projeto: Projeto;
}

/**
 * Linha que busca KPIs do próprio projeto (lazy/per-row). O brief deixa
 * a otimização de batch-fetch pra quando virar bottleneck.
 */
export function ProjetoRow({ projeto }: Props) {
  const navigate = useNavigate();
  const metricas = useProjetoMetricas(projeto.id);

  return (
    <TableRow
      onClick={() => navigate(`/projetos/${projeto.id}`)}
      className="cursor-pointer odd:bg-muted/20 hover:bg-muted"
    >
      <TableCell className="font-medium">{projeto.name}</TableCell>
      <TableCell className="font-mono text-xs text-muted-foreground">
        {projeto.slug}
      </TableCell>
      <TableCell className="text-right font-mono text-xs tabular-nums">
        {metricas.isLoading ? (
          <Skeleton className="ml-auto h-4 w-16" />
        ) : metricas.isError ? (
          <span className="text-muted-foreground">—</span>
        ) : (
          formatNumber(metricas.data?.ciclos_count ?? 0)
        )}
      </TableCell>
      <TableCell className="text-right font-mono text-xs tabular-nums">
        {metricas.isLoading ? (
          <Skeleton className="ml-auto h-4 w-20" />
        ) : metricas.isError ? (
          <span className="text-muted-foreground">—</span>
        ) : (
          formatUSD(metricas.data?.custo_total_usd ?? 0)
        )}
      </TableCell>
      <TableCell className="w-8 text-right text-muted-foreground">
        <ChevronRight className="ml-auto size-4" aria-hidden />
      </TableCell>
    </TableRow>
  );
}
