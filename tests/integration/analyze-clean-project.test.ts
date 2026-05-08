import path from "node:path";
import { describe, expect, it } from "vitest";
import { runSAgentAnalysis } from "@s-agent/core";

describe("integration: analyze clean project", () => {
  it("produces no blocking findings for a clean project", async () => {
    const projectRoot = path.resolve(__dirname, "../evaluation/fixtures/clean-project");
    const result = await runSAgentAnalysis({
      projectRoot,
      rulesDirectory: path.join(projectRoot, "rules")
    });

    expect(result.findings).toEqual([]);
    expect(result.blocking).toBe(false);
  });
});
