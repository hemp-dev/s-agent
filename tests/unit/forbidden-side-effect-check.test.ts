import path from "node:path";
import { describe, expect, it } from "vitest";
import { analyzeProject } from "@s-agent/analyzer";
import { loadRulesFromDirectory } from "@s-agent/rules";

describe("unit: forbidden side effect check", () => {
  it("detects a suspicious write-like call in read-only scope", async () => {
    const projectRoot = path.resolve(__dirname, "../evaluation/fixtures/forbidden-side-effect-violation");
    const rules = await loadRulesFromDirectory(path.join(projectRoot, "rules"));
    const result = await analyzeProject({ projectRoot, rules });

    expect(result.findings).toEqual([
      expect.objectContaining({
        rule_id: "EVAL-REPORTS-001",
        evidence_kind: "heuristic"
      })
    ]);
  });
});
