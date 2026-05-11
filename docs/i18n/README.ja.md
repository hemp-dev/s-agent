# S-Agent Core

これは翻訳です。README の正本は
[英語 README](../../README.md) です。

S-Agent は、意図を考慮したコードレビューのためのオープンソースの
semantic analysis engine です。TypeScript のコード変更が、承認済みの
ビジネス意図とアーキテクチャ意図を保っているかを確認します。

AxiomGuard は、S-Agent Core の上に構築される将来の商用プラットフォーム
で、チーム workflow と enterprise governance を扱います。

## 問題

コードはコンパイルでき、テストにも通り、それでもシステムの意図に反する
ことがあります。

例:

- auth module が billing code を import する;
- read-only reporting flow が database に write したり event を emit
  したりする;
- discount が承認済み product threshold を超える;
- refactor が project docs に書かれた architecture decision を壊す。

従来の linters や tests は、プロジェクト固有の business intent と
architecture intent を強制するためのものではありません。

## 解決策

S-Agent Core は、承認済みの `SemanticRule` YAML files を TypeScript
source code に対する deterministic checks に変換します。rule、violated
invariant、changed file、evidence、blocking status を説明する
proof-carrying findings を出力します。

Core は意図的に小さく保たれています:

- documentation-backed rules が source of truth です;
- deterministic symbolic checks が blocking findings を生成します;
- approved critical rules の `block` mode から出る `PROVEN` findings だけ
  が CLI を失敗させる可能性があります;
- LLM は blocking behavior の source of truth ではありません。

## 現在チェックすること

MVP は TypeScript projects と、小さく実用的な checks に集中しています:

- layer boundary violations。例えば `src/auth/**` が `src/billing/**` を
  import する場合;
- package または module boundaries の forbidden imports;
- read-only scopes における、call-name heuristics に基づく forbidden side
  effects;
- 明らかな numeric literals による value invariants。例えば approved
  maximum を超える discount value。

## Project status

S-Agent Core は experimental MVP です。local demos、fixtures、初期の CI
experiments には有用ですが、public API と rule schema は `1.0.0` までに
変更される可能性があります。

## Quick start

依存関係をインストールします:

```sh
pnpm install
```

Build、test、lint を実行します:

```sh
pnpm build
pnpm test
pnpm lint
```

Clean demo analysis を実行します:

```sh
pnpm analyze:demo
```

S-Agent 自身の dogfood rules を validate します:

```sh
pnpm rules:validate
```

この repository を自身の architecture rules で analyze します:

```sh
pnpm analyze:self
```

意図的に壊した demo を実行します:

```sh
pnpm analyze:demo:broken
```

`pnpm analyze:demo:broken` は、意図的な blocking violation を含むため
exit code `1` で終了します。`pnpm analyze:demo` は clean demo を使い、
exit code `0` が期待されます。

Build 後、CLI entrypoint は workspace binary package `@s-agent/cli` の
`s-agent` bin として利用できます。

## SemanticRule の例

Rules は `.rules.yml` files に置かれます:

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

Approved rules が source of truth です。Candidate、deprecated、archived、
disabled rules は load と inspect ができますが、blocking findings は生成
できません。

## CLI output の例

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

- `PROVEN`: deterministic symbolic evidence が存在します。Approved critical
  `PROVEN` findings は `block` mode で CLI を失敗させることがあります。
- `PROBABLE`: 強い heuristic evidence はありますが、block に十分な proof
  はありません。
- `SUSPECT`: 弱い signal で、informational のみです。
- `RULE_CONFLICT`: heuristic suspicion が symbolic evidence と衝突する
  将来のケースのために予約されています。
- `DISMISSED`: actionable ではない、approved ではない、または evidence
  に支えられていません。

## 何が open source か

S-Agent Core は open source で、以下を含みます:

- CLI analysis。
- `SemanticRule` model と YAML rule-file format。
- Rule loading と validation。
- Basic TypeScript parser と indexer。
- Basic deterministic analyzer checks。
- Proof-carrying findings。
- Markdown と JSON reports。
- Evaluation fixtures。
- Synthetic benchmarks。
- Basic CI usage。
- Planned basic GitHub Action。

Open-source core はそれ自体で有用であり続ける必要があります。既存の MVP
features が paywall の後ろに移されることはありません。

## Open-core model

S-Agent Core は open-source semantic analysis engine です。

AxiomGuard Pro と Enterprise は、将来的に core の上に team と
organization workflows を追加する可能性があります。例えば:

- hosted dashboard;
- team workspace;
- threaded comments 付き PR review bot;
- rule approval console;
- finding history;
- developer feedback analytics;
- automatic intent extraction;
- Git history mining;
- advanced LLM explanations;
- multi-repo governance;
- organization-wide architecture map;
- enterprise integrations;
- SSO、SCIM、RBAC;
- audit logs;
- self-hosted と VPC deployment;
- advanced compliance と security rule packs;
- professional services。

これらは将来の商用拡張です。S-Agent Core を local や CI で実行するために
必要ではありません。

完全な [open-core model](../../OPEN_CORE.md) を読んでください。

## Repository layout

- `packages/rules`: `SemanticRule` model、YAML loading、validation、
  registry、lifecycle。
- `packages/parser`: TypeScript file indexing、import extraction、
  function extraction。
- `packages/analyzer`: deterministic と heuristic rule checks。
- `packages/verifier`: finding statuses、evidence chains、blocking
  classification。
- `packages/explainer`: Markdown と JSON report rendering。
- `packages/core`: rules、analyzer、verifier、explainer の orchestration。
- `packages/shared`: shared types と utilities。
- `apps/cli`: command-line interface。
- `rules`: S-Agent 自身の dogfood rules。package boundary rules を含みます。
- `examples`: broken と clean TypeScript demo projects。
- `tests/evaluation`: semantic benchmark fixtures と metric tests。
- `docs/community`: community roadmap と contribution ideas。

## Current limitations

- Diff support は unified diff に listed された files で findings を filter
  するだけで、full CLI workflow としてはまだ公開されていません。
- Side-effect detection は heuristic で name-based です。
- Value invariant detection は simple numeric literals のみ検出します。
- Import resolution は MVP のため意図的に simple です。
- TypeScript のみ supported です。
- GitHub Action PR comment workflow はまだありません。
- この repository には dashboard や hosted service はありません。
- LLM rule suggestion flow は implemented されていません。

## Roadmap

- v0.1: CLI、rule validation、parser、analyzer、proof-carrying findings、
  reports、fixtures、benchmarks を持つ open-source core。
- v0.2: basic GitHub Action mode。
- v0.3: community rule packs と more framework examples。
- v0.4: plugin API draft と extension-point design。
- Future: team workflows と governance のための AxiomGuard Pro alpha。

[Community roadmap](../community/community-roadmap.md) を参照してください。

## Contributing

S-Agent Core を focused、useful、testable に保つ contributions を歓迎します。

始めやすいタスク:

- fixtures を追加する;
- examples を改善する;
- rule examples を追加する;
- CLI output を改善する;
- `SemanticRule` schema を文書化する;
- framework-specific examples を追加する。

[CONTRIBUTING.md](../../CONTRIBUTING.md) と
[good first issues](../community/good-first-issues.md) を読んでください。

## Security

Security vulnerabilities について public issues を開かないでください。
報告プロセスは [SECURITY.md](../../SECURITY.md) を読んでください。

## License

S-Agent Core は [Apache License 2.0](../../LICENSE) の下でライセンスされて
います。
