export const brand = {
  product: "IntentGuard",
  engine: "S-Agent",
  category: "Intent-Aware Code Review",
  headline: "Protect business intent in every code change.",
  subheadline:
    "Turn approved engineering docs, ADRs, and project rules into deterministic pull request checks before intent drift reaches main."
} as const;

export const proofChain = [
  "CLAUDE.md",
  "SemanticRule YAML",
  "TypeScript diff",
  "Symbolic evidence",
  "CLI / PR gate"
] as const;

export const violationTypes = [
  {
    title: "Layer Boundary",
    rule: "auth must not import billing",
    example: "import { charge } from '../billing/service'",
    accent: "blue"
  },
  {
    title: "Forbidden Side Effect",
    rule: "read-only flows must not write",
    example: "await db.invoice.update(...)",
    accent: "red"
  },
  {
    title: "Value Invariant",
    rule: "discount cannot exceed max",
    example: "discount = 0.85",
    accent: "green"
  }
] as const;

export const findingStatuses = [
  {
    status: "PROVEN",
    effect: "Can block",
    detail: "A deterministic check found symbolic evidence for an approved critical rule."
  },
  {
    status: "PROBABLE",
    effect: "Review",
    detail: "A strong signal needs human judgment before it can become enforceable."
  },
  {
    status: "SUSPECT",
    effect: "Inform",
    detail: "A weak signal is useful context, not a reason to stop a merge."
  },
  {
    status: "RULE_CONFLICT",
    effect: "Investigate",
    detail: "A heuristic suspicion disagrees with deterministic evidence."
  },
  {
    status: "DISMISSED",
    effect: "No action",
    detail: "The finding has no actionable evidence for this change."
  }
] as const;

export const semanticRuleSnippet = [
  "rule_id: AUTH-BOUNDARY-001",
  "status: approved",
  "severity: critical",
  "invariants:",
  "  - type: forbidden_import",
  "    forbidden_imports:",
  "      - '@acme/billing'",
  "enforcement:",
  "  mode: block"
] as const;

export const diffLines = [
  {
    tone: "muted",
    text: "apps/auth/session.ts"
  },
  {
    tone: "bad",
    text: '+ import { charge } from "@acme/billing";'
  },
  {
    tone: "normal",
    text: "+ export async function createSession(user) {"
  },
  {
    tone: "normal",
    text: "+   return issueSession(user);"
  },
  {
    tone: "normal",
    text: "+ }"
  }
] as const;

export const cliReportLines = [
  "$ pnpm analyze:demo:broken",
  "",
  "PROVEN critical finding",
  "rule_id: AUTH-BOUNDARY-001",
  "violated invariant: auth must not import billing",
  "changed file: src/auth/session.ts",
  "evidence: import edge auth -> billing",
  "status: PROVEN",
  "",
  "Merge blocked: approved critical rule with proof."
] as const;
