# Rebrand Directions

## Naming Context

`S-Agent` should remain the internal architecture and repository codename. It sounds technical, implementation-oriented, and agent-centric. The customer-facing product should be framed around intent protection, not agent mechanics.

## Selected Brand: AxiomGuard

**Core line:** AxiomGuard protects business intent in every code change.

### Why It Works

- "Axiom" signals foundational rules that must stay true as code changes.
- "Guard" makes the review-time protection job clear.
- Strong fit for engineering, platform, governance, and critical-systems buyers.
- Avoids overclaiming AI autonomy.
- Supports the category "Intent-Aware Code Review."

### Risks

- "Guard" language can sound security-heavy.
- The name may overlap conceptually with AI guardrails.
- "Axiom" may feel abstract to some developer audiences.
- Needs practical copy that ties axioms back to docs, rules, and PR evidence.

### Mitigation

Pair the name with code review language:

> AxiomGuard: Intent-Aware Code Review for engineering teams.

Use the product sentence:

> AxiomGuard guards the approved business and architecture rules behind every pull request.

## Alternative Directions

### Invariant

**Meaning:** Business and architecture rules that must stay true as code changes.

**Pros:** Premium, rigorous, strong fit for fintech and critical systems.

**Cons:** More abstract for broad developer audiences; may require education.

**Tagline:** Semantic code review for critical software systems.

### CodeIntent

**Meaning:** The product checks whether code still means what it should.

**Pros:** Direct, SEO-friendly, easy to explain.

**Cons:** Less premium and less enterprise-ready than AxiomGuard.

**Tagline:** Know whether your code still means what it should.

### RuleTrace

**Meaning:** Trace every finding back to an approved rule.

**Pros:** Strong evidence and audit connotation.

**Cons:** Sounds narrower and less strategic than AxiomGuard.

### IntentCheck

**Meaning:** Simple check for documented intent.

**Pros:** Plain and product-led.

**Cons:** Less ownable and less premium.

### DriftLock

**Meaning:** Prevent architecture and intent drift.

**Pros:** Strong for architecture buyers.

**Cons:** Too narrow and slightly negative.

### SpecFence

**Meaning:** Fence code changes with approved specs.

**Pros:** Developer-friendly and concrete.

**Cons:** "Spec" may imply formal methods or product specs only.

### ProofReview

**Meaning:** Review findings with proof.

**Pros:** Captures evidence chain.

**Cons:** Sounds like a feature, not a company or platform.

## Brand Recommendation

Use:

- Product brand: **AxiomGuard**
- Internal architecture name: **S-Agent**
- Category: **Intent-Aware Code Review**
- Category aliases to test: **Semantic Code Review**, **Intent-Aware PR Guard**
- Technical primitive: **SemanticRule**
- Finding model: **Proof-carrying finding**

## Visual Direction

**Tone:** precise, calm, engineering-native.

**Avoid:** dark cyber-security aesthetic, generic AI sparkle visuals, complex network graphs, exaggerated "autonomous agent" imagery.

**Use:** documentation-to-PR flow, evidence trails, rule cards, clean diffs, source links, restrained interface.

## Voice

Direct, practical, and trustworthy.

Example:

- "Approved rules are the source of truth."
- "Every blocking finding includes evidence."
- "Start with the rule your senior engineers repeat most often."

Avoid:

- "Revolutionary AI code intelligence."
- "Neuro-symbolic multi-agent governance."
- "Autonomous architecture enforcement."

## Brand Architecture

| Layer | Name |
| --- | --- |
| Public product | AxiomGuard |
| Category | Intent-Aware Code Review |
| Internal project | S-Agent |
| Rule object | SemanticRule |
| Report object | Proof-carrying finding |
| CLI | `axiomguard` eventually, `s-agent` during MVP |

## Product/Architecture Sentence

Use this when explaining the relationship:

> AxiomGuard is powered by S-Agent, a semantic analysis engine that checks whether code changes preserve approved business and architectural intent.
