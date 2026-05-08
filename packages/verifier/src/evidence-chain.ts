import type { AnalysisFinding, EvidenceItem } from "@s-agent/shared";

export interface EvidenceChain {
  rule_id: string;
  violated_invariant: string;
  source_file: string;
  source_section?: string;
  source_line?: number;
  changed_file: string;
  changed_symbol?: string;
  evidence_type: string;
  items: EvidenceItem[];
}

export function buildEvidenceChain(finding: AnalysisFinding): EvidenceChain {
  return {
    rule_id: finding.rule_id,
    violated_invariant: finding.invariant,
    source_file: finding.source.file,
    source_section: finding.source.section,
    source_line: finding.source.line,
    changed_file: finding.changed_file,
    changed_symbol: finding.changed_symbol,
    evidence_type: finding.evidence.map((item) => item.type).join(", "),
    items: finding.evidence
  };
}
