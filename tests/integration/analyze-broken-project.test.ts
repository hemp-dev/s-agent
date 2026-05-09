import path from "node:path";
import { describe, expect, it } from "vitest";
import { runSAgentAnalysis } from "@s-agent/core";

describe("integration: analyze broken project", () => {
  it("produces a PROVEN blocking finding for a layer boundary violation", async () => {
    const projectRoot = path.resolve(__dirname, "../../examples/demo-broken");
    const result = await runSAgentAnalysis({
      projectRoot,
      rulesDirectory: path.join(projectRoot, "rules")
    });

    expect(result.blocking).toBe(true);
    expect(result.findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          rule_id: "INV-AUTH-001",
          status: "PROVEN",
          blocking: true
        })
      ])
    );
  });
});
