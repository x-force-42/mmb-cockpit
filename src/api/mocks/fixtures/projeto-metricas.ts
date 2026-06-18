import type { ProjetoMetricas } from "../../../types/api";

/**
 * Fixtures globais de `GET /api/projetos/:id/metricas`, keyed pelo id do
 * projeto. Cobrem cenários distintos pra exercitar a UI:
 *
 * - `mmb-core`     (0001): muitos ciclos + alguns aborts
 * - `mmb-cockpit`  (0002): atividade média, sem aborts
 * - `mmb-aquarium` (0003): muitos aborts (abort_breakdown variado)
 * - `mmb-logger`   (0004): sem ciclos (status/abort vazios, tempo medio null)
 */
export const projetoMetricasFixtures: Record<string, ProjetoMetricas> = {
  "10000000-0000-0000-0000-000000000001": {
    projeto_id: "10000000-0000-0000-0000-000000000001",
    custo_total_usd: 4.2731,
    ciclos_count: 18,
    status_breakdown: {
      completo: 14,
      abortado: 2,
      iniciado: 1,
      planejado: 1,
    },
    abort_breakdown: {
      heartbeat: 1,
      manual: 1,
    },
    tempo_medio_ciclo_segundos: 245.6,
  },
  "10000000-0000-0000-0000-000000000002": {
    projeto_id: "10000000-0000-0000-0000-000000000002",
    custo_total_usd: 1.9842,
    ciclos_count: 9,
    status_breakdown: {
      completo: 8,
      pr_aberto: 1,
    },
    abort_breakdown: {},
    tempo_medio_ciclo_segundos: 612.3,
  },
  "10000000-0000-0000-0000-000000000003": {
    projeto_id: "10000000-0000-0000-0000-000000000003",
    custo_total_usd: 6.5128,
    ciclos_count: 14,
    status_breakdown: {
      completo: 6,
      abortado: 7,
      planejado: 1,
    },
    abort_breakdown: {
      heartbeat: 3,
      manual: 2,
      self: 1,
      master: 1,
    },
    tempo_medio_ciclo_segundos: 1820.4,
  },
  "10000000-0000-0000-0000-000000000004": {
    projeto_id: "10000000-0000-0000-0000-000000000004",
    custo_total_usd: 0,
    ciclos_count: 0,
    status_breakdown: {},
    abort_breakdown: {},
    tempo_medio_ciclo_segundos: null,
  },
};
