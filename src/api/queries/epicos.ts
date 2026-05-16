import { useQuery } from "@tanstack/react-query";
import type {
  EpicoDetail,
  EpicosListQuery,
  EpicosListResponse,
} from "../../types/api";
import { apiGet } from "../client";

export const epicoKeys = {
  all: ["epicos"] as const,
  list: (filters: EpicosListQuery) => ["epicos", "list", filters] as const,
  detail: (id: string) => ["epicos", "detail", id] as const,
};

export function useEpicos(filters: EpicosListQuery = {}) {
  return useQuery({
    queryKey: epicoKeys.list(filters),
    queryFn: () => apiGet<EpicosListResponse>("/api/epicos", filters),
  });
}

export function useEpico(id: string | undefined) {
  return useQuery({
    queryKey: epicoKeys.detail(id ?? ""),
    queryFn: () => apiGet<EpicoDetail>(`/api/epicos/${id}`),
    enabled: Boolean(id),
  });
}
