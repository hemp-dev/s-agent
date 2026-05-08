import { describe, expect, it } from "vitest";
import { findingStatuses, proofChain, violationTypes } from "./landing";

describe("landing content", () => {
  it("keeps the documented finding statuses visible on the landing page", () => {
    expect(findingStatuses.map((item) => item.status)).toEqual([
      "PROVEN",
      "PROBABLE",
      "SUSPECT",
      "RULE_CONFLICT",
      "DISMISSED"
    ]);
  });

  it("states that only proven findings can block", () => {
    const blockingStatuses = findingStatuses.filter((item) => item.effect === "Can block");

    expect(blockingStatuses).toHaveLength(1);
    expect(blockingStatuses[0]?.status).toBe("PROVEN");
  });

  it("presents the MVP around the approved symbolic checks", () => {
    expect(violationTypes.map((item) => item.title)).toEqual([
      "Layer Boundary",
      "Forbidden Side Effect",
      "Value Invariant"
    ]);
    expect(proofChain).toContain("SemanticRule YAML");
  });
});
