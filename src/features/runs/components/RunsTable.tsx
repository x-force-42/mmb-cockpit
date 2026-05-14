import { ArrowDown, ArrowUp, Check, Minus, X } from "lucide-react";
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
import { formatDateTime, formatDuration, formatUSD } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { MergedToMain, Run, RunsListOrder } from "@/types/api";
import { PhaseBadge } from "./PhaseBadge";

interface Props {
  runs: Run[];
  order: RunsListOrder;
  onToggleDateOrder: () => void;
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

function totalCost(run: Run): number | null {
  const g = run.garagem_cost_usd ?? 0;
  const m = run.meeseeks_cost_usd ?? 0;
  if (run.garagem_cost_usd == null && run.meeseeks_cost_usd == null) {
    return null;
  }
  return g + m;
}

export function RunsTable({ runs, order, onToggleDateOrder }: Props) {
  const navigate = useNavigate();
  const isDesc = order === "started_at:desc";

  return (
    <TooltipProvider>
      <div className="overflow-hidden rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-44">
                <button
                  type="button"
                  onClick={onToggleDateOrder}
                  className="flex items-center gap-1 hover:text-foreground"
                >
                  Data
                  {isDesc ? (
                    <ArrowDown className="size-3" />
                  ) : (
                    <ArrowUp className="size-3" />
                  )}
                </button>
              </TableHead>
              <TableHead className="w-28">Projeto</TableHead>
              <TableHead>Tarefa</TableHead>
              <TableHead className="w-36">Fase</TableHead>
              <TableHead className="w-24 text-right">Duração</TableHead>
              <TableHead className="w-28 text-right">Custo</TableHead>
              <TableHead className="w-24 text-center">Review</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {runs.map((run) => {
              const cost = totalCost(run);
              return (
                <TableRow
                  key={run.id}
                  onClick={() => navigate(`/runs/${run.id}`)}
                  className={cn("cursor-pointer")}
                >
                  <TableCell className="font-mono text-xs tabular-nums">
                    {formatDateTime(run.started_at)}
                  </TableCell>
                  <TableCell className="text-sm">{run.project_slug}</TableCell>
                  <TableCell className="text-sm">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>{truncate(run.task_raw, 60)}</span>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-md">
                        {run.task_raw}
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <PhaseBadge phase={run.terminal_phase} />
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs tabular-nums">
                    {formatDuration(run.total_elapsed_s)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs tabular-nums">
                    {formatUSD(cost)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <MergedIcon merged={run.merged_to_main} />
                      <span className="font-mono text-xs tabular-nums text-muted-foreground">
                        {run.assertiveness_score == null
                          ? "—"
                          : `${run.assertiveness_score}/5`}
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
