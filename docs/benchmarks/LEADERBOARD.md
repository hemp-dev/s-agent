# S-Agent Benchmark Leaderboard

This leaderboard tracks S-Agent Core quality on the canonical evaluation
fixtures in `tests/evaluation/fixtures`. Results are generated with:

```sh
pnpm benchmark
```

Runtime is local-machine dependent and should be treated as directional. The
quality metrics are the primary comparison signal.

| Version | Date | Fixtures | Precision | Recall | False positive rate | PROVEN rate | Runtime | Clean blocking rate | Notes |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| v0.2.0 | 2026-05-09 | 6 | 1.000 | 1.000 | 0.000 | 0.500 | 20 ms | 0.000 | Initial local baseline on existing evaluation fixtures. |

## Submission Rules

- Run `pnpm benchmark` from a clean checkout after `pnpm install`.
- Include analyzer, verifier, parser, or rule changes that explain metric
  movement.
- Do not tune analyzer behavior only to improve this fixture set.
- Add new fixtures for new violation classes or regressions before claiming a
  quality improvement.
- Keep PR comments, hosted services, and dashboards out of benchmark scoring.

See [methodology.md](methodology.md) for metric definitions and fixture policy.
