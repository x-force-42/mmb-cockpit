import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useCiclo, useCiclos, useEventosCiclo } from "./ciclos";
import { createWrapper } from "./test-utils";

describe("useCiclos", () => {
  it("devolve a lista de ciclos com total e paginação", async () => {
    const { result } = renderHook(() => useCiclos(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    const data = result.current.data;
    expect(data).toBeDefined();
    expect(data?.items.length).toBeGreaterThan(0);
    expect(data?.items[0]).toHaveProperty("status");
  });

  it("aplica filtro por project", async () => {
    const { result } = renderHook(
      () => useCiclos({ project: "mmb-aquarium" }),
      { wrapper: createWrapper() },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    const items = result.current.data?.items ?? [];
    expect(items.length).toBeGreaterThan(0);
    expect(items.every((c) => c.project === "mmb-aquarium")).toBe(true);
  });

  it("aplica filtro por abort_origin", async () => {
    const { result } = renderHook(
      () => useCiclos({ abort_origin: "heartbeat" }),
      { wrapper: createWrapper() },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    const items = result.current.data?.items ?? [];
    expect(items.length).toBeGreaterThan(0);
    expect(items.every((c) => c.abort_origin === "heartbeat")).toBe(true);
  });
});

describe("useCiclo", () => {
  it("devolve detalhe quando id existe", async () => {
    const { result } = renderHook(
      () => useCiclo("30000000-0000-0000-0000-000000000003"),
      { wrapper: createWrapper() },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.status).toBe("pr_aberto");
  });

  it("devolve erro 404 quando id não existe", async () => {
    const { result } = renderHook(() => useCiclo("nao-existe"), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useEventosCiclo", () => {
  it("devolve eventos do ciclo em ordem cronológica", async () => {
    const { result } = renderHook(
      () => useEventosCiclo("30000000-0000-0000-0000-000000000003"),
      { wrapper: createWrapper() },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    const items = result.current.data?.items ?? [];
    expect(items.length).toBeGreaterThan(0);
    for (let i = 1; i < items.length; i++) {
      expect(items[i].ts >= items[i - 1].ts).toBe(true);
    }
  });
});
