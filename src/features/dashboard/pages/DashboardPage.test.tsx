import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "@/test/render";
import { DashboardPage } from "./DashboardPage";

describe("DashboardPage", () => {
  it("renderiza 4 KPIs após carregar métricas", async () => {
    renderWithProviders(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText("Total de runs")).toBeInTheDocument();
    });
    expect(screen.getByText("Custo total")).toBeInTheDocument();
    expect(screen.getByText("Tempo médio")).toBeInTheDocument();
    expect(screen.getByText("Taxa de pushback")).toBeInTheDocument();
    // valor da fixture: 87 runs
    expect(screen.getByText("87")).toBeInTheDocument();
  });
});
