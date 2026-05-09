# Karpathy-inspired principles

S-Agent can borrow useful engineering habits from small public research tools
without copying code or becoming a research system. The relevant pattern is not
model training. It is the product feel: minimal, inspectable, reproducible, and
easy to run.

These principles guide near-term S-Agent design.

## Minimal and hackable

Keep the core small enough that a contributor can read the pipeline in one
sitting. Prefer direct TypeScript modules, clear package boundaries, and plain
data artifacts over frameworks, services, or hidden orchestration.

## One-command demo

Maintain a demo path that proves the product quickly:

```sh
pnpm install
pnpm build
pnpm analyze:demo:clean
pnpm analyze:demo:broken
```

The clean demo should exit `0`. The broken demo should exit non-zero with one
intentional `PROVEN` violation.

## Benchmark-first

Every important behavior should have a fixture or benchmark-style test before
it grows into a feature family. A check that cannot be measured should stay out
of the blocking path.

## Staged artifacts

Write intermediate artifacts so users can inspect what happened at each stage.
The target pipeline is:

```text
collect -> parse -> index -> match -> verify -> explain -> render
```

Artifacts should make CI output reproducible and make local debugging boring in
the best way.

## One complexity dial

Expose complexity through one user-facing depth setting:

- `--depth fast`;
- `--depth standard`;
- `--depth deep`.

The default should stay practical. Advanced analysis should be opt-in and
tested.

## Deterministic-first

Approved rules and symbolic evidence remain the source of truth. LLMs may help
with candidate suggestions or prose in future workflows, but they must not
create blocking findings.

## LLM-friendly context export

Make repository context easy to flatten into Markdown, CXML, and HTML for
humans and LLM coding tools. The export command should call no model and make
no enforcement decisions.

## Fixtures and tests for every check

Every implemented check needs a fixture or test. If a feature affects blocking
behavior, it needs coverage for clean cases, violation cases, and false-positive
controls.

## What this does not mean

These principles do not justify adding a dashboard, agent framework, vector
database, graph database, or enterprise workflow to the MVP. S-Agent should
stay a focused semantic review guard.
