import { CircleCheck, CircleDot, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { EpicoStatus } from "@/types/api";

const STATUS_CLASS: Record<EpicoStatus, string> = {
  aberto: "border-transparent bg-status-warning text-status-warning-foreground",
  fechado:
    "border-transparent bg-status-success text-status-success-foreground",
};

const STATUS_ICON: Record<EpicoStatus, LucideIcon> = {
  aberto: CircleDot,
  fechado: CircleCheck,
};

export function EpicoStatusBadge({ status }: { status: EpicoStatus }) {
  const Icon = STATUS_ICON[status];
  return (
    <Badge variant="secondary" className={cn("gap-1", STATUS_CLASS[status])}>
      <Icon className="size-3" aria-hidden />
      {status}
    </Badge>
  );
}
