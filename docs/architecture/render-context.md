# Render context

S-Agent should eventually help humans and LLM tools inspect the relevant
repository context without turning LLMs into the enforcement engine.

The future command is:

```sh
s-agent render-context --project .
```

It should write:

```text
.s-agent/context.md
.s-agent/context.cxml
.s-agent/context.html
```

This design is documentation-only for now.

## Goal

`render-context` flattens useful repository context into portable files. The
output should help contributors, maintainers, and LLM coding tools understand
the project before changing code.

The command must not call an LLM. It only renders local files and metadata.

## Inputs

The first version should use deterministic inputs:

- `README.md`, `CLAUDE.md`, and `AGENTS.md` when present;
- architecture docs and ADR-style files under `docs/`;
- approved `SemanticRule` files;
- package boundaries and workspace metadata;
- relevant source files selected by project rules or changed-file input;
- test and fixture files that explain expected behavior.

## Outputs

`context.md` is the primary human-readable bundle. It should preserve headings,
paths, rule summaries, and short source excerpts.

`context.cxml` is a structured context format for tools that prefer explicit
file and section boundaries.

`context.html` is a local browser-friendly view for scanning context, rules,
and linked source paths.

## Selection policy

The renderer should prefer relevance over volume:

- Always include project intent and architecture boundaries.
- Always include approved rules that apply to selected files.
- Include tests and fixtures when they explain the expected behavior.
- Truncate large files with visible markers.
- Exclude generated artifacts, dependency folders, build output, secrets, and
  binary files.

## LLM workflow boundary

The output may be useful input for LLM tools, but S-Agent's enforcement stays
deterministic:

- LLMs may read exported context.
- LLMs may suggest candidate rules for human approval.
- LLMs must not create blocking findings.
- Only approved `SemanticRule` files and deterministic evidence can block.

## Future tests

The first implementation should include fixtures that verify:

- generated files are written under `.s-agent/`;
- sensitive and generated paths are excluded;
- rule summaries are included;
- output ordering is stable;
- Markdown, CXML, and HTML contain equivalent core context.

