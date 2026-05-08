import { describe, expect, it } from "vitest";
import { isBlockingFinding } from "@s-agent/verifier";

describe("unit: finding classifier", () => {
  it("blocks only approved critical PROVEN findings in block mode", () => {
    expect(
      isBlockingFinding({
        status: "PROVEN",
        severity: "critical",
        enforcement_mode: "block",
        rule_status: "approved"
      })
    ).toBe(true);

    expect(
      isBlockingFinding({
        status: "PROBABLE",
        severity: "critical",
        enforcement_mode: "block",
        rule_status: "approved"
      })
    ).toBe(false);
  });
});
