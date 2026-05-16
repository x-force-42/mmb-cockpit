import { screen, waitFor } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "@/test/render";
import { EpicoDetailPage } from "./EpicoDetailPage";

const EPICO_SLUG = "mmb-logger-destilacao";

describe("EpicoDetailPage", () => {
  it("renderiza header + intenção + ciclos filhos", async () => {
    renderWithProviders(
      <Routes>
        <Route path="/epicos/:id" element={<EpicoDetailPage />} />
      </Routes>,
      { initialEntries: [`/epicos/${EPICO_SLUG}`] },
    );

    await waitFor(() => {
      expect(screen.getAllByText(EPICO_SLUG).length).toBeGreaterThan(0);
    });
    expect(screen.getByText(/Destilar o sistema de logs/i)).toBeInTheDocument();
    expect(screen.getByText(/Ciclos deste épico/i)).toBeInTheDocument();
    // pelo menos uma instrução de ciclo filho
    expect(screen.getByText(/extrair módulo de logging/i)).toBeInTheDocument();
  });

  it("404 quando id não existe", async () => {
    renderWithProviders(
      <Routes>
        <Route path="/epicos/:id" element={<EpicoDetailPage />} />
      </Routes>,
      { initialEntries: ["/epicos/nao-existe"] },
    );

    await waitFor(() => {
      expect(screen.getByText(/épico não encontrado/i)).toBeInTheDocument();
    });
  });
});
