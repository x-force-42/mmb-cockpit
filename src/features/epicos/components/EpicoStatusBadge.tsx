import { CircleCheck, CircleDot, Clock, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { EpicoStatus } from "@/types/api";

type DisplayState = "aberto-trabalhando" | "aberto-idle" | "fechado";

interface Props {
  status: EpicoStatus;
  ciclosTotal: number;
  ciclosCompletos: number;
}

function deriveDisplayState({
  status,
  ciclosTotal,
  ciclosCompletos,
}: Props): DisplayState {
  if (status === "fechado") return "fechado";
  if (ciclosTotal > 0 && ciclosCompletos === ciclosTotal) return "aberto-idle";
  return "aberto-trabalhando";
}

const STATE_CLASS: Record<DisplayState, string> = {
  "aberto-trabalhando":
    "border-transparent bg-status-warning text-status-warning-foreground",
  "aberto-idle":
    "border-transparent bg-status-active text-status-active-foreground",
  fechado:
    "border-transparent bg-status-success text-status-success-foreground",
};

const STATE_ICON: Record<DisplayState, LucideIcon> = {
  "aberto-trabalhando": CircleDot,
  "aberto-idle": Clock,
  fechado: CircleCheck,
};

const STATE_LABEL: Record<DisplayState, string> = {
  "aberto-trabalhando": "aberto",
  "aberto-idle": "idle",
  fechado: "fechado",
};

export function EpicoStatusBadge({
  status,
  ciclosTotal,
  ciclosCompletos,
}: Props) {
  const state = deriveDisplayState({ status, ciclosTotal, ciclosCompletos });
  const Icon = STATE_ICON[state];
  return (
    <Badge variant="secondary" className={cn("gap-1", STATE_CLASS[state])}>
      <Icon className="size-3" aria-hidden />
      {STATE_LABEL[state]}
    </Badge>
  );
}
