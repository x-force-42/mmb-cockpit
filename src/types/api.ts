/**
 * Tipos do contrato da API REST do MMB.
 * Fonte autoritativa: ~/llab/mr-meeseeks-box/docs/tasks/E1-api-cockpit.md
 * (seção "Contrato dos 5 endpoints").
 */

export type TerminalPhase =
  | "success"
  | "meeseeks_failure"
  | "dev_server_failure"
  | "garagem_pushback"
  | "garagem_no_slug"
  | "garagem_error";

export type MergedToMain = 0 | 1 | null;
export type AssertivenessScore = 1 | 2 | 3 | 4 | 5 | null;

export type Outcome = "success" | "failure" | "error" | string;

/** Item enxuto da listagem (`GET /api/runs`). */
export interface Run {
  id: string;
  project_id: string;
  project_slug: string;
  started_at: string;
  task_raw: string;
  terminal_phase: TerminalPhase;
  total_elapsed_s: number;
  garagem_outcome: Outcome | null;
  garagem_cost_usd: number | null;
  meeseeks_outcome: Outcome | null;
  meeseeks_cost_usd: number | null;
  merged_to_main: MergedToMain;
  assertiveness_score: AssertivenessScore;
}

/**
 * Detalhe completo (`GET /api/runs/{id}`).
 * Estende `Run` com os campos extras da tabela + JSONs parseados.
 */
export interface RunDetail extends Run {
  finished_at: string | null;
  briefing_json: Record<string, unknown> | null;
  meeseeks_commits_json: unknown[] | null;
  review_note: string | null;
  garagem_elapsed_s: number | null;
  meeseeks_elapsed_s: number | null;
  // Quaisquer outros campos retornados pela API ficam acessíveis
  // via index signature pra não engessar a evolução do schema.
  [extra: string]: unknown;
}

export interface RunsListResponse {
  items: Run[];
  total: number;
  limit: number;
  offset: number;
}

export type RunsListOrder =
  | "started_at:asc"
  | "started_at:desc"
  | "total_elapsed_s:asc"
  | "total_elapsed_s:desc";

export interface RunsListQuery {
  project?: string;
  phase?: TerminalPhase;
  from?: string; // YYYY-MM-DD
  to?: string; // YYYY-MM-DD
  limit?: number;
  offset?: number;
  order?: RunsListOrder;
}

export interface RunPatch {
  merged_to_main?: MergedToMain;
  assertiveness_score?: AssertivenessScore;
  review_note?: string | null;
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  path: string;
  repo_url: string | null;
  created_at: string;
}

export interface ProjectsListResponse {
  items: Project[];
}

export interface DailyCost {
  dia: string;
  usd: number;
}

export interface DailyRuns {
  dia: string;
  n: number;
}

export type PhaseBreakdown = Partial<Record<TerminalPhase, number>>;

export interface MetricsOverview {
  window_days: number;
  runs_total: number;
  custo_total_usd: number;
  tempo_medio_s: number;
  taxa_pushback: number;
  custo_por_dia: DailyCost[];
  runs_por_dia: DailyRuns[];
  phase_breakdown: PhaseBreakdown;
}
