# Metrics Framework

## Purpose

S-Agent, customer-facing as IntentGuard, needs two measurement systems:

1. Product correctness: does the deterministic review engine find real intent violations without noisy blocking findings?
2. Product usefulness: do teams understand, trust, and keep using the findings?

The MVP should optimize for narrow reliability over broad coverage. A small number of high-confidence intent checks is more valuable than a large number of vague review comments.

## Metric Categories

### Technical Metrics

| Metric | Definition | MVP target |
| --- | --- | --- |
| Unit test pass rate | Passing unit tests divided by total unit tests. | 100% on main branch |
| Integration test pass rate | Passing end-to-end package and CLI tests divided by total integration tests. | 100% on main branch |
| Fixture coverage | Required semantic scenario families represented by executable fixtures. | Clean, layer, side effect, value invariant, false positive, ambiguous |
| CLI execution stability | Successful CLI runs divided by total benchmark CLI runs. | 100% on benchmark fixtures |

### Semantic Metrics

| Metric | Definition | MVP target |
| --- | --- | --- |
| Precision | True positive findings divided by all findings. | >= 80% |
| Recall | Expected violations detected divided by total known violations. | >= 50-60% on the narrow MVP rule set |
| False positive rate | Unexpected findings on clean/control fixtures divided by control opportunities. | <= 20% |
| PROVEN finding rate | PROVEN findings divided by all findings. | Track separately |
| PROVEN blocking finding rate | PROVEN blocking findings divided by all blocking findings. | >= 70%; ideally 100% because only PROVEN critical findings should block |

### Developer Experience Metrics

| Metric | Definition | MVP target |
| --- | --- | --- |
| Developer acceptance rate | Findings accepted by developers divided by actionable findings. | Track in pilots |
| Suppression rate | Suppressed or dismissed findings divided by total findings. | Track; rising rate signals noise |
| Time to understand finding | Median time for a developer to explain why a finding exists. | Under 60 seconds for deterministic findings |
| PR review time impact | Review duration with IntentGuard compared to baseline review duration. | Neutral or better after onboarding |

### Business Metrics

| Metric | Definition | MVP target |
| --- | --- | --- |
| Semantic regressions prevented | Confirmed risky merges prevented by blocking or accepted review findings. | At least 1 in first real repo test |
| Escaped semantic bugs | Semantic bugs that still reach production after IntentGuard is deployed. | Track; should trend down |
| Critical module coverage | Critical modules with at least one approved rule divided by total critical modules. | Track by repo |
| Architecture drift detected | Boundary or dependency violations detected before merge. | Track by repo |
| AI-generated code safety | AI-authored PRs checked and cleared or blocked by approved rules. | Track during AI coding pilots |

### Commercial Metrics

| Metric | Definition | MVP target |
| --- | --- | --- |
| Time to first useful finding | Time from install/start to first accepted useful finding or clean pass. | Under 30 minutes |
| Onboarding time | Time to install, define or use first rule, run first analysis, and interpret report. | Under 30 minutes |
| Activation rate | Teams that reach first useful finding divided by teams that start onboarding. | Track in pilots |
| Willingness to pay | Stated and observed price acceptance from discovery and pilots. | Validate before paid launch |
| Team retention after 7 days | Teams still running checks 7 days after activation. | Track in pilots |
| GitHub Action installation rate | Teams that install the GitHub Action once available divided by activated teams. | Track after Action exists |
| Five-rule creation rate | Teams that create at least 5 SemanticRules divided by activated teams. | Track in pilots |

## Finding Outcome Labels

Use these labels for evaluation:

- True positive: finding matches a known fixture violation or is accepted by a developer in a real repo.
- False positive: finding is not actionable or contradicts approved intent.
- False negative: known violation exists but no finding is produced.
- True negative: clean or control case produces no finding.
- Ambiguous: finding requires human judgment and should not block unless promoted to a deterministic rule.

## MVP Quality Gates

The MVP benchmark suite should pass these gates:

- Precision >= 80%.
- Recall >= 50-60% on the narrow MVP fixture set.
- False positive rate <= 20%.
- Clean project produces zero blocking findings.
- Broken fixture produces at least one PROVEN finding.
- At least one useful semantic finding appears in the first real repo test.
- Onboarding can be completed in under 30 minutes.
- A developer can understand a deterministic finding in under 60 seconds.

## Measurement Cadence

- Every code change: run unit, integration, and semantic fixture benchmarks.
- Every fixture addition: update expected finding metadata.
- Every real pilot repo: record first useful finding, suppressions, developer acceptance, and onboarding time.
- Every release candidate: compare semantic metrics against previous release.
