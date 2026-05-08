# Good first issues

S-Agent Core is early, so small contributions can have a large impact. Good
first issues should be narrow, testable, and easy to review.

## Add more fixtures

Add small projects under `tests/evaluation/fixtures` that show one invariant
at a time. Useful fixtures include:

- clean layer boundaries;
- broken layer boundaries;
- forbidden side-effect examples;
- value invariant examples;
- ambiguous cases that should not block.

## Improve README examples

Make the README easier for new users by improving:

- `SemanticRule` examples;
- CLI output examples;
- quick-start steps;
- explanation of finding statuses;
- links to deeper docs.

## Add more rule examples

Add example `.rules.yml` files for common architecture and business intent
patterns. Keep examples small and deterministic.

Useful examples include:

- auth boundaries;
- billing boundaries;
- read-only reporting flows;
- discount thresholds;
- dependency direction rules.

## Improve CLI output

Improve wording, formatting, or readability in CLI reports without changing
finding truth or blocking behavior.

Changes to output must include tests.

## Add docs for the SemanticRule schema

Write clearer docs for:

- required fields;
- rule statuses;
- enforcement modes;
- supported invariant types;
- evidence-chain expectations;
- examples for clean and violating cases.

## Add framework-specific examples

Add examples that show how S-Agent Core can protect intent in common TypeScript
project structures.

Useful examples include:

- Next.js app boundaries;
- Express service boundaries;
- NestJS module boundaries;
- frontend state-management invariants;
- package-level monorepo boundaries.

Framework examples must stay in the OSS core scope and avoid commercial
workflow features.
