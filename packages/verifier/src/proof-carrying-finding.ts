import type { AnalysisFinding, EnforcementMode, Severity } from "@s-agent/shared";
import type { EvidenceChain } from "./evidence-chain";
import type { FindingStatus } from "./statuses";

export interface ProofCarryingFinding {
  id: string;
  rule_id: string;
  invariant_id: string;
  status: FindingStatus;
  severity: Severity;
  changed_file: string;
  changed_symbol?: string;
  message: string;
  evidence: AnalysisFinding["evidence"];
  evidence_chain: EvidenceChain;
  business_impact: string;
  technical_details: string;
  enforcement_mode: EnforcementMode;
  blocking: boolean;
}
