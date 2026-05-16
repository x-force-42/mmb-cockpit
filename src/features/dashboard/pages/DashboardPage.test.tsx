import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "@/test/render";
import { DashboardPage } from "./DashboardPage";

describe("DashboardPage", () => {
  it("renderiza 4 KPIs após carregar métricas", async () => {
    renderWithProviders(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText("Total ciclos")).toBeInTheDocument();
    });
    expect(screen.getByText("Épicos")).toBeInTheDocument();
    expect(screen.getByText("Custo total")).toBeInTheDocument();
    expect(screen.getByText("Taxa de abort")).toBeInTheDocument();
    // valor da fixture: 23 ciclos
    expect(screen.getByText("23")).toBeInTheDocument();
  });

  it("renderiza StatusBreakdown com todos os 5 estados", async () => {
    renderWithProviders(<DashboardPage />);

    await waitFor(() =>
      expect(screen.getByText(/Distribuição por status/i)).toBeInTheDocument(),
    );
    expect(screen.getByText(/iniciado/i)).toBeInTheDocument();
    expect(screen.getByText(/planejado/i)).toBeInTheDocument();
    expect(screen.getByText(/PR aberto/i)).toBeInTheDocument();
    expect(screen.getAllByText(/completo/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/abortado/i).length).toBeGreaterThan(0);
  });
});
