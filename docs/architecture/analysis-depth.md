# Analysis depth

S-Agent should expose one simple complexity dial for users who want a faster
local loop or a more complete CI check. The future CLI flag is:

```sh
s-agent analyze --project . --depth fast
s-agent analyze --project . --depth standard
s-agent analyze --project . --depth deep
```

This design is documentation-only for now. Do not implement deep mode until the
standard deterministic pipeline has stable artifacts and benchmarks.

## Depth levels

`--depth fast` is for local feedback while editing. It should favor speed,
changed files, cached indexes, and deterministic checks with low setup cost.

`--depth standard` is the default mode for CI and pull requests. It should run
the supported deterministic analyzer checks, verify findings, and render normal
reports.

`--depth deep` is a future mode for slower repository-wide checks. It may add
broader cross-file analysis, richer rule coverage inspection, and more
expensive git-risk signals. It must remain deterministic-first and must not use
LLM output as a source of blocking truth.

## Initial behavior

Until this design is implemented, the CLI effectively behaves like
`--depth standard`.

The first implementation should add the flag without changing existing analyzer
semantics:

- `fast` may narrow scope only when the inputs make that safe and visible.
- `standard` must preserve current behavior.
- `deep` should be rejected or documented as unavailable until implemented.

## Guardrails

Depth must not create hidden policy differences. A rule that blocks in
`standard` should also block in `deep` when the same evidence exists.

Depth may change how much context S-Agent collects, but it must not change the
finding status definitions:

- `PROVEN` requires deterministic symbolic evidence.
- `PROBABLE` remains non-blocking.
- `SUSPECT` remains informational.
- `RULE_CONFLICT` signals disagreement between heuristic suspicion and
  symbolic results.
- `DISMISSED` remains not actionable.

## Test expectations

Every implemented depth mode must have fixtures or tests that prove:

- which files are included;
- which rules are included;
- which findings are emitted;
- which findings are allowed to block.

