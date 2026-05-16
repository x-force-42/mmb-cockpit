import type { MetricasOverview } from "../../../types/api";

/**
 * Agregados consistentes com as fixtures de ciclos:
 * - 23 ciclos no total
 * - 5 épicos
 * - status_breakdown: iniciado 1, planejado 2, pr_aberto 1, completo 11, abortado 8
 * - abort_breakdown: 2 de cada origin (heartbeat, manual, self, master)
 * - taxa_abort = 8/23 ≈ 0.348
 * - taxa_merged = 10/11 ciclos completos com merged_to_main=1 ≈ 0.909
 */
export const metricas: MetricasOverview = {
  window_days: 30,
  ciclos_total: 23,
  epicos_total: 5,
  custo_total_usd: 12.87,
  tempo_medio_completo_s: 78600,
  taxa_abort: 0.348,
  taxa_merged: 0.909,
  custo_por_dia: [
    { dia: "2026-05-08", usd: 0.42 },
    { dia: "2026-05-09", usd: 0.18 },
    { dia: "2026-05-10", usd: 0.55 },
    { dia: "2026-05-11", usd: 0.31 },
    { dia: "2026-05-12", usd: 0.93 },
    { dia: "2026-05-13", usd: 0.31 },
    { dia: "2026-05-14", usd: 0.07 },
    { dia: "2026-05-15", usd: 1.37 },
  ],
  ciclos_por_dia: [
    { dia: "2026-05-08", n: 1 },
    { dia: "2026-05-09", n: 1 },
    { dia: "2026-05-10", n: 1 },
    { dia: "2026-05-11", n: 1 },
    { dia: "2026-05-12", n: 2 },
    { dia: "2026-05-13", n: 1 },
    { dia: "2026-05-14", n: 2 },
    { dia: "2026-05-15", n: 3 },
  ],
  status_breakdown: {
    iniciado: 1,
    planejado: 2,
    pr_aberto: 1,
    completo: 11,
    abortado: 8,
  },
  abort_breakdown: {
    heartbeat: 2,
    manual: 2,
    self: 2,
    master: 2,
  },
};
