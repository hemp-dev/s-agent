# S-Agent Core

Это перевод. Каноническая версия README находится в
[английском README](../../README.md).

S-Agent — это open-source движок семантического анализа для code review с
учетом намерений. Он проверяет, сохраняют ли изменения в TypeScript-коде
утвержденные бизнес- и архитектурные намерения.

AxiomGuard — будущая коммерческая платформа поверх S-Agent Core для командных
workflow и корпоративного управления.

## Проблема

Код может компилироваться, проходить тесты и при этом нарушать намерение
системы.

Примеры:

- auth-модуль импортирует billing-код;
- read-only reporting-flow пишет в базу данных или отправляет события;
- скидка превышает утвержденный продуктовый лимит;
- рефакторинг нарушает архитектурное решение, описанное в проектной
  документации.

Обычные линтеры и тесты не предназначены для проверки проектных бизнес- и
архитектурных намерений.

## Решение

S-Agent Core превращает утвержденные YAML-файлы `SemanticRule` в
детерминированные проверки TypeScript-кода. Он формирует findings с
доказательной цепочкой: правило, нарушенный invariant, измененный файл,
evidence и blocking status.

Core намеренно остается небольшим:

- правила из документации являются источником истины;
- deterministic symbolic checks создают blocking findings;
- только `PROVEN` findings из утвержденных critical rules в режиме `block`
  могут завершить CLI с ошибкой;
- LLM не используется как источник истины для blocking behavior.

## Что проверяется сейчас

MVP сфокусирован на TypeScript-проектах и небольшом наборе практичных проверок:

- layer boundary violations, например импорт `src/billing/**` из
  `src/auth/**`;
- forbidden imports для package или module boundaries;
- forbidden side effects в read-only областях на основе простых эвристик по
  именам вызовов;
- value invariants на очевидных числовых литералах, например скидка выше
  утвержденного максимума.

## Статус проекта

S-Agent Core — экспериментальный MVP. Он полезен для локальных demo, fixtures
и ранних CI-экспериментов, но public API и rule schema могут измениться до
`1.0.0`.

## Быстрый старт

Установите зависимости:

```sh
pnpm install
```

Соберите проект, запустите тесты и lint:

```sh
pnpm build
pnpm test
pnpm lint
```

Запустите анализ clean demo:

```sh
pnpm analyze:demo
```

Провалидируйте dogfood-правила S-Agent:

```sh
pnpm rules:validate
```

Проанализируйте этот репозиторий по его собственным архитектурным правилам:

```sh
pnpm analyze:self
```

Запустите намеренно broken demo:

```sh
pnpm analyze:demo:broken
```

`pnpm analyze:demo:broken` завершается с кодом `1`, потому что demo намеренно
содержит blocking violation. `pnpm analyze:demo` использует clean demo и
должен завершаться с кодом `0`.

После сборки CLI entrypoint доступен как workspace binary package
`@s-agent/cli` с bin `s-agent`.

## Пример SemanticRule

Правила находятся в `.rules.yml` файлах:

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

Утвержденные правила являются источником истины. Candidate, deprecated,
archived или disabled rules могут загружаться и просматриваться, но не могут
создавать blocking findings.

## Пример CLI-вывода

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

## Статусы findings

- `PROVEN`: есть deterministic symbolic evidence. Утвержденные critical
  `PROVEN` findings в режиме `block` могут завершить CLI с ошибкой.
- `PROBABLE`: есть сильное heuristic evidence, но недостаточно proof для
  blocking.
- `SUSPECT`: слабый сигнал, только informational.
- `RULE_CONFLICT`: зарезервировано для будущих случаев, где heuristic
  suspicion конфликтует с symbolic evidence.
- `DISMISSED`: не actionable, не approved или не подкреплено evidence.

## Что является open source?

S-Agent Core открыт и включает:

- CLI-анализ.
- Модель `SemanticRule` и YAML-формат rule files.
- Загрузку и валидацию правил.
- Базовый TypeScript parser и indexer.
- Базовые deterministic analyzer checks.
- Proof-carrying findings.
- Markdown- и JSON-отчеты.
- Evaluation fixtures.
- Synthetic benchmarks.
- Базовое использование в CI.
- Планируемый basic GitHub Action.

Open-source core должен оставаться полезным сам по себе. Существующие MVP
features не будут перенесены за paywall.

## Open-core model

S-Agent Core — open-source semantic analysis engine.

AxiomGuard Pro и Enterprise могут позже добавить командные и организационные
workflow поверх core:

- hosted dashboard;
- team workspace;
- PR review bot с threaded comments;
- rule approval console;
- finding history;
- developer feedback analytics;
- automatic intent extraction;
- Git history mining;
- advanced LLM explanations;
- multi-repo governance;
- organization-wide architecture map;
- enterprise integrations;
- SSO, SCIM и RBAC;
- audit logs;
- self-hosted и VPC deployment;
- advanced compliance и security rule packs;
- professional services.

Это будущие коммерческие расширения. Они не нужны, чтобы запускать S-Agent Core
локально или в CI.

Читайте полный [open-core model](../../OPEN_CORE.md).

## Структура репозитория

- `packages/rules`: модель `SemanticRule`, YAML loading, validation, registry
  и lifecycle.
- `packages/parser`: TypeScript file indexing, import extraction и function
  extraction.
- `packages/analyzer`: deterministic и heuristic rule checks.
- `packages/verifier`: finding statuses, evidence chains и blocking
  classification.
- `packages/explainer`: Markdown и JSON report rendering.
- `packages/core`: orchestration across rules, analyzer, verifier и explainer.
- `packages/shared`: shared types и utilities.
- `apps/cli`: command-line interface.
- `rules`: dogfood-правила S-Agent, включая package boundary rules.
- `examples`: broken и clean TypeScript demo projects.
- `tests/evaluation`: semantic benchmark fixtures и metric tests.
- `docs/community`: community roadmap и идеи для contributions.

## Текущие ограничения

- Diff support только фильтрует findings по файлам из unified diff и еще не
  доступен как полноценный CLI workflow.
- Side-effect detection эвристический и основан на именах.
- Value invariant detection ловит только простые числовые литералы.
- Import resolution намеренно простой для MVP.
- Поддерживается только TypeScript.
- GitHub Action PR comment workflow пока отсутствует.
- Dashboard или hosted service в этом репозитории отсутствуют.
- LLM rule suggestion flow не реализован.

## Roadmap

- v0.1: open-source core с CLI, rule validation, parser, analyzer,
  proof-carrying findings, reports, fixtures и benchmarks.
- v0.2: basic GitHub Action mode.
- v0.3: community rule packs и больше framework examples.
- v0.4: plugin API draft и design extension points.
- Future: AxiomGuard Pro alpha для team workflows и governance.

Смотрите [community roadmap](../community/community-roadmap.md).

## Contributing

Contributions приветствуются, если они сохраняют S-Agent Core focused, useful
и testable.

Хорошие стартовые задачи:

- добавить fixtures;
- улучшить examples;
- добавить rule examples;
- улучшить CLI output;
- задокументировать schema `SemanticRule`;
- добавить framework-specific examples.

Читайте [CONTRIBUTING.md](../../CONTRIBUTING.md) и
[good first issues](../community/good-first-issues.md).

## Security

Не открывайте public issues для security vulnerabilities. Процесс reporting
описан в [SECURITY.md](../../SECURITY.md).

## License

S-Agent Core распространяется по [Apache License 2.0](../../LICENSE).
