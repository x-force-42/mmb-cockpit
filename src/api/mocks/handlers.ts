import { HttpResponse, http } from "msw";
import type {
  AbortOrigin,
  AssertivenessScore,
  Ciclo,
  CicloDetail,
  CicloPatch,
  CicloStatus,
  CiclosListResponse,
  EpicoDetail,
  EpicoStatus,
  EpicosListResponse,
  MergedToMain,
} from "../../types/api";
import { ciclos as initialCiclos } from "./fixtures/ciclos";
import { epicos as initialEpicos } from "./fixtures/epicos";
import { eventos as initialEventos } from "./fixtures/eventos";
import { metricas } from "./fixtures/metricas";
import { projetos } from "./fixtures/projetos";

// Estado mutável em memória pra suportar PATCH entre testes.
let ciclos: CicloDetail[] = initialCiclos.map((c) => ({ ...c }));
const eventos = [...initialEventos];

export function resetMocks(): void {
  ciclos = initialCiclos.map((c) => ({ ...c }));
}

const VALID_CICLO_STATUS: CicloStatus[] = [
  "iniciado",
  "planejado",
  "pr_aberto",
  "completo",
  "abortado",
];

const VALID_ABORT_ORIGIN: AbortOrigin[] = [
  "heartbeat",
  "manual",
  "self",
  "master",
];

const VALID_EPICO_STATUS: EpicoStatus[] = ["aberto", "fechado"];

const VALID_CICLOS_ORDERS = new Set([
  "planner_invoked_at:asc",
  "planner_invoked_at:desc",
  "cost_usd:asc",
  "cost_usd:desc",
]);

function toCicloListItem(c: CicloDetail): Ciclo {
  const {
    id,
    epico_id,
    project,
    planner_invoked_at,
    status,
    instruction,
    pr_url,
    pr_number,
    closed_partial_at,
    closed_complete_at,
    merged_to_main,
    assertiveness_score,
    cost_usd,
    abort_origin,
    abort_reason,
    andaime_version,
  } = c;
  return {
    id,
    epico_id,
    project,
    planner_invoked_at,
    status,
    instruction,
    pr_url,
    pr_number,
    closed_partial_at,
    closed_complete_at,
    merged_to_main,
    assertiveness_score,
    cost_usd,
    abort_origin,
    abort_reason,
    andaime_version,
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

function findEpicoByIdOrSlug(value: string) {
  return initialEpicos.find((e) => e.id === value || e.slug === value) ?? null;
}

export const handlers = [
  // ─── épicos ─────────────────────────────────────────────────────────
  http.get("*/api/epicos", ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");
    const andaimeVersions = url.searchParams.getAll("andaime_version");
    const limit = Math.min(Number(url.searchParams.get("limit") ?? 50), 200);
    const offset = Math.max(Number(url.searchParams.get("offset") ?? 0), 0);

    if (status && !VALID_EPICO_STATUS.includes(status as EpicoStatus)) {
      return HttpResponse.json(
        { detail: `status inválido: ${status}` },
        { status: 422 },
      );
    }

    let filtered = initialEpicos.slice();
    if (status) filtered = filtered.filter((e) => e.status === status);
    if (from)
      filtered = filtered.filter((e) => e.started_at.slice(0, 10) >= from);
    if (to) filtered = filtered.filter((e) => e.started_at.slice(0, 10) <= to);
    if (andaimeVersions.length > 0) {
      filtered = filtered.filter((e) =>
        e.andaime_version != null
          ? andaimeVersions.includes(e.andaime_version)
          : false,
      );
    }

    filtered.sort((a, b) => b.started_at.localeCompare(a.started_at));

    const total = filtered.length;
    const items = filtered.slice(offset, offset + limit);
    const body: EpicosListResponse = { items, total, limit, offset };
    return HttpResponse.json(body);
  }),

  http.get("*/api/epicos/:id", ({ params }) => {
    const epico = findEpicoByIdOrSlug(String(params.id));
    if (!epico) {
      return HttpResponse.json(
        { detail: "épico não encontrado" },
        { status: 404 },
      );
    }
    const ciclosDoEpico = ciclos
      .filter((c) => c.epico_id === epico.id)
      .slice()
      .sort((a, b) => b.planner_invoked_at.localeCompare(a.planner_invoked_at))
      .map(toCicloListItem);
    const body: EpicoDetail = { ...epico, ciclos: ciclosDoEpico };
    return HttpResponse.json(body);
  }),

  // ─── ciclos ─────────────────────────────────────────────────────────
  http.get("*/api/ciclos", ({ request }) => {
    const url = new URL(request.url);
    const epicoQ = url.searchParams.get("epico");
    const project = url.searchParams.get("project");
    const status = url.searchParams.get("status");
    const abortOrigin = url.searchParams.get("abort_origin");
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");
    const andaimeVersions = url.searchParams.getAll("andaime_version");
    const limit = Math.min(Number(url.searchParams.get("limit") ?? 50), 200);
    const offset = Math.max(Number(url.searchParams.get("offset") ?? 0), 0);
    const order = url.searchParams.get("order") ?? "planner_invoked_at:desc";

    if (status && !VALID_CICLO_STATUS.includes(status as CicloStatus)) {
      return HttpResponse.json(
        { detail: `status inválido: ${status}` },
        { status: 422 },
      );
    }
    if (
      abortOrigin &&
      !VALID_ABORT_ORIGIN.includes(abortOrigin as AbortOrigin)
    ) {
      return HttpResponse.json(
        { detail: `abort_origin inválido: ${abortOrigin}` },
        { status: 422 },
      );
    }
    if (!VALID_CICLOS_ORDERS.has(order)) {
      return HttpResponse.json(
        { detail: `order inválido: ${order}` },
        { status: 422 },
      );
    }

    let filtered = ciclos.slice();
    if (epicoQ) {
      const matchedEpico = findEpicoByIdOrSlug(epicoQ);
      const epicoId = matchedEpico?.id ?? epicoQ;
      filtered = filtered.filter((c) => c.epico_id === epicoId);
    }
    if (project) filtered = filtered.filter((c) => c.project === project);
    if (status) filtered = filtered.filter((c) => c.status === status);
    if (abortOrigin) {
      filtered = filtered.filter((c) => c.abort_origin === abortOrigin);
    }
    if (from) {
      filtered = filtered.filter(
        (c) => c.planner_invoked_at.slice(0, 10) >= from,
      );
    }
    if (to) {
      filtered = filtered.filter(
        (c) => c.planner_invoked_at.slice(0, 10) <= to,
      );
    }
    if (andaimeVersions.length > 0) {
      filtered = filtered.filter((c) =>
        c.andaime_version != null
          ? andaimeVersions.includes(c.andaime_version)
          : false,
      );
    }

    const [field, direction] = order.split(":") as [
      "planner_invoked_at" | "cost_usd",
      "asc" | "desc",
    ];
    filtered.sort((a, b) => {
      const av = a[field];
      const bv = b[field];
      // null vai pro fim, independente da direção
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (av < bv) return direction === "asc" ? -1 : 1;
      if (av > bv) return direction === "asc" ? 1 : -1;
      return 0;
    });

    const total = filtered.length;
    const items = filtered.slice(offset, offset + limit).map(toCicloListItem);
    const body: CiclosListResponse = { items, total, limit, offset };
    return HttpResponse.json(body);
  }),

  http.get("*/api/ciclos/:id", ({ params }) => {
    const ciclo = ciclos.find((c) => c.id === params.id);
    if (!ciclo) {
      return HttpResponse.json(
        { detail: "ciclo não encontrado" },
        { status: 404 },
      );
    }
    return HttpResponse.json(ciclo);
  }),

  http.get("*/api/ciclos/:id/eventos", ({ params }) => {
    const ciclo = ciclos.find((c) => c.id === params.id);
    if (!ciclo) {
      return HttpResponse.json(
        { detail: "ciclo não encontrado" },
        { status: 404 },
      );
    }
    const items = eventos
      .filter((e) => e.ciclo_id === params.id)
      .slice()
      .sort((a, b) => a.ts.localeCompare(b.ts));
    return HttpResponse.json({ items });
  }),

  http.patch("*/api/ciclos/:id", async ({ params, request }) => {
    const idx = ciclos.findIndex((c) => c.id === params.id);
    if (idx === -1) {
      return HttpResponse.json(
        { detail: "ciclo não encontrado" },
        { status: 404 },
      );
    }
    const body = (await request.json()) as Partial<CicloPatch> &
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
    const current = ciclos[idx];
    const updated: CicloDetail = { ...current };
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
    ciclos[idx] = updated;
    return HttpResponse.json(updated);
  }),

  // ─── projetos ───────────────────────────────────────────────────────
  http.get("*/api/projetos", () => HttpResponse.json({ items: projetos })),

  // ─── andaime versions ───────────────────────────────────────────────
  http.get("*/api/andaime-versions", () =>
    HttpResponse.json({
      items: [
        "v0.7.0",
        "v0.6.0",
        "v0.5.0",
        "v0.4.0",
        "v0.3.0",
        "v0.2",
        "v0.1",
        "v0",
      ],
    }),
  ),

  // ─── métricas ───────────────────────────────────────────────────────
  http.get("*/api/metricas/overview", ({ request }) => {
    const url = new URL(request.url);
    const days = Number(url.searchParams.get("days") ?? 30);
    return HttpResponse.json({ ...metricas, window_days: days });
  }),
];
