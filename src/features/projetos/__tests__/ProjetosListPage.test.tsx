import { screen, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";
import { server } from "@/api/mocks/server";
import { renderWithProviders } from "@/test/render";
import { ProjetosListPage } from "../pages/ProjetosListPage";

describe("ProjetosListPage", () => {
  it("renderiza a tabela com os projetos retornados", async () => {
    renderWithProviders(<ProjetosListPage />);

    expect(screen.getByText("Projetos")).toBeInTheDocument();

    await waitFor(() => {
      // cada projeto aparece duas vezes (nome + slug), por isso getAllByText
      expect(screen.getAllByText("mmb-cockpit").length).toBeGreaterThan(0);
    });
    expect(screen.getAllByText("mmb-logger").length).toBeGreaterThan(0);
    expect(
      screen.getByRole("columnheader", { name: /custo total/i }),
    ).toBeInTheDocument();
  });

  it("mostra skeleton enquanto carrega a lista", () => {
    server.use(
      http.get(
        "*/api/projetos",
        async () => new Promise<Response>(() => undefined),
      ),
    );
    renderWithProviders(<ProjetosListPage />);
    expect(
      screen.getByRole("status", { name: /carregando projetos/i }),
    ).toBeInTheDocument();
  });

  it("renderiza error state com retry quando a API falha", async () => {
    server.use(
      http.get("*/api/projetos", () =>
        HttpResponse.json({ detail: "boom" }, { status: 500 }),
      ),
    );

    renderWithProviders(<ProjetosListPage />);

    expect(
      await screen.findByText(/não consegui carregar os projetos/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /tentar novamente/i }),
    ).toBeInTheDocument();
  });
});
