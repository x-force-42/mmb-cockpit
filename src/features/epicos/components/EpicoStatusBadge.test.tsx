import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EpicoStatusBadge } from "./EpicoStatusBadge";

describe("EpicoStatusBadge", () => {
  it("fechado → exibe 'fechado' independente dos contadores", () => {
    render(
      <EpicoStatusBadge status="fechado" ciclosTotal={3} ciclosCompletos={3} />,
    );
    expect(screen.getByText("fechado")).toBeInTheDocument();
  });

  it("aberto com ciclos_total=0 → exibe 'aberto' (não idle)", () => {
    render(
      <EpicoStatusBadge status="aberto" ciclosTotal={0} ciclosCompletos={0} />,
    );
    expect(screen.getByText("aberto")).toBeInTheDocument();
  });

  it("aberto com ciclos em curso → exibe 'aberto'", () => {
    render(
      <EpicoStatusBadge status="aberto" ciclosTotal={3} ciclosCompletos={1} />,
    );
    expect(screen.getByText("aberto")).toBeInTheDocument();
  });

  it("aberto com todos ciclos completos → exibe 'idle'", () => {
    render(
      <EpicoStatusBadge status="aberto" ciclosTotal={3} ciclosCompletos={3} />,
    );
    expect(screen.getByText("idle")).toBeInTheDocument();
  });

  it("fechado com ciclos completos não vira idle", () => {
    render(
      <EpicoStatusBadge status="fechado" ciclosTotal={4} ciclosCompletos={4} />,
    );
    expect(screen.getByText("fechado")).toBeInTheDocument();
    expect(screen.queryByText("idle")).not.toBeInTheDocument();
  });
});
