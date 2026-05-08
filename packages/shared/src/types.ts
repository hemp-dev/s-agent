export type RuleStatus = "candidate" | "approved" | "deprecated" | "archived";

export type Severity = "info" | "warning" | "critical";

export type EnforcementMode = "off" | "info" | "review" | "block";

export type EvidenceKind = "deterministic" | "heuristic";

export type EvidenceType =
  | "IMPORT"
  | "FORBIDDEN_CALL"
  | "VALUE_LITERAL"
  | "RULE_SOURCE"
  | "DIFF";

export interface SourceReference {
  file: string;
  section?: string;
  line?: number;
}

export interface EvidenceItem {
  type: EvidenceType;
  kind: EvidenceKind;
  file: string;
  line?: number;
  symbol?: string;
  detail: string;
  snippet?: string;
}

export interface AnalysisFinding {
  id?: string;
  rule_id: string;
  invariant_id: string;
  invariant: string;
  severity: Severity;
  changed_file: string;
  changed_symbol?: string;
  message: string;
  evidence_kind: EvidenceKind;
  evidence: EvidenceItem[];
  business_impact: string;
  technical_details: string;
  confidence: number;
  enforcement_mode: EnforcementMode;
  rule_status: RuleStatus;
  source: SourceReference;
}
