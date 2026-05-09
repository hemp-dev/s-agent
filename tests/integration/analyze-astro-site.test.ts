import path from "node:path";
import { describe, expect, it } from "vitest";
import { runSAgentAnalysis } from "@s-agent/core";

const repoRoot = path.resolve(__dirname, "../..");
const rulesDirectory = path.join(repoRoot, "rules");
const fixturesRoot = path.resolve(__dirname, "../evaluation/fixtures");

describe("integration: Astro site rules", () => {
  it("detects Astro presentation, side-effect, and content-boundary violations", async () => {
    const result = await runSAgentAnalysis({
      projectRoot: path.join(fixturesRoot, "astro-site-violation"),
      rulesDirectory
    });

    expect(result.findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          rule_id: "S-AGENT-ASTRO-NODE-001",
          status: "PROVEN",
          blocking: true
        }),
        expect.objectContaining({
          rule_id: "S-AGENT-ASTRO-STATIC-SIDE-EFFECTS-001",
          status: "PROBABLE",
          blocking: false
        }),
        expect.objectContaining({
          rule_id: "S-AGENT-ASTRO-CONTENT-BOUNDARY-001",
          status: "PROVEN",
          blocking: false
        })
      ])
    );
  });

  it("keeps a clean Astro landing free of Astro rule findings", async () => {
    const result = await runSAgentAnalysis({
      projectRoot: path.join(fixturesRoot, "astro-site-clean"),
      rulesDirectory
    });

    expect(result.findings).toEqual([]);
    expect(result.blocking).toBe(false);
  });
});
