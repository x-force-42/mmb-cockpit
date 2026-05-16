import { useQuery } from "@tanstack/react-query";
import type { MetricasOverview } from "../../types/api";
import { apiGet } from "../client";

export const metricasKeys = {
  overview: (days: number) => ["metricas", "overview", days] as const,
};

export function useMetricasOverview(days = 30) {
  return useQuery({
    queryKey: metricasKeys.overview(days),
    queryFn: () =>
      apiGet<MetricasOverview>("/api/metricas/overview", { days }),
  });
}
