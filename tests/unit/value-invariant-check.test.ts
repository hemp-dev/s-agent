import path from "node:path";
import { describe, expect, it } from "vitest";
import { analyzeProject } from "@s-agent/analyzer";
import { loadRulesFromDirectory } from "@s-agent/rules";

describe("unit: value invariant check", () => {
  it("detects a numeric literal above the approved maximum", async () => {
    const projectRoot = path.resolve(__dirname, "../evaluation/fixtures/value-invariant-violation");
    const rules = await loadRulesFromDirectory(path.join(projectRoot, "rules"));
    const result = await analyzeProject({ projectRoot, rules });

    expect(result.findings).toEqual([
      expect.objectContaining({
        rule_id: "EVAL-BILLING-001",
        evidence_kind: "deterministic"
      })
    ]);
  });
});
