import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { EpicoStatus } from "@/types/api";

const STATUS_CLASS: Record<EpicoStatus, string> = {
  aberto:
    "border-transparent bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200",
  fechado:
    "border-transparent bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200",
};

export function EpicoStatusBadge({ status }: { status: EpicoStatus }) {
  return (
    <Badge variant="secondary" className={cn(STATUS_CLASS[status])}>
      {status}
    </Badge>
  );
}
