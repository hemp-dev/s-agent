# S-Agent Core

Ceci est une traduction. La version canonique du README se trouve dans le
[README anglais](../../README.md).

S-Agent est un moteur open source d'analyse sémantique pour la revue de code
orientée intention. Il vérifie si les changements de code TypeScript préservent
l'intention métier et architecturale approuvée.

AxiomGuard est la future plateforme commerciale construite sur S-Agent Core
pour les workflows d'équipe et la gouvernance d'entreprise.

## Problème

Du code peut compiler, passer les tests et pourtant violer l'intention du
système.

Exemples :

- un module auth importe du code billing ;
- un flux de reporting read-only écrit dans une base de données ou émet des
  événements ;
- une remise dépasse le seuil produit approuvé ;
- un refactoring casse une décision d'architecture documentée.

Les linters et les tests traditionnels ne sont pas conçus pour faire respecter
des intentions métier et architecturales propres à un projet.

## Solution

S-Agent Core transforme des fichiers YAML `SemanticRule` approuvés en
vérifications déterministes sur du code TypeScript. Il produit des findings
porteurs de preuves qui expliquent la règle, l'invariant violé, le fichier
modifié, l'evidence et le statut bloquant.

Le core reste volontairement petit :

- les règles issues de la documentation sont la source de vérité ;
- les vérifications symboliques déterministes produisent des findings
  bloquants ;
- seuls les findings `PROVEN` issus de règles critical approuvées en mode
  `block` peuvent faire échouer le CLI ;
- les LLM ne sont pas utilisés comme source de vérité pour le comportement
  bloquant.

## Ce qui est vérifié aujourd'hui

Le MVP cible les projets TypeScript et un petit ensemble de vérifications
pratiques :

- violations de limites de couches, par exemple `src/auth/**` qui importe
  `src/billing/**` ;
- imports interdits pour les limites de packages ou de modules ;
- effets de bord interdits dans les scopes read-only via de simples
  heuristiques sur les noms d'appels ;
- invariants de valeur avec des littéraux numériques évidents, comme une remise
  au-dessus du maximum approuvé.

## Statut du projet

S-Agent Core est un MVP expérimental. Il est utile pour les démos locales, les
fixtures et les premières expériences CI, mais l'API publique et le schéma de
règles peuvent encore changer avant `1.0.0`.

## Démarrage rapide

Installez les dépendances :

```sh
pnpm install
```

Construisez, testez et lancez le lint :

```sh
pnpm build
pnpm test
pnpm lint
```

Lancez l'analyse de la démo propre :

```sh
pnpm analyze:demo
```

Validez les règles dogfood de S-Agent :

```sh
pnpm rules:validate
```

Analysez ce dépôt avec ses propres règles d'architecture :

```sh
pnpm analyze:self
```

Lancez la démo volontairement cassée :

```sh
pnpm analyze:demo:broken
```

`pnpm analyze:demo:broken` sort avec le code `1` parce qu'elle contient
volontairement une violation bloquante. `pnpm analyze:demo` utilise la démo
propre et doit sortir avec le code `0`.

Après build, l'entrypoint CLI est disponible comme binaire du package workspace
`@s-agent/cli` avec le bin `s-agent`.

## Exemple de SemanticRule

Les règles vivent dans des fichiers `.rules.yml` :

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

Les règles approuvées sont la source de vérité. Les règles candidate,
deprecated, archived ou disabled peuvent être chargées et inspectées, mais ne
peuvent pas créer de findings bloquants.

## Exemple de sortie CLI

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

## Statuts des findings

- `PROVEN` : une evidence symbolique déterministe existe. Les findings
  critical `PROVEN` approuvés en mode `block` peuvent faire échouer le CLI.
- `PROBABLE` : une evidence heuristique forte existe, mais pas assez de preuve
  pour bloquer.
- `SUSPECT` : signal faible, seulement informatif.
- `RULE_CONFLICT` : réservé à de futurs cas où une suspicion heuristique
  contredit une evidence symbolique.
- `DISMISSED` : non actionnable, non approuvé ou non soutenu par l'evidence.

## Ce qui est open source

S-Agent Core est open source et inclut :

- l'analyse CLI ;
- le modèle `SemanticRule` et le format YAML des fichiers de règles ;
- le chargement et la validation des règles ;
- un parser et indexer TypeScript de base ;
- des vérifications déterministes de base ;
- des findings porteurs de preuves ;
- des rapports Markdown et JSON ;
- des fixtures d'évaluation ;
- des benchmarks synthétiques ;
- un usage CI de base ;
- une GitHub Action de base planifiée.

Le core open source doit rester utile par lui-même. Les fonctionnalités MVP
existantes ne seront pas déplacées derrière un paywall.

## Modèle open-core

S-Agent Core est le moteur open source d'analyse sémantique.

AxiomGuard Pro et Enterprise pourront plus tard ajouter des workflows d'équipe
et d'organisation au-dessus du core, par exemple :

- hosted dashboard ;
- team workspace ;
- PR review bot avec threaded comments ;
- rule approval console ;
- finding history ;
- developer feedback analytics ;
- automatic intent extraction ;
- Git history mining ;
- advanced LLM explanations ;
- multi-repo governance ;
- organization-wide architecture map ;
- enterprise integrations ;
- SSO, SCIM et RBAC ;
- audit logs ;
- self-hosted et VPC deployment ;
- advanced compliance et security rule packs ;
- professional services.

Ce sont de futures extensions commerciales. Elles ne sont pas nécessaires pour
exécuter S-Agent Core localement ou en CI.

Lisez le [modèle open-core complet](../../OPEN_CORE.md).

## Structure du dépôt

- `packages/rules` : modèle `SemanticRule`, chargement YAML, validation,
  registry et lifecycle.
- `packages/parser` : indexation des fichiers TypeScript, extraction d'imports
  et extraction de fonctions.
- `packages/analyzer` : vérifications déterministes et heuristiques.
- `packages/verifier` : statuts de findings, chaînes d'evidence et
  classification bloquante.
- `packages/explainer` : rendu de rapports Markdown et JSON.
- `packages/core` : orchestration entre rules, analyzer, verifier et explainer.
- `packages/shared` : types et utilitaires partagés.
- `apps/cli` : interface en ligne de commande.
- `rules` : règles dogfood de S-Agent, y compris les règles de limites de
  packages.
- `examples` : projets demo TypeScript cassés et propres.
- `tests/evaluation` : fixtures de benchmark sémantique et tests de métriques.
- `docs/community` : roadmap communautaire et idées de contribution.

## Limitations actuelles

- Le support diff filtre seulement les findings selon les fichiers listés dans
  un unified diff et n'est pas encore exposé comme workflow CLI complet.
- La détection des effets de bord est heuristique et basée sur les noms.
- La détection des invariants de valeur ne capture que des littéraux numériques
  simples.
- La résolution d'imports est volontairement simple pour le MVP.
- TypeScript est le seul langage supporté.
- Aucun workflow de commentaires PR via GitHub Action n'existe encore.
- Aucun dashboard ni service hosted n'existe dans ce dépôt.
- Aucun flux de suggestion de règles par LLM n'est implémenté.

## Roadmap

- v0.1 : core open source avec CLI, validation des règles, parser, analyzer,
  findings porteurs de preuves, rapports, fixtures et benchmarks.
- v0.2 : mode GitHub Action de base.
- v0.3 : rule packs communautaires et plus d'exemples de frameworks.
- v0.4 : draft d'API plugin et design des points d'extension.
- Future : alpha AxiomGuard Pro pour team workflows et governance.

Voir la [community roadmap](../community/community-roadmap.md).

## Contribuer

Les contributions sont bienvenues lorsqu'elles gardent S-Agent Core concentré,
utile et testable.

Bons points de départ :

- ajouter des fixtures ;
- améliorer les exemples ;
- ajouter des exemples de règles ;
- améliorer la sortie CLI ;
- documenter le schema `SemanticRule` ;
- ajouter des exemples propres à des frameworks.

Lisez [CONTRIBUTING.md](../../CONTRIBUTING.md) et
[good first issues](../community/good-first-issues.md).

## Sécurité

N'ouvrez pas d'issues publiques pour les vulnérabilités de sécurité. Lisez
[SECURITY.md](../../SECURITY.md) pour le processus de signalement.

## Licence

S-Agent Core est sous licence [Apache License 2.0](../../LICENSE).
