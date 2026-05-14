import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Hello from "./Hello";

describe("Hello", () => {
  it("renderiza o título do cockpit", () => {
    render(<Hello />);
    expect(screen.getByText(/hello cockpit/i)).toBeInTheDocument();
  });
});
