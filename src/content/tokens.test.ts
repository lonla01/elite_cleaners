import { describe, expect, it } from "vitest";
import { fillTokens } from "./tokens";

describe("fillTokens", () => {
  it("replaces known tokens and leaves unknown ones visible", () => {
    expect(fillTokens("{legalName}, RCS {rcs} {unknown}", { legalName: "ACME", rcs: "B1" })).toBe(
      "ACME, RCS B1 {unknown}",
    );
  });
});
