import path from "node:path";
import { describe, expect, it } from "vitest";
import { analyzeProject } from "@s-agent/analyzer";
import { loadRulesFromDirectory } from "@s-agent/rules";

describe("unit: layer boundary check", () => {
  it("detects auth importing billing", async () => {
    const projectRoot = path.resolve(__dirname, "../evaluation/fixtures/layer-boundary-violation");
    const rules = await loadRulesFromDirectory(path.join(projectRoot, "rules"));
    const result = await analyzeProject({ projectRoot, rules });

    expect(result.findings).toEqual([
      expect.objectContaining({
        rule_id: "EVAL-AUTH-001",
        evidence_kind: "deterministic"
      })
    ]);
  });
});
