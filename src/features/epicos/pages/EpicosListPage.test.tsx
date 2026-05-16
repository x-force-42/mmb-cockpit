import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  it("filtra a lista quando uma tag de andaime_version é marcada", async () => {
    const user = userEvent.setup();
    renderWithProviders(<EpicosListPage />);

    // espera carregar a lista cheia
    await waitFor(() => {
      expect(screen.getByText("mmb-logger-destilacao")).toBeInTheDocument();
      expect(screen.getByText("aquarium-prototipo")).toBeInTheDocument();
    });

    // marca a tag do épico mmb-logger-destilacao (v0.5.0 nas fixtures)
    await user.click(screen.getByLabelText("v0.5.0"));

    await waitFor(() => {
      expect(screen.getByText("mmb-logger-destilacao")).toBeInTheDocument();
      expect(screen.queryByText("aquarium-prototipo")).not.toBeInTheDocument();
    });

    // desmarcar volta a mostrar tudo
    await user.click(screen.getByLabelText("v0.5.0"));
    await waitFor(() => {
      expect(screen.getByText("aquarium-prototipo")).toBeInTheDocument();
    });
  });
});
