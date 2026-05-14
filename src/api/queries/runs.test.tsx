import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useRun, useRuns } from "./runs";
import { createWrapper } from "./test-utils";

describe("useRuns", () => {
  it("devolve a lista de runs com total e paginação", async () => {
    const { result } = renderHook(() => useRuns(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    const data = result.current.data;
    expect(data).toBeDefined();
    expect(data?.items.length).toBeGreaterThan(0);
    expect(data?.total).toBe(data?.items.length);
    expect(data?.items[0]).toHaveProperty("terminal_phase");
  });

  it("aplica filtro por project", async () => {
    const { result } = renderHook(() => useRuns({ project: "jogo" }), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    const items = result.current.data?.items ?? [];
    expect(items.length).toBeGreaterThan(0);
    expect(items.every((r) => r.project_slug === "jogo")).toBe(true);
  });
});

describe("useRun", () => {
  it("devolve detalhe quando id existe", async () => {
    const { result } = renderHook(
      () => useRun("aaaaaaaa-0000-0000-0000-000000000001"),
      { wrapper: createWrapper() },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.project_slug).toBe("jogo");
    expect(result.current.data?.briefing_json).toBeTruthy();
  });

  it("devolve erro 404 quando id não existe", async () => {
    const { result } = renderHook(() => useRun("nao-existe"), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
  });
});
