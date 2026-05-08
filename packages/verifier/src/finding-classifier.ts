import type { AnalysisFinding, RuleStatus } from "@s-agent/shared";
import type { FindingStatus } from "./statuses";

export function classifyFinding(finding: AnalysisFinding): FindingStatus {
  if (finding.rule_status !== "approved") {
    return "DISMISSED";
  }

  if (finding.evidence.length === 0) {
    return "DISMISSED";
  }

  if (finding.evidence_kind === "deterministic" && finding.confidence >= 1) {
    return "PROVEN";
  }

  if (finding.evidence_kind === "heuristic" && finding.confidence >= 0.75) {
    return "PROBABLE";
  }

  if (finding.evidence_kind === "heuristic") {
    return "SUSPECT";
  }

  return "DISMISSED";
}

export function isBlockingFinding(input: {
  status: FindingStatus;
  severity: AnalysisFinding["severity"];
  enforcement_mode: AnalysisFinding["enforcement_mode"];
  rule_status: RuleStatus;
}): boolean {
  return (
    input.status === "PROVEN" &&
    input.rule_status === "approved" &&
    input.severity === "critical" &&
    input.enforcement_mode === "block"
  );
}
