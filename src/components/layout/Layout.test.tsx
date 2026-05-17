import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { Layout } from "./Layout";

function renderLayout() {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<p>conteúdo-de-teste</p>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe("Layout", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("renderiza Header, Sidebar e o conteúdo do Outlet", () => {
    renderLayout();

    expect(screen.getByText("MMB Cockpit")).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: /navegação principal/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("conteúdo-de-teste")).toBeInTheDocument();
  });

  it("estado padrão é expandido (sem mmb-sidebar-collapsed no localStorage)", () => {
    renderLayout();

    const grid = screen.getByTestId("layout-grid");
    expect(grid.className).toMatch(/grid-cols-\[14rem_1fr\]/);
    expect(grid.className).not.toMatch(/grid-cols-\[3rem_1fr\]/);
  });

  it("lê estado collapsed do localStorage na inicialização", () => {
    localStorage.setItem("mmb-sidebar-collapsed", "1");
    renderLayout();

    const grid = screen.getByTestId("layout-grid");
    expect(grid.className).toMatch(/grid-cols-\[3rem_1fr\]/);
  });

  it("toggle alterna sidebar entre expandido e recolhido", async () => {
    const user = userEvent.setup();
    renderLayout();

    const grid = screen.getByTestId("layout-grid");
    const toggleBtn = screen.getByRole("button", { name: /recolher sidebar/i });

    expect(grid.className).toMatch(/grid-cols-\[14rem_1fr\]/);

    await user.click(toggleBtn);

    expect(grid.className).toMatch(/grid-cols-\[3rem_1fr\]/);
    expect(
      screen.getByRole("button", { name: /expandir sidebar/i }),
    ).toBeInTheDocument();
  });

  it("persiste estado collapsed no localStorage após toggle", async () => {
    const user = userEvent.setup();
    renderLayout();

    await user.click(screen.getByRole("button", { name: /recolher sidebar/i }));
    expect(localStorage.getItem("mmb-sidebar-collapsed")).toBe("1");

    await user.click(screen.getByRole("button", { name: /expandir sidebar/i }));
    expect(localStorage.getItem("mmb-sidebar-collapsed")).toBe("0");
  });
});
