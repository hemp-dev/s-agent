# Plugins and rule packs

S-Agent Core does not have a plugin system yet. This document describes the
kind of community extensions we may support later.

The current priority is a small, deterministic, well-tested core. Extension
points should be designed only after the core API and rule model are clearer.

## Future rule packs

Community rule packs may provide reusable `SemanticRule` files for common
frameworks, domains, or architecture patterns.

Examples:

- auth and billing boundaries;
- read-only reporting flows;
- frontend state-management invariants;
- service-layer dependency direction;
- framework-specific project layouts.

Rule packs should include fixtures and documentation.

## Future framework adapters

Framework adapters may help S-Agent Core understand common project structures.

Examples:

- Next.js route and server-action conventions;
- NestJS module conventions;
- Express controller and service boundaries;
- monorepo package boundary conventions.

Adapters must not replace approved rules as the source of truth.

## Future analyzer checks

Analyzer checks may extend deterministic coverage for new invariant types.

Every new check should include:

- a clear `SemanticRule` invariant;
- deterministic evidence;
- unit tests;
- evaluation fixtures;
- Markdown or JSON output coverage when relevant.

## Future fixtures and benchmarks

Community fixtures and benchmark datasets can help measure precision, recall,
and false-positive behavior.

Useful contributions include:

- small clean projects;
- intentional violation projects;
- ambiguous examples;
- framework-specific layouts;
- benchmark datasets that can run offline.

## Not implemented yet

This repository does not currently implement:

- a plugin API;
- plugin loading;
- external rule-pack publishing;
- hosted marketplace features.

Those ideas need design discussion before implementation.
