# Changelog

## v0.1.0 - 2026-05-08

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

### Fixed

- Added a CLI `src/index.ts` entrypoint so package scripts can run `dist/index.js`.
- Configured the CLI TypeScript build info file under `dist/.tsbuildinfo`.

### Known Limitations

- TypeScript is the only supported language.
- Import resolution is intentionally simple for the MVP.
- Side-effect checks are heuristic and name-based.
- Value invariant checks only catch simple numeric literals.
- No LLM enforcement, Neo4j, dashboard, GitHub Action comment workflow, or multi-language parser is included.
