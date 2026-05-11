import fs from "node:fs";
import path from "node:path";
import { parse } from "yaml";
import { describe, expect, it } from "vitest";

interface ActionInput {
  default?: string;
  description?: string;
  required?: boolean;
}

interface ActionStep {
  run?: string;
}

interface ActionMetadata {
  inputs?: Record<string, ActionInput>;
  runs?: {
    using?: string;
    steps?: ActionStep[];
  };
}

const repoRoot = path.resolve(__dirname, "../..");

function readText(relativePath: string): string {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

describe("integration: GitHub Action metadata", () => {
  it("declares the documented inputs and delegates to the CLI", () => {
    const action = parse(readText("action.yml")) as ActionMetadata;
    const runScript = action.runs?.steps?.map((step) => step.run ?? "").join("\n") ?? "";

    expect(action.runs?.using).toBe("composite");
    expect(action.inputs?.project?.default).toBe(".");
    expect(action.inputs?.rules?.default).toBe("rules");
    expect(action.inputs?.["output-format"]?.default).toBe("markdown");
    expect(action.inputs?.diff?.default).toBe("");
    expect(action.inputs?.["fail-on-blocking"]?.default).toBe("true");
    expect(runScript).toContain("apps/cli/dist/index.js");
    expect(runScript).toContain("analyze");
    expect(runScript).toContain("--project");
    expect(runScript).toContain("--rules");
    expect(runScript).toContain("--diff");
  });

  it("documents a copy-paste workflow example", () => {
    const docs = readText("docs/github-action.md");
    const example = readText("examples/github-action/s-agent.yml");
    const readme = readText("README.md");

    expect(docs).toContain("uses: s-agent/s-agent@v0.3.0");
    expect(example).toContain("uses: s-agent/s-agent@v0.3.0");
    expect(readme).toContain("uses: s-agent/s-agent@v0.3.0");
  });
});
