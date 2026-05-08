# MVP Success Criteria

## Required Product Outcomes

The MVP succeeds when it proves that approved intent can be enforced in a small, deterministic, developer-credible loop.

## Hard Gates

| Criterion | Target | Measurement |
| --- | --- | --- |
| Precision | >= 80% | `tests/evaluation/precision-benchmark.test.ts` |
| Recall | >= 50-60% on narrow MVP cases | `tests/evaluation/recall-benchmark.test.ts` and synthetic dataset |
| False positive rate | <= 20% | `tests/evaluation/false-positive-benchmark.test.ts` |
| First real repo usefulness | At least 1 useful semantic finding | Design partner pilot |
| Onboarding time | Under 30 minutes | Timed onboarding session |
| Clean project behavior | Zero blocking findings | Clean fixture and real repo smoke test |
| Broken fixture behavior | At least one PROVEN finding | Semantic fixture runner |
| Finding comprehension | Developer understands deterministic finding in under 60 seconds | Usability interview |

## Technical Readiness

- `pnpm install` completes.
- `pnpm build` completes.
- `pnpm test` completes.
- `pnpm lint` completes.
- CLI exits non-zero only for blocking PROVEN critical findings.
- Root dogfood rules validate successfully.
- Root dogfood analysis produces no blocking findings.
- Unit tests cover rule validation, registry behavior, import graph extraction, analyzer checks, and finding classification.
- Integration tests cover clean project analysis, broken project analysis, JSON report shape, Markdown report shape, and blocking behavior.

## Semantic Readiness

- Approved rules are the only enforceable source of truth.
- Candidate rules do not block.
- Deterministic evidence produces PROVEN findings.
- Heuristic evidence produces PROBABLE or SUSPECT findings.
- Every finding includes rule id, source documentation, changed file, evidence, status, severity, business impact, and technical details.

## Developer Readiness

- A new user can understand the rule format from README and examples.
- A developer can understand a generated finding without reading analyzer code.
- A team can start with one rule and run the CLI locally.
- Clean output is quiet and does not create review clutter.

## Business Readiness

- The first pilot can name a real rule they want enforced.
- The product can show a useful finding or a trusted clean pass in the first session.
- The team can explain why IntentGuard is different from SAST, a linter, and broad AI code review.
- Pricing discovery has enough signal to validate or reject per-active-contributor pricing.
- A team can create at least 5 SemanticRules without custom engineering help.
- A team still wants to run IntentGuard after 7 days.

## Failure Conditions

The MVP is not ready if:

- clean fixtures produce blocking findings;
- candidate rules can block;
- heuristic findings can block without deterministic evidence;
- the CLI requires manual setup beyond the documented flow;
- users cannot connect a finding back to the source rule;
- the product is described primarily as an AI reviewer or linter.

## First Real Repo Test

A successful first real repo test should produce one of these outcomes:

1. At least one accepted semantic finding.
2. A clean pass on a critical module with a rule the team agrees is useful.

Either outcome can be valuable. A noisy finding is not useful, even if technically detected.

## One-Sentence Value Test

A user should be able to explain the product in one sentence:

> IntentGuard checks whether AI-generated and refactored code still preserves approved business and architecture intent.
