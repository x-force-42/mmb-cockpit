import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { delay, HttpResponse, http } from "msw";
import { describe, expect, it, vi } from "vitest";
import { server } from "@/api/mocks/server";
import { renderWithProviders } from "@/test/render";
import { AndaimeVersionFilter } from "./AndaimeVersionFilter";

describe("AndaimeVersionFilter", () => {
  it("abre popover com uma opção por tag retornada pela API", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <AndaimeVersionFilter
        idPrefix="t"
        selected={[]}
        onChange={() => undefined}
      />,
    );

    const trigger = await screen.findByRole("combobox", {
      name: /versão do andaime/i,
    });
    await user.click(trigger);

    for (const tag of [
      "v0.7.0",
      "v0.6.0",
      "v0.5.0",
      "v0.4.0",
      "v0.3.0",
      "v0.2",
      "v0.1",
      "v0",
    ]) {
      expect(
        await screen.findByRole("option", { name: tag }),
      ).toBeInTheDocument();
    }
  });

  it("mostra skeleton enquanto a query carrega", async () => {
    server.use(
      http.get("*/api/andaime-versions", async () => {
        await delay(200);
        return HttpResponse.json({ items: ["v0.7.0"] });
      }),
    );

    renderWithProviders(
      <AndaimeVersionFilter
        idPrefix="t"
        selected={[]}
        onChange={() => undefined}
      />,
    );

    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
    await screen.findByRole("combobox", { name: /versão do andaime/i });
  });

  it("renderiza fallback quando a query falha", async () => {
    server.use(
      http.get("*/api/andaime-versions", () =>
        HttpResponse.json({ detail: "boom" }, { status: 500 }),
      ),
    );

    renderWithProviders(
      <AndaimeVersionFilter
        idPrefix="t"
        selected={[]}
        onChange={() => undefined}
      />,
    );

    await waitFor(() =>
      expect(screen.getByText(/filtros indisponíveis/i)).toBeInTheDocument(),
    );
  });

  it("clicar em uma tag não-marcada chama onChange com ela acrescida", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderWithProviders(
      <AndaimeVersionFilter
        idPrefix="t"
        selected={["v0.5.0"]}
        onChange={onChange}
      />,
    );

    const trigger = await screen.findByRole("combobox", {
      name: /versão do andaime/i,
    });
    await user.click(trigger);
    await user.click(await screen.findByRole("option", { name: "v0.6.0" }));
    expect(onChange).toHaveBeenCalledWith(["v0.5.0", "v0.6.0"]);
  });

  it("clicar em uma tag já marcada chama onChange com ela removida", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderWithProviders(
      <AndaimeVersionFilter
        idPrefix="t"
        selected={["v0.5.0", "v0.6.0"]}
        onChange={onChange}
      />,
    );

    const trigger = await screen.findByRole("combobox", {
      name: /versão do andaime/i,
    });
    await user.click(trigger);
    await user.click(await screen.findByRole("option", { name: "v0.5.0" }));
    expect(onChange).toHaveBeenCalledWith(["v0.6.0"]);
  });
});
