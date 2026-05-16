import { useQuery } from "@tanstack/react-query";
import type { AndaimeVersionsResponse } from "../../types/api";
import { apiGet } from "../client";

export const andaimeVersionKeys = {
  all: ["andaime-versions"] as const,
};

/**
 * Lista de versões do andaime descobertas pelo logger (`GET /api/andaime-versions`).
 * Versões mudam raramente — `staleTime` 5min evita refetch desnecessário.
 */
export function useAndaimeVersions() {
  return useQuery({
    queryKey: andaimeVersionKeys.all,
    queryFn: () => apiGet<AndaimeVersionsResponse>("/api/andaime-versions"),
    staleTime: 5 * 60 * 1000,
    select: (data) => data.items,
  });
}
