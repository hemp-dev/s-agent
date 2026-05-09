# Landing Page Copy

## Hero

**Eyebrow:** Intent-Aware Code Review

**Headline:** Protect business intent in every code change.

**Subheadline:** AxiomGuard turns approved engineering docs, ADRs, and project rules into deterministic pull request checks. Prevent AI-generated and refactored code from breaking business intent before it merges.

**Primary CTA:** Run AxiomGuard on a Demo PR

**Secondary CTA:** See Example Rules

**Trust line:** Blocking findings require approved rules and deterministic evidence.

## Problem Section

**Headline:** Your most important rules are stuck in docs.

Architecture decisions live in ADRs. Domain rules live in READMEs. Product constraints live in senior engineers' heads. Meanwhile, AI-generated and refactored code keeps moving faster.

SAST finds vulnerabilities. Linters find style issues. AI reviewers find plausible concerns. But who checks whether a PR violates the intent your team already agreed to?

## Solution Section

**Headline:** Turn intent into review guardrails.

AxiomGuard reads approved SemanticRules and checks TypeScript changes for violations of business and architecture intent.

- Prevent layer boundary drift.
- Flag forbidden side effects in read-only flows.
- Catch obvious value invariant violations.
- Tie every finding back to source documentation.
- Block only approved critical rules with proof.

## How It Works

### 1. Start with your docs

Use `CLAUDE.md`, READMEs, ADRs, and architecture docs as the source material for candidate rules.

### 2. Approve explicit SemanticRules

A human approves the rules that should govern review. The YAML rule file becomes the source of truth.

### 3. Check every PR

AxiomGuard indexes TypeScript code, analyzes imports and functions, verifies findings, and produces a proof-carrying report.

### 4. Block only proven critical violations

Heuristics can inform reviewers. Only approved critical rules with deterministic evidence block.

## Use Cases

**Architecture boundaries:** Auth must not import billing. UI must not call persistence directly. Packages must preserve layer direction.

**Business invariants:** Discounts must not exceed an approved threshold. Enterprise-only flows must not run for free accounts.

**Side-effect constraints:** Read-only functions must not write to the database, emit events, publish messages, or dispatch commands.

**AI coding safety:** Give generated and refactored code the same approved intent checks as human-written code.

## Differentiation Section

**Headline:** Not another linter. Not another vague AI reviewer.

AxiomGuard is deterministic-first. AI can help suggest candidate rules, but it cannot create blocking findings. Blocking requires approved rules, symbolic evidence, and a trace back to source documentation.

| Alternative | What it checks | What AxiomGuard adds |
| --- | --- | --- |
| SAST | Security vulnerabilities | Product and architecture intent |
| Linters | Style and syntax patterns | Business-specific invariants |
| AI reviewers | Broad contextual suggestions | Approved, proof-carrying blocking rules |
| Architecture tools | Dependencies and structure | PR reports tied to documented intent |

## CTA Section

**Headline:** Start with one rule your team repeats every week.

Encode it. Approve it. Run it on a real PR.

**Primary CTA:** Try the Demo

**Secondary CTA:** Read the Rule Format

## FAQ

**Is this a replacement for SAST?**

No. AxiomGuard complements SAST by checking business and architecture intent rather than security vulnerability classes.

**Does it use an LLM?**

The MVP does not use an LLM for enforcement. Future LLM features may suggest candidate rules or explanations, but approved SemanticRules remain the source of truth.

**What can block a pull request?**

Only a `PROVEN` finding from an approved critical rule in block mode.

**What languages are supported?**

The MVP is TypeScript-first.

**Do we need perfect documentation?**

No. Start with one important rule that reviewers already enforce manually.
