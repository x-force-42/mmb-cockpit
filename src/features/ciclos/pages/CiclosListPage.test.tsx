import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";
import { server } from "@/api/mocks/server";
import { renderWithProviders } from "@/test/render";
import { CiclosListPage } from "./CiclosListPage";

describe("CiclosListPage", () => {
  it("renderiza a tabela com pelo menos um ciclo", async () => {
    renderWithProviders(<CiclosListPage />);

    expect(screen.getByText("Ciclos")).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText(/extrair módulo de logging/i),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByRole("columnheader", { name: "Instrução" }),
    ).toBeInTheDocument();
  });

  it("filtra ciclos quando uma tag de andaime_version é marcada", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CiclosListPage />);

    // espera a lista carregar com pelo menos um ciclo do mmb-logger (v0.5.0)
    // e um do aquarium scaffold (v0.4.0)
    await waitFor(() => {
      expect(
        screen.getByText(/extrair módulo de logging/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/scaffold inicial PixiJS/i)).toBeInTheDocument();
    });

    await user.click(screen.getByLabelText("v0.5.0"));

    await waitFor(() => {
      expect(
        screen.getByText(/extrair módulo de logging/i),
      ).toBeInTheDocument();
      expect(
        screen.queryByText(/scaffold inicial PixiJS/i),
      ).not.toBeInTheDocument();
    });
  });

  it("renderiza error state com botão de retry quando a API falha", async () => {
    server.use(
      http.get("*/api/ciclos", () =>
        HttpResponse.json({ detail: "boom" }, { status: 500 }),
      ),
    );

    renderWithProviders(<CiclosListPage />);

    expect(
      await screen.findByText(/não consegui carregar os ciclos/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /tentar novamente/i }),
    ).toBeInTheDocument();
  });
});
