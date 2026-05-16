import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "next-themes";
import { describe, expect, it } from "vitest";
import { ThemeToggle } from "./theme-toggle";

function renderToggle(defaultTheme: "light" | "dark" = "light") {
  return render(
    <ThemeProvider
      attribute="data-theme"
      defaultTheme={defaultTheme}
      enableSystem={false}
      storageKey="mmb-theme-test"
    >
      <ThemeToggle />
    </ThemeProvider>,
  );
}

describe("ThemeToggle", () => {
  it("anuncia 'modo escuro' como próximo estado no tema claro", async () => {
    renderToggle("light");
    expect(
      await screen.findByRole("button", { name: /trocar para modo escuro/i }),
    ).toBeInTheDocument();
  });

  it("anuncia 'modo claro' como próximo estado no tema escuro", async () => {
    renderToggle("dark");
    expect(
      await screen.findByRole("button", { name: /trocar para modo claro/i }),
    ).toBeInTheDocument();
  });

  it("alterna de light para dark ao clicar", async () => {
    const user = userEvent.setup();
    renderToggle("light");
    const btn = await screen.findByRole("button", {
      name: /trocar para modo escuro/i,
    });
    await user.click(btn);
    expect(
      await screen.findByRole("button", { name: /trocar para modo claro/i }),
    ).toBeInTheDocument();
  });

  it("alterna de dark para light ao clicar", async () => {
    const user = userEvent.setup();
    renderToggle("dark");
    const btn = await screen.findByRole("button", {
      name: /trocar para modo claro/i,
    });
    await user.click(btn);
    expect(
      await screen.findByRole("button", { name: /trocar para modo escuro/i }),
    ).toBeInTheDocument();
  });
});
