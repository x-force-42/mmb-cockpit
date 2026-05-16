import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useEpico, useEpicos } from "./epicos";
import { createWrapper } from "./test-utils";

describe("useEpicos", () => {
  it("devolve a lista de épicos com total e paginação", async () => {
    const { result } = renderHook(() => useEpicos(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    const data = result.current.data;
    expect(data).toBeDefined();
    expect(data?.items.length).toBeGreaterThan(0);
    expect(data?.total).toBe(data?.items.length);
    expect(data?.items[0]).toHaveProperty("ciclos_total");
  });

  it("aplica filtro por status", async () => {
    const { result } = renderHook(() => useEpicos({ status: "fechado" }), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    const items = result.current.data?.items ?? [];
    expect(items.length).toBeGreaterThan(0);
    expect(items.every((e) => e.status === "fechado")).toBe(true);
  });
});

describe("useEpico", () => {
  it("devolve detalhe com ciclos filhos para slug existente", async () => {
    const { result } = renderHook(() => useEpico("mmb-logger-destilacao"), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.slug).toBe("mmb-logger-destilacao");
    expect(Array.isArray(result.current.data?.ciclos)).toBe(true);
  });
});
