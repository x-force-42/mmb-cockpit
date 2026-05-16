import { useQuery } from "@tanstack/react-query";
import type { ProjetosListResponse } from "../../types/api";
import { apiGet } from "../client";

export const projetoKeys = {
  all: ["projetos"] as const,
};

export function useProjetos() {
  return useQuery({
    queryKey: projetoKeys.all,
    queryFn: () => apiGet<ProjetosListResponse>("/api/projetos"),
  });
}
