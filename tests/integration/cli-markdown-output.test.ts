import path from "node:path";
import { describe, expect, it } from "vitest";
import { runCli } from "../../apps/cli/src/main";

describe("integration: CLI Markdown output", () => {
  it("prints a readable markdown report", async () => {
    const projectRoot = path.resolve(__dirname, "../evaluation/fixtures/layer-boundary-violation");
    const stdout: string[] = [];
    const exitCode = await runCli(["analyze", "--project", projectRoot, "--markdown"], process.cwd(), {
      stdout: (message) => stdout.push(message),
      stderr: () => undefined
    });
    const output = stdout.join("\n");

    expect(exitCode).toBe(1);
    expect(output).toContain("# S-Agent Report");
    expect(output).toContain("Status: PROVEN");
    expect(output).toContain("Blocking: yes");
  });
});
