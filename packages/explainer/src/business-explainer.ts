import type { ProofCarryingFinding } from "@s-agent/verifier";

export function explainBusinessImpact(finding: ProofCarryingFinding): string {
  return finding.business_impact;
}
