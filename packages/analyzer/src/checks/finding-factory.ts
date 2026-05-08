import type { IndexedFile } from "@s-agent/parser";
import type { SemanticInvariant, SemanticRule } from "@s-agent/rules";
import type { AnalysisFinding, EvidenceItem, EvidenceKind } from "@s-agent/shared";
import { lineAt } from "@s-agent/shared";
import { DETERMINISTIC_CONFIDENCE } from "../confidence";

interface FindingInput {
  rule: SemanticRule;
  invariant: SemanticInvariant;
  file: IndexedFile;
  line?: number;
  changedSymbol?: string;
  message: string;
  evidenceKind: EvidenceKind;
  evidence: EvidenceItem[];
  technicalDetails: string;
  confidence?: number;
}

export function createFinding(input: FindingInput): AnalysisFinding {
  const snippet = input.line ? lineAt(input.file.text, input.line) : undefined;
  const sourceEvidence: EvidenceItem = {
    type: "RULE_SOURCE",
    kind: "deterministic",
    file: input.rule.source.file,
    line: input.rule.source.line,
    detail: `${input.rule.source.file}#${input.rule.source.section}`
  };

  return {
    rule_id: input.rule.rule_id,
    invariant_id: input.invariant.id,
    invariant: input.invariant.description,
    severity: input.rule.severity,
    changed_file: input.file.relativePath,
    changed_symbol: input.changedSymbol,
    message: input.message,
    evidence_kind: input.evidenceKind,
    evidence: [...input.evidence, sourceEvidence],
    business_impact: input.rule.intent,
    technical_details: snippet
      ? `${input.technicalDetails} Matched line: ${snippet}`
      : input.technicalDetails,
    confidence: input.confidence ?? DETERMINISTIC_CONFIDENCE,
    enforcement_mode: input.rule.enforcement.mode,
    rule_status: input.rule.status,
    source: input.rule.source
  };
}
