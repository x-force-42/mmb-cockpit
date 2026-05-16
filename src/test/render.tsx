import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type RenderOptions, render } from "@testing-library/react";
import { ThemeProvider } from "next-themes";
import type { ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";

export function renderWithProviders(
  ui: ReactElement,
  options: { initialEntries?: string[] } & Omit<RenderOptions, "wrapper"> = {},
) {
  const { initialEntries = ["/"], ...rest } = options;
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(ui, {
    wrapper: ({ children }) => (
      <ThemeProvider
        attribute="data-theme"
        defaultTheme="light"
        enableSystem={false}
        storageKey="mmb-theme-test"
      >
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={initialEntries}>
            {children}
          </MemoryRouter>
        </QueryClientProvider>
      </ThemeProvider>
    ),
    ...rest,
  });
}
