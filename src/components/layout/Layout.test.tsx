import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { Layout } from "./Layout";

describe("Layout", () => {
  it("renderiza Header, Sidebar e o conteúdo do Outlet", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<p>conteúdo-de-teste</p>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("MMB Cockpit")).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: /navegação principal/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("conteúdo-de-teste")).toBeInTheDocument();
  });
});
