import {
  ArrowDown,
  ArrowUp,
  Check,
  ExternalLink,
  Minus,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
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
import { formatDateTime, formatUSD } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Ciclo, CiclosListOrder, MergedToMain } from "@/types/api";
import { CicloStatusBadge } from "./CicloStatusBadge";

interface Props {
  ciclos: Ciclo[];
  order?: CiclosListOrder;
  onToggleDateOrder?: () => void;
  epicoSlugById?: Record<string, string>;
  /** Esconde a coluna "Épico" — útil em telas de detalhe de épico. */
  hideEpicoColumn?: boolean;
}

function truncate(s: string, n: number): string {
  return s.length > n ? `${s.slice(0, n - 1)}…` : s;
}

function MergedIcon({ merged }: { merged: MergedToMain }) {
  if (merged === 1) {
    return (
      <Check
        className="size-4 text-emerald-600"
        aria-label="mergeado em main"
      />
    );
  }
  if (merged === 0) {
    return <X className="size-4 text-destructive" aria-label="não mergeado" />;
  }
  return (
    <Minus
      className="size-4 text-muted-foreground"
      aria-label="merge indefinido"
    />
  );
}

export function CiclosTable({
  ciclos,
  order,
  onToggleDateOrder,
  epicoSlugById = {},
  hideEpicoColumn = false,
}: Props) {
  const navigate = useNavigate();
  const isDesc = order === "planner_invoked_at:desc";
  const isAsc = order === "planner_invoked_at:asc";
  const sortable = Boolean(onToggleDateOrder);

  return (
    <TooltipProvider>
      <div className="overflow-hidden rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-44">
                {sortable ? (
                  <button
                    type="button"
                    onClick={onToggleDateOrder}
                    className="flex items-center gap-1 hover:text-foreground"
                  >
                    Data
                    {isDesc ? (
                      <ArrowDown className="size-3" />
                    ) : isAsc ? (
                      <ArrowUp className="size-3" />
                    ) : null}
                  </button>
                ) : (
                  "Data"
                )}
              </TableHead>
              {hideEpicoColumn ? null : (
                <TableHead className="w-44">Épico</TableHead>
              )}
              <TableHead className="w-32">Projeto</TableHead>
              <TableHead>Instrução</TableHead>
              <TableHead className="w-32">Status</TableHead>
              <TableHead className="w-20">PR</TableHead>
              <TableHead className="w-24 text-right">Custo</TableHead>
              <TableHead className="w-24 text-center">Review</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ciclos.map((c) => {
              const epicoSlug = epicoSlugById[c.epico_id];
              return (
                <TableRow
                  key={c.id}
                  onClick={() => navigate(`/ciclos/${c.id}`)}
                  className={cn("cursor-pointer")}
                >
                  <TableCell className="font-mono text-xs tabular-nums">
                    {formatDateTime(c.planner_invoked_at)}
                  </TableCell>
                  {hideEpicoColumn ? null : (
                    <TableCell className="text-sm">
                      {epicoSlug ? (
                        <Link
                          to={`/epicos/${c.epico_id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="hover:underline"
                        >
                          {epicoSlug}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  )}
                  <TableCell className="text-sm">{c.project}</TableCell>
                  <TableCell className="text-sm">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>{truncate(c.instruction, 60)}</span>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-md">
                        {c.instruction}
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <CicloStatusBadge status={c.status} />
                  </TableCell>
                  <TableCell className="text-sm">
                    {c.pr_url && c.pr_number ? (
                      <a
                        href={c.pr_url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 font-mono text-xs hover:underline"
                      >
                        #{c.pr_number}
                        <ExternalLink className="size-3" />
                      </a>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs tabular-nums">
                    {formatUSD(c.cost_usd)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <MergedIcon merged={c.merged_to_main} />
                      <span className="font-mono text-xs tabular-nums text-muted-foreground">
                        {c.assertiveness_score == null
                          ? "—"
                          : `${c.assertiveness_score}/5`}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  );
}
