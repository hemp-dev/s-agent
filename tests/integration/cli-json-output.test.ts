import path from "node:path";
import { describe, expect, it } from "vitest";
import { runCli } from "../../apps/cli/src/main";

describe("integration: CLI JSON output", () => {
  it("prints parseable JSON analysis output", async () => {
    const projectRoot = path.resolve(__dirname, "../evaluation/fixtures/layer-boundary-violation");
    const stdout: string[] = [];
    const exitCode = await runCli(["analyze", "--project", projectRoot, "--json"], process.cwd(), {
      stdout: (message) => stdout.push(message),
      stderr: () => undefined
    });
    const parsed = JSON.parse(stdout.join("\n")) as { blocking: boolean; findings: unknown[] };

    expect(exitCode).toBe(1);
    expect(parsed.blocking).toBe(true);
    expect(parsed.findings).toHaveLength(1);
  });

  it("limits JSON analysis output to findings introduced by stdin diff", async () => {
    const projectRoot = path.resolve(__dirname, "../../examples/demo-broken");
    const diffText = [
      "diff --git a/src/auth/session.ts b/src/auth/session.ts",
      "--- a/src/auth/session.ts",
      "+++ b/src/auth/session.ts",
      "@@ -4,1 +4,1 @@",
      "-  userId: string;",
      "+  userId: string;"
    ].join("\n");
    const stdout: string[] = [];
    const exitCode = await runCli(
      ["analyze", "--project", projectRoot, "--diff-stdin", "--json"],
      process.cwd(),
      {
        stdout: (message) => stdout.push(message),
        stderr: () => undefined,
        readStdin: async () => diffText
      }
    );
    const parsed = JSON.parse(stdout.join("\n")) as { blocking: boolean; findings: unknown[] };

    expect(exitCode).toBe(0);
    expect(parsed.blocking).toBe(false);
    expect(parsed.findings).toEqual([]);
  });
});
