# Benchmark Methodology

S-Agent benchmarks measure deterministic semantic review quality on repository
fixtures. The benchmark command runs the same fixture set used by the evaluation
tests and reports both a Markdown summary table and a JSON summary.

## Command

```sh
pnpm benchmark
```

The script builds the workspace, runs `scripts/benchmark.cjs`, analyzes each
fixture listed in `tests/evaluation/fixtures/manifest.json`, and prints:

- a Markdown leaderboard row;
- a JSON object with aggregate counts, metrics, and per-fixture results.

## Fixture Set

The current benchmark includes:

- `clean-project`
- `layer-boundary-violation`
- `forbidden-side-effect-violation`
- `value-invariant-violation`
- `false-positive-cases`
- `ambiguous-cases`

Each fixture has expected findings in the manifest. Adding a new benchmark case
means adding a fixture directory and updating the manifest, then letting both
`pnpm test` and `pnpm benchmark` exercise it.

## Metrics

| Metric | Definition |
| --- | --- |
| `precision` | Expected findings detected divided by total findings emitted. If no findings are emitted, precision is `1`. |
| `recall` | Expected findings detected divided by expected findings in the manifest. If no findings are expected, recall is `1`. |
| `false_positive_rate` | Findings emitted on fixtures with no expected findings, divided by the number of those clean/control fixtures. |
| `proven_rate` | Findings with status `PROVEN` divided by total findings emitted. |
| `runtime_ms` | Wall-clock runtime for analyzing the benchmark fixture set, excluding the build step. |
| `clean_blocking_rate` | Clean/control fixtures with blocking results divided by clean/control fixtures. |

## Policy

Benchmark improvements must come from real analysis quality, not from
hard-coding fixture names, weakening evidence statuses, or changing analyzer
behavior solely to improve leaderboard numbers.

When behavior changes, update or add fixtures that explain the intended quality
movement. The benchmark should remain small, reproducible, and reviewable.
