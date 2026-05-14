import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useProjects } from "./projects";
import { createWrapper } from "./test-utils";

describe("useProjects", () => {
  it("devolve a lista de projetos", async () => {
    const { result } = renderHook(() => useProjects(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    const items = result.current.data?.items ?? [];
    expect(items.length).toBeGreaterThan(0);
    expect(items[0]).toHaveProperty("slug");
    expect(items[0]).toHaveProperty("path");
  });
});
