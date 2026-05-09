# S-Agent Core

Dies ist eine Übersetzung. Die kanonische Version des README steht im
[englischen README](../../README.md).

S-Agent ist eine Open-Source-Engine für semantische Analyse im intent-aware
Code Review. Sie prüft, ob TypeScript-Codeänderungen genehmigte geschäftliche
und architektonische Absichten bewahren.

AxiomGuard ist die zukünftige kommerzielle Plattform auf Basis von S-Agent
Core für Team-Workflows und Enterprise-Governance.

## Problem

Code kann kompilieren, Tests bestehen und trotzdem die Absicht des Systems
verletzen.

Beispiele:

- ein auth-Modul importiert billing-Code;
- ein read-only Reporting-Flow schreibt in eine Datenbank oder sendet Events;
- ein Rabatt überschreitet den genehmigten Produktgrenzwert;
- ein Refactoring bricht eine in Projektdokumentation festgehaltene
  Architekturentscheidung.

Klassische Linters und Tests sind nicht dafür gebaut, projektspezifische
Business- und Architekturabsichten durchzusetzen.

## Lösung

S-Agent Core wandelt genehmigte `SemanticRule` YAML-Dateien in deterministische
Prüfungen über TypeScript-Quellcode um. Es meldet proof-carrying findings, die
Regel, verletzten invariant, geänderte Datei, evidence und blocking status
erklären.

Der Core bleibt absichtlich klein:

- dokumentationsgestützte Regeln sind die Source of Truth;
- deterministic symbolic checks erzeugen blocking findings;
- nur `PROVEN` findings aus approved critical rules im Modus `block` können die
  CLI fehlschlagen lassen;
- LLMs sind nicht die Source of Truth für blocking behavior.

## Was es heute prüft

Das MVP konzentriert sich auf TypeScript-Projekte und eine kleine Menge
praktischer Prüfungen:

- layer boundary violations, etwa wenn `src/auth/**` `src/billing/**`
  importiert;
- forbidden imports für package oder module boundaries;
- forbidden side effects in read-only scopes über einfache Heuristiken anhand
  von Aufrufnamen;
- value invariants mit offensichtlichen numerischen Literalen, etwa ein Rabatt
  über dem genehmigten Maximum.

## Projektstatus

S-Agent Core ist ein experimentelles MVP. Es ist nützlich für lokale Demos,
Fixtures und frühe CI-Experimente, aber Public API und Rule Schema können sich
vor `1.0.0` noch ändern.

## Schnellstart

Abhängigkeiten installieren:

```sh
pnpm install
```

Build, Tests und Lint ausführen:

```sh
pnpm build
pnpm test
pnpm lint
```

Clean demo analysis ausführen:

```sh
pnpm analyze:demo
```

S-Agents eigene Dogfood-Regeln validieren:

```sh
pnpm rules:validate
```

Dieses Repository gegen seine eigenen Architekturregeln analysieren:

```sh
pnpm analyze:self
```

Die absichtlich kaputte Demo ausführen:

```sh
pnpm analyze:demo:broken
```

`pnpm analyze:demo:broken` beendet sich mit Code `1`, weil die Demo absichtlich
eine blocking violation enthält. `pnpm analyze:demo` nutzt die saubere Demo und
sollte mit Code `0` enden.

Nach dem Build ist der CLI-Entrypoint als Workspace-Binary-Package
`@s-agent/cli` mit dem Bin `s-agent` verfügbar.

## Beispiel für SemanticRule

Regeln liegen in `.rules.yml`-Dateien:

```yaml
rules:
  - rule_id: INV-AUTH-001
    domain: auth
    status: approved
    owner: platform
    severity: critical
    scope:
      modules:
        - "src/auth/**"
    intent: "Authentication must remain identity-only."
    invariants:
      - id: INV-AUTH-001
        type: layer_boundary
        description: "Auth module must not import billing."
        from: "src/auth/**"
        to: "src/billing/**"
    enforcement:
      mode: block
    source:
      file: "CLAUDE.md"
      section: "authentication-module"
```

Approved rules sind die Source of Truth. Candidate, deprecated, archived oder
disabled rules können geladen und geprüft werden, aber keine blocking findings
erzeugen.

## Beispiel für CLI-Ausgabe

```md
# S-Agent Report

Project: /path/to/examples/demo-typescript-app

## Violation: INV-AUTH-001

Changed file: src/auth/session.ts
Changed symbol: module

Problem: Layer boundary violation: src/auth/session.ts imports
../billing/billing-service.

Why this matters:
The authentication layer is identity-only; billing behavior must stay inside
the billing domain.

Technical details:
The importing file matches 'src/auth/**' and the resolved import matches
'src/billing/**'.

Status: PROVEN
Severity: critical
Blocking: yes
```

## Finding-Status

- `PROVEN`: deterministic symbolic evidence existiert. Approved critical
  `PROVEN` findings im Modus `block` können die CLI fehlschlagen lassen.
- `PROBABLE`: starke heuristic evidence existiert, aber nicht genug proof zum
  Blockieren.
- `SUSPECT`: schwaches Signal, nur informational.
- `RULE_CONFLICT`: reserviert für zukünftige Fälle, in denen heuristic
  suspicion mit symbolic evidence kollidiert.
- `DISMISSED`: nicht actionable, nicht approved oder nicht durch evidence
  gestützt.

## Was ist Open Source?

S-Agent Core ist Open Source und enthält:

- CLI analysis.
- Das `SemanticRule` model und YAML rule-file format.
- Rule loading und validation.
- Basic TypeScript parser und indexer.
- Basic deterministic analyzer checks.
- Proof-carrying findings.
- Markdown und JSON reports.
- Evaluation fixtures.
- Synthetic benchmarks.
- Basic CI usage.
- Eine geplante basic GitHub Action.

Der Open-Source-Core muss für sich allein nützlich bleiben. Bestehende
MVP-Features werden nicht hinter einen Paywall verschoben.

## Open-Core-Modell

S-Agent Core ist die Open-Source-Engine für semantische Analyse.

AxiomGuard Pro und Enterprise können später Team- und Organisations-Workflows
auf dem Core ergänzen, zum Beispiel:

- hosted dashboard;
- team workspace;
- PR review bot mit threaded comments;
- rule approval console;
- finding history;
- developer feedback analytics;
- automatic intent extraction;
- Git history mining;
- advanced LLM explanations;
- multi-repo governance;
- organization-wide architecture map;
- enterprise integrations;
- SSO, SCIM und RBAC;
- audit logs;
- self-hosted und VPC deployment;
- advanced compliance und security rule packs;
- professional services.

Dies sind zukünftige kommerzielle Erweiterungen. Sie sind nicht nötig, um
S-Agent Core lokal oder in CI auszuführen.

Lies das vollständige [open-core model](../../OPEN_CORE.md).

## Repository-Struktur

- `packages/rules`: `SemanticRule` model, YAML loading, validation, registry
  und lifecycle.
- `packages/parser`: TypeScript file indexing, import extraction und function
  extraction.
- `packages/analyzer`: deterministic und heuristic rule checks.
- `packages/verifier`: finding statuses, evidence chains und blocking
  classification.
- `packages/explainer`: Markdown und JSON report rendering.
- `packages/core`: orchestration zwischen rules, analyzer, verifier und
  explainer.
- `packages/shared`: shared types und utilities.
- `apps/cli`: command-line interface.
- `rules`: S-Agents eigene Dogfood-Regeln, einschließlich package boundary
  rules.
- `examples`: broken und clean TypeScript demo projects.
- `tests/evaluation`: semantic benchmark fixtures und metric tests.
- `docs/community`: community roadmap und contribution ideas.

## Aktuelle Einschränkungen

- Diff support filtert findings nur nach Dateien, die in einem unified diff
  gelistet sind, und ist noch nicht als vollständiger CLI workflow verfügbar.
- Side-effect detection ist heuristisch und name-based.
- Value invariant detection erkennt nur einfache numerische Literale.
- Import resolution ist für das MVP absichtlich einfach.
- TypeScript ist die einzige unterstützte Sprache.
- Es gibt noch keinen GitHub Action PR comment workflow.
- In diesem Repository gibt es kein Dashboard und keinen hosted service.
- Ein LLM rule suggestion flow ist nicht implementiert.

## Roadmap

- v0.1: open-source core mit CLI, rule validation, parser, analyzer,
  proof-carrying findings, reports, fixtures und benchmarks.
- v0.2: basic GitHub Action mode.
- v0.3: community rule packs und mehr framework examples.
- v0.4: plugin API draft und extension-point design.
- Future: AxiomGuard Pro alpha für team workflows und governance.

Siehe die [community roadmap](../community/community-roadmap.md).

## Beitragen

Beiträge sind willkommen, wenn sie S-Agent Core fokussiert, nützlich und
testbar halten.

Gute Startpunkte:

- fixtures hinzufügen;
- examples verbessern;
- rule examples hinzufügen;
- CLI output verbessern;
- das `SemanticRule` schema dokumentieren;
- framework-specific examples hinzufügen.

Lies [CONTRIBUTING.md](../../CONTRIBUTING.md) und
[good first issues](../community/good-first-issues.md).

## Sicherheit

Öffne keine public issues für security vulnerabilities. Lies
[SECURITY.md](../../SECURITY.md) für den Meldeprozess.

## Lizenz

S-Agent Core ist unter der [Apache License 2.0](../../LICENSE) lizenziert.
