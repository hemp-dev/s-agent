import { describe, expect, it } from "vitest";
import {
  answerBlocks,
  comparisonRows,
  faqItems,
  findingStatuses,
  heroDefinition,
  pageMetadata,
  proofChain,
  siteMetadata,
  violationTypes,
  workflowSteps
} from "./landing";
import { seoClusterPages, seoClusterSlugs } from "./seo-pages";

describe("landing content", () => {
  it("keeps the documented finding statuses visible on the landing page", () => {
    expect(findingStatuses.map((item) => item.status)).toEqual([
      "PROVEN",
      "PROBABLE",
      "SUSPECT",
      "RULE_CONFLICT",
      "DISMISSED"
    ]);
  });

  it("states that only proven findings can block", () => {
    const blockingStatuses = findingStatuses.filter((item) => item.effect === "Can block");

    expect(blockingStatuses).toHaveLength(1);
    expect(blockingStatuses[0]?.status).toBe("PROVEN");
  });

  it("presents the MVP around the approved symbolic checks", () => {
    expect(violationTypes.map((item) => item.title)).toEqual([
      "Layer Boundary",
      "Forbidden Side Effect",
      "Value Invariant"
    ]);
    expect(proofChain).toContain("SemanticRule YAML");
  });

  it("keeps extractable answer content for AEO surfaces", () => {
    expect(pageMetadata.description).toContain("intent-aware code review tool");
    expect(pageMetadata.lastUpdated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(siteMetadata.productionUrl).toBe("https://intentguard.dev");
    expect(siteMetadata.githubUrl).toBe("https://github.com/muthukumar-js-dev/intent-guard");
    expect(siteMetadata.ogImagePath).toBe("/og/intentguard-og.png");
    expect(heroDefinition).toContain("TypeScript PRs");
    expect(answerBlocks).toHaveLength(3);
    expect(answerBlocks[0]?.title).toBe("What is IntentGuard?");
    expect(answerBlocks[0]?.body).toContain("proof-carrying findings");
  });

  it("keeps FAQ and comparison content visible for search snippets", () => {
    expect(faqItems.map((item) => item.question)).toContain("What can block a pull request?");
    expect(comparisonRows.map((item) => item.alternative)).toEqual([
      "SAST",
      "Linters",
      "AI reviewers",
      "Architecture tools"
    ]);
    expect(workflowSteps).toHaveLength(4);
  });

  it("defines the SEO cluster pages requested for forced promotion", () => {
    expect(seoClusterSlugs).toEqual([
      "semantic-code-review",
      "intent-aware-code-review",
      "ai-code-review-guardrails",
      "architecture-drift-prevention",
      "business-logic-regression-prevention"
    ]);
    expect(seoClusterPages.every((page) => page.faq.length >= 2)).toBe(true);
    expect(seoClusterPages.every((page) => page.definition.includes("IntentGuard"))).toBe(true);
  });
});
