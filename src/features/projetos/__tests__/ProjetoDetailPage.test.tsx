import { screen, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { server } from "@/api/mocks/server";
import { renderWithProviders } from "@/test/render";
import type { ProjetoMetricas } from "@/types/api";
import { ProjetoDetailPage } from "../pages/ProjetoDetailPage";

const PROJETO_ID = "10000000-0000-0000-0000-000000000001"; // mmb-core, tem ciclos na fixture

function renderAt(id: string) {
  return renderWithProviders(
    <Routes>
      <Route path="/projetos/:id" element={<ProjetoDetailPage />} />
    </Routes>,
    { initialEntries: [`/projetos/${id}`] },
  );
}

describe("ProjetoDetailPage", () => {
  it("renderiza KPI cards, breakdowns e tabela de ciclos", async () => {
    const metricas: ProjetoMetricas = {
      projeto_id: PROJETO_ID,
      custo_total_usd: 12.34,
      ciclos_count: 6,
      status_breakdown: { completo: 4, abortado: 2 },
      abort_breakdown: { heartbeat: 1, manual: 1 },
      tempo_medio_ciclo_segundos: 1800,
    };
    server.use(
      http.get(`*/api/projetos/${PROJETO_ID}/metricas`, () =>
        HttpResponse.json(metricas),
      ),
    );

    renderAt(PROJETO_ID);

    await waitFor(() => {
      expect(screen.getByText("Custo total")).toBeInTheDocument();
    });
    expect(screen.getByText("Ciclos")).toBeInTheDocument();
    expect(screen.getByText("Tempo médio por ciclo")).toBeInTheDocument();
    expect(screen.getByText(/distribuição por status/i)).toBeInTheDocument();
    expect(screen.getByText(/origem dos aborts/i)).toBeInTheDocument();
    // ao menos 1 ciclo da fixture deste projeto
    await waitFor(() => {
      expect(screen.getByText(/ciclos deste projeto/i)).toBeInTheDocument();
    });
  });

  it("renderiza 404 quando metricas retornam 404", async () => {
    const FAKE_ID = "10000000-0000-0000-0000-00000000ffff";
    server.use(
      http.get(`*/api/projetos/${FAKE_ID}/metricas`, () =>
        HttpResponse.json({ detail: "não encontrado" }, { status: 404 }),
      ),
    );
    renderAt(FAKE_ID);

    await waitFor(() => {
      expect(screen.getByText(/projeto não encontrado/i)).toBeInTheDocument();
    });
    expect(
      screen.getByRole("link", { name: /voltar para a lista/i }),
    ).toBeInTheDocument();
  });

  it("renderiza generic error quando metricas falham com 500", async () => {
    server.use(
      http.get(`*/api/projetos/${PROJETO_ID}/metricas`, () =>
        HttpResponse.json({ detail: "boom" }, { status: 500 }),
      ),
    );
    renderAt(PROJETO_ID);

    await waitFor(() => {
      expect(
        screen.getByText(/não consegui carregar este projeto/i),
      ).toBeInTheDocument();
    });
  });
});
