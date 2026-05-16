import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TAGS_DISPONIVEIS } from "@/lib/tags";
import { AndaimeVersionFilter } from "./AndaimeVersionFilter";

describe("AndaimeVersionFilter", () => {
  it("renderiza um checkbox pra cada tag de TAGS_DISPONIVEIS", () => {
    render(
      <AndaimeVersionFilter
        idPrefix="t"
        selected={[]}
        onChange={() => undefined}
      />,
    );
    for (const tag of TAGS_DISPONIVEIS) {
      expect(screen.getByLabelText(tag)).toBeInTheDocument();
    }
  });

  it("clicar em uma tag não-marcada chama onChange com ela acrescida", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <AndaimeVersionFilter
        idPrefix="t"
        selected={["v0.5.0"]}
        onChange={onChange}
      />,
    );

    await user.click(screen.getByLabelText("v0.6.0"));
    expect(onChange).toHaveBeenCalledWith(["v0.5.0", "v0.6.0"]);
  });

  it("clicar em uma tag já marcada chama onChange com ela removida", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <AndaimeVersionFilter
        idPrefix="t"
        selected={["v0.5.0", "v0.6.0"]}
        onChange={onChange}
      />,
    );

    await user.click(screen.getByLabelText("v0.5.0"));
    expect(onChange).toHaveBeenCalledWith(["v0.6.0"]);
  });
});
