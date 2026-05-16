import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "@/test/render";
import { EpicosListPage } from "./EpicosListPage";

describe("EpicosListPage", () => {
  it("renderiza a tabela com pelo menos um épico", async () => {
    renderWithProviders(<EpicosListPage />);

    expect(screen.getByText("Épicos")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("mmb-logger-destilacao")).toBeInTheDocument();
    });

    expect(
      screen.getByRole("columnheader", { name: "Intenção" }),
    ).toBeInTheDocument();
  });
});
