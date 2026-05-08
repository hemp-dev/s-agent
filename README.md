# S-Agent Core

S-Agent is an open-source semantic analysis engine for intent-aware code
review. It checks whether TypeScript code changes preserve approved business
and architectural intent.

AxiomGuard is the future commercial platform built on top of S-Agent Core for
team workflows and enterprise governance.

## Translations

- [Русский](docs/i18n/README.ru.md)
- [Español](docs/i18n/README.es.md)
- [简体中文](docs/i18n/README.zh-CN.md)
- [हिन्दी](docs/i18n/README.hi.md)
- [العربية](docs/i18n/README.ar.md)
- [Français](docs/i18n/README.fr.md)
- [Português do Brasil](docs/i18n/README.pt-BR.md)
- [Deutsch](docs/i18n/README.de.md)
- [日本語](docs/i18n/README.ja.md)

## Problem

Code can compile, pass tests, and still violate the intent of the system.

Examples:

- an auth module imports billing code;
- a read-only reporting flow writes to a database or emits events;
- a discount exceeds the approved product threshold;
- a refactor breaks an architecture decision documented in project docs.

Traditional linters and tests are not designed to enforce project-specific
business and architecture intent.

## Why intent-aware code review matters

Many important constraints live in documentation, architecture decisions, and
team conventions rather than in type systems or unit tests. S-Agent Core makes
those approved constraints executable, so a pull request can show not only that
the code is valid TypeScript, but also that it still respects the intended
boundaries and business rules.

## Solution

S-Agent Core turns approved `SemanticRule` YAML files into deterministic checks
over TypeScript source code. It reports proof-carrying findings that explain
the rule, the violated invariant, the changed file, the evidence, and the
blocking status.

The core is intentionally small:

- documentation-backed rules are the source of truth;
- deterministic symbolic checks produce blocking findings;
- only `PROVEN` findings from approved critical rules in `block` mode may fail
  the CLI;
- LLMs are not used as the source of truth for blocking behavior.

## What it checks today

The MVP focuses on TypeScript projects and a small set of practical checks:

- layer boundary violations, such as `src/auth/**` importing `src/billing/**`;
- forbidden imports for package or module boundaries;
- forbidden side effects in read-only scopes using simple call-name heuristics;
- value invariants using obvious numeric literal checks, such as a discount
  value above the approved maximum.

## What is included in v0.1.0

S-Agent Core v0.1.0 includes the open-source MVP:

- CLI analysis for local and CI usage.
- The `SemanticRule` model and YAML rule-file format.
- Rule loading and validation.
- Basic TypeScript parser and indexer.
- Basic deterministic analyzer checks.
- Proof-carrying findings with explicit finding statuses.
- Markdown and JSON reports.
- Clean and broken demo projects.
- Evaluation fixtures and synthetic benchmarks.
- Dogfood architecture rules for this repository.
- Open-core, contribution, governance, security, and community docs.
- README translations for major world languages.

## Project status

S-Agent Core is an experimental MVP. It is useful for local demos, fixtures,
and early CI experiments, but the public API and rule schema may still change
before `1.0.0`.

## Quick start

Install dependencies:

```sh
pnpm install
```

Build, test, and lint:

```sh
pnpm build
pnpm test
pnpm lint
```

Run the clean demo analysis:

```sh
pnpm analyze:demo
```

Validate S-Agent's own dogfood rules:

```sh
pnpm rules:validate
```

Analyze this repository against its own architecture rules:

```sh
pnpm analyze:self
```

Run the intentionally broken demo:

```sh
pnpm analyze:demo:broken
```

`pnpm analyze:demo:broken` exits with code `1` because it intentionally
contains a blocking violation. `pnpm analyze:demo` uses the clean demo and is
expected to exit with code `0`.

After building, the CLI entrypoint is available as the workspace binary package
`@s-agent/cli` with the `s-agent` bin.

## Example SemanticRule

Rules live in `.rules.yml` files:

```yaml
rules:
  - rule_id: INV-AUTH-001
    domain: auth
    status: approved
    owner: platform
    severity: critical
    scope:
      modules:
        - "src/auth/**"
    intent: "Authentication must remain identity-only."
    invariants:
      - id: INV-AUTH-001
        type: layer_boundary
        description: "Auth module must not import billing."
        from: "src/auth/**"
        to: "src/billing/**"
    enforcement:
      mode: block
    source:
      file: "CLAUDE.md"
      section: "authentication-module"
```

Approved rules are the source of truth. Candidate, deprecated, archived, or
disabled rules may be loaded and inspected, but they cannot create blocking
findings.

## How SemanticRule works

A `SemanticRule` records an approved intent from project documentation and the
deterministic invariant S-Agent Core can check. The rule status and enforcement
mode decide whether a finding can block:

- `status: approved` marks a rule as enforceable.
- `severity: critical` marks a rule as high impact.
- `enforcement.mode: block` allows proven violations to fail the CLI.
- Candidate, deprecated, archived, or disabled rules cannot create blocking
  findings.

Only approved critical rules with deterministic `PROVEN` evidence can block.

## Example finding

```md
# S-Agent Report

Project: /path/to/examples/demo-typescript-app

## Violation: INV-AUTH-001

Changed file: src/auth/session.ts
Changed symbol: module

Problem: Layer boundary violation: src/auth/session.ts imports
../billing/billing-service.

Why this matters:
The authentication layer is identity-only; billing behavior must stay inside
the billing domain.

Technical details:
The importing file matches 'src/auth/**' and the resolved import matches
'src/billing/**'.

Status: PROVEN
Severity: critical
Blocking: yes
```

## Finding statuses

- `PROVEN`: deterministic symbolic evidence exists. Approved critical
  `PROVEN` findings in `block` mode may fail the CLI.
- `PROBABLE`: strong heuristic evidence exists, but not enough proof to block.
- `SUSPECT`: weak signal; informational only.
- `RULE_CONFLICT`: reserved for future cases where heuristic suspicion
  conflicts with symbolic evidence.
- `DISMISSED`: not actionable, not approved, or unsupported by evidence.

## What is open source?

S-Agent Core is open source and includes:

- CLI analysis.
- The `SemanticRule` model and YAML rule-file format.
- Rule loading and validation.
- Basic TypeScript parser and indexer.
- Basic deterministic analyzer checks.
- Proof-carrying findings.
- Markdown and JSON reports.
- Evaluation fixtures.
- Synthetic benchmarks.
- Basic CI usage.
- A planned basic GitHub Action.

The open-source core must remain useful on its own. Existing MVP features will
not be moved behind a paywall.

## Open-core model

S-Agent Core is the open-source semantic analysis engine.

AxiomGuard Pro and Enterprise may later add team and organization workflows on
top of the core, such as:

- hosted dashboard;
- team workspace;
- PR review bot with threaded comments;
- rule approval console;
- finding history;
- developer feedback analytics;
- automatic intent extraction;
- Git history mining;
- advanced LLM explanations;
- multi-repo governance;
- organization-wide architecture map;
- enterprise integrations;
- SSO, SCIM, and RBAC;
- audit logs;
- self-hosted and VPC deployment;
- advanced compliance and security rule packs;
- professional services.

These are future commercial extensions. They are not required to run S-Agent
Core locally or in CI.

Read the full [open-core model](OPEN_CORE.md).

## Repository layout

- `packages/rules`: `SemanticRule` model, YAML loading, validation, registry,
  and lifecycle.
- `packages/parser`: TypeScript file indexing, import extraction, and function
  extraction.
- `packages/analyzer`: deterministic and heuristic rule checks.
- `packages/verifier`: finding statuses, evidence chains, and blocking
  classification.
- `packages/explainer`: Markdown and JSON report rendering.
- `packages/core`: orchestration across rules, analyzer, verifier, and
  explainer.
- `packages/shared`: shared types and utilities.
- `apps/cli`: command-line interface.
- `rules`: S-Agent's own dogfood rules, including package boundary rules.
- `examples`: broken and clean TypeScript demo projects.
- `tests/evaluation`: semantic benchmark fixtures and metric tests.
- `docs/community`: community roadmap and contribution ideas.

## Current limitations

- Diff support only filters findings by files listed in a unified diff and is
  not exposed as a full CLI workflow yet.
- Side-effect detection is heuristic and name-based.
- Value invariant detection only catches simple numeric literals.
- Import resolution is intentionally simple for the MVP.
- TypeScript is the only supported language.
- No GitHub Action PR comment workflow yet.
- No dashboard or hosted service exists in this repository.
- No LLM rule suggestion flow is implemented.

## Roadmap

- v0.1: open-source core with CLI, rule validation, parser, analyzer,
  proof-carrying findings, reports, fixtures, and benchmarks.
- v0.2: basic GitHub Action mode.
- v0.3: community rule packs and more framework examples.
- v0.4: plugin API draft and extension-point design.
- Future: AxiomGuard Pro alpha for team workflows and governance.

See the [community roadmap](docs/community/community-roadmap.md).

## Contributing

Contributions are welcome when they keep S-Agent Core focused, useful, and
testable.

Good places to start:

- add fixtures;
- improve examples;
- add rule examples;
- improve CLI output;
- document the `SemanticRule` schema;
- add framework-specific examples.

Read [CONTRIBUTING.md](CONTRIBUTING.md) and
[good first issues](docs/community/good-first-issues.md).

## Security

Don't open public issues for security vulnerabilities. Read
[SECURITY.md](SECURITY.md) for the reporting process.

## License

S-Agent Core is licensed under the [Apache License 2.0](LICENSE).
