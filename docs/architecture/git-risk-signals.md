# Git risk signals

S-Agent should eventually expose lightweight git-derived risk signals that help
reviewers decide where to spend attention. The future command is:

```sh
s-agent git-risk --project .
```

This design is documentation-only for now. It must not change analyzer
behavior.

## Goal

`git-risk` summarizes repository history around changed files and critical
modules. It should make risk visible without introducing a hosted service,
dashboard, or enterprise workflow.

## Signals

The first version should consider these signals:

- churn;
- recent hotfixes;
- number of authors;
- high-risk files;
- rule coverage;
- critical module overlap.

## Signal definitions

`churn` measures how often a file changed over a recent window. High churn can
mean unstable code or active development.

`recent hotfixes` identifies commits that look like urgent fixes near the same
files. The first implementation can use conservative commit-message patterns
such as `fix`, `hotfix`, `revert`, and `incident`.

`number of authors` counts distinct commit authors touching the file or module.
Many authors can increase coordination risk.

`high-risk files` flags files that match configured critical modules, security
boundaries, payment paths, authentication paths, or rule-protected scopes.

`rule coverage` reports whether changed files are covered by approved
`SemanticRule` scopes.

`critical module overlap` reports when a change touches multiple protected
domains, such as `auth` and `billing`, in one pull request.

## Output shape

The first output can be JSON and Markdown under `.s-agent/`:

```text
.s-agent/git-risk.json
.s-agent/git-risk.md
```

Each changed file should include a compact score, raw signal values, and a
short explanation. The score is advisory only.

## Guardrails

Git risk signals must not block a pull request by themselves. Blocking remains
limited to approved critical rules with `PROVEN` deterministic findings.

The command should work without network access and should tolerate shallow
clones by marking unavailable history as unknown instead of failing the whole
analysis.

## Future tests

The first implementation should use small fixture repositories or scripted git
histories to test:

- stable churn counts;
- hotfix-message detection;
- author counting;
- rule coverage reporting;
- critical module overlap reporting;
- behavior in shallow or history-limited clones.

