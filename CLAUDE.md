# S-Agent Project Instructions

## Product Goal

We are building S-Agent MVP: a semantic code review guard that turns project documentation, CLAUDE.md, README, ADRs and approved project rules into enforceable semantic checks for pull requests.

S-Agent must detect when code changes are technically valid but violate business or architectural intent.

The MVP must be practical, deterministic-first, and not over-engineered.

## Core Principle

Do not build a full multi-agent research system.

Build a minimal, testable product:

CLAUDE.md / docs
→ SemanticRule YAML
→ TypeScript diff / AST analysis
→ symbolic finding
→ proof-carrying report
→ CLI output
→ later GitHub Action comment

LLM is allowed only for:
- suggesting candidate rules from documentation;
- generating human-readable explanations;
- ambiguity analysis.

LLM must not be the source of truth.
Only approved SemanticRules can create blocking findings.

## Hard Constraints

- TypeScript-first.
- Monorepo with pnpm workspaces.
- Keep architecture modular but MVP-focused.
- Use YAML/JSON for SemanticRule source of truth.
- Validate rules with JSON Schema or Zod.
- Start with deterministic symbolic checks.
- Do not add Neo4j, JSON-LD, GNN, MLN, Z3, full MoE, or multi-language support in MVP.
- Do not create a complex dashboard.
- Do not introduce unnecessary abstractions.

## MVP Scope

Implement only these violation types first:

1. Layer Boundary Violation
Example: auth module must not import billing module.

2. Forbidden Side Effect
Example: read-only function must not write to database or emit events.

3. Value Invariant Violation
Example: discount must not exceed max allowed threshold.

## Required Finding Statuses

Every finding must be classified as:

- PROVEN: deterministic symbolic evidence exists.
- PROBABLE: strong semantic suspicion but no full proof.
- SUSPECT: weak signal, informational only.
- RULE_CONFLICT: neural or heuristic suspicion conflicts with symbolic result.
- DISMISSED: not actionable.

Only PROVEN findings from approved critical rules may block.

## Self-Application Principle

S-Agent must be developed using the same principles it is designed to enforce.

This means:

- Every module must have a clear intent.
- Every package must have explicit architectural boundaries.
- Business and architectural invariants must be written as SemanticRules.
- Code changes must preserve module intent.
- New features must not violate the approved architecture.
- The project must dogfood its own rules as early as possible.

The implementation agent must treat this repository as the first test case for S-Agent.

Whenever a new package, module or feature is added, update or create the corresponding SemanticRule.

## S-Agent Internal Architecture Rules

The codebase must follow these boundaries:

1. `packages/rules`
   - Owns SemanticRule loading, validation and lifecycle.
   - Must not depend on analyzer, parser, verifier or explainer.

2. `packages/parser`
   - Owns TypeScript code indexing.
   - Must not know about business explanations.
   - May depend on shared and core only.

3. `packages/analyzer`
   - Owns rule checks.
   - May depend on rules, parser, verifier types and shared.
   - Must not generate final user-facing explanations.

4. `packages/verifier`
   - Owns finding classification and evidence chain.
   - Must not parse source files directly.
   - Must not call LLM.

5. `packages/explainer`
   - Owns human-readable output.
   - Must not decide whether a finding is true.
   - Must only explain findings produced by analyzer/verifier.

6. `apps/cli`
   - Orchestrates packages.
   - Must not contain core analysis logic.

7. `apps/github-action`
   - Must call CLI/core APIs.
   - Must not duplicate analyzer logic.

## Required Evidence Chain

Every finding must include:

- rule_id
- violated invariant
- source file and line if available
- changed file
- changed symbol if available
- evidence type
- status
- severity
- business explanation
- technical explanation

## Code Quality Rules

- Prefer small files.
- Prefer pure functions where possible.
- Add tests for every core module.
- Do not hide errors.
- Use typed interfaces.
- Keep CLI usable.
- Every implemented feature must have at least one fixture or test.

## Initial Commands

Use pnpm.

Expected commands:

- pnpm install
- pnpm build
- pnpm test
- pnpm lint

If a command fails, fix the implementation instead of bypassing tests.