import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { Sidebar } from "./Sidebar";

describe("Sidebar", () => {
  it("renderiza os links de navegação com hrefs corretos", () => {
    render(
      <MemoryRouter>
        <Sidebar collapsed={false} />
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
        <Sidebar collapsed={false} />
      </MemoryRouter>,
    );

    const ciclos = screen.getByRole("link", { name: /ciclos/i });
    expect(ciclos).toHaveAttribute("aria-current", "page");
  });

  it("exibe labels dos itens quando expandido", () => {
    render(
      <MemoryRouter>
        <Sidebar collapsed={false} />
      </MemoryRouter>,
    );

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Épicos")).toBeInTheDocument();
    expect(screen.getByText("Ciclos")).toBeInTheDocument();
  });

  it("oculta labels e mantém links acessíveis quando recolhido", () => {
    render(
      <MemoryRouter>
        <Sidebar collapsed={true} />
      </MemoryRouter>,
    );

    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
    expect(screen.queryByText("Épicos")).not.toBeInTheDocument();
    expect(screen.queryByText("Ciclos")).not.toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: /dashboard/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /épicos/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /ciclos/i })).toBeInTheDocument();
  });

  it("links têm title acessível quando recolhido", () => {
    render(
      <MemoryRouter>
        <Sidebar collapsed={true} />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: /dashboard/i })).toHaveAttribute(
      "title",
      "Dashboard",
    );
    expect(screen.getByRole("link", { name: /épicos/i })).toHaveAttribute(
      "title",
      "Épicos",
    );
    expect(screen.getByRole("link", { name: /ciclos/i })).toHaveAttribute(
      "title",
      "Ciclos",
    );
  });
});
