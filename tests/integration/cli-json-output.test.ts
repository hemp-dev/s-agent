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
});
