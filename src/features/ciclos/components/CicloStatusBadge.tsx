import {
  CircleCheck,
  CirclePlay,
  CircleX,
  Clock,
  GitPullRequest,
  type LucideIcon,
} from "lucide-react";
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

const STATUS_ICON: Record<CicloStatus, LucideIcon> = {
  iniciado: CirclePlay,
  planejado: Clock,
  pr_aberto: GitPullRequest,
  completo: CircleCheck,
  abortado: CircleX,
};

const STATUS_CLASS: Record<CicloStatus, string> = {
  iniciado: "",
  planejado:
    "border-transparent bg-status-active text-status-active-foreground",
  pr_aberto:
    "border-transparent bg-status-warning text-status-warning-foreground",
  completo:
    "border-transparent bg-status-success text-status-success-foreground",
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
  const Icon = STATUS_ICON[status];
  return (
    <Badge
      variant={STATUS_VARIANT[status]}
      className={cn("gap-1", STATUS_CLASS[status])}
    >
      <Icon className="size-3" aria-hidden />
      {STATUS_LABEL[status]}
    </Badge>
  );
}
