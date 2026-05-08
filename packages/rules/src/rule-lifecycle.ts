import type { RuleStatus } from "@s-agent/shared";
import type { SemanticRule } from "./semantic-rule";

const allowedTransitions: Record<RuleStatus, RuleStatus[]> = {
  candidate: ["approved", "archived"],
  approved: ["deprecated", "archived"],
  deprecated: ["archived"],
  archived: []
};

export function canTransitionRule(rule: SemanticRule, nextStatus: RuleStatus): boolean {
  return allowedTransitions[rule.status].includes(nextStatus);
}

export function transitionRule(rule: SemanticRule, nextStatus: RuleStatus): SemanticRule {
  if (!canTransitionRule(rule, nextStatus)) {
    throw new Error(`Cannot transition rule '${rule.rule_id}' from ${rule.status} to ${nextStatus}`);
  }

  return {
    ...rule,
    status: nextStatus
  };
}
