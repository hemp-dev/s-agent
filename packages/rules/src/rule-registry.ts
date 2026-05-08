import type { SemanticRule } from "./semantic-rule";

export class RuleRegistry {
  private readonly rulesById: Map<string, SemanticRule>;

  constructor(rules: SemanticRule[]) {
    this.rulesById = new Map();

    for (const rule of rules) {
      if (this.rulesById.has(rule.rule_id)) {
        throw new Error(`Duplicate SemanticRule id '${rule.rule_id}'`);
      }

      this.rulesById.set(rule.rule_id, rule);
    }
  }

  all(): SemanticRule[] {
    return [...this.rulesById.values()];
  }

  approved(): SemanticRule[] {
    return this.all().filter((rule) => rule.status === "approved");
  }

  enforceable(): SemanticRule[] {
    return this.approved().filter((rule) => rule.enforcement.mode !== "off");
  }

  get(ruleId: string): SemanticRule | undefined {
    return this.rulesById.get(ruleId);
  }

  require(ruleId: string): SemanticRule {
    const rule = this.get(ruleId);

    if (!rule) {
      throw new Error(`SemanticRule '${ruleId}' was not found`);
    }

    return rule;
  }
}
