# Messaging

## Message House

**Core claim:** AxiomGuard protects business intent in every code change.

**Audience:** Engineering leaders, platform teams, staff engineers, and teams adopting AI-assisted development.

**Category:** Intent-Aware Code Review.

**AI-era promise:** Prevent AI-generated and refactored code from breaking business intent.

## Primary Value Propositions

### 1. Preserve the rules that make your system yours

Generic tools catch generic issues. AxiomGuard checks the rules that are specific to your product, domains, architecture, and business logic.

### 2. Block only what is approved and proven

AxiomGuard separates suggestions from enforceable findings. Only approved critical rules with deterministic evidence can block a PR.

### 3. Turn docs into guardrails

Rules start from `CLAUDE.md`, READMEs, ADRs, and architecture docs, then become reviewed SemanticRules that run in CI.

### 4. Help reviewers focus on judgment

Stop spending senior review time restating the same boundaries. Let AxiomGuard handle repeatable intent checks and leave humans for design tradeoffs.

### 5. Make AI coding safer without slowing it down

AI can produce code that compiles, passes tests, and still violates product intent. AxiomGuard gives AI-generated and refactored code a deterministic check against rules your team approved.

## Product Language

Use:

- intent-aware code review
- approved rules
- business intent
- architecture intent
- proof-carrying findings
- deterministic evidence
- review guardrails
- source documentation
- pre-merge protection

Avoid:

- just another linter
- magic AI reviewer
- neuro-symbolic
- multi-agent
- autonomous governance
- generic code quality score
- "trust us" AI confidence

## Messaging By Persona

| Persona | Message |
| --- | --- |
| VP Engineering | Ship faster without letting architecture and domain rules drift. |
| CTO | Make the intent behind your system enforceable at review time. |
| Staff Engineer | Encode the review comments you repeat every week. |
| Platform Engineer | Give every repo a consistent, low-noise intent guardrail. |
| AppSec Lead | Add business-logic guardrails beside SAST and dependency scanning. |
| Developer | Get specific findings tied to rules your team approved. |
| AI Enablement Lead | Increase AI coding throughput without giving up deterministic pre-merge safety. |

## Objection Handling

### "Is this just a linter?"

No. Linters usually enforce syntax, style, or generic correctness. AxiomGuard enforces project-specific business and architecture intent approved by your team.

### "Our SAST already scans PRs."

Keep it. SAST protects against security vulnerabilities. AxiomGuard protects against documented domain and architecture violations, such as a read-only flow writing to the database or an auth module importing billing.

### "AI code review tools already do this."

Some AI reviewers can suggest issues from context. AxiomGuard is designed for enforceable decisions: approved rules, deterministic checks, evidence chains, and strict blocking rules.

### "Will this slow developers down?"

The MVP should start with a small number of critical rules. The product should default to review or info mode until teams trust a rule enough to mark it blocking.

### "Who writes the rules?"

Rules can be suggested from documentation, but a human must approve them before they are enforceable. The final source of truth is the SemanticRule file.

### "What about false positives?"

Blocking requires deterministic evidence and an approved critical rule. Heuristic findings should be classified as probable or suspect and should not block.

### "We do not have perfect docs."

That is normal. Start with the few rules senior engineers already repeat in reviews. AxiomGuard can make those rules visible, testable, and easier to improve.

### "Can developers bypass it?"

The policy should match the team's CI and repository settings. AxiomGuard can provide the evidence and exit code; branch protection decides whether blocking findings prevent merge.

## Proof Points To Build Toward

- Number of approved rules enforced.
- Number of prevented critical intent violations.
- Reduction in repeated architecture review comments.
- Time saved by staff engineers on routine boundary checks.
- Percentage of findings with deterministic proof.
- Rule adoption from info to review to block mode.

## Message Hierarchy

1. Business outcome: protect intent as code changes.
2. Practical mechanism: approved SemanticRules from docs.
3. Trust mechanism: deterministic evidence and finding statuses.
4. Workflow: PR and CI output.
5. Expansion: AI may suggest rules, but humans approve them.
