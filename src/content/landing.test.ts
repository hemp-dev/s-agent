import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  answerBlocks,
  comparisonRows,
  faqItems,
  findingStatuses,
  heroDefinition,
  inspirationCredit,
  pageMetadata,
  proofChain,
  realDemo,
  realDemoReports,
  realDemoSteps,
  releaseUpdate,
  siteMetadata,
  violationTypes,
  workflowSteps
} from "./landing";
import { seoClusterPages, seoClusterSlugs } from "./seo-pages";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

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
    expect(siteMetadata.productionUrl).toBe("https://axiomguard.dev");
    expect(siteMetadata.githubUrl).toBe("https://github.com/hemp-dev/s-agent");
    expect(siteMetadata.releaseUrl).toContain("/releases/tag/v0.2.0");
    expect(siteMetadata.benchmarkUrl).toContain("docs/benchmarks/LEADERBOARD.md");
    expect(siteMetadata.karpathyUrl).toBe("https://karpathy.ai/");
    expect(siteMetadata.ogImagePath).toBe("/og/axiomguard-og.png");
    expect(existsSync(path.resolve(siteRoot, "public", siteMetadata.ogImagePath.slice(1)))).toBe(true);
    expect(heroDefinition).toContain("TypeScript PRs");
    expect(answerBlocks).toHaveLength(3);
    expect(answerBlocks[0]?.title).toBe("What is AxiomGuard?");
    expect(answerBlocks[0]?.body).toContain("proof-carrying findings");
  });

  it("keeps public brand content pointed at the official repository", () => {
    const legacyBrand = ["Intent", "Guard"].join("");
    const legacyRepoPath = [
      ["muthukumar", "js", "dev"].join("-"),
      ["intent", "guard"].join("-")
    ].join("/");
    const publicContent = JSON.stringify({
      answerBlocks,
      faqItems,
      heroDefinition,
      pageMetadata,
      realDemo,
      seoClusterPages,
      siteMetadata,
      workflowSteps
    });

    expect(publicContent).toContain("AxiomGuard");
    expect(publicContent).toContain("https://github.com/hemp-dev/s-agent");
    expect(publicContent).not.toContain(legacyBrand);
    expect(publicContent).not.toContain(legacyRepoPath);
  });

  it("keeps the real demo tied to checked-in fixtures and CLI output", () => {
    expect(realDemo.fixturePath).toBe("examples/demo-typescript-app");
    expect(realDemo.cleanFixturePath).toBe("examples/demo-typescript-app-clean");
    expect(realDemo.brokenCommand).toBe("pnpm analyze:demo:broken");
    expect(realDemo.cleanCommand).toBe("pnpm analyze:demo");
    expect(realDemoSteps.map((step) => step.path)).toEqual([
      "examples/demo-typescript-app/CLAUDE.md",
      "examples/demo-typescript-app/rules/auth.rules.yml",
      "examples/demo-typescript-app/src/auth/session.ts",
      "apps/cli"
    ]);
    expect(realDemoReports[0]?.lines).toContain("Status: PROVEN");
    expect(realDemoReports[0]?.lines).toContain("Blocking: yes");
    expect(realDemoReports[1]?.lines).toContain("No findings.");

    expect(realDemoSteps.some((step) => step.path === "apps/cli")).toBe(true);
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

  it("surfaces the v0.2.0 release and acknowledgement content", () => {
    expect(releaseUpdate.version).toBe("S-Agent Core v0.2.0");
    expect(releaseUpdate.highlights.map((item) => item.label)).toEqual([
      "GitHub Action",
      "Benchmarks",
      "Scope discipline"
    ]);
    expect(releaseUpdate.metrics.map((metric) => metric.label)).toContain("Clean blocking rate");
    expect(inspirationCredit.title).toContain("Andrej Karpathy");
    expect(inspirationCredit.body).toContain("not an affiliation");
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
    expect(seoClusterPages.every((page) => page.definition.includes("AxiomGuard"))).toBe(true);
  });
});
