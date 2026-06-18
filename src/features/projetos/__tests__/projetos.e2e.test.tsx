import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "@/App";
import { renderWithProviders } from "@/test/render";

/**
 * E2E "feliz" do painel de projetos: dashboard → sidebar Projetos →
 * lista → click numa linha → detalhe.
 *
 * Vitest+RTL com MemoryRouter cobre o MVP. Playwright/Cypress vira
 * épico próprio quando justificar (brief task 1.3).
 */
describe("Projetos — navegação E2E", () => {
  it("navega dashboard → /projetos → /projetos/:id e renderiza detalhe", async () => {
    const user = userEvent.setup();

    renderWithProviders(<App />, { initialEntries: ["/"] });

    // 1. Dashboard renderiza (heading h1).
    expect(
      await screen.findByRole("heading", { level: 1, name: /^dashboard$/i }),
    ).toBeInTheDocument();

    // 2. Click no sidebar "Projetos".
    const sidebarLink = screen.getByRole("link", { name: /^projetos$/i });
    await user.click(sidebarLink);

    // 3. Lista de projetos renderiza com fixtures globais.
    expect(
      await screen.findByRole("heading", { level: 1, name: /^projetos$/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /custo total/i }),
    ).toBeInTheDocument();

    // Esperar os 4 projetos aparecerem (cada um aparece como nome + slug).
    await waitFor(() => {
      expect(screen.getAllByText("mmb-core").length).toBeGreaterThan(0);
      expect(screen.getAllByText("mmb-cockpit").length).toBeGreaterThan(0);
      expect(screen.getAllByText("mmb-aquarium").length).toBeGreaterThan(0);
      expect(screen.getAllByText("mmb-logger").length).toBeGreaterThan(0);
    });

    // 4. Click na linha do mmb-core (linha inteira é clicável).
    const linhaCore = screen.getAllByText("mmb-core")[0].closest("tr");
    expect(linhaCore).not.toBeNull();
    await user.click(linhaCore as HTMLElement);

    // 5. Detalhe renderiza com KPIs, breakdowns e seção de ciclos. Scoping
    //    no <main> evita colidir com a label "Ciclos" do sidebar.
    const main = screen.getByRole("main");
    expect(await within(main).findByText("Custo total")).toBeInTheDocument();
    expect(within(main).getByText("Ciclos")).toBeInTheDocument();
    expect(within(main).getByText("Tempo médio por ciclo")).toBeInTheDocument();
    expect(
      within(main).getByText(/distribuição por status/i),
    ).toBeInTheDocument();
    expect(within(main).getByText(/origem dos aborts/i)).toBeInTheDocument();
    expect(
      await within(main).findByRole("heading", {
        name: /ciclos deste projeto/i,
      }),
    ).toBeInTheDocument();

    // breadcrumb mostra o slug do projeto navegado.
    expect(within(main).getByLabelText(/breadcrumb/i)).toHaveTextContent(
      "mmb-core",
    );
  });
});
