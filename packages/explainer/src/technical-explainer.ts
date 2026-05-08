import type { ProofCarryingFinding } from "@s-agent/verifier";

export function explainTechnicalDetails(finding: ProofCarryingFinding): string {
  const evidence = finding.evidence_chain.items
    .map((item) => {
      const location = item.line ? `${item.file}:${item.line}` : item.file;
      return `- ${location} - ${item.detail}`;
    })
    .join("\n");

  return `${finding.technical_details}\n\nEvidence:\n${evidence}`;
}
