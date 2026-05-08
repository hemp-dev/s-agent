export const brand = {
  product: "IntentGuard",
  engine: "S-Agent",
  category: "Intent-Aware Code Review",
  headline: "Protect business intent in every code change.",
  subheadline:
    "Turn approved engineering docs, ADRs, and project rules into deterministic pull request checks before intent drift reaches main."
} as const;

export const pageMetadata = {
  title: "IntentGuard - Intent-Aware Code Review for TypeScript PRs",
  description:
    "IntentGuard is an intent-aware code review tool that turns approved engineering docs into deterministic TypeScript pull request checks with proof-carrying findings.",
  lastUpdated: "2026-05-08"
} as const;

export const siteMetadata = {
  productionUrl: "https://intentguard.dev",
  githubUrl: "https://github.com/muthukumar-js-dev/intent-guard",
  ogImagePath: "/og/intentguard-og.png"
} as const;

export const heroDefinition =
  "IntentGuard is an intent-aware code review guard for TypeScript PRs that turns approved rules into proof-carrying checks." as const;

export const answerBlocks = [
  {
    title: "What is IntentGuard?",
    body:
      "IntentGuard is an intent-aware code review tool for engineering teams that need pull requests to preserve approved business and architecture rules. It turns SemanticRule YAML into deterministic TypeScript checks and reports proof-carrying findings reviewers can audit."
  },
  {
    title: "What is intent-aware code review?",
    body:
      "Intent-aware code review verifies whether a code change preserves documented business, product, and architecture intent. It catches changes that compile and pass tests but still violate approved rules such as module boundaries, side-effect limits, or value thresholds."
  },
  {
    title: "Who is it for?",
    body:
      "IntentGuard is built for TypeScript-heavy teams using AI coding tools, large refactors, or fast-moving product engineering workflows. It is most useful when important rules live in ADRs, READMEs, CLAUDE.md, or senior engineers' repeated review comments."
  }
] as const;

export const proofChain = [
  "CLAUDE.md",
  "SemanticRule YAML",
  "TypeScript diff",
  "Symbolic evidence",
  "CLI / PR gate"
] as const;

export const workflowSteps = [
  {
    title: "Start with docs",
    body:
      "Use CLAUDE.md, READMEs, ADRs, and architecture notes as source material for candidate rules."
  },
  {
    title: "Approve SemanticRules",
    body:
      "A human approves explicit YAML rules. The approved SemanticRule file becomes the source of truth."
  },
  {
    title: "Check every PR",
    body:
      "IntentGuard indexes TypeScript code, analyzes imports and functions, verifies findings, and prints a proof-carrying report."
  },
  {
    title: "Block only proof",
    body:
      "Only PROVEN findings from approved critical rules in block mode can stop a merge."
  }
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

export const comparisonRows = [
  {
    alternative: "SAST",
    checks: "Security vulnerability patterns",
    adds: "Product and architecture intent, such as billing boundaries and domain invariants"
  },
  {
    alternative: "Linters",
    checks: "Style, syntax, and generic code-quality rules",
    adds: "Team-specific business rules backed by approved documentation"
  },
  {
    alternative: "AI reviewers",
    checks: "Broad contextual suggestions and plausible concerns",
    adds: "Deterministic blocking only when approved rules produce symbolic evidence"
  },
  {
    alternative: "Architecture tools",
    checks: "Dependencies, packages, and structural drift",
    adds: "PR-level reports tied to documented business and architecture intent"
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

export const faqItems = [
  {
    question: "Is IntentGuard a replacement for SAST?",
    answer:
      "No. IntentGuard complements SAST by checking business and architecture intent rather than security vulnerability classes."
  },
  {
    question: "Does IntentGuard use an LLM?",
    answer:
      "The MVP does not use an LLM for enforcement. Future LLM features may suggest candidate rules or explanations, but approved SemanticRules remain the source of truth."
  },
  {
    question: "What can block a pull request?",
    answer:
      "Only a PROVEN finding from an approved critical rule in block mode can block a pull request."
  },
  {
    question: "What languages are supported?",
    answer:
      "The MVP is TypeScript-first and focuses on deterministic symbolic checks for TypeScript diffs."
  },
  {
    question: "Do teams need perfect documentation to start?",
    answer:
      "No. Teams can start with one important rule reviewers already enforce manually, then expand the SemanticRule set over time."
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
