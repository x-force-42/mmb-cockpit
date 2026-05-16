import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { CicloStatus } from "@/types/api";

const STATUS_LABEL: Record<CicloStatus, string> = {
  iniciado: "iniciado",
  planejado: "planejado",
  pr_aberto: "PR aberto",
  completo: "completo",
  abortado: "abortado",
};

// Variants do shadcn não comportam todos os tons; aplico classes
// Tailwind explícitas (mesmo pattern do antigo PhaseBadge).
const STATUS_CLASS: Record<CicloStatus, string> = {
  iniciado: "",
  planejado:
    "border-transparent bg-sky-100 text-sky-900 dark:bg-sky-900/40 dark:text-sky-200",
  pr_aberto:
    "border-transparent bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200",
  completo:
    "border-transparent bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200",
  abortado: "border-transparent bg-destructive text-white",
};

const STATUS_VARIANT: Record<CicloStatus, "outline" | "secondary"> = {
  iniciado: "outline",
  planejado: "secondary",
  pr_aberto: "secondary",
  completo: "secondary",
  abortado: "secondary",
};

export function CicloStatusBadge({ status }: { status: CicloStatus }) {
  return (
    <Badge variant={STATUS_VARIANT[status]} className={cn(STATUS_CLASS[status])}>
      {STATUS_LABEL[status]}
    </Badge>
  );
}
