# Business Impact Metrics

## Why Business Metrics Matter

IntentGuard's value is not the number of findings. Its value is preventing changes that violate business intent, architecture decisions, and critical domain constraints.

## Core Business Metrics

### Semantic Regressions Prevented

```text
semantic_regressions_prevented = accepted_blocking_findings + accepted_pre_merge_review_findings
```

Count only findings that the team agrees would have created business, architecture, operational, or compliance risk if merged.

Examples:

- Auth importing billing despite an identity-only boundary.
- Read-only reporting code writing to a database.
- Discount logic exceeding an approved threshold.
- A critical module using an unapproved dependency.

### Escaped Semantic Bugs

```text
escaped_semantic_bugs = semantic_bugs_reaching_production_after_intentguard
```

This is the counter-metric to regressions prevented. If escaped semantic bugs continue after rules exist, either the rule coverage is too low or the checker is missing important cases.

### Critical Module Coverage

```text
critical_module_coverage = critical_modules_with_approved_rules / total_critical_modules
```

Critical modules should be identified by the customer:

- auth;
- billing;
- permissions;
- payments;
- audit;
- privacy;
- entitlements;
- data export;
- compliance-sensitive workflows.

### Architecture Drift Detected

```text
architecture_drift_detected = boundary_findings + forbidden_import_findings
```

Track by module and rule. The best signal is not raw count; it is whether repeated drift decreases after rules are approved.

### AI-Generated Code Safety

```text
ai_generated_code_safety = ai_authored_prs_checked / ai_authored_prs_opened
```

Also track:

- AI-authored PRs with PROVEN findings;
- AI-authored PRs with clean pass;
- accepted findings in AI-authored PRs;
- critical modules touched by AI-authored PRs.
- AI-generated changes that violated approved intent.

## Commercial Impact Metrics

### Time To First Useful Finding

Measure from the start of onboarding to:

- first accepted finding; or
- first trusted clean pass on a meaningful rule.

MVP target: under 30 minutes.

### Onboarding Time

Measure time to:

1. install or run the CLI;
2. point IntentGuard at a repo;
3. validate rules;
4. run analysis;
5. interpret the result.

MVP target: under 30 minutes.

### Activation Rate

```text
activation_rate = teams_with_first_useful_finding / teams_started
```

Activation should require a meaningful rule, not just a successful install.

Additional activation milestones:

- installed GitHub Action once available;
- created at least 5 SemanticRules;
- accepted at least one finding;
- ran analysis again within 7 days.

### Willingness To Pay

Collect through discovery calls and pilot conversion:

- acceptable price per active contributor;
- budget owner;
- procurement blocker;
- value metric preference;
- must-have enterprise features.

### Team Retention After 7 Days

```text
team_retention_7d = teams_running_again_within_7_days / activated_teams
```

Retention means the team ran IntentGuard again, added a rule, changed rule status, or discussed a finding.

## Reporting View

For each pilot, summarize:

- number of rules approved;
- number of protected critical modules;
- number of analyses run;
- clean passes;
- PROVEN findings;
- accepted findings;
- suppressed findings;
- time to first useful finding;
- onboarding time;
- next rule requested.

## Interpretation Guidance

High finding volume is not automatically good. The MVP should prefer:

- fewer findings;
- higher acceptance;
- stronger evidence;
- clear business connection;
- low suppression;
- fast onboarding.

One accepted critical semantic finding in a real repository is more valuable than dozens of speculative comments.
