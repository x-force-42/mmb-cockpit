import { HttpResponse, http } from "msw";
import type {
  AssertivenessScore,
  MergedToMain,
  Run,
  RunDetail,
  RunPatch,
  RunsListResponse,
  TerminalPhase,
} from "../../types/api";
import { metrics } from "./fixtures/metrics";
import { projects } from "./fixtures/projects";
import { runs as initialRuns } from "./fixtures/runs";

// Estado mutável em memória pra suportar PATCH entre testes.
// `resetMocks()` restaura.
let runs: RunDetail[] = [...initialRuns];

export function resetMocks(): void {
  runs = initialRuns.map((r) => ({ ...r }));
}

const VALID_PHASES: TerminalPhase[] = [
  "success",
  "meeseeks_failure",
  "dev_server_failure",
  "garagem_pushback",
  "garagem_no_slug",
  "garagem_error",
];

const VALID_ORDERS = new Set([
  "started_at:asc",
  "started_at:desc",
  "total_elapsed_s:asc",
  "total_elapsed_s:desc",
]);

function toRunListItem(r: RunDetail): Run {
  const {
    id,
    project_id,
    project_slug,
    started_at,
    task_raw,
    terminal_phase,
    total_elapsed_s,
    garagem_outcome,
    garagem_cost_usd,
    meeseeks_outcome,
    meeseeks_cost_usd,
    merged_to_main,
    assertiveness_score,
  } = r;
  return {
    id,
    project_id,
    project_slug,
    started_at,
    task_raw,
    terminal_phase,
    total_elapsed_s,
    garagem_outcome,
    garagem_cost_usd,
    meeseeks_outcome,
    meeseeks_cost_usd,
    merged_to_main,
    assertiveness_score,
  };
}

function isValidMerged(value: unknown): value is MergedToMain {
  return value === 0 || value === 1 || value === null;
}

function isValidScore(value: unknown): value is AssertivenessScore {
  if (value === null) return true;
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 1 &&
    value <= 5
  );
}

export const handlers = [
  http.get("*/api/runs", ({ request }) => {
    const url = new URL(request.url);
    const project = url.searchParams.get("project");
    const phase = url.searchParams.get("phase");
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");
    const limit = Math.min(Number(url.searchParams.get("limit") ?? 50), 200);
    const offset = Math.max(Number(url.searchParams.get("offset") ?? 0), 0);
    const order = url.searchParams.get("order") ?? "started_at:desc";

    if (phase && !VALID_PHASES.includes(phase as TerminalPhase)) {
      return HttpResponse.json(
        { detail: `phase inválida: ${phase}` },
        { status: 422 },
      );
    }
    if (!VALID_ORDERS.has(order)) {
      return HttpResponse.json(
        { detail: `order inválido: ${order}` },
        { status: 422 },
      );
    }

    let filtered = runs.slice();
    if (project) filtered = filtered.filter((r) => r.project_slug === project);
    if (phase) filtered = filtered.filter((r) => r.terminal_phase === phase);
    if (from) {
      filtered = filtered.filter((r) => r.started_at.slice(0, 10) >= from);
    }
    if (to) {
      filtered = filtered.filter((r) => r.started_at.slice(0, 10) <= to);
    }

    const [field, direction] = order.split(":") as [
      "started_at" | "total_elapsed_s",
      "asc" | "desc",
    ];
    filtered.sort((a, b) => {
      const av = a[field] as number | string;
      const bv = b[field] as number | string;
      if (av < bv) return direction === "asc" ? -1 : 1;
      if (av > bv) return direction === "asc" ? 1 : -1;
      return 0;
    });

    const total = filtered.length;
    const items = filtered.slice(offset, offset + limit).map(toRunListItem);
    const body: RunsListResponse = { items, total, limit, offset };
    return HttpResponse.json(body);
  }),

  http.get("*/api/runs/:id", ({ params }) => {
    const run = runs.find((r) => r.id === params.id);
    if (!run) {
      return HttpResponse.json(
        { detail: "run não encontrado" },
        { status: 404 },
      );
    }
    return HttpResponse.json(run);
  }),

  http.patch("*/api/runs/:id", async ({ params, request }) => {
    const idx = runs.findIndex((r) => r.id === params.id);
    if (idx === -1) {
      return HttpResponse.json(
        { detail: "run não encontrado" },
        { status: 404 },
      );
    }
    const body = (await request.json()) as Partial<RunPatch> &
      Record<string, unknown>;
    if ("merged_to_main" in body && !isValidMerged(body.merged_to_main)) {
      return HttpResponse.json(
        { detail: "merged_to_main fora do domínio (0 | 1 | null)" },
        { status: 422 },
      );
    }
    if (
      "assertiveness_score" in body &&
      !isValidScore(body.assertiveness_score)
    ) {
      return HttpResponse.json(
        { detail: "assertiveness_score fora do domínio (1..5 | null)" },
        { status: 422 },
      );
    }
    const current = runs[idx];
    const updated: RunDetail = { ...current };
    if ("merged_to_main" in body && isValidMerged(body.merged_to_main)) {
      updated.merged_to_main = body.merged_to_main;
    }
    if (
      "assertiveness_score" in body &&
      isValidScore(body.assertiveness_score)
    ) {
      updated.assertiveness_score = body.assertiveness_score;
    }
    if ("review_note" in body) {
      updated.review_note =
        body.review_note === null ? null : String(body.review_note ?? "");
    }
    runs[idx] = updated;
    return HttpResponse.json(updated);
  }),

  http.get("*/api/projects", () => HttpResponse.json({ items: projects })),

  http.get("*/api/metrics/overview", ({ request }) => {
    const url = new URL(request.url);
    const days = Number(url.searchParams.get("days") ?? 30);
    return HttpResponse.json({ ...metrics, window_days: days });
  }),
];
