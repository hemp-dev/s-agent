# Community roadmap

This roadmap describes the intended direction for S-Agent Core and future
AxiomGuard commercial work. It is not a promise of dates. It is a shared map
for community planning.

## v0.1 OSS Core

Focus: a useful local semantic analysis engine for TypeScript projects.

- CLI analysis.
- `SemanticRule` YAML validation.
- Basic TypeScript parser and indexer.
- Deterministic analyzer checks for MVP rule types.
- Proof-carrying findings.
- Markdown and JSON reports.
- Evaluation fixtures and synthetic benchmarks.
- Dogfood rules for this repository.

## v0.2 GitHub Action basic mode

Focus: run S-Agent Core in pull-request workflows without a hosted service.

- Basic GitHub Action wrapper.
- CI-friendly output.
- Optional PR annotation or summary support.
- Documentation for repository setup.

## v0.3 community rule packs

Focus: make it easier to share useful rules and examples.

- More example rule packs.
- Framework-specific fixtures.
- Rule authoring documentation.
- Compatibility guidance for community-maintained packs.

## v0.4 plugin API draft

Focus: design extension points before implementing a plugin system.

- Draft plugin API proposal.
- Analyzer check extension discussion.
- Rule pack packaging discussion.
- Compatibility and stability guidelines.

No plugin system is implemented yet.

## Future AxiomGuard Pro alpha

Focus: team workflows and governance built on top of S-Agent Core.

Potential commercial features include team workspaces, hosted review workflows,
finding history, rule approval flows, analytics, enterprise integrations, and
self-hosted deployment options.

The open-source core remains useful without these features.
