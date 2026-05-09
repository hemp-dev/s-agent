# Open-core model

S-Agent Core is the open-source semantic analysis engine for intent-aware
code review. AxiomGuard Pro and Enterprise will be commercial products built
on top of S-Agent Core for team workflows, governance, automation, dashboards,
and enterprise deployment.

This repository contains S-Agent Core. The core must stay useful on its own.
It is not a teaser, crippled edition, or placeholder for a paid product.

## What is S-Agent Core?

S-Agent Core checks whether TypeScript code changes preserve approved business
and architectural intent.

The core turns documentation-backed `SemanticRule` files into deterministic
analysis over source code and produces proof-carrying findings. Approved rules
remain the source of truth. LLMs may help suggest rules or draft explanations,
but they don't create blocking findings.

S-Agent Core includes:

- CLI analysis.
- The `SemanticRule` model and YAML rule-file format.
- Rule loading and validation.
- Basic TypeScript parser and indexer.
- Basic deterministic analyzer checks.
- Proof-carrying findings.
- Markdown and JSON reports.
- Evaluation fixtures.
- Synthetic benchmarks.
- Local and basic CI usage.
- A planned basic GitHub Action.

## What is AxiomGuard Pro / Enterprise?

AxiomGuard is the future commercial platform built on top of S-Agent Core.
It is intended for teams and organizations that need shared workflows around
semantic code review.

## Product boundary

| Area | S-Agent Core | AxiomGuard Pro / Enterprise |
| --- | --- | --- |
| Availability | Open-source repository | Future commercial products |
| Primary user | Individual developers and CI jobs | Teams and organizations |
| Execution model | Local CLI and basic CI usage | Hosted, team, and enterprise workflows |
| Source of truth | Approved `SemanticRule` files | Shared rule governance built on core rules |
| Blocking behavior | Deterministic `PROVEN` findings only | Uses core findings, with extra workflow features |
| Required service | None | Future hosted or self-hosted platform |

Commercial editions may include:

- Hosted dashboard.
- Team workspaces.
- PR review bot with threaded comments.
- Rule approval console.
- Finding history.
- Developer feedback analytics.
- Automatic intent extraction.
- Git history mining.
- Advanced LLM explanations.
- Multi-repo governance.
- Organization-wide architecture map.
- Enterprise integrations.
- SSO, SCIM, and RBAC.
- Audit logs.
- Self-hosted and VPC deployment.
- Advanced compliance and security rule packs.
- Professional services.

These features are future extensions. They are not required for S-Agent Core to
be useful.

## What will always remain open source?

The open-source core will continue to include the engine pieces needed to run
meaningful semantic analysis locally and in CI:

- The CLI.
- Rule schema and YAML rule-file validation.
- Deterministic TypeScript checks for supported rule types.
- Parser and indexing support required by those checks.
- Finding classification and evidence-chain types.
- Markdown and JSON report generation.
- Tests, fixtures, and benchmark data needed to verify the core.
- Basic documentation for writing and running rules.
- Local CLI usage and basic CI usage.
- Basic GitHub Action usage when available.

Existing MVP features will not be moved behind a paywall.

## What may become commercial later?

Commercial features may focus on coordination, governance, history, hosted
automation, enterprise deployment, and advanced organization-level workflows.

The boundary is simple:

- S-Agent Core owns the local semantic analysis engine.
- AxiomGuard Pro / Enterprise owns hosted and team-oriented platform features.

## Why open-core?

Intent-aware code review works only if developers can inspect, run, test, and
trust the engine. Keeping the core open makes the rule model, findings, and
analysis behavior visible to the community.

Commercial products can then fund deeper team workflows without weakening the
open-source engine.

## Community commitment

S-Agent Core must remain:

- useful for individual developers and small teams;
- runnable without a hosted service;
- testable with local fixtures;
- transparent about why findings are produced;
- deterministic-first for blocking results;
- open to community rules, fixtures, examples, and analyzer checks.

Commercial work must not compromise those commitments.
