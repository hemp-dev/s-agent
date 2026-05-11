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

  it("can scope analysis to evidence introduced by a unified diff", async () => {
    const projectRoot = path.resolve(__dirname, "../../../examples/demo-broken");
    const result = await runSAgentAnalysis({
      projectRoot,
      rulesDirectory: path.join(projectRoot, "rules"),
      diffText: [
        "diff --git a/src/auth/session.ts b/src/auth/session.ts",
        "--- a/src/auth/session.ts",
        "+++ b/src/auth/session.ts",
        "@@ -4,1 +4,1 @@",
        "-  userId: string;",
        "+  userId: string;"
      ].join("\n")
    });

    expect(result.findings).toEqual([]);
    expect(result.blocking).toBe(false);
  });

  it("treats an empty diff as an empty PR scope", async () => {
    const projectRoot = path.resolve(__dirname, "../../../examples/demo-broken");
    const result = await runSAgentAnalysis({
      projectRoot,
      rulesDirectory: path.join(projectRoot, "rules"),
      diffText: ""
    });

    expect(result.findings).toEqual([]);
    expect(result.blocking).toBe(false);
  });
});
