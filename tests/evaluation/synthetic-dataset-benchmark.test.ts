import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { runSAgentAnalysis } from "@s-agent/core";
import type { FindingStatus } from "@s-agent/verifier";

type SyntheticKind = "layer" | "side-effect" | "value" | "clean";

interface SyntheticCase {
  case_id: string;
  kind: SyntheticKind;
  expected_finding: boolean;
  expected_status?: FindingStatus;
  expected_rule_id?: string;
  expected_severity?: "info" | "warning" | "critical";
  should_block: boolean;
}

function numbered(prefix: string, index: number): string {
  return `${prefix}-${String(index + 1).padStart(3, "0")}`;
}

const syntheticCases: SyntheticCase[] = [
  ...Array.from({ length: 15 }, (_, index) => ({
    case_id: numbered("broken-auth-import", index),
    kind: "layer" as const,
    expected_finding: true,
    expected_status: "PROVEN" as const,
    expected_rule_id: "INV-AUTH-001",
    expected_severity: "critical" as const,
    should_block: true
  })),
  ...Array.from({ length: 15 }, (_, index) => ({
    case_id: numbered("broken-readonly-side-effect", index),
    kind: "side-effect" as const,
    expected_finding: true,
    expected_status: "PROBABLE" as const,
    expected_rule_id: "INV-READONLY-001",
    expected_severity: "warning" as const,
    should_block: false
  })),
  ...Array.from({ length: 10 }, (_, index) => ({
    case_id: numbered("broken-discount-value", index),
    kind: "value" as const,
    expected_finding: true,
    expected_status: "PROVEN" as const,
    expected_rule_id: "INV-DISCOUNT-001",
    expected_severity: "critical" as const,
    should_block: true
  })),
  ...Array.from({ length: 10 }, (_, index) => ({
    case_id: numbered("clean-project", index),
    kind: "clean" as const,
    expected_finding: false,
    should_block: false
  }))
];

function ruleDocumentFor(testCase: SyntheticCase): string {
  if (testCase.kind === "side-effect") {
    return [
      "rules:",
      "  - rule_id: INV-READONLY-001",
      "    domain: reporting",
      "    status: approved",
      "    owner: evaluation",
      "    severity: warning",
      "    scope:",
      "      modules:",
      "        - \"src/reports/**\"",
      "    intent: \"Read-only reporting code must not mutate state.\"",
      "    invariants:",
      "      - id: INV-READONLY-001",
      "        type: forbidden_side_effect",
      "        description: \"Read-only report functions must not perform write-like calls.\"",
      "        readonly: true",
      "        functions:",
      "          - readOnlySummary",
      "    enforcement:",
      "      mode: review",
      "    source:",
      "      file: \"CLAUDE.md\"",
      "      section: \"read-only-reports\"",
      ""
    ].join("\n");
  }

  if (testCase.kind === "value") {
    return [
      "rules:",
      "  - rule_id: INV-DISCOUNT-001",
      "    domain: billing",
      "    status: approved",
      "    owner: evaluation",
      "    severity: critical",
      "    scope:",
      "      modules:",
      "        - \"src/billing/**\"",
      "    intent: \"Discount values must preserve revenue guardrails.\"",
      "    invariants:",
      "      - id: INV-DISCOUNT-001",
      "        type: value_invariant",
      "        description: \"Discount must not exceed 30.\"",
      "        value:",
      "          symbol: discount",
      "          max: 30",
      "          operator: \"<=\"",
      "    enforcement:",
      "      mode: block",
      "    source:",
      "      file: \"CLAUDE.md\"",
      "      section: \"billing-discounts\"",
      ""
    ].join("\n");
  }

  return [
    "rules:",
    "  - rule_id: INV-AUTH-001",
    "    domain: auth",
    "    status: approved",
    "    owner: evaluation",
    "    severity: critical",
    "    scope:",
    "      modules:",
    "        - \"src/auth/**\"",
    "    intent: \"Authentication must remain identity-only.\"",
    "    invariants:",
    "      - id: INV-AUTH-001",
    "        type: layer_boundary",
    "        description: \"Auth must not import billing.\"",
    "        from: \"src/auth/**\"",
    "        to: \"src/billing/**\"",
    "    enforcement:",
    "      mode: block",
    "    source:",
    "      file: \"CLAUDE.md\"",
    "      section: \"authentication-module\"",
    ""
  ].join("\n");
}

function sourceFilesFor(testCase: SyntheticCase): Array<{ filePath: string; text: string }> {
  if (testCase.kind === "layer") {
    return [
      {
        filePath: "src/auth/session.ts",
        text: [
          "import { recordBillingEvent } from \"../billing/service\";",
          "",
          "export function startSession(userId: string): string {",
          "  recordBillingEvent(userId);",
          "  return userId;",
          "}",
          ""
        ].join("\n")
      },
      {
        filePath: "src/billing/service.ts",
        text: [
          "export function recordBillingEvent(userId: string): void {",
          "  console.log(userId);",
          "}",
          ""
        ].join("\n")
      }
    ];
  }

  if (testCase.kind === "side-effect") {
    return [
      {
        filePath: "src/reports/read-model.ts",
        text: [
          "export function readOnlySummary(): string {",
          "  save();",
          "  return \"summary\";",
          "}",
          "",
          "function save(): void {",
          "  console.log(\"write\");",
          "}",
          ""
        ].join("\n")
      }
    ];
  }

  if (testCase.kind === "value") {
    return [
      {
        filePath: "src/billing/discount.ts",
        text: [
          "export function discountForEnterprise(): number {",
          "  const discount = 45;",
          "  return discount;",
          "}",
          ""
        ].join("\n")
      }
    ];
  }

  return [
    {
      filePath: "src/auth/session.ts",
      text: [
        "export function startSession(userId: string): string {",
        "  const billingLabel = \"copy-only\";",
        "  return `${userId}:${billingLabel}`;",
        "}",
        ""
      ].join("\n")
    }
  ];
}

async function writeSyntheticProject(root: string, testCase: SyntheticCase): Promise<string> {
  const projectRoot = path.join(root, testCase.case_id);
  const rulesRoot = path.join(projectRoot, "rules");
  await fs.mkdir(rulesRoot, { recursive: true });
  await fs.writeFile(path.join(projectRoot, "CLAUDE.md"), `# ${testCase.case_id}\n`, "utf8");
  await fs.writeFile(path.join(rulesRoot, "semantic.rules.yml"), ruleDocumentFor(testCase), "utf8");

  for (const source of sourceFilesFor(testCase)) {
    const targetPath = path.join(projectRoot, source.filePath);
    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    await fs.writeFile(targetPath, source.text, "utf8");
  }

  return projectRoot;
}

describe("50-case synthetic semantic dataset", () => {
  it("meets MVP precision, recall, false-positive, and blocking thresholds", async () => {
    const tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), "s-agent-eval-"));

    try {
      const runs = await Promise.all(
        syntheticCases.map(async (testCase) => {
          const projectRoot = await writeSyntheticProject(tmpRoot, testCase);
          const result = await runSAgentAnalysis({
            projectRoot,
            rulesDirectory: path.join(projectRoot, "rules")
          });
          return { testCase, result };
        })
      );

      const expectedPositiveCases = runs.filter((run) => run.testCase.expected_finding);
      const cleanCases = runs.filter((run) => !run.testCase.expected_finding);
      const detectedExpected = expectedPositiveCases.filter((run) =>
        run.result.findings.some(
          (finding) =>
            finding.rule_id === run.testCase.expected_rule_id &&
            finding.status === run.testCase.expected_status &&
            finding.severity === run.testCase.expected_severity &&
            finding.blocking === run.testCase.should_block
        )
      );
      const allFindings = runs.flatMap((run) => run.result.findings);
      const unexpectedFindings = runs.flatMap((run) => {
        if (!run.testCase.expected_finding) {
          return run.result.findings;
        }

        return run.result.findings.filter(
          (finding) => finding.rule_id !== run.testCase.expected_rule_id
        );
      });
      const blockingFindings = allFindings.filter((finding) => finding.blocking);
      const provenBlockingFindings = blockingFindings.filter((finding) => finding.status === "PROVEN");

      const precision = allFindings.length === 0 ? 1 : detectedExpected.length / allFindings.length;
      const recall = detectedExpected.length / expectedPositiveCases.length;
      const falsePositiveRate = unexpectedFindings.length / cleanCases.length;
      const provenBlockingFindingRate =
        blockingFindings.length === 0 ? 1 : provenBlockingFindings.length / blockingFindings.length;

      expect(syntheticCases).toHaveLength(50);
      expect(precision).toBeGreaterThanOrEqual(0.8);
      expect(recall).toBeGreaterThanOrEqual(0.5);
      expect(falsePositiveRate).toBeLessThanOrEqual(0.2);
      expect(provenBlockingFindingRate).toBeGreaterThanOrEqual(0.7);
      expect(cleanCases.every((run) => !run.result.blocking)).toBe(true);
      expect(provenBlockingFindings.length).toBeGreaterThanOrEqual(1);
    } finally {
      await fs.rm(tmpRoot, { recursive: true, force: true });
    }
  });
});
