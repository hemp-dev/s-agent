# Governance

S-Agent Core is an early-stage open-source project maintained by hemp-dev.
This document explains how decisions are made while the project is still small.

## Maintainer model

Maintainers are responsible for:

- reviewing issues and pull requests;
- protecting the project scope;
- keeping the core deterministic-first;
- maintaining release quality;
- separating open-source engine work from future commercial platform work.

As the community grows, maintainers may invite regular contributors to become
reviewers or maintainers based on consistent, constructive contributions.

## Decision-making

Most decisions happen in GitHub issues and pull requests. Maintainers aim for
rough consensus, then make a clear decision when the tradeoff is understood.

Small fixes can be decided in PR review. Larger changes need an issue first,
especially when they affect:

- rule schema;
- analyzer behavior;
- package boundaries;
- CLI output;
- public APIs;
- roadmap scope;
- open-core boundaries.

## Issue triage

Maintainers triage issues by:

- confirming whether the report is reproducible;
- labeling bugs, docs, tests, fixtures, rules, or design discussions;
- asking whether the request belongs in S-Agent Core;
- closing requests that are outside the open-source core scope.

Security issues must follow `SECURITY.md` and must not be opened as public
issues.

## Pull request review

PRs are reviewed for:

- correctness;
- tests and fixtures;
- evidence-chain completeness;
- deterministic-first behavior;
- documentation updates;
- package boundary discipline;
- fit with the open-source core.

Maintainers may ask contributors to split large PRs into smaller changes.

## Release process

Releases are prepared by maintainers.

A release should include:

- passing build, test, lint, and demo analysis;
- a changelog entry;
- updated documentation for user-facing changes;
- a version tag.

## Versioning

S-Agent Core uses semantic versioning.

Before `1.0.0`, minor versions may include breaking changes. Breaking changes
must be documented clearly in the changelog.

After `1.0.0`:

- patch releases fix bugs;
- minor releases add backward-compatible functionality;
- major releases may include breaking changes.

## Roadmap process

The roadmap is maintained in public documentation and GitHub issues.
Community proposals are welcome when they strengthen the core engine, improve
tests and fixtures, or make rule authoring clearer.

Large roadmap items should start as design issues before implementation.

## Open-core boundary

S-Agent Core contains the open-source semantic analysis engine. IntentGuard
Pro and Enterprise may contain future hosted, team, governance, and enterprise
features.

Existing MVP features in S-Agent Core will not be moved behind a paywall.

Commercial feature discussions must not block improvements to the open-source
engine unless the proposal changes shared interfaces or project scope.

## Community proposals

Community proposals are handled in public issues. A good proposal explains:

- the problem;
- the intended invariant or workflow;
- why it belongs in S-Agent Core;
- examples of violations and clean cases;
- test or fixture coverage.

Maintainers may accept, defer, narrow, or decline proposals based on project
scope and maintenance cost.
