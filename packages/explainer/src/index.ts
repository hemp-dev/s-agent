import type { ProofCarryingFinding } from "@s-agent/verifier";
import { explainBusinessImpact } from "./business-explainer";
import { explainTechnicalDetails } from "./technical-explainer";

export interface ReportInput {
  findings: readonly ProofCarryingFinding[];
  projectRoot?: string;
}

function renderFinding(finding: ProofCarryingFinding): string {
  const sourceLine = finding.evidence_chain.source_line
    ? `${finding.evidence_chain.source_file}:${finding.evidence_chain.source_line}`
    : finding.evidence_chain.source_file;
  const changedSymbol = finding.changed_symbol ?? "module";
  const blocking = finding.blocking ? "yes" : "no";

  return [
    `## Violation: ${finding.invariant_id}`,
    "",
    `Changed file: ${finding.changed_file}`,
    `Changed symbol: ${changedSymbol}`,
    "",
    `Problem: ${finding.message}`,
    "",
    "Why this matters:",
    explainBusinessImpact(finding),
    "",
    "Technical details:",
    explainTechnicalDetails(finding),
    "",
    "Rule source:",
    `${sourceLine}#${finding.evidence_chain.source_section ?? "rule"}`,
    "",
    `Status: ${finding.status}`,
    `Severity: ${finding.severity}`,
    `Blocking: ${blocking}`
  ].join("\n");
}

export function renderMarkdownReport(input: ReportInput): string {
  const title = input.projectRoot ? `# S-Agent Report\n\nProject: ${input.projectRoot}` : "# S-Agent Report";

  if (input.findings.length === 0) {
    return `${title}\n\nNo findings.`;
  }

  return `${title}\n\n${input.findings.map(renderFinding).join("\n\n")}`;
}

export function renderJsonReport(input: ReportInput): string {
  return JSON.stringify(
    {
      projectRoot: input.projectRoot,
      findings: input.findings,
      blocking: input.findings.some((finding) => finding.blocking)
    },
    null,
    2
  );
}

export * from "./business-explainer";
export * from "./technical-explainer";
