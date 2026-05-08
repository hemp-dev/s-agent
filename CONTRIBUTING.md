# Contributing to S-Agent Core

Thanks for helping build S-Agent Core. This project is early-stage and
MVP-focused. We value small, clear contributions that keep the open-source
engine useful, deterministic-first, and easy to test.

## Install dependencies

Use pnpm:

```sh
pnpm install
```

## Build

```sh
pnpm build
```

## Test

```sh
pnpm test
```

## Lint

The current lint command runs the TypeScript build in strict, non-pretty mode:

```sh
pnpm lint
```

## Run demo analysis

Run the clean demo:

```sh
pnpm analyze:demo
```

The broken demo is intentionally expected to fail with a blocking finding:

```sh
pnpm analyze:demo:broken
```

## Run full local validation

Before opening a larger PR, run the same checks maintainers expect for the
open-source core:

```sh
pnpm build
pnpm test
pnpm lint
pnpm rules:validate
pnpm analyze:demo
pnpm analyze:self
```

## Project structure

- `apps/cli`: command-line interface and orchestration entrypoint.
- `packages/core`: programmatic orchestration across core packages.
- `packages/rules`: `SemanticRule` loading, validation, registry, and lifecycle.
- `packages/parser`: TypeScript file indexing, imports, and symbols.
- `packages/analyzer`: deterministic rule checks.
- `packages/verifier`: finding status, evidence chains, and blocking decisions.
- `packages/explainer`: Markdown and JSON output for findings.
- `packages/shared`: shared types and utility functions.
- `rules`: S-Agent's own dogfood architecture rules.
- `examples`: clean and broken demo TypeScript projects.
- `tests/evaluation`: fixtures and benchmark-style tests.

## Add a SemanticRule

1. Add or update a `.rules.yml` file under `rules`, an example project, or an
   evaluation fixture.
2. Keep the rule specific to one business or architectural invariant.
3. Use `status: approved` only for rules that are ready to enforce.
4. Use `enforcement.mode: block` only when a proven violation should fail CI.
5. Run rule validation:

```sh
pnpm rules:validate
```

## Add a new analyzer check

1. Start with a documented invariant and an approved `SemanticRule`.
2. Add the check under `packages/analyzer/src/checks`.
3. Keep the implementation deterministic-first.
4. Preserve evidence-chain discipline for every finding.
5. Add unit tests for the check.
6. Add at least one fixture or evaluation case.
7. Avoid adding LLM calls, graph databases, dashboards, multi-language support,
   or enterprise features without opening a design discussion first.

Every finding must preserve:

- `rule_id`
- violated invariant
- source file and line when available
- changed file
- changed symbol when available
- evidence type
- status
- severity
- business explanation
- technical explanation

## Add fixtures

Fixtures live in `tests/evaluation/fixtures`.

A good fixture includes:

- a small `src` tree;
- a `CLAUDE.md` or project-intent document;
- a `rules/semantic.rules.yml` file;
- one clear expected outcome.

Prefer small fixtures that show one behavior at a time.

## Add tests

Add tests with the smallest scope that proves the change:

- package-level tests live next to the package source;
- cross-package CLI behavior belongs in `tests/integration`;
- precision, recall, false-positive, and benchmark coverage belongs in
  `tests/evaluation`.

Every new analyzer check must include tests and fixtures.

Run the test suite before opening a PR:

```sh
pnpm test
```

## Add evaluation tests

Evaluation tests live in `tests/evaluation`.

Use them when a contribution changes expected precision, recall, false-positive
behavior, or benchmark coverage. Keep evaluation tests deterministic and avoid
network access.

## Coding standards

- Keep the core deterministic-first.
- Prefer small files and pure functions.
- Use typed interfaces.
- Don't hide errors.
- Don't add commercial code to the OSS core.
- Don't add LLM enforcement, Neo4j, dashboards, multi-language support, or
  enterprise features to the OSS core without discussion.
- Don't move existing MVP functionality behind a commercial boundary.
- Add tests for every core module change.
- Add fixtures for every new analyzer behavior.
- Every new analyzer check must include tests and fixtures.

## Commit style

Use clear, imperative commit messages:

```text
Add value invariant fixture
```

Keep commits focused. Separate documentation, tests, and behavior changes when
that makes review easier.

## Pull request checklist

Before opening a PR, check that:

- Tests were added or updated for behavior changes.
- Fixtures were added for new analyzer checks.
- Documentation was updated when commands, rules, or outputs changed.
- No commercial code was added to the OSS core.
- No advanced architecture dependency was added without discussion.
- Finding evidence chains remain complete.
- `pnpm build` passes.
- `pnpm test` passes.
- `pnpm lint` passes.
- `pnpm rules:validate` passes.
- `pnpm analyze:demo` passes.
- `pnpm analyze:self` passes.
