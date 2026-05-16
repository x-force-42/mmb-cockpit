import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { Sidebar } from "./Sidebar";

describe("Sidebar", () => {
  it("renderiza os links de navegação com hrefs corretos", () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>,
    );

    const dashboard = screen.getByRole("link", { name: /dashboard/i });
    const epicos = screen.getByRole("link", { name: /épicos/i });
    const ciclos = screen.getByRole("link", { name: /ciclos/i });

    expect(dashboard).toHaveAttribute("href", "/");
    expect(epicos).toHaveAttribute("href", "/epicos");
    expect(ciclos).toHaveAttribute("href", "/ciclos");
  });

  it("marca o link da rota ativa", () => {
    render(
      <MemoryRouter initialEntries={["/ciclos"]}>
        <Sidebar />
      </MemoryRouter>,
    );

    const ciclos = screen.getByRole("link", { name: /ciclos/i });
    expect(ciclos).toHaveAttribute("aria-current", "page");
  });
});
