# S-Agent Core

Esta es una traducción. La versión canónica del README está en el
[README en inglés](../../README.md).

S-Agent es un motor open source de análisis semántico para revisiones de código
orientadas a intención. Comprueba si los cambios en código TypeScript preservan
la intención de negocio y arquitectura aprobada.

AxiomGuard es la futura plataforma comercial construida sobre S-Agent Core
para flujos de trabajo de equipo y gobierno empresarial.

## Problema

El código puede compilar, pasar las pruebas y aun así violar la intención del
sistema.

Ejemplos:

- un módulo de auth importa código de billing;
- un flujo read-only de reportes escribe en una base de datos o emite eventos;
- un descuento supera el umbral de producto aprobado;
- una refactorización rompe una decisión de arquitectura documentada.

Los linters y las pruebas tradicionales no están diseñados para hacer cumplir
intenciones de negocio y arquitectura específicas del proyecto.

## Solución

S-Agent Core convierte archivos YAML `SemanticRule` aprobados en comprobaciones
deterministas sobre código TypeScript. Genera findings con prueba: la regla, el
invariant violado, el archivo modificado, la evidencia y el estado de bloqueo.

El core se mantiene pequeño de forma intencional:

- las reglas respaldadas por documentación son la fuente de verdad;
- las comprobaciones simbólicas deterministas producen findings bloqueantes;
- solo los findings `PROVEN` de reglas critical aprobadas en modo `block`
  pueden hacer fallar el CLI;
- los LLM no son la fuente de verdad para el comportamiento bloqueante.

## Qué comprueba hoy

El MVP se enfoca en proyectos TypeScript y un conjunto pequeño de comprobaciones
prácticas:

- violaciones de límites de capa, como `src/auth/**` importando
  `src/billing/**`;
- imports prohibidos para límites de paquetes o módulos;
- efectos secundarios prohibidos en ámbitos read-only usando heurísticas
  simples basadas en nombres de llamadas;
- invariantes de valor con literales numéricos obvios, como un descuento por
  encima del máximo aprobado.

## Estado del proyecto

S-Agent Core es un MVP experimental. Es útil para demos locales, fixtures y
experimentos tempranos de CI, pero la API pública y el esquema de reglas pueden
cambiar antes de `1.0.0`.

## Inicio rápido

Instala dependencias:

```sh
pnpm install
```

Compila, ejecuta pruebas y lint:

```sh
pnpm build
pnpm test
pnpm lint
```

Ejecuta el análisis de la demo limpia:

```sh
pnpm analyze:demo
```

Valida las reglas dogfood de S-Agent:

```sh
pnpm rules:validate
```

Analiza este repositorio con sus propias reglas de arquitectura:

```sh
pnpm analyze:self
```

Ejecuta la demo intencionalmente rota:

```sh
pnpm analyze:demo:broken
```

`pnpm analyze:demo:broken` sale con código `1` porque contiene una violación
bloqueante intencional. `pnpm analyze:demo` usa la demo limpia y debe salir con
código `0`.

Después de compilar, el entrypoint del CLI está disponible como el paquete bin
del workspace `@s-agent/cli` con el bin `s-agent`.

## Ejemplo de SemanticRule

Las reglas viven en archivos `.rules.yml`:

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

Las reglas aprobadas son la fuente de verdad. Las reglas candidate, deprecated,
archived o disabled pueden cargarse e inspeccionarse, pero no pueden crear
findings bloqueantes.

## Ejemplo de salida del CLI

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

## Estados de findings

- `PROVEN`: existe evidencia simbólica determinista. Los findings critical
  `PROVEN` aprobados en modo `block` pueden hacer fallar el CLI.
- `PROBABLE`: existe evidencia heurística fuerte, pero no suficiente prueba
  para bloquear.
- `SUSPECT`: señal débil, solo informativa.
- `RULE_CONFLICT`: reservado para casos futuros donde una sospecha heurística
  entre en conflicto con evidencia simbólica.
- `DISMISSED`: no es accionable, no está aprobado o no tiene evidencia.

## Qué es open source

S-Agent Core es open source e incluye:

- análisis por CLI;
- el modelo `SemanticRule` y el formato YAML de archivos de reglas;
- carga y validación de reglas;
- parser e indexer básicos para TypeScript;
- comprobaciones deterministas básicas del analyzer;
- findings con prueba;
- reportes Markdown y JSON;
- fixtures de evaluación;
- benchmarks sintéticos;
- uso básico en CI;
- una GitHub Action básica planificada.

El core open source debe seguir siendo útil por sí mismo. Las funcionalidades
MVP existentes no se moverán detrás de un paywall.

## Modelo open-core

S-Agent Core es el motor open source de análisis semántico.

AxiomGuard Pro y Enterprise podrán añadir más adelante flujos de trabajo para
equipos y organizaciones sobre el core, como:

- hosted dashboard;
- team workspace;
- PR review bot con threaded comments;
- rule approval console;
- finding history;
- developer feedback analytics;
- automatic intent extraction;
- Git history mining;
- advanced LLM explanations;
- multi-repo governance;
- organization-wide architecture map;
- enterprise integrations;
- SSO, SCIM y RBAC;
- audit logs;
- self-hosted y VPC deployment;
- advanced compliance y security rule packs;
- professional services.

Estas son extensiones comerciales futuras. No son necesarias para ejecutar
S-Agent Core localmente o en CI.

Lee el [modelo open-core completo](../../OPEN_CORE.md).

## Estructura del repositorio

- `packages/rules`: modelo `SemanticRule`, carga YAML, validación, registry y
  lifecycle.
- `packages/parser`: indexación de archivos TypeScript, extracción de imports y
  extracción de funciones.
- `packages/analyzer`: comprobaciones deterministas y heurísticas de reglas.
- `packages/verifier`: estados de findings, cadenas de evidencia y
  clasificación bloqueante.
- `packages/explainer`: renderizado de reportes Markdown y JSON.
- `packages/core`: orquestación entre rules, analyzer, verifier y explainer.
- `packages/shared`: tipos y utilidades compartidas.
- `apps/cli`: interfaz de línea de comandos.
- `rules`: reglas dogfood de S-Agent, incluidas reglas de límites de paquetes.
- `examples`: proyectos demo TypeScript rotos y limpios.
- `tests/evaluation`: fixtures de benchmarks semánticos y pruebas de métricas.
- `docs/community`: roadmap comunitario e ideas de contribución.

## Limitaciones actuales

- El soporte de diff solo filtra findings por archivos listados en un unified
  diff y aún no está expuesto como flujo completo de CLI.
- La detección de efectos secundarios es heurística y basada en nombres.
- La detección de invariantes de valor solo captura literales numéricos simples.
- La resolución de imports es intencionalmente simple para el MVP.
- TypeScript es el único lenguaje soportado.
- Aún no hay workflow de comentarios de PR con GitHub Action.
- No hay dashboard ni servicio hosted en este repositorio.
- No hay flujo de sugerencia de reglas con LLM implementado.

## Roadmap

- v0.1: core open source con CLI, validación de reglas, parser, analyzer,
  findings con prueba, reportes, fixtures y benchmarks.
- v0.2: modo básico de GitHub Action.
- v0.3: rule packs comunitarios y más ejemplos de frameworks.
- v0.4: borrador de plugin API y diseño de puntos de extensión.
- Futuro: alpha de AxiomGuard Pro para team workflows y governance.

Consulta el [community roadmap](../community/community-roadmap.md).

## Contribuir

Las contribuciones son bienvenidas cuando mantienen S-Agent Core enfocado, útil
y comprobable.

Buenos puntos de partida:

- añadir fixtures;
- mejorar ejemplos;
- añadir ejemplos de reglas;
- mejorar la salida del CLI;
- documentar el schema de `SemanticRule`;
- añadir ejemplos específicos de frameworks.

Lee [CONTRIBUTING.md](../../CONTRIBUTING.md) y
[good first issues](../community/good-first-issues.md).

## Seguridad

No abras issues públicos para vulnerabilidades de seguridad. Lee
[SECURITY.md](../../SECURITY.md) para conocer el proceso de reporte.

## Licencia

S-Agent Core está licenciado bajo [Apache License 2.0](../../LICENSE).
