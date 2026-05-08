# Developer Experience Metrics

## Why DX Matters

IntentGuard can only protect intent if developers trust its findings. The MVP should measure not only whether findings are correct, but whether they are understandable, actionable, and low-noise in real PR workflows.

## Core DX Metrics

### Developer Acceptance Rate

```text
developer_acceptance_rate = accepted_findings / actionable_findings
```

Accepted means the developer agrees the finding should be fixed, converted into a task, or intentionally documented as an exception.

Target for pilots: track only. A useful early signal is > 60% acceptance for non-clean pilot findings.

### Suppression Rate

```text
suppression_rate = suppressed_findings / total_findings
```

Suppression includes ignored findings, dismissed findings, or explicit rule exceptions.

Interpretation:

- Low suppression: rules are probably well scoped.
- Rising suppression: a rule may be too broad, too heuristic, or insufficiently explained.
- High suppression on a critical rule: block mode is premature.

### Time To Understand Finding

Measure the time from opening the report to the developer being able to explain:

- what rule was violated;
- where the violation occurred;
- why it matters;
- what evidence supports it.

MVP target: under 60 seconds for deterministic findings.

### PR Review Time Impact

```text
review_time_impact = median_review_time_with_intentguard - baseline_median_review_time
```

Do not expect immediate reduction during onboarding. The first target is neutral review time with higher confidence. Later, target reduced senior-review load for repeated rules.

## Qualitative Prompts

Ask developers after reviewing a finding:

1. Was the finding understandable?
2. Was it actionable?
3. Did the evidence prove the issue?
4. Would you want this rule to block future PRs?
5. What wording would make the finding clearer?
6. Would you keep this check enabled next week?

## DX Event Taxonomy

Track these events in future product instrumentation:

- rule created;
- rule approved;
- rule changed from info to review;
- rule changed from review to block;
- analysis started;
- analysis completed;
- finding viewed;
- finding accepted;
- finding suppressed;
- finding linked to source docs;
- CLI run failed;
- CLI run produced blocking finding;
- CLI run produced clean pass.

## Developer Trust Principles

- Clean projects should be quiet.
- Blocking should be rare and explainable.
- Findings should link to source documentation.
- Heuristic findings should not pretend to be proof.
- Rules should have owners.
- Developers should know how to propose rule changes.

## Pilot Collection Template

| Field | Value |
| --- | --- |
| Repo | |
| Rule id | |
| Finding status | |
| Accepted? | |
| Suppressed? | |
| Time to understand | |
| Would block next time? | |
| Developer comment | |
