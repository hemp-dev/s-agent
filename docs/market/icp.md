# Ideal Customer Profiles

## Primary ICP: AI-Heavy Engineering Teams

**Company profile:** Engineering teams already using Claude Code, Cursor, Codex, GitHub Copilot, CodeRabbit, or internal coding agents.

**Codebase profile:** TypeScript-heavy monorepo or several services where AI-generated and AI-assisted changes touch meaningful product logic.

**Trigger:** AI generates working code, but the team worries it may break business meaning, architecture boundaries, permissions, pricing rules, or workflow assumptions.

**Best buyer:** VP Engineering, Head of Platform, Director of Engineering, Staff Engineer, Principal Engineer.

**Best champion:** Staff engineer, AI enablement lead, platform engineer, developer productivity lead.

**Pain:**

- AI-authored PRs look plausible but violate domain assumptions.
- Prompts and repo context are not enforceable review policy.
- Senior engineers cannot manually re-check every product invariant.
- The team wants AI speed without losing architecture discipline.

**Value promise:** IntentGuard verifies that AI-generated and refactored code still preserves approved business and architecture intent.

## Secondary ICP: Fintech and Billing-Heavy SaaS

**Company profile:** Fintech, billing-heavy SaaS, insurance, marketplaces, usage-based pricing companies, and B2B SaaS products with sensitive account or entitlement logic.

**Codebase profile:** Critical rules around discounts, limits, fraud rules, permissions, approval flows, tariffs, billing events, tax, and entitlements.

**Trigger:** A subtle business logic regression can create direct financial, compliance, or customer-trust damage.

**Best buyer:** VP Engineering, CTO, Director of Application Security, Director of Billing Engineering, Platform Engineering leader.

**Best champion:** Staff engineer responsible for billing, auth, entitlements, or compliance-sensitive modules.

**Pain:**

- Business rules are documented but not mechanically checked.
- Small code changes can alter pricing, discounts, approvals, or permissions.
- SAST catches vulnerabilities but not pricing or entitlement intent.
- Reviewers need evidence for why a finding should block.

**Value promise:** IntentGuard prevents business-rule regressions in modules where mistakes have visible ROI.

## Tertiary ICP: Legacy Modernization Teams

**Company profile:** Enterprise teams rewriting or modularizing legacy systems.

**Codebase profile:** Legacy code hides business rules in services, stored procedures, old UI flows, or undocumented coupling.

**Trigger:** A modernization effort needs to preserve business behavior while changing architecture.

**Best buyer:** CTO, VP Engineering, Enterprise Architecture lead.

**Best champion:** Principal engineer, modernization lead, architecture guild owner.

**Pain:**

- Nobody fully knows which business rules are encoded in old code.
- Refactors risk breaking implicit invariants.
- Migration teams need guardrails as rules become explicit.

**Value promise:** IntentGuard turns rediscovered rules into enforceable checks during modernization.

## Additional ICP: Scaling Product Engineering Teams

**Company profile:** B2B SaaS, healthtech, infrastructure, marketplace, or developer-tool companies with 30-300 engineers.

**Pain:**

- Architecture rules live in ADRs, README files, and tribal knowledge.
- PR reviewers repeatedly say "this should not happen in this domain" after the damage is already in review.
- AI-generated or junior-authored changes look plausible but violate boundaries.
- Existing linters and SAST tools do not understand product intent.

**Value promise:** IntentGuard turns approved engineering and product intent into enforceable PR checks with proof.

## Non-ICP

- Very small teams without documented architecture or repeatable business rules.
- Teams looking only for SAST, SCA, secrets, or license scanning.
- Organizations unwilling to approve and maintain explicit rules.
- Teams expecting a broad autonomous AI reviewer rather than deterministic guardrails.

## Buying Committee

| Role | What they care about | Message |
| --- | --- | --- |
| VP Engineering | Shipping speed without architectural drift | Protect critical intent without slowing every PR. |
| CTO | Durable engineering system | Convert architecture decisions into enforceable review checks. |
| Staff Engineer | Fewer repeated review comments | Stop re-litigating the same boundary rules in every PR. |
| Platform Lead | Scalable governance | Provide rules, evidence, and CI integration across repos. |
| AppSec Lead | Complement existing controls | Add business-logic guardrails beside SAST and SCA. |
| Developer | Low-noise feedback | Only approved, evidence-backed findings can block. |

## Jobs To Be Done

- When a team documents an architecture decision, they want it enforced in future PRs.
- When AI-assisted development increases code volume, they want deterministic guardrails before merge.
- When a critical product invariant is violated, they want a proof-carrying finding tied to source documentation.
- When reviewers disagree, they want approved rules to settle blocking decisions.
