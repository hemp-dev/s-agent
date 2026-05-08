# S-Agent Core

यह अनुवाद है। README का canonical संस्करण
[English README](../../README.md) में है।

S-Agent intent-aware code review के लिए एक open-source semantic analysis engine
है। यह जांचता है कि TypeScript code changes approved business और architectural
intent को सुरक्षित रखते हैं या नहीं।

IntentGuard भविष्य का commercial platform है, जो team workflows और enterprise
governance के लिए S-Agent Core के ऊपर बनाया जाएगा।

## समस्या

Code compile हो सकता है, tests pass कर सकता है, और फिर भी system intent का
उल्लंघन कर सकता है।

उदाहरण:

- auth module billing code import करता है;
- read-only reporting flow database में write करता है या events emit करता है;
- discount approved product threshold से अधिक है;
- refactor project docs में दर्ज architecture decision को तोड़ देता है।

Traditional linters और tests project-specific business और architecture intent
enforce करने के लिए नहीं बने हैं।

## समाधान

S-Agent Core approved `SemanticRule` YAML files को TypeScript source code पर
deterministic checks में बदलता है। यह proof-carrying findings report करता है,
जो rule, violated invariant, changed file, evidence और blocking status बताते
हैं।

Core जानबूझकर छोटा रखा गया है:

- documentation-backed rules source of truth हैं;
- deterministic symbolic checks blocking findings बनाते हैं;
- approved critical rules के `block` mode वाले केवल `PROVEN` findings CLI को
  fail कर सकते हैं;
- LLM blocking behavior के लिए source of truth नहीं है।

## आज यह क्या जांचता है

MVP TypeScript projects और practical checks के छोटे set पर केंद्रित है:

- layer boundary violations, जैसे `src/auth/**` से `src/billing/**` import करना;
- package या module boundaries के लिए forbidden imports;
- read-only scopes में simple call-name heuristics से forbidden side effects;
- obvious numeric literals से value invariants, जैसे approved maximum से ऊपर
  discount value.

## Project status

S-Agent Core एक experimental MVP है। यह local demos, fixtures और शुरुआती CI
experiments के लिए उपयोगी है, लेकिन public API और rule schema `1.0.0` से पहले
बदल सकते हैं।

## Quick start

Dependencies install करें:

```sh
pnpm install
```

Build, test और lint चलाएं:

```sh
pnpm build
pnpm test
pnpm lint
```

Clean demo analysis चलाएं:

```sh
pnpm analyze:demo
```

S-Agent के dogfood rules validate करें:

```sh
pnpm rules:validate
```

इस repository को इसके अपने architecture rules से analyze करें:

```sh
pnpm analyze:self
```

Intentionally broken demo चलाएं:

```sh
pnpm analyze:demo:broken
```

`pnpm analyze:demo:broken` code `1` के साथ exit करता है क्योंकि इसमें
intentionally blocking violation है। `pnpm analyze:demo` clean demo का उपयोग
करता है और expected exit code `0` है।

Build के बाद CLI entrypoint workspace binary package `@s-agent/cli` के
`s-agent` bin के रूप में उपलब्ध है।

## SemanticRule example

Rules `.rules.yml` files में रहते हैं:

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

Approved rules source of truth हैं। Candidate, deprecated, archived या disabled
rules load और inspect किए जा सकते हैं, लेकिन वे blocking findings नहीं बना
सकते।

## CLI output example

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

## Finding statuses

- `PROVEN`: deterministic symbolic evidence मौजूद है। Approved critical
  `PROVEN` findings `block` mode में CLI fail कर सकते हैं।
- `PROBABLE`: strong heuristic evidence है, लेकिन block करने के लिए full proof
  नहीं है।
- `SUSPECT`: weak signal, केवल informational।
- `RULE_CONFLICT`: future cases के लिए reserved है जहां heuristic suspicion
  symbolic evidence से conflict करे।
- `DISMISSED`: actionable नहीं, approved नहीं या evidence से supported नहीं।

## Open source में क्या है?

S-Agent Core open source है और इसमें शामिल है:

- CLI analysis.
- `SemanticRule` model और YAML rule-file format.
- Rule loading और validation.
- Basic TypeScript parser और indexer.
- Basic deterministic analyzer checks.
- Proof-carrying findings.
- Markdown और JSON reports.
- Evaluation fixtures.
- Synthetic benchmarks.
- Basic CI usage.
- Planned basic GitHub Action.

Open-source core अपने आप में useful रहना चाहिए। Existing MVP features को
paywall के पीछे नहीं ले जाया जाएगा।

## Open-core model

S-Agent Core open-source semantic analysis engine है।

IntentGuard Pro और Enterprise बाद में core के ऊपर team और organization
workflows जोड़ सकते हैं, जैसे:

- hosted dashboard;
- team workspace;
- threaded comments वाला PR review bot;
- rule approval console;
- finding history;
- developer feedback analytics;
- automatic intent extraction;
- Git history mining;
- advanced LLM explanations;
- multi-repo governance;
- organization-wide architecture map;
- enterprise integrations;
- SSO, SCIM और RBAC;
- audit logs;
- self-hosted और VPC deployment;
- advanced compliance और security rule packs;
- professional services.

ये future commercial extensions हैं। S-Agent Core को local या CI में चलाने के
लिए इनकी जरूरत नहीं है।

पूरा [open-core model](../../OPEN_CORE.md) पढ़ें।

## Repository layout

- `packages/rules`: `SemanticRule` model, YAML loading, validation, registry और
  lifecycle.
- `packages/parser`: TypeScript file indexing, import extraction और function
  extraction.
- `packages/analyzer`: deterministic और heuristic rule checks.
- `packages/verifier`: finding statuses, evidence chains और blocking
  classification.
- `packages/explainer`: Markdown और JSON report rendering.
- `packages/core`: rules, analyzer, verifier और explainer के बीच orchestration.
- `packages/shared`: shared types और utilities.
- `apps/cli`: command-line interface.
- `rules`: S-Agent के dogfood rules, जिनमें package boundary rules शामिल हैं.
- `examples`: broken और clean TypeScript demo projects.
- `tests/evaluation`: semantic benchmark fixtures और metric tests.
- `docs/community`: community roadmap और contribution ideas.

## Current limitations

- Diff support केवल unified diff में listed files के आधार पर findings filter
  करता है और अभी full CLI workflow के रूप में exposed नहीं है।
- Side-effect detection heuristic और name-based है।
- Value invariant detection केवल simple numeric literals पकड़ता है।
- Import resolution MVP के लिए intentionally simple है।
- केवल TypeScript supported है।
- GitHub Action PR comment workflow अभी नहीं है।
- इस repository में dashboard या hosted service नहीं है।
- LLM rule suggestion flow implemented नहीं है।

## Roadmap

- v0.1: CLI, rule validation, parser, analyzer, proof-carrying findings,
  reports, fixtures और benchmarks वाला open-source core.
- v0.2: basic GitHub Action mode.
- v0.3: community rule packs और अधिक framework examples.
- v0.4: plugin API draft और extension-point design.
- Future: team workflows और governance के लिए IntentGuard Pro alpha.

[Community roadmap](../community/community-roadmap.md) देखें।

## Contributing

Contributions welcome हैं जब वे S-Agent Core को focused, useful और testable
रखते हैं।

शुरू करने के अच्छे काम:

- fixtures जोड़ें;
- examples सुधारें;
- rule examples जोड़ें;
- CLI output सुधारें;
- `SemanticRule` schema document करें;
- framework-specific examples जोड़ें।

[CONTRIBUTING.md](../../CONTRIBUTING.md) और
[good first issues](../community/good-first-issues.md) पढ़ें।

## Security

Security vulnerabilities के लिए public issues न खोलें। Reporting process के
लिए [SECURITY.md](../../SECURITY.md) पढ़ें।

## License

S-Agent Core [Apache License 2.0](../../LICENSE) के तहत licensed है।
