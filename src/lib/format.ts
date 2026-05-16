import type { AbortOrigin, CicloStatus, EventoKind } from "@/types/api";

const usdFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 4,
});

const numberFormatter = new Intl.NumberFormat("pt-BR");

const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
});

export function formatUSD(value: number | null | undefined): string {
  if (value == null) return "—";
  return usdFormatter.format(value);
}

export function formatNumber(value: number | null | undefined): string {
  if (value == null) return "—";
  return numberFormatter.format(value);
}

export function formatDuration(seconds: number | null | undefined): string {
  if (seconds == null) return "—";
  if (seconds < 60) return `${seconds.toFixed(1)}s`;
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}m ${s}s`;
}

export function formatDateTime(iso: string): string {
  return dateTimeFormatter.format(new Date(iso));
}

export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(iso));
}

export function formatPercent(value: number | null | undefined): string {
  if (value == null) return "—";
  return `${(value * 100).toFixed(1)}%`;
}

const CICLO_STATUS_LABEL: Record<CicloStatus, string> = {
  iniciado: "Iniciado",
  planejado: "Planejado",
  pr_aberto: "PR aberto",
  completo: "Completo",
  abortado: "Abortado",
};

const ABORT_ORIGIN_LABEL: Record<AbortOrigin, string> = {
  heartbeat: "Heartbeat perdido",
  manual: "Manual (Rick)",
  self: "Auto-abortado",
  master: "Master cancelou",
};

const EVENTO_KIND_LABEL: Record<EventoKind, string> = {
  state_change: "Mudança de estado",
  msg_send: "Mensagem enviada",
  msg_receive: "Mensagem recebida",
  heartbeat_loss: "Heartbeat perdido",
  atomic_spawn: "Atômico spawnado",
  atomic_deregister: "Atômico encerrado",
  pr_opened: "PR aberto",
  journal_warn: "Diário · aviso",
  journal_error: "Diário · erro",
  journal_critical: "Diário · crítico",
};

export function formatCicloStatus(status: CicloStatus): string {
  return CICLO_STATUS_LABEL[status];
}

export function formatAbortOrigin(origin: AbortOrigin): string {
  return ABORT_ORIGIN_LABEL[origin];
}

export function formatEventoKind(kind: EventoKind): string {
  return EVENTO_KIND_LABEL[kind];
}
