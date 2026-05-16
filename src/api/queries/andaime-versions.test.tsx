import { renderHook, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";
import { server } from "@/api/mocks/server";
import { useAndaimeVersions } from "./andaime-versions";
import { createWrapper } from "./test-utils";

describe("useAndaimeVersions", () => {
  it("retorna o array `items` do contrato GET /api/andaime-versions", async () => {
    const { result } = renderHook(() => useAndaimeVersions(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    const items = result.current.data ?? [];
    expect(items).toEqual([
      "v0.7.0",
      "v0.6.0",
      "v0.5.0",
      "v0.4.0",
      "v0.3.0",
      "v0.2",
      "v0.1",
      "v0",
    ]);
  });

  it("propaga erro quando a API responde 500", async () => {
    server.use(
      http.get("*/api/andaime-versions", () =>
        HttpResponse.json({ detail: "boom" }, { status: 500 }),
      ),
    );
    const { result } = renderHook(() => useAndaimeVersions(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
