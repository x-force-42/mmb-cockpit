import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useMetricasOverview } from "./metricas";
import { createWrapper } from "./test-utils";

describe("useMetricasOverview", () => {
  it("devolve overview com chaves esperadas e respeita days", async () => {
    const { result } = renderHook(() => useMetricasOverview(30), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    const data = result.current.data;
    expect(data).toBeDefined();
    expect(data?.window_days).toBe(30);
    expect(Array.isArray(data?.custo_por_dia)).toBe(true);
    expect(Array.isArray(data?.ciclos_por_dia)).toBe(true);
    expect(data?.status_breakdown).toBeTypeOf("object");
    expect(data?.abort_breakdown).toBeTypeOf("object");
  });
});
