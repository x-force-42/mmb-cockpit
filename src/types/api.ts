/**
 * Tipos do contrato da API REST do mmb-logger.
 * Fonte autoritativa (em construção):
 *   /MMB/mmb-logger/docs/api.md (vai existir quando M1 do logger fechar)
 *
 * Por enquanto, este arquivo define o contrato; MSW implementa fixtures.
 */

// ─── épicos ────────────────────────────────────────────────────────────

export type EpicoStatus = "aberto" | "fechado";

export interface Epico {
  id: string;
  slug: string;
  started_at: string; // ISO8601 UTC
  intencao: string; // texto livre da intenção do Rick
  status: EpicoStatus;
  closed_at: string | null;
  andaime_version: string | null;
  ciclos_total: number;
  ciclos_completos: number;
  ciclos_abortados: number;
}

export interface EpicoDetail extends Epico {
  /** Ciclos filhos ordenados por planner_invoked_at desc. */
  ciclos: Ciclo[];
}

// ─── ciclos ────────────────────────────────────────────────────────────

export type CicloStatus =
  | "iniciado"
  | "planejado"
  | "pr_aberto"
  | "completo"
  | "abortado";

export type AbortOrigin =
  | "heartbeat"
  | "manual"
  | "self"
  | "master"
  | "worker-exit"
  | "worker-timeout"
  | "stale";

export type MergedToMain = 0 | 1 | null;
export type AssertivenessScore = 1 | 2 | 3 | 4 | 5 | null;

/** Item enxuto da listagem (`GET /api/ciclos`). */
export interface Ciclo {
  id: string;
  epico_id: string;
  project: string;
  planner_invoked_at: string;
  status: CicloStatus;
  instruction: string;
  pr_url: string | null;
  pr_number: number | null;
  closed_partial_at: string | null;
  closed_complete_at: string | null;
  merged_to_main: MergedToMain;
  assertiveness_score: AssertivenessScore;
  cost_usd: number | null;
  abort_origin: AbortOrigin | null;
  abort_reason: string | null;
  andaime_version: string | null;
}

export interface CicloDetail extends Ciclo {
  briefing_md: string | null;
  review_note: string | null;
  abort_at: string | null;
  tokens_input: number | null;
  tokens_output: number | null;
  diff_added: number | null;
  diff_deleted: number | null;
  diff_files: number | null;
}

// ─── eventos do ciclo ──────────────────────────────────────────────────

export type EventoKind =
  | "state_change"
  | "msg_send"
  | "msg_receive"
  | "heartbeat_loss"
  | "atomic_spawn"
  | "atomic_deregister"
  | "pr_opened"
  | "journal_warn"
  | "journal_error"
  | "journal_critical";

export type EventoSeverity = "info" | "warn" | "error" | "critical";

export interface Evento {
  id: number;
  /** NULL para eventos órfãos (sem ciclo casado pela heurística do reconciler). */
  ciclo_id: string | null;
  ts: string;
  kind: EventoKind;
  severity: EventoSeverity | null;
  payload: Record<string, unknown>;
}

// ─── listagens + filtros ───────────────────────────────────────────────

export interface EpicosListResponse {
  items: Epico[];
  total: number;
  limit: number;
  offset: number;
}

export interface EpicosListQuery {
  status?: EpicoStatus;
  from?: string;
  to?: string;
  andaime_version?: string[];
  limit?: number;
  offset?: number;
}

export interface CiclosListResponse {
  items: Ciclo[];
  total: number;
  limit: number;
  offset: number;
}

export type CiclosListOrder =
  | "planner_invoked_at:asc"
  | "planner_invoked_at:desc"
  | "cost_usd:asc"
  | "cost_usd:desc";

export interface CiclosListQuery {
  epico?: string;
  project?: string;
  status?: CicloStatus;
  abort_origin?: AbortOrigin;
  from?: string;
  to?: string;
  andaime_version?: string[];
  limit?: number;
  offset?: number;
  order?: CiclosListOrder;
}

export interface CicloPatch {
  merged_to_main?: MergedToMain;
  assertiveness_score?: AssertivenessScore;
  review_note?: string | null;
}

// ─── projetos ──────────────────────────────────────────────────────────

export interface Projeto {
  id: string;
  slug: string;
  name: string;
  path: string;
  repo_url: string | null;
  created_at: string;
}

export interface ProjetosListResponse {
  items: Projeto[];
}

// ─── andaime versions ──────────────────────────────────────────────────

export interface AndaimeVersionsResponse {
  /** Lista das versões distintas presentes no DB, ordenadas da mais recente pra mais antiga. */
  items: string[];
}

// ─── métricas ──────────────────────────────────────────────────────────

export interface DiaCusto {
  dia: string;
  usd: number;
}

export interface DiaCiclos {
  dia: string;
  n: number;
}

export type StatusBreakdown = Partial<Record<CicloStatus, number>>;
export type AbortBreakdown = Partial<Record<AbortOrigin, number>>;

export interface MetricasOverview {
  window_days: number;
  ciclos_total: number;
  epicos_total: number;
  custo_total_usd: number;
  tempo_medio_completo_s: number;
  taxa_abort: number;
  taxa_merged: number;
  custo_por_dia: DiaCusto[];
  ciclos_por_dia: DiaCiclos[];
  status_breakdown: StatusBreakdown;
  abort_breakdown: AbortBreakdown;
}
