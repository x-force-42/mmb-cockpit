import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  RunDetail,
  RunPatch,
  RunsListQuery,
  RunsListResponse,
} from "../../types/api";
import { apiGet, apiPatch } from "../client";

export const runKeys = {
  all: ["runs"] as const,
  list: (filters: RunsListQuery) => ["runs", "list", filters] as const,
  detail: (id: string) => ["runs", "detail", id] as const,
};

export function useRuns(filters: RunsListQuery = {}) {
  return useQuery({
    queryKey: runKeys.list(filters),
    queryFn: () => apiGet<RunsListResponse>("/api/runs", filters),
  });
}

export function useRun(id: string | undefined) {
  return useQuery({
    queryKey: runKeys.detail(id ?? ""),
    queryFn: () => apiGet<RunDetail>(`/api/runs/${id}`),
    enabled: Boolean(id),
  });
}

export function usePatchRun(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (patch: RunPatch) =>
      apiPatch<RunDetail>(`/api/runs/${id}`, patch),
    onSuccess: (updated) => {
      queryClient.setQueryData(runKeys.detail(id), updated);
      queryClient.invalidateQueries({ queryKey: runKeys.all });
    },
  });
}
