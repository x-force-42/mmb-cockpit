import { useQuery } from "@tanstack/react-query";
import type { MetricsOverview } from "../../types/api";
import { apiGet } from "../client";

export const metricsKeys = {
  overview: (days: number) => ["metrics", "overview", days] as const,
};

export function useMetricsOverview(days = 30) {
  return useQuery({
    queryKey: metricsKeys.overview(days),
    queryFn: () => apiGet<MetricsOverview>("/api/metrics/overview", { days }),
  });
}
