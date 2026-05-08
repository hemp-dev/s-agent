import type { EnforcementMode, RuleStatus, Severity } from "@s-agent/shared";

export type InvariantType =
  | "layer_boundary"
  | "forbidden_import"
  | "forbidden_side_effect"
  | "value_invariant";

export interface RuleScope {
  modules: string[];
}

export interface RuleSource {
  file: string;
  section: string;
  line?: number;
}

export interface RuleEnforcement {
  mode: EnforcementMode;
}

export interface ValueInvariant {
  symbol: string;
  max: number;
  operator?: "<=";
}

export interface SemanticInvariant {
  id: string;
  type: InvariantType;
  description: string;
  from?: string;
  to?: string;
  forbidden_imports?: string[];
  readonly?: boolean;
  functions?: string[];
  forbidden_calls?: string[];
  value?: ValueInvariant;
}

export interface SemanticRule {
  rule_id: string;
  domain: string;
  status: RuleStatus;
  owner: string;
  severity: Severity;
  scope: RuleScope;
  intent: string;
  invariants: SemanticInvariant[];
  enforcement: RuleEnforcement;
  source: RuleSource;
}

export interface RuleDocument {
  rules: SemanticRule[];
}
