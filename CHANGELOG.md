# Changelog

## v0.2.0 - 2026-05-09

GitHub Action and benchmark infrastructure release.

### Added

- Added a root composite GitHub Action that runs the existing S-Agent CLI.
- Added GitHub Action inputs for project path, rules path, output format, and
  blocking-failure behavior.
- Added GitHub Action usage documentation and a copy-paste workflow example.
- Added `pnpm benchmark` for running the canonical evaluation fixtures.
- Added benchmark JSON summary output and Markdown leaderboard row output.
- Added benchmark metrics for precision, recall, false positive rate, PROVEN
  rate, runtime, and clean blocking rate.
- Added benchmark methodology docs and the initial leaderboard.
- Added a shared evaluation fixture manifest used by both tests and benchmark
  reporting.

### Changed

- Updated the README with GitHub Action and benchmark usage.

### Known Limitations

- Pull request comments are not implemented yet.
- No hosted service, dashboard, or analyzer behavior changes are included.

## v0.1.0 - 2026-05-08

Initial open-source MVP.

### Added

- Created the S-Agent TypeScript monorepo with pnpm workspaces.
- Added the `SemanticRule` YAML model, validation, registry, and lifecycle helpers.
- Added TypeScript source indexing for files, imports, functions, comments, and line numbers.
- Added deterministic MVP checks for layer boundaries, forbidden imports, and value invariants.
- Added heuristic forbidden side-effect detection for read-only scopes.
- Added proof-carrying findings with `PROVEN`, `PROBABLE`, `SUSPECT`, `RULE_CONFLICT`, and `DISMISSED` statuses.
- Added deterministic Markdown and JSON reporting.
- Added the CLI with rule validation and project analysis commands.
- Added clean and broken TypeScript demo projects.
- Added S-Agent dogfood architecture rules in `rules/s-agent-architecture.rules.yml`.
- Added evaluation fixtures, precision/recall/false-positive benchmarks, and a 50-case synthetic dataset.
- Added product strategy docs for IntentGuard positioning, ICPs, pricing, messaging, and customer discovery.
- Added release CI for install, build, test, lint, rule validation, clean demo analysis, and self-analysis.
- Added Apache-2.0 licensing, open-core documentation, governance, contribution, security, and code of conduct docs.
- Added GitHub issue templates, a pull request template, and community roadmap docs.
- Added README translations for major world languages.

### Fixed

- Added a CLI `src/index.ts` entrypoint so package scripts can run `dist/index.js`.
- Configured the CLI TypeScript build info file under `dist/.tsbuildinfo`.

### Known Limitations

- TypeScript is the only supported language.
- Import resolution is intentionally simple for the MVP.
- Side-effect checks are heuristic and name-based.
- Value invariant checks only catch simple numeric literals.
- No LLM enforcement, Neo4j, dashboard, GitHub Action comment workflow, or multi-language parser is included.
