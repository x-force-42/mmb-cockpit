import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";
import { apiGet } from "./client";
import { server } from "./mocks/server";

describe("apiGet querystring serialization", () => {
  it("serializa arrays como a mesma key repetida (não JSON, não CSV)", async () => {
    let capturedUrl = "";
    server.use(
      http.get("*/api/teste-array", ({ request }) => {
        capturedUrl = request.url;
        return HttpResponse.json({ ok: true });
      }),
    );

    await apiGet("/api/teste-array", {
      andaime_version: ["v0.5.0", "v0.6.0"],
      status: "aberto",
    });

    const url = new URL(capturedUrl);
    expect(url.searchParams.getAll("andaime_version")).toEqual([
      "v0.5.0",
      "v0.6.0",
    ]);
    expect(url.searchParams.get("status")).toBe("aberto");
    // querystring deve ter `andaime_version=v0.5.0&andaime_version=v0.6.0`,
    // sem `[`, sem vírgula combinando as duas tags.
    expect(url.search).toContain("andaime_version=v0.5.0");
    expect(url.search).toContain("andaime_version=v0.6.0");
    expect(url.search).not.toContain("%5B"); // sem JSON-encoded `[`
    expect(url.search).not.toContain("v0.5.0%2C"); // sem vírgula CSV
  });

  it("ignora itens undefined/null/'' dentro do array sem quebrar", async () => {
    let capturedUrl = "";
    server.use(
      http.get("*/api/teste-array-vazio", ({ request }) => {
        capturedUrl = request.url;
        return HttpResponse.json({ ok: true });
      }),
    );

    await apiGet("/api/teste-array-vazio", {
      andaime_version: ["v0.5.0", undefined, null, "", "v0.6.0"],
    });

    const url = new URL(capturedUrl);
    expect(url.searchParams.getAll("andaime_version")).toEqual([
      "v0.5.0",
      "v0.6.0",
    ]);
  });

  it("array vazio não emite nenhum parâmetro", async () => {
    let capturedUrl = "";
    server.use(
      http.get("*/api/teste-array-zero", ({ request }) => {
        capturedUrl = request.url;
        return HttpResponse.json({ ok: true });
      }),
    );

    await apiGet("/api/teste-array-zero", { andaime_version: [] });

    const url = new URL(capturedUrl);
    expect(url.searchParams.getAll("andaime_version")).toEqual([]);
    expect(url.search).toBe("");
  });
});
