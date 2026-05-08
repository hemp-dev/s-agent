# S-Agent Core

هذه ترجمة. النسخة المرجعية من README موجودة في
[README باللغة الإنجليزية](../../README.md).

S-Agent هو محرك مفتوح المصدر للتحليل الدلالي في مراجعة الكود المعتمدة على
النية. يتحقق مما إذا كانت تغييرات كود TypeScript تحافظ على نية العمل
والهندسة المعمارية المعتمدة.

IntentGuard هو المنصة التجارية المستقبلية المبنية فوق S-Agent Core لسير عمل
الفرق وحوكمة المؤسسات.

## المشكلة

قد ينجح الكود في الترجمة ويمرر الاختبارات، ومع ذلك يخالف نية النظام.

أمثلة:

- وحدة auth تستورد كود billing;
- مسار تقارير read-only يكتب في قاعدة بيانات أو يرسل أحداثا;
- خصم يتجاوز الحد المعتمد للمنتج;
- إعادة هيكلة تكسر قرارا معماريا موثقا في مستندات المشروع.

أدوات lint والاختبارات التقليدية ليست مصممة لفرض نوايا العمل والهندسة
الخاصة بكل مشروع.

## الحل

يحول S-Agent Core ملفات YAML المعتمدة من نوع `SemanticRule` إلى فحوصات
حتمية على كود TypeScript. وينتج findings تحمل سلسلة إثبات تشرح القاعدة،
والـ invariant المخالف، والملف المتغير، والدليل، وحالة الحظر.

يبقى core صغيرا عن قصد:

- القواعد المدعومة بالتوثيق هي مصدر الحقيقة;
- deterministic symbolic checks تنتج blocking findings;
- فقط findings من نوع `PROVEN` لقواعد critical معتمدة في وضع `block` يمكن أن
  تفشل CLI;
- لا يستخدم LLM كمصدر حقيقة لسلوك الحظر.

## ما الذي يفحصه اليوم

يركز MVP على مشاريع TypeScript ومجموعة صغيرة من الفحوصات العملية:

- انتهاكات layer boundary، مثل استيراد `src/billing/**` من `src/auth/**`;
- forbidden imports لحدود packages أو modules;
- forbidden side effects داخل نطاقات read-only باستخدام heuristics بسيطة
  مبنية على أسماء الاستدعاءات;
- value invariants باستخدام أرقام literal واضحة، مثل قيمة خصم أعلى من الحد
  المعتمد.

## حالة المشروع

S-Agent Core هو MVP تجريبي. إنه مفيد للعروض المحلية، والـ fixtures، وتجارب CI
المبكرة، لكن public API و rule schema قد يتغيران قبل `1.0.0`.

## البدء السريع

ثبّت الاعتماديات:

```sh
pnpm install
```

ابن المشروع وشغل الاختبارات و lint:

```sh
pnpm build
pnpm test
pnpm lint
```

شغل تحليل clean demo:

```sh
pnpm analyze:demo
```

تحقق من قواعد dogfood الخاصة بـ S-Agent:

```sh
pnpm rules:validate
```

حلل هذا المستودع بقواعده المعمارية الخاصة:

```sh
pnpm analyze:self
```

شغل demo المكسور عمدا:

```sh
pnpm analyze:demo:broken
```

`pnpm analyze:demo:broken` يخرج بالكود `1` لأنه يحتوي عمدا على blocking
violation. يستخدم `pnpm analyze:demo` clean demo ومن المتوقع أن يخرج بالكود
`0`.

بعد البناء، يكون CLI entrypoint متاحا كـ workspace binary package باسم
`@s-agent/cli` مع bin `s-agent`.

## مثال SemanticRule

توجد القواعد في ملفات `.rules.yml`:

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

القواعد approved هي مصدر الحقيقة. يمكن تحميل وفحص قواعد candidate أو
deprecated أو archived أو disabled، لكنها لا تستطيع إنشاء blocking findings.

## مثال مخرجات CLI

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

## حالات findings

- `PROVEN`: يوجد deterministic symbolic evidence. قد تفشل findings critical
  المعتمدة من نوع `PROVEN` في وضع `block` تشغيل CLI.
- `PROBABLE`: يوجد heuristic evidence قوي، لكن لا يوجد proof كامل للحظر.
- `SUSPECT`: إشارة ضعيفة، معلوماتية فقط.
- `RULE_CONFLICT`: محجوز لحالات مستقبلية يتعارض فيها heuristic suspicion مع
  symbolic evidence.
- `DISMISSED`: غير قابل للتنفيذ، أو غير approved، أو غير مدعوم بالأدلة.

## ما هو مفتوح المصدر؟

S-Agent Core مفتوح المصدر ويتضمن:

- CLI analysis.
- نموذج `SemanticRule` وصيغة YAML لملفات القواعد.
- تحميل القواعد والتحقق منها.
- TypeScript parser و indexer أساسيين.
- deterministic analyzer checks أساسية.
- Proof-carrying findings.
- تقارير Markdown و JSON.
- Evaluation fixtures.
- Synthetic benchmarks.
- استخدام CI أساسي.
- Basic GitHub Action مخطط له.

يجب أن يبقى open-source core مفيدا بذاته. لن تنقل ميزات MVP الحالية خلف
paywall.

## نموذج open-core

S-Agent Core هو open-source semantic analysis engine.

قد تضيف IntentGuard Pro و Enterprise لاحقا workflows للفرق والمؤسسات فوق
core، مثل:

- hosted dashboard;
- team workspace;
- PR review bot مع threaded comments;
- rule approval console;
- finding history;
- developer feedback analytics;
- automatic intent extraction;
- Git history mining;
- advanced LLM explanations;
- multi-repo governance;
- organization-wide architecture map;
- enterprise integrations;
- SSO و SCIM و RBAC;
- audit logs;
- self-hosted و VPC deployment;
- advanced compliance و security rule packs;
- professional services.

هذه امتدادات تجارية مستقبلية. ليست مطلوبة لتشغيل S-Agent Core محليا أو في CI.

اقرأ [نموذج open-core الكامل](../../OPEN_CORE.md).

## بنية المستودع

- `packages/rules`: نموذج `SemanticRule`، تحميل YAML، validation، registry و
  lifecycle.
- `packages/parser`: TypeScript file indexing، import extraction و function
  extraction.
- `packages/analyzer`: deterministic و heuristic rule checks.
- `packages/verifier`: finding statuses، evidence chains و blocking
  classification.
- `packages/explainer`: Markdown و JSON report rendering.
- `packages/core`: orchestration بين rules و analyzer و verifier و explainer.
- `packages/shared`: shared types و utilities.
- `apps/cli`: command-line interface.
- `rules`: قواعد dogfood الخاصة بـ S-Agent، بما في ذلك package boundary rules.
- `examples`: مشاريع demo TypeScript مكسورة ونظيفة.
- `tests/evaluation`: semantic benchmark fixtures و metric tests.
- `docs/community`: community roadmap وأفكار contributions.

## القيود الحالية

- Diff support يرشح findings فقط حسب الملفات المذكورة في unified diff، ولم
  يعرض بعد كـ full CLI workflow.
- Side-effect detection heuristic ومبني على الأسماء.
- Value invariant detection يلتقط فقط numeric literals بسيطة.
- Import resolution بسيط عمدا للـ MVP.
- TypeScript هي اللغة الوحيدة المدعومة.
- لا يوجد GitHub Action PR comment workflow حتى الآن.
- لا يوجد dashboard أو hosted service في هذا المستودع.
- لم ينفذ LLM rule suggestion flow.

## Roadmap

- v0.1: open-source core مع CLI، rule validation، parser، analyzer،
  proof-carrying findings، reports، fixtures و benchmarks.
- v0.2: basic GitHub Action mode.
- v0.3: community rule packs ومزيد من framework examples.
- v0.4: plugin API draft وتصميم extension points.
- Future: IntentGuard Pro alpha لـ team workflows و governance.

راجع [community roadmap](../community/community-roadmap.md).

## المساهمة

المساهمات مرحب بها عندما تبقي S-Agent Core focused و useful و testable.

بدايات جيدة:

- إضافة fixtures;
- تحسين examples;
- إضافة rule examples;
- تحسين CLI output;
- توثيق schema الخاصة بـ `SemanticRule`;
- إضافة framework-specific examples.

اقرأ [CONTRIBUTING.md](../../CONTRIBUTING.md) و
[good first issues](../community/good-first-issues.md).

## Security

لا تفتح public issues للثغرات الأمنية. اقرأ [SECURITY.md](../../SECURITY.md)
لمعرفة عملية الإبلاغ.

## License

S-Agent Core مرخص بموجب [Apache License 2.0](../../LICENSE).
