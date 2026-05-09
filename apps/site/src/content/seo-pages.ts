import { pageMetadata } from "./landing";

export interface SeoFaq {
  question: string;
  answer: string;
}

export interface SeoClusterPage {
  slug: string;
  keyword: string;
  title: string;
  description: string;
  hero: string;
  definition: string;
  proofPoints: string[];
  useCases: string[];
  faq: SeoFaq[];
}

export const seoClusterPages: SeoClusterPage[] = [
  {
    slug: "semantic-code-review",
    keyword: "semantic code review",
    title: "Semantic Code Review for TypeScript PRs",
    description:
      "Semantic code review checks whether a TypeScript pull request preserves approved business and architecture intent, not only syntax, style, or security patterns.",
    hero: "Semantic code review catches code changes that are technically valid but semantically wrong for the system.",
    definition:
      "Semantic code review evaluates whether code preserves the meaning a team already approved in documentation, architecture decisions, and product rules. IntentGuard implements this with approved SemanticRule YAML, deterministic TypeScript analysis, and proof-carrying findings.",
    proofPoints: [
      "Approved SemanticRules are the source of truth.",
      "Deterministic symbolic evidence creates PROVEN findings.",
      "Only approved critical rules in block mode can stop a merge."
    ],
    useCases: [
      "Prevent auth code from importing billing code.",
      "Catch read-only flows that write to a database or emit events.",
      "Flag value literals that exceed an approved product threshold."
    ],
    faq: [
      {
        question: "How is semantic code review different from linting?",
        answer:
          "Linting checks generic style and syntax rules. Semantic code review checks project-specific intent, such as domain boundaries, side-effect rules, and business invariants."
      },
      {
        question: "Can semantic code review block a pull request?",
        answer:
          "IntentGuard can block only when an approved critical SemanticRule produces a PROVEN deterministic finding in block mode."
      }
    ]
  },
  {
    slug: "intent-aware-code-review",
    keyword: "intent-aware code review",
    title: "Intent-Aware Code Review Guardrails",
    description:
      "Intent-aware code review verifies that every pull request preserves documented business, product, and architecture rules.",
    hero: "Intent-aware code review gives every pull request a memory of the rules your team already agreed to follow.",
    definition:
      "Intent-aware code review checks code changes against approved intent from CLAUDE.md, READMEs, ADRs, and architecture notes. IntentGuard turns those approved rules into deterministic TypeScript checks with evidence a reviewer can audit.",
    proofPoints: [
      "Candidate rules can come from documentation, but a human approves enforcement.",
      "The YAML rule file remains the enforceable source of truth.",
      "Findings include the violated invariant, changed file, evidence, status, and severity."
    ],
    useCases: [
      "Turn repeated staff-engineer review comments into executable rules.",
      "Keep product invariants visible during refactors.",
      "Make architecture decisions enforceable in CI."
    ],
    faq: [
      {
        question: "What does intent-aware code review check?",
        answer:
          "It checks whether a change violates approved intent, including layer boundaries, forbidden side effects, and value invariants."
      },
      {
        question: "Does intent-aware code review rely on an LLM?",
        answer:
          "IntentGuard does not use an LLM as the source of truth for blocking. LLMs may suggest candidate rules or explanations, but approved SemanticRules decide enforcement."
      }
    ]
  },
  {
    slug: "ai-code-review-guardrails",
    keyword: "AI code review guardrails",
    title: "AI Code Review Guardrails for Generated Code",
    description:
      "AI code review guardrails help teams keep AI-generated and refactored code aligned with approved business and architecture rules.",
    hero: "AI-generated code can pass tests and still violate business intent. Guardrails make those rules explicit before merge.",
    definition:
      "AI code review guardrails are deterministic checks that constrain AI-assisted changes with approved project rules. IntentGuard verifies TypeScript pull requests against SemanticRules so AI-written code must respect the same intent as human-written code.",
    proofPoints: [
      "Prompts and repository context are helpful, but they are not enforceable policy.",
      "Approved rules create auditable findings with deterministic evidence.",
      "Heuristic suspicions can inform review, but only proof can block."
    ],
    useCases: [
      "Review AI-generated PRs for domain boundary drift.",
      "Protect billing, auth, entitlement, and pricing flows from plausible but wrong edits.",
      "Give platform teams a deterministic layer beside AI reviewers."
    ],
    faq: [
      {
        question: "Why do AI-generated pull requests need guardrails?",
        answer:
          "AI-generated code can be syntactically correct while missing business context. Guardrails check approved rules that prompts and tests may not enforce."
      },
      {
        question: "Is IntentGuard an AI reviewer?",
        answer:
          "No. IntentGuard is deterministic-first. It can complement AI reviewers, but blocking findings come from approved SemanticRules and symbolic evidence."
      }
    ]
  },
  {
    slug: "architecture-drift-prevention",
    keyword: "architecture drift prevention",
    title: "Architecture Drift Prevention for Pull Requests",
    description:
      "Architecture drift prevention catches pull requests that violate documented module boundaries and approved architecture decisions.",
    hero: "Architecture drift starts with one reasonable import. IntentGuard catches boundary violations before they become the new normal.",
    definition:
      "Architecture drift prevention keeps code changes aligned with approved architecture decisions. IntentGuard checks TypeScript imports and scoped rules so teams can stop layer boundary violations before they merge.",
    proofPoints: [
      "Rules can encode boundaries such as auth must not import billing.",
      "Findings show the importing file, resolved edge, violated invariant, and status.",
      "The CLI can fail only on approved critical rules with PROVEN evidence."
    ],
    useCases: [
      "Protect package direction in a TypeScript monorepo.",
      "Keep UI code from reaching into persistence layers.",
      "Preserve architecture decisions during modernization projects."
    ],
    faq: [
      {
        question: "What is architecture drift?",
        answer:
          "Architecture drift happens when code gradually diverges from approved design decisions, often through small dependencies, shortcuts, or refactors that look harmless in isolation."
      },
      {
        question: "How does IntentGuard prevent architecture drift?",
        answer:
          "IntentGuard encodes approved boundaries as SemanticRules, analyzes TypeScript changes, and reports proof-carrying findings when a pull request violates those boundaries."
      }
    ]
  },
  {
    slug: "business-logic-regression-prevention",
    keyword: "business logic regression prevention",
    title: "Business Logic Regression Prevention in Code Review",
    description:
      "Business logic regression prevention checks pull requests for rule violations such as unsafe side effects, broken product invariants, and invalid thresholds.",
    hero: "Business logic regressions are often valid code with the wrong meaning. IntentGuard checks the rules tests and linters miss.",
    definition:
      "Business logic regression prevention protects product rules such as pricing limits, entitlement assumptions, approval flows, and read-only behavior. IntentGuard turns those rules into deterministic checks over TypeScript changes.",
    proofPoints: [
      "Value invariants can flag obvious numeric thresholds that exceed approved limits.",
      "Forbidden side-effect rules can identify writes or emitted events in read-only flows.",
      "Every finding carries business and technical explanations."
    ],
    useCases: [
      "Prevent discounts from exceeding approved thresholds.",
      "Keep reporting and read-model functions from writing to persistence.",
      "Protect billing, entitlement, and compliance-sensitive modules during refactors."
    ],
    faq: [
      {
        question: "Why do business logic regressions escape normal tests?",
        answer:
          "Tests usually cover known examples. Business logic regressions can appear when a change is type-correct but violates an assumption documented outside the code path being tested."
      },
      {
        question: "What business rules can IntentGuard check today?",
        answer:
          "The MVP focuses on layer boundary violations, forbidden side effects, forbidden imports, and obvious value invariant violations in TypeScript projects."
      }
    ]
  }
] as const;

export const seoClusterSlugs = seoClusterPages.map((page) => page.slug);

export const seoLastUpdated = pageMetadata.lastUpdated;
