# S-Agent MVP

S-Agent is a deterministic-first semantic code review guard for TypeScript projects. It is the internal architecture behind the IntentGuard product direction:

> Protect business intent in every code change.

S-Agent turns approved project-specific `SemanticRule` YAML files into symbolic checks over TypeScript source code and reports proof-carrying findings. The product value is simple: teams can verify that code changes preserve approved business and architectural intent, not just syntax, style, or generic security patterns.

The MVP intentionally stays small: no Neo4j, no dashboard, no solver, no LLM enforcement, no multi-agent runtime, and no multi-language support.

## Why It Exists

Code can compile, pass tests, and still break the intent of the system.

Examples:

- an auth module imports billing code;
- a read-only flow writes to a database or emits events;
- a discount exceeds the approved product threshold;
- AI-generated or refactored code violates an architecture decision documented in an ADR.

S-Agent is built for those cases. It checks approved intent, produces evidence, and only blocks when a critical rule is both approved and proven.

## What It Checks

- Layer boundary violations, such as `src/auth/**` importing `src/billing/**`.
- Forbidden imports for package or module boundaries.
- Forbidden side effects in read-only scopes using simple call-name heuristics.
- Value invariants using obvious numeric literal checks, such as `discount = 45` when the max is `30`.

Only `PROVEN` findings from approved critical rules in `block` mode are blocking.

## Quick Start

Install dependencies:

```sh
pnpm install
```

Build and test:

```sh
pnpm build
pnpm test
pnpm lint
```

Validate S-Agent's own dogfood rules:

```sh
pnpm rules:validate
```

Run the green demo smoke test:

```sh
pnpm analyze:demo
```

Run the intentionally broken demo:

```sh
pnpm analyze:demo:broken
```

Analyze this repository against its own architecture rules:

```sh
pnpm analyze:self
```

After building, the CLI entrypoint is also available as the workspace binary package `@s-agent/cli` with the `s-agent` bin.

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

Approved rules are the source of truth. Candidate, deprecated, archived, or disabled rules may be loaded and inspected, but they cannot create blocking findings.

## Demo Output

```md
# S-Agent Report

Project: /path/to/examples/demo-typescript-app

## Violation: INV-AUTH-001

Changed file: src/auth/session.ts
Changed symbol: module

Problem: Layer boundary violation: src/auth/session.ts imports ../billing/billing-service.

Why this matters:
The authentication layer is identity-only; billing behavior must stay inside the billing domain.

Technical details:
The importing file matches 'src/auth/**' and the resolved import matches 'src/billing/**'.

Status: PROVEN
Severity: critical
Blocking: yes
```

The broken demo exits with code `1` because it intentionally violates a critical approved rule. The clean demo and self-analysis should exit with code `0`.

## Finding Statuses

- `PROVEN`: deterministic symbolic evidence exists. Approved critical `PROVEN` findings in `block` mode may fail the CLI.
- `PROBABLE`: strong heuristic evidence exists, but not enough proof to block.
- `SUSPECT`: weak signal; informational only.
- `RULE_CONFLICT`: reserved for future cases where heuristic suspicion conflicts with symbolic evidence.
- `DISMISSED`: not actionable, not approved, or unsupported by evidence.

## Repository Layout

- `packages/rules`: SemanticRule model, YAML loading, validation, registry, lifecycle.
- `packages/parser`: TypeScript file indexing, import extraction, function extraction.
- `packages/analyzer`: deterministic and heuristic rule checks.
- `packages/verifier`: finding statuses, evidence chain, blocking classification.
- `packages/explainer`: deterministic Markdown and JSON report rendering.
- `packages/core`: orchestration across rules, analyzer, verifier, and explainer.
- `apps/cli`: command-line interface.
- `rules`: S-Agent's own dogfood rules, including package boundary rules.
- `examples`: broken and clean TypeScript demo projects.
- `tests/evaluation`: semantic benchmark fixtures and metric tests.
- `.github/workflows/ci.yml`: release CI for install, build, test, lint, rule validation, clean demo analysis, and self-analysis.

## Release Checks

```sh
pnpm install
pnpm build
pnpm test
pnpm lint
pnpm rules:validate
pnpm analyze:demo
pnpm analyze:self
```

## Known Limitations

- Diff support only filters findings by files listed in a unified diff and is not exposed as a full CLI workflow yet.
- Side-effect detection is heuristic and name-based.
- Value invariant detection only catches simple numeric literals.
- Import resolution is intentionally simple for MVP.
- TypeScript is the only supported language.
- No GitHub Action PR comment workflow, dashboard, LLM rule suggestion flow, or multi-language parser yet.

## Next Step

Add Git diff ingestion to the CLI so `s-agent analyze --diff` reports only changed files in pull-request workflows.
