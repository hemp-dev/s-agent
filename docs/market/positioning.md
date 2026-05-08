# Positioning

## Recommended Category

**Intent-Aware Code Review**

Definition:

> Intent-aware code review verifies whether a code change preserves approved business, product, and architecture intent.

This category is adjacent to SAST, code quality, architecture governance, AI code review, and the emerging AI coding safety layer. It is not a replacement for any one of them.

Secondary category language to test:

- Semantic Code Review
- Intent-Aware PR Guard
- AI Coding Safety Layer

## Core Positioning

**AxiomGuard protects business intent in every code change.**

For engineering teams shipping quickly, AxiomGuard turns documented rules from `CLAUDE.md`, READMEs, ADRs, and architecture docs into deterministic pull request checks. It flags only approved rule violations as blocking, and every finding carries evidence back to the source intent.

Internal architecture formulation:

> S-Agent is the internal semantic analysis architecture. AxiomGuard is the product built on top of S-Agent. AxiomGuard helps engineering teams verify that AI-generated and refactored code still preserves approved business and architectural intent.

Product formulation:

> Prevent AI-generated and refactored code from breaking business intent.

## Positioning Option 1: The Intent Guardrail

**Statement:** AxiomGuard is the PR guardrail for business and architecture intent.

**Best for:** Platform teams and staff engineers.

**Strength:** Clear, direct, and differentiated from generic AI review.

**Risk:** "Guardrail" is becoming common in AI tooling, so the proof and approved-rule language must carry the differentiation.

## Positioning Option 2: Policy-as-Code for Product Engineering

**Statement:** AxiomGuard turns engineering decisions into policy-as-code for pull requests.

**Best for:** Enterprise and regulated buyers.

**Strength:** Familiar mental model for governance and compliance buyers.

**Risk:** Could sound heavy or compliance-first for product engineering teams.

## Positioning Option 3: Architecture Drift Prevention

**Statement:** AxiomGuard catches architecture drift before it merges.

**Best for:** Architecture guilds and platform teams.

**Strength:** Very concrete and urgent.

**Risk:** Too narrow. The product also protects business invariants and side-effect rules.

## Positioning Option 4: Deterministic Review for AI-Written Code

**Statement:** AxiomGuard gives AI-generated code a deterministic review layer.

**Best for:** Teams adopting coding agents.

**Strength:** Timely and easy to understand.

**Risk:** Could over-anchor on AI as the problem. The product should be valuable for all code changes.

## Recommended Position

Lead with Option 1 and support with Options 2 and 4:

> AxiomGuard is the intent-aware code review guardrail for engineering teams that need code changes to preserve approved business and architecture rules.

Supporting proof points:

- Approved SemanticRules are the source of truth.
- Deterministic checks create `PROVEN` findings.
- Only approved critical rules in block mode can block.
- Every finding includes code evidence and source documentation.
- AI can suggest rules, but cannot create blocking findings.

## Category Boundaries

AxiomGuard is not:

- a SAST replacement;
- a general AI reviewer;
- a code formatter;
- a dashboard-first governance platform;
- a prompt-based policy engine.

AxiomGuard is:

- a deterministic review layer;
- a rule lifecycle for approved intent;
- a bridge from docs to PR enforcement;
- a proof-carrying report for reviewers.

## Strategic Taglines

- Protect business intent in every code change.
- Turn architecture decisions into review checks.
- Stop intent drift before it merges.
- Give every PR a memory of your rules.
- Make documented decisions enforceable.

## One-Liner

AxiomGuard is an intent-aware code review tool that turns approved engineering docs into deterministic PR checks.

## Elevator Pitch

Modern teams write code faster than they can review it, especially with AI-assisted development. But the rules that matter most - domain boundaries, side-effect constraints, product invariants, compliance assumptions - still live in docs and senior engineers' heads. AxiomGuard turns approved intent into deterministic review checks, so every blocking finding is backed by code evidence and source documentation.

## Architecture-To-Product Language

Technical:

> S-Agent turns architecture docs and project rules into enforceable semantic code review checks.

Customer-facing:

> AxiomGuard turns your architecture docs, `CLAUDE.md`, and product rules into enforceable semantic review checks for pull requests.

Russian-language positioning for local discovery:

> AxiomGuard помогает инженерным командам проверять, что AI-сгенерированный и отрефакторенный код сохраняет утвержденный бизнес- и архитектурный смысл.
