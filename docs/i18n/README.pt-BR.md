# S-Agent Core

Esta é uma tradução. A versão canônica do README está no
[README em inglês](../../README.md).

S-Agent é um mecanismo open source de análise semântica para code review
orientado por intenção. Ele verifica se mudanças em código TypeScript preservam
a intenção de negócio e arquitetura aprovada.

IntentGuard é a futura plataforma comercial construída sobre o S-Agent Core
para fluxos de trabalho de equipes e governança empresarial.

## Problema

O código pode compilar, passar nos testes e ainda assim violar a intenção do
sistema.

Exemplos:

- um módulo de auth importa código de billing;
- um fluxo read-only de relatórios escreve no banco de dados ou emite eventos;
- um desconto excede o limite aprovado do produto;
- uma refatoração quebra uma decisão de arquitetura documentada.

Linters e testes tradicionais não foram criados para impor intenções de negócio
e arquitetura específicas de cada projeto.

## Solução

S-Agent Core transforma arquivos YAML `SemanticRule` aprovados em verificações
determinísticas sobre código TypeScript. Ele gera findings com cadeia de prova
que explicam a regra, o invariant violado, o arquivo alterado, a evidência e o
status de bloqueio.

O core é intencionalmente pequeno:

- regras baseadas em documentação são a fonte da verdade;
- verificações simbólicas determinísticas produzem findings bloqueantes;
- apenas findings `PROVEN` de regras critical aprovadas em modo `block` podem
  fazer o CLI falhar;
- LLMs não são usados como fonte da verdade para comportamento bloqueante.

## O que ele verifica hoje

O MVP foca em projetos TypeScript e em um pequeno conjunto de verificações
práticas:

- violações de limite de camada, como `src/auth/**` importando
  `src/billing/**`;
- imports proibidos para limites de packages ou módulos;
- efeitos colaterais proibidos em escopos read-only usando heurísticas simples
  por nome de chamada;
- invariantes de valor usando literais numéricos óbvios, como desconto acima do
  máximo aprovado.

## Status do projeto

S-Agent Core é um MVP experimental. Ele é útil para demos locais, fixtures e
experimentos iniciais de CI, mas a API pública e o schema de regras ainda podem
mudar antes da versão `1.0.0`.

## Início rápido

Instale as dependências:

```sh
pnpm install
```

Faça build, execute testes e lint:

```sh
pnpm build
pnpm test
pnpm lint
```

Execute a análise da demo limpa:

```sh
pnpm analyze:demo
```

Valide as regras dogfood do S-Agent:

```sh
pnpm rules:validate
```

Analise este repositório com suas próprias regras de arquitetura:

```sh
pnpm analyze:self
```

Execute a demo intencionalmente quebrada:

```sh
pnpm analyze:demo:broken
```

`pnpm analyze:demo:broken` sai com código `1` porque contém uma violação
bloqueante intencional. `pnpm analyze:demo` usa a demo limpa e deve sair com
código `0`.

Depois do build, o entrypoint do CLI fica disponível como o pacote binário de
workspace `@s-agent/cli` com o bin `s-agent`.

## Exemplo de SemanticRule

As regras ficam em arquivos `.rules.yml`:

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

Regras aprovadas são a fonte da verdade. Regras candidate, deprecated, archived
ou disabled podem ser carregadas e inspecionadas, mas não podem criar findings
bloqueantes.

## Exemplo de saída do CLI

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

## Status dos findings

- `PROVEN`: existe evidência simbólica determinística. Findings critical
  `PROVEN` aprovados em modo `block` podem fazer o CLI falhar.
- `PROBABLE`: existe evidência heurística forte, mas sem prova completa para
  bloquear.
- `SUSPECT`: sinal fraco, apenas informativo.
- `RULE_CONFLICT`: reservado para casos futuros em que uma suspeita heurística
  conflita com evidência simbólica.
- `DISMISSED`: não acionável, não aprovado ou sem suporte por evidência.

## O que é open source?

S-Agent Core é open source e inclui:

- análise por CLI;
- o modelo `SemanticRule` e o formato YAML de arquivos de regras;
- carregamento e validação de regras;
- parser e indexer básicos de TypeScript;
- verificações determinísticas básicas do analyzer;
- findings com cadeia de prova;
- relatórios Markdown e JSON;
- fixtures de avaliação;
- benchmarks sintéticos;
- uso básico em CI;
- uma GitHub Action básica planejada.

O core open source deve continuar útil por si só. Funcionalidades MVP existentes
não serão colocadas atrás de um paywall.

## Modelo open-core

S-Agent Core é o mecanismo open source de análise semântica.

IntentGuard Pro e Enterprise podem adicionar futuramente fluxos de trabalho de
equipes e organizações sobre o core, como:

- hosted dashboard;
- team workspace;
- PR review bot com threaded comments;
- rule approval console;
- finding history;
- developer feedback analytics;
- automatic intent extraction;
- Git history mining;
- advanced LLM explanations;
- multi-repo governance;
- organization-wide architecture map;
- enterprise integrations;
- SSO, SCIM e RBAC;
- audit logs;
- self-hosted e VPC deployment;
- advanced compliance e security rule packs;
- professional services.

Essas são extensões comerciais futuras. Elas não são necessárias para executar
o S-Agent Core localmente ou em CI.

Leia o [modelo open-core completo](../../OPEN_CORE.md).

## Estrutura do repositório

- `packages/rules`: modelo `SemanticRule`, carregamento YAML, validação,
  registry e lifecycle.
- `packages/parser`: indexação de arquivos TypeScript, extração de imports e
  extração de funções.
- `packages/analyzer`: verificações determinísticas e heurísticas de regras.
- `packages/verifier`: status de findings, cadeias de evidência e classificação
  bloqueante.
- `packages/explainer`: renderização de relatórios Markdown e JSON.
- `packages/core`: orquestração entre rules, analyzer, verifier e explainer.
- `packages/shared`: tipos e utilitários compartilhados.
- `apps/cli`: interface de linha de comando.
- `rules`: regras dogfood do S-Agent, incluindo regras de limites de packages.
- `examples`: projetos demo TypeScript quebrados e limpos.
- `tests/evaluation`: fixtures de benchmarks semânticos e testes de métricas.
- `docs/community`: roadmap da comunidade e ideias de contribuição.

## Limitações atuais

- O suporte a diff apenas filtra findings por arquivos listados em um unified
  diff e ainda não está exposto como workflow completo de CLI.
- A detecção de efeitos colaterais é heurística e baseada em nomes.
- A detecção de invariantes de valor só captura literais numéricos simples.
- A resolução de imports é intencionalmente simples para o MVP.
- TypeScript é a única linguagem suportada.
- Ainda não há workflow de comentários em PR via GitHub Action.
- Não há dashboard ou serviço hosted neste repositório.
- Não há fluxo de sugestão de regras com LLM implementado.

## Roadmap

- v0.1: core open source com CLI, validação de regras, parser, analyzer,
  findings com prova, relatórios, fixtures e benchmarks.
- v0.2: modo básico de GitHub Action.
- v0.3: rule packs comunitários e mais exemplos de frameworks.
- v0.4: rascunho de plugin API e design de pontos de extensão.
- Futuro: alpha do IntentGuard Pro para team workflows e governance.

Veja o [community roadmap](../community/community-roadmap.md).

## Contribuindo

Contribuições são bem-vindas quando mantêm o S-Agent Core focado, útil e
testável.

Bons pontos de partida:

- adicionar fixtures;
- melhorar exemplos;
- adicionar exemplos de regras;
- melhorar a saída do CLI;
- documentar o schema `SemanticRule`;
- adicionar exemplos específicos de frameworks.

Leia [CONTRIBUTING.md](../../CONTRIBUTING.md) e
[good first issues](../community/good-first-issues.md).

## Segurança

Não abra issues públicos para vulnerabilidades de segurança. Leia
[SECURITY.md](../../SECURITY.md) para o processo de reporte.

## Licença

S-Agent Core é licenciado sob [Apache License 2.0](../../LICENSE).
