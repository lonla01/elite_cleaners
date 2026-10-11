import { describe, expect, it } from "vitest";
import { formatDate, formatMoney, formatPercentFromBasisPoints, intlLocale } from "./format";

describe("format", () => {
  it("formats dates as DD/MM/YYYY in Luxembourg time", () => {
    expect(formatDate("2026-01-05T12:00:00Z")).toBe("05/01/2026");
    // 23:30 UTC on 31 Dec is already 1 Jan in Luxembourg.
    expect(formatDate("2026-12-31T23:30:00Z")).toBe("01/01/2027");
  });

  it("formats integer cents as euros", () => {
    expect(formatMoney(123450, "en")).toBe("€1,234.50");
    expect(formatMoney(123450, "fr").replace(/\s/g, " ")).toBe("1.234,50 €");
    expect(() => formatMoney(1.5, "en")).toThrow();
  });

  it("resolves an Intl locale for lb, falling back when unsupported", () => {
    expect(["lb-LU", "lb", "de-LU"]).toContain(intlLocale("lb"));
  });

  it("formats VAT basis points", () => {
    expect(formatPercentFromBasisPoints(1700, "en")).toBe("17%");
  });
});
