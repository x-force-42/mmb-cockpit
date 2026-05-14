import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Hello from "./Hello";

describe("Hello", () => {
  it("renderiza o saudação inicial do cockpit", () => {
    render(<Hello />);
    expect(
      screen.getByRole("heading", { name: /hello cockpit/i }),
    ).toBeInTheDocument();
  });
});
