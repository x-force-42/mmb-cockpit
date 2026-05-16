import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
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
});
