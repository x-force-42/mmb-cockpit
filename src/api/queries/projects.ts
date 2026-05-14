import { useQuery } from "@tanstack/react-query";
import type { ProjectsListResponse } from "../../types/api";
import { apiGet } from "../client";

export const projectKeys = {
  all: ["projects"] as const,
};

export function useProjects() {
  return useQuery({
    queryKey: projectKeys.all,
    queryFn: () => apiGet<ProjectsListResponse>("/api/projects"),
  });
}
