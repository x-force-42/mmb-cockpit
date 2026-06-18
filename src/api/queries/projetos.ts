import { useQuery } from "@tanstack/react-query";
import type { ProjetoMetricas, ProjetosListResponse } from "../../types/api";
import { apiGet } from "../client";

export const projetoKeys = {
  all: ["projetos"] as const,
  metricas: (id: string, days?: number) =>
    ["projetos", "metricas", id, days ?? null] as const,
};

export function useProjetos() {
  return useQuery({
    queryKey: projetoKeys.all,
    queryFn: () => apiGet<ProjetosListResponse>("/api/projetos"),
  });
}

export function useProjetoMetricas(id: string | undefined, days?: number) {
  return useQuery({
    queryKey: projetoKeys.metricas(id ?? "", days),
    queryFn: () =>
      apiGet<ProjetoMetricas>(`/api/projetos/${id}/metricas`, { days }),
    enabled: Boolean(id),
  });
}
