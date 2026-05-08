import path from "node:path";
import { describe, expect, it } from "vitest";
import { indexProject } from "@s-agent/parser";
import type { SemanticRule } from "@s-agent/rules";
import { analyzeFastPath } from "./fast-path-analyzer";

const layerRule: SemanticRule = {
  rule_id: "INV-AUTH-001",
  domain: "auth",
  status: "approved",
  owner: "platform",
  severity: "critical",
  scope: {
    modules: ["src/auth/**"]
  },
  intent: "Auth is identity-only.",
  invariants: [
    {
      id: "INV-AUTH-001",
      type: "layer_boundary",
      description: "Auth module must not import billing.",
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

describe("fast path analyzer", () => {
  it("finds a layer boundary violation in the broken demo app", async () => {
    const projectRoot = path.resolve(__dirname, "../../../examples/demo-typescript-app");
    const index = await indexProject(projectRoot);
    const findings = analyzeFastPath(index, [layerRule]);

    expect(findings).toHaveLength(1);
    expect(findings[0]?.rule_id).toBe("INV-AUTH-001");
    expect(findings[0]?.changed_file).toBe("src/auth/session.ts");
    expect(findings[0]?.evidence[0]?.type).toBe("IMPORT");
  });

  it("returns no finding for the clean demo app", async () => {
    const projectRoot = path.resolve(__dirname, "../../../examples/demo-typescript-app-clean");
    const index = await indexProject(projectRoot);
    const findings = analyzeFastPath(index, [layerRule]);

    expect(findings).toEqual([]);
  });

  it("detects side-effect heuristics and numeric invariant violations", async () => {
    const projectRoot = path.resolve(__dirname, "../../../tests/fixtures/rule-checks");
    const index = await indexProject(projectRoot);
    const rule: SemanticRule = {
      rule_id: "INV-CHECKS-001",
      domain: "checks",
      status: "approved",
      owner: "platform",
      severity: "warning",
      scope: {
        modules: ["src/**"]
      },
      intent: "Rule fixtures exercise MVP checks.",
      invariants: [
        {
          id: "INV-CHECKS-SIDE",
          type: "forbidden_side_effect",
          description: "Read-only functions must not write.",
          readonly: true,
          functions: ["readOnlySummary"]
        },
        {
          id: "INV-CHECKS-VALUE",
          type: "value_invariant",
          description: "Discount must not exceed max.",
          value: {
            symbol: "discount",
            max: 30,
            operator: "<="
          }
        }
      ],
      enforcement: {
        mode: "review"
      },
      source: {
        file: "CLAUDE.md",
        section: "checks"
      }
    };

    const findings = analyzeFastPath(index, [rule]);

    expect(findings.map((finding) => finding.invariant_id).sort()).toEqual([
      "INV-CHECKS-SIDE",
      "INV-CHECKS-VALUE"
    ]);
  });
});
