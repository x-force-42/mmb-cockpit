import { describe, expect, it } from "vitest";
import {
  formatDate,
  formatDateTime,
  formatDuration,
  formatNumber,
  formatPercent,
  formatUSD,
} from "./format";

describe("format helpers", () => {
  it("formatUSD: devolve — pra null/undefined; usa pt-BR", () => {
    expect(formatUSD(null)).toBe("—");
    expect(formatUSD(undefined)).toBe("—");
    const formatted = formatUSD(1.2345);
    expect(formatted).toMatch(/US\$/);
    expect(formatted).toContain("1,2345");
  });

  it("formatNumber: usa locale pt-BR e — pra nulo", () => {
    expect(formatNumber(null)).toBe("—");
    expect(formatNumber(1234)).toBe("1.234");
  });

  it("formatDuration: <60s usa s; >=60s usa m s", () => {
    expect(formatDuration(null)).toBe("—");
    expect(formatDuration(45)).toBe("45.0s");
    expect(formatDuration(92)).toBe("1m 32s");
    expect(formatDuration(3725)).toBe("62m 5s");
  });

  it("formatPercent: multiplica por 100 com 1 decimal", () => {
    expect(formatPercent(null)).toBe("—");
    expect(formatPercent(0.184)).toBe("18.4%");
    expect(formatPercent(1)).toBe("100.0%");
  });

  it("formatDate / formatDateTime: aceita ISO e devolve string", () => {
    expect(formatDate("2026-05-14T12:00:00")).toMatch(/14/);
    expect(formatDateTime("2026-05-14T09:30:00")).toMatch(/14/);
  });
});
