import { QueryClient } from "@tanstack/react-query";

/**
 * QueryClient singleton. Cockpit é local — não vale a pena refetch agressivo.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
