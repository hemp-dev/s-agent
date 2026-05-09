# GitHub Action

S-Agent Core ships a basic composite GitHub Action for CI. The action builds
the repository copy of S-Agent and calls the existing CLI; it does not
duplicate analyzer logic, post pull request comments, or call a hosted service.

## Usage

Add this workflow to `.github/workflows/s-agent.yml`:

```yaml
name: S-Agent

on:
  pull_request:
  push:
    branches:
      - main

permissions:
  contents: read

jobs:
  semantic-review:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Run S-Agent
        uses: s-agent/s-agent@v0.2.0
        with:
          project: "."
          rules: "rules"
          output-format: "markdown"
          fail-on-blocking: "true"
```

## Inputs

| Input | Default | Description |
| --- | --- | --- |
| `project` | `.` | Project directory to analyze, relative to the workflow workspace unless absolute. |
| `rules` | `rules` | SemanticRule directory, relative to the workflow workspace unless absolute. |
| `output-format` | `markdown` | CLI report format. Supported values are `markdown` and `json`. |
| `fail-on-blocking` | `true` | When `true`, the workflow fails if the CLI reports blocking findings. |

## Behavior

The action runs:

```sh
s-agent analyze --project <project> --rules <rules> --markdown
```

Use `output-format: "json"` to pass `--json` instead. With the default
`fail-on-blocking: "true"`, the action preserves the CLI exit code. Set
`fail-on-blocking: "false"` to print the report but allow the workflow to
continue when blocking findings are present.

For monorepos, point both paths at the workspace you want to analyze:

```yaml
- name: Run S-Agent for API package
  uses: s-agent/s-agent@v0.2.0
  with:
    project: "packages/api"
    rules: "packages/api/rules"
```

Pull request comments are not implemented yet. Use the Markdown output in the
workflow log for v0.2.0.
