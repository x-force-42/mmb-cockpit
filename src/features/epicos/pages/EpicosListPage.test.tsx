import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";
import { server } from "@/api/mocks/server";
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

  it("renderiza error state com botão de retry quando a API falha", async () => {
    server.use(
      http.get("*/api/epicos", () =>
        HttpResponse.json({ detail: "boom" }, { status: 500 }),
      ),
    );

    renderWithProviders(<EpicosListPage />);

    expect(
      await screen.findByText(/não consegui carregar os épicos/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /tentar novamente/i }),
    ).toBeInTheDocument();
  });
});
