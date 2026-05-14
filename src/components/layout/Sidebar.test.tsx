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
    const runs = screen.getByRole("link", { name: /runs/i });

    expect(dashboard).toHaveAttribute("href", "/");
    expect(runs).toHaveAttribute("href", "/runs");
  });

  it("marca o link da rota ativa", () => {
    render(
      <MemoryRouter initialEntries={["/runs"]}>
        <Sidebar />
      </MemoryRouter>,
    );

    const runs = screen.getByRole("link", { name: /runs/i });
    expect(runs).toHaveAttribute("aria-current", "page");
  });
});
