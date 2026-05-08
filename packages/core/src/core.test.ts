import path from "node:path";
import { describe, expect, it } from "vitest";
import { runSAgentAnalysis } from "./index";

describe("core orchestration", () => {
  it("runs the full deterministic pipeline on the demo app", async () => {
    const projectRoot = path.resolve(__dirname, "../../../examples/demo-typescript-app");
    const result = await runSAgentAnalysis({
      projectRoot,
      rulesDirectory: path.join(projectRoot, "rules")
    });

    expect(result.findings[0]?.status).toBe("PROVEN");
    expect(result.blocking).toBe(true);
  });
});
