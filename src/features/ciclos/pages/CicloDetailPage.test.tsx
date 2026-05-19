import { screen, waitFor } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "@/test/render";
import { CicloDetailPage } from "./CicloDetailPage";

const PR_ABERTO_ID = "30000000-0000-0000-0000-000000000003";
const ABORTADO_ID = "30000000-0000-0000-0000-000000000005";
const PLANEJADO_ID = "30000000-0000-0000-0000-000000000004";

function renderAt(id: string) {
  return renderWithProviders(
    <Routes>
      <Route path="/ciclos/:id" element={<CicloDetailPage />} />
    </Routes>,
    { initialEntries: [`/ciclos/${id}`] },
  );
}

describe("CicloDetailPage", () => {
  it("ciclo em pr_aberto: KPIs + form de review ativo + eventos", async () => {
    renderAt(PR_ABERTO_ID);

    await waitFor(() => {
      expect(
        screen.getByRole("region", { name: /indicadores do ciclo/i }),
      ).toBeInTheDocument();
    });
    expect(screen.getByText("Review")).toBeInTheDocument();
    expect(screen.getByLabelText("Nota")).toBeInTheDocument();
    expect(screen.getByLabelText("Nota")).not.toBeDisabled();
    expect(screen.getByRole("button", { name: /salvar/i })).toBeInTheDocument();
    expect(screen.getByText("Eventos")).toBeInTheDocument();
  });

  it("ciclo abortado: mostra AbortCard, abort_origin no status, form desabilitado", async () => {
    renderAt(ABORTADO_ID);

    await waitFor(() => {
      // "Ciclo abortado" aparece tanto no AbortCard quanto no hint do form
      expect(screen.getAllByText(/Ciclo abortado/i).length).toBeGreaterThan(0);
    });
    expect(screen.getByLabelText("Nota")).toBeDisabled();
    expect(screen.queryByRole("button", { name: /salvar/i })).toBeNull();
    expect(
      screen.getByText(/ciclo abortado, sem review aplicável/i),
    ).toBeInTheDocument();
  });

  it("ciclo planejado: KPIs renderizam, form desabilitado com hint", async () => {
    renderAt(PLANEJADO_ID);

    await waitFor(() => {
      expect(
        screen.getByRole("region", { name: /indicadores do ciclo/i }),
      ).toBeInTheDocument();
    });
    expect(screen.getByLabelText("Nota")).toBeDisabled();
    expect(
      screen.getByText(/review fica disponível quando o ciclo abre PR/i),
    ).toBeInTheDocument();
  });

  it("404 quando id não existe", async () => {
    renderAt("nao-existe");

    await waitFor(() => {
      expect(screen.getByText(/ciclo não encontrado/i)).toBeInTheDocument();
    });
    expect(
      screen.getByRole("link", { name: /voltar para a lista/i }),
    ).toBeInTheDocument();
  });
});
