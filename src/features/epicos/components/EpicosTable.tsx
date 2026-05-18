import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Epico } from "@/types/api";
import { EpicoStatusBadge } from "./EpicoStatusBadge";

interface Props {
  epicos: Epico[];
}

function truncate(s: string, n: number): string {
  return s.length > n ? `${s.slice(0, n - 1)}…` : s;
}

export function EpicosTable({ epicos }: Props) {
  const navigate = useNavigate();
  return (
    <TooltipProvider>
      <div className="overflow-hidden rounded-md border bg-background shadow-xs [&_tr>*:first-child]:pl-4 [&_tr>*:last-child]:pr-4">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted/60 backdrop-blur-sm">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-56">Slug</TableHead>
              <TableHead>Intenção</TableHead>
              <TableHead className="w-28">Status</TableHead>
              <TableHead className="w-44">Iniciado em</TableHead>
              <TableHead className="w-36 text-right">Ciclos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {epicos.map((e) => (
              <TableRow
                key={e.id}
                onClick={() => navigate(`/epicos/${e.id}`)}
                className={cn("cursor-pointer odd:bg-muted/20 hover:bg-muted")}
              >
                <TableCell className="text-sm font-medium">{e.slug}</TableCell>
                <TableCell className="text-sm">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>{truncate(e.intencao, 80)}</span>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-md">
                      {e.intencao}
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <EpicoStatusBadge
                    status={e.status}
                    ciclosTotal={e.ciclos_total}
                    ciclosCompletos={e.ciclos_completos}
                  />
                </TableCell>
                <TableCell className="font-mono text-xs tabular-nums">
                  {formatDateTime(e.started_at)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex items-center justify-end gap-2">
                    <span className="font-mono text-xs tabular-nums">
                      {e.ciclos_completos}/{e.ciclos_total}
                    </span>
                    {e.ciclos_abortados > 0 ? (
                      <span
                        className="rounded-full bg-destructive/15 px-2 py-0.5 font-mono text-[10px] text-destructive"
                        title={`${e.ciclos_abortados} abortados`}
                      >
                        {e.ciclos_abortados} abortados
                      </span>
                    ) : null}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  );
}
