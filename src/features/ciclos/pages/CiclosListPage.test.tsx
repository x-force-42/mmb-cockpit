import { screen, waitFor } from "@testing-library/react";
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
});
