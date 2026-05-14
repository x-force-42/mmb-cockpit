import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "@/test/render";
import { RunsListPage } from "./RunsListPage";

describe("RunsListPage", () => {
  it("renderiza a tabela com pelo menos uma run", async () => {
    renderWithProviders(<RunsListPage />);

    expect(screen.getByText("Runs")).toBeInTheDocument();

    await waitFor(() => {
      // task_raw do primeiro fixture
      expect(
        screen.getByText(/adicionar contagem regressiva/i),
      ).toBeInTheDocument();
    });

    // headers da tabela (Projeto também aparece no filtro)
    expect(
      screen.getByRole("columnheader", { name: "Tarefa" }),
    ).toBeInTheDocument();
  });
});
