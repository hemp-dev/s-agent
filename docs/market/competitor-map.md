# Competitor Map

Last researched: May 8, 2026

## Category Thesis

IntentGuard should define and lead a focused category: **Intent-Aware Code Review**.

The product does not replace SAST, AI reviewers, linters, or architecture visualization tools. It fills the gap between written intent and code change behavior:

> Does this pull request violate an approved business or architecture rule the team already agreed to?

Useful category aliases for early testing:

- Semantic Code Review
- Intent-Aware PR Guard
- AI Coding Safety Layer

The strongest AI-era framing:

```text
AI writes code.
IntentGuard checks whether the code preserved business intent.
```

## Competitive Landscape

| Category | Representative tools | What buyers use them for | Where they are strong | Gap IntentGuard can own |
| --- | --- | --- | --- | --- |
| SAST and AppSec | GitHub CodeQL, Snyk Code, Semgrep, Checkmarx, Veracode | Find vulnerabilities, taint flows, insecure APIs, known weakness classes | Security coverage, compliance, CI and IDE integration, mature reporting | They usually answer "is this code secure?", not "does this change violate our product or architecture intent?" |
| AI code review | CodeRabbit, Greptile, Qodo, Bito, DeepSource AI review | Summarize PRs, flag bugs, enforce style or team guidance, accelerate review | Broad contextual feedback, PR-native experience, increasingly strong repo understanding | Findings can be hard to prove. IntentGuard should be deterministic-first and only block on approved rules with evidence. |
| Code quality tools | SonarQube, Codacy, DeepSource, ESLint | Maintainability, reliability, code smells, style, coverage, duplication | Developer familiarity, quality gates, broad rule libraries | They enforce generic or technical quality standards more than company-specific business invariants. |
| Architecture governance | ArchUnit, dependency-cruiser, CodeScene, Structure101 | Enforce layer boundaries, visualize dependency drift, prioritize technical debt | Architecture constraints, dependency maps, design drift awareness | Often language-specific, test-suite-specific, or focused on structure rather than business intent and PR reporting. |
| AI coding safety layer | Emerging internal platform tools, coding-agent guardrails, pre-merge agent checks | Keep AI-generated and refactored code inside approved constraints | Timely buyer pain, direct connection to AI adoption, clear risk story | This is the best wedge for IntentGuard: AI-assisted code can compile and still violate business meaning. |

## Pricing Anchors

Pricing changes often, but current public anchors show that buyers already pay per developer, contributor, active committer, or LOC for adjacent controls:

| Tool | Current public pricing anchor | Relevance |
| --- | --- | --- |
| GitHub Code Security | $30 per active committer/month | Security checks before production. IntentGuard can sit beside this as business-intent protection. |
| Semgrep Teams | Starting at $30 per contributor/month for Code or Supply Chain modules | AppSec platform pricing validates contributor-based spend for code controls. |
| SonarQube Cloud Team | Starts at EUR 30 monthly for up to 100k private LOC | LOC-based quality pricing validates codebase-scale budgets. |
| CodeRabbit Pro / Pro+ | $24 / $48 per developer/month billed annually | AI code review buyers already understand per-user pricing. |

## Competitor Notes

### SAST Tools

SAST vendors own the security shelf. GitHub code scanning and CodeQL focus on vulnerabilities and coding errors surfaced as code scanning alerts. Snyk Code describes itself as developer-first SAST. Semgrep Code is a SAST tool using rules and data-flow analysis, including custom rules. Checkmarx SAST examines code structure and flows, with preconfigured and custom queries. Veracode emphasizes enterprise SAST, language coverage, low false positives, and remediation workflow.

IntentGuard should not fight this category head-on. The best framing is "beside SAST":

- SAST protects against exploit risk.
- IntentGuard protects against business and architecture drift.
- SAST rules come from security taxonomies.
- IntentGuard rules come from approved internal docs, ADRs, architecture decisions, and domain constraints.

### AI Code Review Tools

CodeRabbit, Greptile, Qodo, Bito, and DeepSource are converging on context-aware pull request review. They emphasize repo context, summaries, bug detection, standards enforcement, AI fixes, and workflow automation. Greptile highlights custom rules and learning from review comments. Qodo positions around enterprise quality guardrails and rule enforcement. CodeRabbit offers PR reviews, planning, IDE/CLI workflows, and pre-merge checks.

IntentGuard should not claim to be a better general AI reviewer. The wedge is narrower:

- approved rules, not inferred preferences;
- proof-carrying findings, not broad suggestions;
- deterministic blocking, not LLM confidence;
- business intent translated into enforceable guardrails.

### Code Quality Tools

SonarQube positions around clean, secure, maintainable code with quality gates. ESLint owns configurable JavaScript/TypeScript linting. Codacy and DeepSource combine static analysis, code quality, security, and AI review in PR workflows.

IntentGuard should avoid "linter" language. A linter checks code shape. IntentGuard checks whether a change violates documented intent.

### Architecture Governance Tools

ArchUnit tests Java architecture within normal unit tests. dependency-cruiser validates and visualizes JavaScript and TypeScript dependencies with rules. CodeScene prioritizes code health and hotspots using development activity and quality signals.

IntentGuard can learn from this shelf but should keep its own category:

- architecture rules are one rule type, not the entire product;
- business invariants and side-effect constraints matter as much as package boundaries;
- PR reviewers need a report that ties code evidence back to documented decisions.

## Positioning Matrix

| Axis | Low end | High end | IntentGuard target |
| --- | --- | --- | --- |
| Source of truth | Inferred preferences | Approved documented rules | Approved SemanticRules generated from docs and reviewed by humans |
| Finding type | Generic quality issue | Business or architecture intent violation | Intent violation with code evidence |
| Review confidence | Heuristic suggestion | Deterministic proof | Only approved critical PROVEN findings block |
| Buyer mental model | Linter or reviewer | Governance guardrail | Intent-aware code review |
| Primary user | Individual developer | Platform and engineering leadership | Staff engineers, platform teams, engineering managers |

## Strategic Opening

The market is crowded around "find bugs faster" and "review code with AI." IntentGuard should choose a sharper pain:

> Teams are writing more code, but their product rules, architecture decisions, and domain constraints still live in docs that do not protect the codebase.

Do not position the product as "another SAST" or "another AI reviewer." Position it as the missing safety layer between AI-assisted development, refactoring, and approved business intent.

## Sources Checked

- [GitHub code scanning and CodeQL](https://docs.github.com/en/code-security/concepts/code-scanning/about-code-scanning)
- [Snyk Code docs](https://docs.snyk.io/scan-using-snyk/snyk-code)
- [Semgrep Code overview](https://semgrep.dev/docs/semgrep-code/overview)
- [Checkmarx SAST scanner docs](https://docs.checkmarx.com/en/34965-324470-sast-scanner.html)
- [Veracode Static Analysis](https://www.veracode.com/products/binary-static-analysis-sast)
- [SonarQube Cloud docs](https://docs.sonarsource.com/sonarcloud/)
- [ESLint](https://eslint.org/)
- [Codacy](https://www.codacy.com/)
- [DeepSource docs](https://docs.deepsource.com/docs/product)
- [CodeRabbit docs](https://docs.coderabbit.ai/about/features)
- [Greptile](https://www.greptile.com/)
- [Qodo code review docs](https://docs.qodo.ai/code-review)
- [Bito AI code review docs](https://docs.bito.ai/ai-code-reviews-in-git/overview)
- [ArchUnit](https://www.archunit.org/)
- [dependency-cruiser](https://www.npmjs.com/package/dependency-cruiser)
- [CodeScene Code Health](https://codescene.com/product/code-health)
- [GitHub security plans](https://github.com/security/plans)
- [Semgrep pricing](https://semgrep.dev/pricing/)
- [SonarQube Cloud pricing](https://www.sonarsource.com/plans-and-pricing/sonarcloud/)
- [CodeRabbit pricing](https://www.coderabbit.ai/pricing)
