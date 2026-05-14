import { screen, waitFor } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "@/test/render";
import { RunDetailPage } from "./RunDetailPage";

const RUN_ID = "aaaaaaaa-0000-0000-0000-000000000001";

describe("RunDetailPage", () => {
  it("renderiza metadata + form de review para id existente", async () => {
    renderWithProviders(
      <Routes>
        <Route path="/runs/:id" element={<RunDetailPage />} />
      </Routes>,
      { initialEntries: [`/runs/${RUN_ID}`] },
    );

    await waitFor(() => {
      // task_raw aparece em RunMetadata e também dentro do briefing_json
      expect(
        screen.getAllByText(/adicionar contagem regressiva/i).length,
      ).toBeGreaterThan(0);
    });

    expect(screen.getByText("Review")).toBeInTheDocument();
    expect(screen.getByLabelText("Nota")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /salvar/i })).toBeInTheDocument();
  });

  it("renderiza estado 404 para id inexistente", async () => {
    renderWithProviders(
      <Routes>
        <Route path="/runs/:id" element={<RunDetailPage />} />
      </Routes>,
      { initialEntries: ["/runs/id-que-nao-existe"] },
    );

    await waitFor(() => {
      expect(screen.getByText(/run não encontrado/i)).toBeInTheDocument();
    });
    expect(
      screen.getByRole("link", { name: /voltar para a lista/i }),
    ).toBeInTheDocument();
  });
});
