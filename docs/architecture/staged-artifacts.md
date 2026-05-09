# Staged artifacts

S-Agent should make every major analysis stage inspectable. The CLI can stay
simple while still writing intermediate artifacts that help contributors debug
rules, reproduce CI output, and review what the analyzer actually saw.

This design is documentation-only for now. It describes the artifact contract
future commands should implement.

## Pipeline

The analysis pipeline is:

```text
collect -> parse -> index -> match -> verify -> explain -> render
```

Each stage has one job:

- `collect` finds project files, rule files, docs, and optional diff input.
- `parse` reads TypeScript source and `SemanticRule` YAML.
- `index` creates stable project and rule indexes.
- `match` runs deterministic rule checks against the indexed project.
- `verify` classifies findings and builds the evidence chain.
- `explain` adds deterministic business and technical explanations.
- `render` writes CLI, Markdown, JSON, and future PR-friendly output.

The stages must remain deterministic. An LLM may help suggest candidate rules
or draft prose in a separate workflow, but it must not create blocking
findings.

## Artifact directory

Future commands should write generated artifacts under `.s-agent/` in the
analyzed project:

```text
.s-agent/
  project-index.json
  rule-index.json
  findings.json
  evidence.json
  report.md
```

The directory is a generated analysis output, not source truth. Projects may
choose whether to commit selected artifacts for examples, fixtures, or
regression tests, but normal CI runs should treat the directory as disposable.

## Artifact roles

`project-index.json` records the files, imports, symbols, and source locations
that S-Agent collected from TypeScript source.

`rule-index.json` records validated `SemanticRule` inputs, lifecycle status,
enforcement mode, severity, and the subset of rules that can produce blocking
findings.

`findings.json` records analyzer and verifier output. It should preserve every
required finding field, including `rule_id`, violated invariant, changed file,
changed symbol when available, evidence type, status, severity, and blocking
decision.

`evidence.json` records the proof-carrying evidence chain in a shape that is
easy to inspect without reading Markdown output.

`report.md` records the human-readable report used by local developers and CI
summaries.

## Reproducibility rules

Artifacts should be stable across runs when input files are unchanged:

- Sort files, rules, findings, and evidence deterministically.
- Store project-relative paths where possible.
- Avoid timestamps in core artifacts unless they are isolated in metadata.
- Include the S-Agent version and schema version in each artifact.
- Preserve enough input metadata to rerun a failing fixture locally.

## MVP constraints

The first implementation should write artifacts only from existing deterministic
pipeline data. It should not add a database, background service, dashboard, or
new runtime dependency.

