# Repository settings

These settings prepare the public GitHub repository for early community use.
They must be configured manually by a repository maintainer.

## About

Description:

```text
Open-source semantic analysis engine for intent-aware code review.
```

Website:

```text

```

Leave the website empty for now, or add a future landing page when one exists.

## Topics

Recommended GitHub topics:

- `static-analysis`
- `code-review`
- `typescript`
- `semantic-analysis`
- `developer-tools`
- `ai-code-review`
- `architecture`
- `open-source`

## Branch protection

Protect `main` with these settings:

- Require a pull request before merging.
- Require CI checks before merging.
- Require branches to be up to date before merging.
- Disallow force pushes.
- Disallow deletion.

Recommended required checks:

- `pnpm build`
- `pnpm test`
- `pnpm lint`
- `pnpm analyze:demo`

If GitHub exposes the checks under workflow job names instead of command names,
select the corresponding CI job.

## Releases

For v0.1.0, create the GitHub Release manually from tag `v0.1.0`.

Use `CHANGELOG.md` as the release-note source and make clear that this is an
experimental MVP for early community use.
