import type { MetricsOverview } from "../../../types/api";

export const metrics: MetricsOverview = {
  window_days: 30,
  runs_total: 87,
  custo_total_usd: 4.23,
  tempo_medio_s: 92.1,
  taxa_pushback: 0.18,
  custo_por_dia: [
    { dia: "2026-05-14", usd: 0.45 },
    { dia: "2026-05-13", usd: 0.32 },
    { dia: "2026-05-12", usd: 0.21 },
    { dia: "2026-05-11", usd: 0.18 },
    { dia: "2026-05-10", usd: 0.09 },
  ],
  runs_por_dia: [
    { dia: "2026-05-14", n: 12 },
    { dia: "2026-05-13", n: 7 },
    { dia: "2026-05-12", n: 5 },
    { dia: "2026-05-11", n: 4 },
    { dia: "2026-05-10", n: 2 },
  ],
  phase_breakdown: {
    success: 60,
    meeseeks_failure: 12,
    garagem_pushback: 15,
  },
};
