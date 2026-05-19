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

/**
 * Formata o intervalo entre dois timestamps ISO no formato HH:MM:SS.
 * Aceita `end == null` (ciclo em andamento) e retorna "—" se ambos forem null.
 */
export function formatDurationBetween(
  start: string | null | undefined,
  end: string | null | undefined,
): string {
  if (!start) return "—";
  const startMs = new Date(start).getTime();
  const endMs = end ? new Date(end).getTime() : Date.now();
  if (Number.isNaN(startMs) || Number.isNaN(endMs)) return "—";
  let totalSec = Math.max(0, Math.floor((endMs - startMs) / 1000));
  const h = Math.floor(totalSec / 3600);
  totalSec -= h * 3600;
  const m = Math.floor(totalSec / 60);
  const s = totalSec - m * 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

/** Formata número compacto: 1234 → "1.2k", 1_500_000 → "1.5M". */
export function formatCompact(value: number | null | undefined): string {
  if (value == null) return "—";
  if (value < 1000) return String(value);
  if (value < 1_000_000) return `${(value / 1000).toFixed(1)}k`;
  return `${(value / 1_000_000).toFixed(1)}M`;
}

export function formatDateTime(iso: string): string {
  return dateTimeFormatter.format(new Date(iso));
}

export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(iso));
}

// Strings só-data ("YYYY-MM-DD") são tratadas como UTC midnight por new Date(iso),
// causando deslocamento de -1 dia em BRT. Este helper parseia como meia-noite local.
export function formatLocalDate(dateOnly: string): string {
  const [y, m, d] = dateOnly.split("-").map(Number);
  return dateFormatter.format(new Date(y, m - 1, d));
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
  "worker-exit": "Worker exit não-zero",
  "worker-timeout": "Worker timeout",
  stale: "Stale (sem atividade)",
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
