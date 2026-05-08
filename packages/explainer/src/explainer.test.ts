import { describe, expect, it } from "vitest";
import type { ProofCarryingFinding } from "@s-agent/verifier";
import { renderMarkdownReport } from "./index";

const finding: ProofCarryingFinding = {
  id: "INV-AUTH-001:src/auth/session.ts",
  rule_id: "INV-AUTH-001",
  invariant_id: "INV-AUTH-001",
  status: "PROVEN",
  severity: "critical",
  changed_file: "src/auth/session.ts",
  message: "Layer boundary violation: src/auth/session.ts imports ../billing/billing-service.",
  evidence: [
    {
      type: "IMPORT",
      kind: "deterministic",
      file: "src/auth/session.ts",
      line: 1,
      detail: "Import crosses forbidden boundary."
    }
  ],
  evidence_chain: {
    rule_id: "INV-AUTH-001",
    violated_invariant: "Auth module must not import billing.",
    source_file: "CLAUDE.md",
    source_section: "authentication-module",
    source_line: 3,
    changed_file: "src/auth/session.ts",
    evidence_type: "IMPORT",
    items: [
      {
        type: "IMPORT",
        kind: "deterministic",
        file: "src/auth/session.ts",
        line: 1,
        detail: "Import crosses forbidden boundary."
      }
    ]
  },
  business_impact: "Auth is identity-only.",
  technical_details: "Import matched forbidden boundary.",
  enforcement_mode: "block",
  blocking: true
};

describe("markdown explainer", () => {
  it("renders a stable evidence-carrying report", () => {
    expect(renderMarkdownReport({ findings: [finding], projectRoot: "/demo" })).toContain(
      "Status: PROVEN"
    );
    expect(renderMarkdownReport({ findings: [finding], projectRoot: "/demo" })).toContain(
      "CLAUDE.md:3#authentication-module"
    );
  });
});
