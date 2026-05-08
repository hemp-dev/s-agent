import { describe, expect, it } from "vitest";
import type { AnalysisFinding } from "@s-agent/shared";
import { classifyFinding, isBlockingFinding } from "./finding-classifier";

const baseFinding: AnalysisFinding = {
  rule_id: "INV-AUTH-001",
  invariant_id: "INV-AUTH-001",
  invariant: "Auth module must not import billing.",
  severity: "critical",
  changed_file: "src/auth/session.ts",
  message: "Layer boundary violation.",
  evidence_kind: "deterministic",
  evidence: [
    {
      type: "IMPORT",
      kind: "deterministic",
      file: "src/auth/session.ts",
      line: 1,
      detail: "imported billing"
    }
  ],
  business_impact: "Auth remains identity-only.",
  technical_details: "Import matched forbidden boundary.",
  confidence: 1,
  enforcement_mode: "block",
  rule_status: "approved",
  source: {
    file: "CLAUDE.md",
    section: "authentication-module"
  }
};

describe("finding classifier", () => {
  it("marks deterministic approved evidence as PROVEN", () => {
    expect(classifyFinding(baseFinding)).toBe("PROVEN");
  });

  it("keeps heuristic evidence non-blocking unless proven", () => {
    expect(classifyFinding({ ...baseFinding, evidence_kind: "heuristic", confidence: 0.8 })).toBe(
      "PROBABLE"
    );
  });

  it("dismisses candidate rules", () => {
    expect(classifyFinding({ ...baseFinding, rule_status: "candidate" })).toBe("DISMISSED");
  });

  it("only blocks approved critical proven findings in block mode", () => {
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
