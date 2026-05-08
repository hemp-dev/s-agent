import { RuleRegistry, type SemanticRule } from "@s-agent/rules";
import type { AnalysisFinding } from "@s-agent/shared";
import { buildEvidenceChain } from "./evidence-chain";
import { classifyFinding, isBlockingFinding } from "./finding-classifier";
import type { ProofCarryingFinding } from "./proof-carrying-finding";

function stableFindingId(finding: AnalysisFinding, index: number): string {
  return [
    finding.rule_id,
    finding.invariant_id,
    finding.changed_file,
    finding.changed_symbol ?? "module",
    index + 1
  ].join(":");
}

export function verifyFindings(
  findings: readonly AnalysisFinding[],
  rules: readonly SemanticRule[]
): ProofCarryingFinding[] {
  const registry = new RuleRegistry([...rules]);

  return findings.map((finding, index) => {
    const rule = registry.get(finding.rule_id);
    const ruleStatus = rule?.status ?? finding.rule_status;
    const normalizedFinding: AnalysisFinding = {
      ...finding,
      rule_status: ruleStatus,
      enforcement_mode: rule?.enforcement.mode ?? finding.enforcement_mode,
      severity: rule?.severity ?? finding.severity
    };
    const status = classifyFinding(normalizedFinding);

    return {
      id: finding.id ?? stableFindingId(finding, index),
      rule_id: normalizedFinding.rule_id,
      invariant_id: normalizedFinding.invariant_id,
      status,
      severity: normalizedFinding.severity,
      changed_file: normalizedFinding.changed_file,
      changed_symbol: normalizedFinding.changed_symbol,
      message: normalizedFinding.message,
      evidence: normalizedFinding.evidence,
      evidence_chain: buildEvidenceChain(normalizedFinding),
      business_impact: normalizedFinding.business_impact,
      technical_details: normalizedFinding.technical_details,
      enforcement_mode: normalizedFinding.enforcement_mode,
      blocking: isBlockingFinding({
        status,
        severity: normalizedFinding.severity,
        enforcement_mode: normalizedFinding.enforcement_mode,
        rule_status: normalizedFinding.rule_status
      })
    };
  });
}
