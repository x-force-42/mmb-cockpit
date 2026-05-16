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

  it("filtra por andaime_version simples", async () => {
    const { result } = renderHook(
      () => useEpicos({ andaime_version: ["v0.5.0"] }),
      { wrapper: createWrapper() },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    const items = result.current.data?.items ?? [];
    expect(items.length).toBeGreaterThan(0);
    expect(items.every((e) => e.andaime_version === "v0.5.0")).toBe(true);
  });

  it("multiselect de andaime_version aplica union", async () => {
    const { result } = renderHook(
      () => useEpicos({ andaime_version: ["v0.5.0", "v0.4.0"] }),
      { wrapper: createWrapper() },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    const items = result.current.data?.items ?? [];
    const versions = items.map((e) => e.andaime_version);
    expect(versions).toContain("v0.5.0");
    expect(versions).toContain("v0.4.0");
    expect(
      items.every((e) =>
        ["v0.5.0", "v0.4.0"].includes(e.andaime_version ?? ""),
      ),
    ).toBe(true);
  });

  it("andaime_version inexistente devolve lista vazia", async () => {
    const { result } = renderHook(
      () => useEpicos({ andaime_version: ["v999.999"] }),
      { wrapper: createWrapper() },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.items.length).toBe(0);
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
