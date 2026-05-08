import { describe, expect, it } from "vitest";
import { RuleValidationError, validateRule } from "@s-agent/rules";

describe("unit: rule validator", () => {
  it("rejects invalid SemanticRule input with a useful error", () => {
    expect(() => validateRule({ rule_id: "missing-fields" })).toThrow(RuleValidationError);
  });
});
