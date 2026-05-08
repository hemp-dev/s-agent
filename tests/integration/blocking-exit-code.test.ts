import path from "node:path";
import { describe, expect, it } from "vitest";
import { runCli } from "../../apps/cli/src/main";

describe("integration: blocking exit code", () => {
  it("returns non-zero only for blocking PROVEN critical findings", async () => {
    const brokenProject = path.resolve(__dirname, "../evaluation/fixtures/layer-boundary-violation");
    const sideEffectProject = path.resolve(
      __dirname,
      "../evaluation/fixtures/forbidden-side-effect-violation"
    );
    const cleanProject = path.resolve(__dirname, "../evaluation/fixtures/clean-project");
    const io = {
      stdout: () => undefined,
      stderr: () => undefined
    };

    await expect(runCli(["analyze", "--project", brokenProject, "--json"], process.cwd(), io)).resolves.toBe(
      1
    );
    await expect(
      runCli(["analyze", "--project", sideEffectProject, "--json"], process.cwd(), io)
    ).resolves.toBe(0);
    await expect(runCli(["analyze", "--project", cleanProject, "--json"], process.cwd(), io)).resolves.toBe(
      0
    );
  });
});
