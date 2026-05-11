# Pricing Hypothesis

## Pricing Context

Comparable tools in adjacent categories often price per contributor or seat:

- GitHub Code Security is listed at $30 per active committer per month.
- Semgrep Teams starts around $30 per contributor per month for Code/SCA modules.
- Greptile lists $30 per seat per month with included review volume.
- CodeRabbit lists Pro at $24 per user per month billed annually and Pro Plus at $48.
- Qodo Teams lists $30 per user per month annually.
- DeepSource Team lists $30 per contributor per month, with additional AI and SCA usage models.
- SonarQube Cloud uses LOC-based pricing; the Team plan currently starts at EUR 30 monthly for up to 100k private LOC.

AxiomGuard should not race to the bottom as a linter. Its value is closer to preventing costly architecture and business-rule regressions, especially for teams where senior review time is scarce.

## Recommended Model

Use a hybrid model:

- charge by active contributor for self-serve and team plans;
- add repo and rule limits for packaging clarity;
- reserve self-hosting, SSO, audit exports, custom rule assistance, and premium support for enterprise.

## Packaging Hypothesis

| Plan | Target buyer | Price hypothesis | Included |
| --- | --- | --- | --- |
| Open Source / Hobby | Individuals and public repos | Free | Local CLI, public repo usage, limited rules, community support |
| Team | Product engineering teams | $20-30 per active contributor per month | PR checks, approved rules, Markdown/JSON reports, GitHub integration when available, up to 25 repos |
| Business | Scaling engineering orgs | $40-60 per active contributor per month | Multi-repo rules, rule lifecycle workflow, evidence exports, team analytics, priority support |
| Enterprise | Regulated or large orgs | Custom annual | SSO/SAML, audit logs, self-hosting, custom deployment, procurement support, rule onboarding workshops |

## Value Metric

Primary value metric: **active contributors on protected repositories**.

Why it fits:

- easy to understand;
- maps to review volume and engineering value;
- common in adjacent code review and code quality tools;
- avoids punishing teams for writing more rules.

Secondary packaging limits:

- protected repositories;
- approved blocking rules;
- retention for reports and evidence;
- deployment mode.

Avoid pricing per finding. It creates the wrong incentive and makes customers feel punished for discovering risk.

## Trial Strategy

Offer a 14-day trial with:

- one organization;
- up to 10 repositories;
- unlimited candidate rules;
- up to 5 approved blocking rules;
- guided "first rule" setup.

The activation goal is not "scan everything." It is:

> First approved rule catches or clears a real PR.

## Willingness-To-Pay Questions

Use Van Westendorp-style questions in interviews:

1. At what monthly price per contributor would this feel too expensive to consider?
2. At what price would it feel expensive but worth discussing?
3. At what price would it feel like good value?
4. At what price would it feel too cheap to trust for critical PR checks?

## Pricing Risks

- Per-seat pricing may feel high if only platform engineers configure rules but all developers are counted.
- Repo-based pricing may undercharge large monorepos and overcharge small service fleets.
- Too generous a free plan may frame the product as a linter.
- Too much enterprise-only packaging may slow early adoption.

## Recommended Starting Point

Start with:

- Free local CLI for adoption.
- Team plan at $25 per active contributor per month.
- Business plan at $50 per active contributor per month.
- Enterprise custom.

Revisit after 10-15 discovery calls and 3-5 design partner pilots.

## Commercial Validation Metrics

Track these before locking packaging:

- teams that install the GitHub Action once available;
- teams that create at least 5 SemanticRules;
- accepted findings per active team;
- teams that return within 7 days;
- teams willing to pay after one real repo test;
- onboarding time from install to first useful finding.

## Sources Checked

- [GitHub security plans](https://github.com/security/plans)
- [Semgrep pricing](https://semgrep.dev/pricing/)
- [SonarQube Cloud pricing](https://www.sonarsource.com/plans-and-pricing/sonarcloud/)
- [Greptile pricing](https://www.greptile.com/pricing)
- [CodeRabbit pricing](https://www.coderabbit.ai/pricing)
- [Qodo pricing](https://www.qodo.ai/pricing/)
- [DeepSource billing docs](https://docs.deepsource.com/docs/platform/reference/billing)
