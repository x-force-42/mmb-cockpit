import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CicloDetail,
  CicloPatch,
  CiclosListQuery,
  CiclosListResponse,
  Evento,
} from "../../types/api";
import { apiGet, apiPatch } from "../client";

export const cicloKeys = {
  all: ["ciclos"] as const,
  list: (filters: CiclosListQuery) => ["ciclos", "list", filters] as const,
  detail: (id: string) => ["ciclos", "detail", id] as const,
  eventos: (id: string) => ["ciclos", "eventos", id] as const,
};

export function useCiclos(filters: CiclosListQuery = {}) {
  return useQuery({
    queryKey: cicloKeys.list(filters),
    queryFn: () => apiGet<CiclosListResponse>("/api/ciclos", filters),
  });
}

export function useCiclo(id: string | undefined) {
  return useQuery({
    queryKey: cicloKeys.detail(id ?? ""),
    queryFn: () => apiGet<CicloDetail>(`/api/ciclos/${id}`),
    enabled: Boolean(id),
  });
}

export function useEventosCiclo(id: string | undefined) {
  return useQuery({
    queryKey: cicloKeys.eventos(id ?? ""),
    queryFn: () => apiGet<{ items: Evento[] }>(`/api/ciclos/${id}/eventos`),
    enabled: Boolean(id),
  });
}

export function usePatchCiclo(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (patch: CicloPatch) =>
      apiPatch<CicloDetail>(`/api/ciclos/${id}`, patch),
    onSuccess: (updated) => {
      queryClient.setQueryData(cicloKeys.detail(id), updated);
      queryClient.invalidateQueries({ queryKey: cicloKeys.all });
    },
  });
}
