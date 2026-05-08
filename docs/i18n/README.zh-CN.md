# S-Agent Core

这是翻译版本。README 的权威版本是
[英文 README](../../README.md)。

S-Agent 是一个开源语义分析引擎，用于面向意图的代码审查。它检查
TypeScript 代码变更是否保留了已批准的业务和架构意图。

AxiomGuard 是未来构建在 S-Agent Core 之上的商业平台，用于团队工作流
和企业治理。

## 问题

代码可能可以编译、通过测试，但仍然违反系统意图。

示例：

- auth 模块导入 billing 代码；
- read-only 报表流程写入数据库或发送事件；
- 折扣超过已批准的产品阈值；
- 重构破坏了项目文档中记录的架构决策。

传统 linters 和测试并不是为了执行项目特定的业务和架构意图而设计的。

## 解决方案

S-Agent Core 将已批准的 `SemanticRule` YAML 文件转换为针对 TypeScript
源代码的确定性检查。它生成带证明的 findings，说明规则、被违反的
invariant、变更文件、evidence 和 blocking status。

Core 有意保持小而清晰：

- 基于文档的规则是事实来源；
- deterministic symbolic checks 产生 blocking findings；
- 只有 approved critical rules 在 `block` 模式下产生的 `PROVEN` findings
  才可能使 CLI 失败；
- LLM 不作为 blocking behavior 的事实来源。

## 现在检查什么

MVP 专注于 TypeScript 项目和一小组实用检查：

- layer boundary violations，例如 `src/auth/**` 导入 `src/billing/**`；
- package 或 module boundaries 的 forbidden imports；
- read-only scope 中基于简单调用名启发式的 forbidden side effects；
- 使用明显数字字面量的 value invariants，例如折扣值高于已批准最大值。

## 项目状态

S-Agent Core 是实验性 MVP。它适用于本地 demo、fixtures 和早期 CI 实验，
但 public API 和 rule schema 在 `1.0.0` 之前仍可能变化。

## 快速开始

安装依赖：

```sh
pnpm install
```

构建、测试并运行 lint：

```sh
pnpm build
pnpm test
pnpm lint
```

运行 clean demo 分析：

```sh
pnpm analyze:demo
```

验证 S-Agent 自身的 dogfood rules：

```sh
pnpm rules:validate
```

使用仓库自身的架构规则分析本仓库：

```sh
pnpm analyze:self
```

运行有意破坏的 demo：

```sh
pnpm analyze:demo:broken
```

`pnpm analyze:demo:broken` 会以代码 `1` 退出，因为它有意包含 blocking
violation。`pnpm analyze:demo` 使用 clean demo，预期以代码 `0` 退出。

构建后，CLI entrypoint 可作为 workspace binary package `@s-agent/cli`
中的 `s-agent` bin 使用。

## SemanticRule 示例

规则位于 `.rules.yml` 文件中：

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

Approved rules 是事实来源。Candidate、deprecated、archived 或 disabled
rules 可以被加载和检查，但不能创建 blocking findings。

## CLI 输出示例

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

## Finding 状态

- `PROVEN`：存在 deterministic symbolic evidence。Approved critical
  `PROVEN` findings 在 `block` 模式下可能使 CLI 失败。
- `PROBABLE`：存在强 heuristic evidence，但不足以证明并阻塞。
- `SUSPECT`：弱信号，仅供参考。
- `RULE_CONFLICT`：保留给未来 heuristic suspicion 与 symbolic evidence
  冲突的情况。
- `DISMISSED`：不可操作、未 approved 或没有 evidence 支持。

## 什么是开源的？

S-Agent Core 是开源的，并包括：

- CLI analysis。
- `SemanticRule` model 和 YAML rule-file format。
- Rule loading 和 validation。
- 基础 TypeScript parser 和 indexer。
- 基础 deterministic analyzer checks。
- Proof-carrying findings。
- Markdown 和 JSON reports。
- Evaluation fixtures。
- Synthetic benchmarks。
- 基础 CI usage。
- 计划中的 basic GitHub Action。

Open-source core 必须保持自身有用。现有 MVP features 不会被移到 paywall
之后。

## Open-core model

S-Agent Core 是 open-source semantic analysis engine。

AxiomGuard Pro 和 Enterprise 未来可能在 core 之上加入团队和组织工作流，
例如：

- hosted dashboard；
- team workspace；
- 带 threaded comments 的 PR review bot；
- rule approval console；
- finding history；
- developer feedback analytics；
- automatic intent extraction；
- Git history mining；
- advanced LLM explanations；
- multi-repo governance；
- organization-wide architecture map；
- enterprise integrations；
- SSO、SCIM 和 RBAC；
- audit logs；
- self-hosted 和 VPC deployment；
- advanced compliance 和 security rule packs；
- professional services。

这些是未来商业扩展。运行本地或 CI 中的 S-Agent Core 不需要它们。

阅读完整的 [open-core model](../../OPEN_CORE.md)。

## 仓库结构

- `packages/rules`：`SemanticRule` model、YAML loading、validation、
  registry 和 lifecycle。
- `packages/parser`：TypeScript file indexing、import extraction 和
  function extraction。
- `packages/analyzer`：deterministic 和 heuristic rule checks。
- `packages/verifier`：finding statuses、evidence chains 和 blocking
  classification。
- `packages/explainer`：Markdown 和 JSON report rendering。
- `packages/core`：rules、analyzer、verifier 和 explainer 的 orchestration。
- `packages/shared`：shared types 和 utilities。
- `apps/cli`：command-line interface。
- `rules`：S-Agent 自身的 dogfood rules，包括 package boundary rules。
- `examples`：broken 和 clean TypeScript demo projects。
- `tests/evaluation`：semantic benchmark fixtures 和 metric tests。
- `docs/community`：community roadmap 和 contribution ideas。

## 当前限制

- Diff support 只按 unified diff 中列出的文件过滤 findings，尚未作为完整
  CLI workflow 暴露。
- Side-effect detection 是基于名称的启发式。
- Value invariant detection 只捕获简单数字字面量。
- Import resolution 为 MVP 有意保持简单。
- 目前仅支持 TypeScript。
- 还没有 GitHub Action PR comment workflow。
- 本仓库没有 dashboard 或 hosted service。
- 尚未实现 LLM rule suggestion flow。

## Roadmap

- v0.1：open-source core，包含 CLI、rule validation、parser、analyzer、
  proof-carrying findings、reports、fixtures 和 benchmarks。
- v0.2：basic GitHub Action mode。
- v0.3：community rule packs 和更多 framework examples。
- v0.4：plugin API draft 和 extension-point design。
- Future：用于 team workflows 和 governance 的 AxiomGuard Pro alpha。

查看 [community roadmap](../community/community-roadmap.md)。

## 贡献

欢迎能让 S-Agent Core 保持 focused、useful 和 testable 的贡献。

适合开始的任务：

- 添加 fixtures；
- 改进 examples；
- 添加 rule examples；
- 改进 CLI output；
- 编写 `SemanticRule` schema 文档；
- 添加 framework-specific examples。

阅读 [CONTRIBUTING.md](../../CONTRIBUTING.md) 和
[good first issues](../community/good-first-issues.md)。

## 安全

不要为 security vulnerabilities 创建 public issues。报告流程请阅读
[SECURITY.md](../../SECURITY.md)。

## License

S-Agent Core 使用 [Apache License 2.0](../../LICENSE) 授权。
