import { describe, expect, it } from "vitest";
import { RuleRegistry, type SemanticRule } from "@s-agent/rules";

const approvedRule: SemanticRule = {
  rule_id: "UNIT-RULE-001",
  domain: "unit",
  status: "approved",
  owner: "test",
  severity: "critical",
  scope: {
    modules: ["src/**"]
  },
  intent: "Approved rules are enforceable.",
  invariants: [
    {
      id: "UNIT-RULE-001",
      type: "forbidden_import",
      description: "No forbidden imports.",
      forbidden_imports: ["src/forbidden/**"]
    }
  ],
  enforcement: {
    mode: "block"
  },
  source: {
    file: "CLAUDE.md",
    section: "unit"
  }
};

describe("unit: rule registry", () => {
  it("filters enforceable rules by status and mode", () => {
    const registry = new RuleRegistry([
      approvedRule,
      { ...approvedRule, rule_id: "UNIT-RULE-002", status: "candidate" },
      { ...approvedRule, rule_id: "UNIT-RULE-003", enforcement: { mode: "off" } }
    ]);

    expect(registry.enforceable().map((rule) => rule.rule_id)).toEqual(["UNIT-RULE-001"]);
  });
});
