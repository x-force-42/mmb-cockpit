import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useProjetos } from "./projetos";
import { createWrapper } from "./test-utils";

describe("useProjetos", () => {
  it("devolve a lista de projetos", async () => {
    const { result } = renderHook(() => useProjetos(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    const items = result.current.data?.items ?? [];
    expect(items.length).toBeGreaterThan(0);
    expect(items[0]).toHaveProperty("slug");
    expect(items[0]).toHaveProperty("path");
  });
});
