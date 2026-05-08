# Customer Discovery Interview Script

## Interview Goal

Validate whether engineering teams feel acute pain around business and architecture intent drifting during code review, and whether they would adopt an explicit rule-based review guardrail.

## Target Participants

- VP Engineering
- CTO
- Staff Engineer
- Principal Engineer
- Platform Engineering lead
- Application Security lead
- Engineering manager responsible for code review quality

## Setup

Length: 30-45 minutes.

Positioning to test:

> We are exploring AxiomGuard, an intent-aware code review tool that turns approved engineering docs and architecture rules into deterministic PR checks.

Do not pitch heavily at the start. Spend the first two-thirds on current behavior and pain.

## Opening

Thanks for taking the time. I am researching how teams protect architecture and business rules during code review, especially as code volume increases. I am not here to sell; I want to understand your review process and where existing tools fall short.

## Current Workflow

1. Walk me through how a typical pull request gets reviewed today.
2. What kinds of issues do reviewers reliably catch?
3. What kinds of issues tend to slip through?
4. Where do architecture or domain rules live today?
5. How do new engineers learn those rules?
6. How do AI coding tools affect your review process, if at all?

## Pain Discovery

1. Tell me about the last time a change violated an architecture or business rule.
2. How was it caught?
3. What was the cost of catching it late?
4. Which review comments do senior engineers repeat most often?
5. Are there rules that everyone agrees with but no tool enforces?
6. How often do reviewers disagree about whether something should block?

## Existing Alternatives

1. What do you use for SAST, code quality, linting, or AI code review?
2. Which tools are trusted enough to block a merge?
3. Which tools are too noisy to block?
4. Have you tried custom rules in existing tools?
5. What made custom rules easy or hard to maintain?

## Concept Test

Show the short concept:

> AxiomGuard turns approved docs and architecture decisions into SemanticRules. It checks TypeScript PRs for layer boundary violations, forbidden side effects, and value invariant violations. Findings are classified as PROVEN, PROBABLE, or SUSPECT. Only approved critical PROVEN findings can block.

Ask:

1. What part is immediately useful?
2. What part is confusing?
3. What would make you trust a blocking finding?
4. Who would approve rules in your organization?
5. Which first three rules would you want to encode?
6. Where should the report appear: CLI, CI, GitHub comment, dashboard, IDE?

## Pricing Discovery

1. If this prevented one serious architecture or business-rule regression per quarter, what would that be worth?
2. Would you expect pricing per contributor, per repo, or flat platform fee?
3. At what price per active contributor per month would this feel like good value?
4. At what price would it become difficult to justify?
5. Would you pay more for self-hosting, SSO, audit logs, or rule onboarding?

## Objections

1. What would stop your team from adopting this?
2. Would developers see it as helpful or bureaucratic?
3. What false positive rate would be unacceptable?
4. What would have to be true for a finding to block a PR?
5. What security or privacy review would this need to pass?

## Closing

1. On a scale of 1-10, how painful is this problem today?
2. Who else should I talk to?
3. Would you be open to testing this on one repository with one approved rule?
4. Can I follow up with a mock report and example rule?

## Signals To Capture

Strong positive signals:

- They can name repeated architecture review comments.
- They have rules in docs that are not enforced.
- They distrust broad AI review as a blocker.
- They already use branch protection or quality gates.
- They ask about evidence, approval, audit, or rollout controls.

Weak signals:

- They want only generic code review automation.
- They do not have documented rules or architecture ownership.
- They see all PR review problems as style or security.
- They are unwilling to maintain explicit rules.
