import { describe, expect, it } from "vitest";
import { RuleRegistry } from "./rule-registry";
import { RuleValidationError, validateRule } from "./rule-validator";
import type { SemanticRule } from "./semantic-rule";

const validRule: SemanticRule = {
  rule_id: "INV-AUTH-001",
  domain: "auth",
  status: "approved",
  owner: "platform",
  severity: "critical",
  scope: {
    modules: ["src/auth/**"]
  },
  intent: "Auth stays identity-only.",
  invariants: [
    {
      id: "INV-AUTH-001",
      type: "layer_boundary",
      description: "Auth must not import billing.",
      from: "src/auth/**",
      to: "src/billing/**"
    }
  ],
  enforcement: {
    mode: "block"
  },
  source: {
    file: "CLAUDE.md",
    section: "authentication-module"
  }
};

describe("rule validation", () => {
  it("accepts a valid SemanticRule", () => {
    expect(validateRule(validRule).rule_id).toBe("INV-AUTH-001");
  });

  it("rejects invalid rules with useful issue paths", () => {
    expect(() => validateRule({ ...validRule, scope: { modules: [] } })).toThrow(
      RuleValidationError
    );
  });
});

describe("rule registry", () => {
  it("only treats approved rules as enforceable", () => {
    const candidate = { ...validRule, rule_id: "INV-AUTH-002", status: "candidate" as const };
    const registry = new RuleRegistry([validRule, candidate]);

    expect(registry.approved().map((rule) => rule.rule_id)).toEqual(["INV-AUTH-001"]);
    expect(registry.enforceable().map((rule) => rule.rule_id)).toEqual(["INV-AUTH-001"]);
  });
});
