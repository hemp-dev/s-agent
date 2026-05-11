import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadRulesFromDirectory } from "@s-agent/rules";
import { analyzeDiff, changedFilesFromUnifiedDiff, parseUnifiedDiff } from "./analyze-diff";

const boundaryDiff = [
  "diff --git a/src/auth/session.ts b/src/auth/session.ts",
  "--- a/src/auth/session.ts",
  "+++ b/src/auth/session.ts",
  "@@ -0,0 +1,1 @@",
  '+import { BillingService } from "../billing/billing-service";'
].join("\n");

const unrelatedLineDiff = [
  "diff --git a/src/auth/session.ts b/src/auth/session.ts",
  "--- a/src/auth/session.ts",
  "+++ b/src/auth/session.ts",
  "@@ -4,1 +4,1 @@",
  "-  userId: string;",
  "+  userId: string;"
].join("\n");

describe("diff analysis", () => {
  it("extracts changed files and added line numbers from unified diff text", () => {
    const scope = parseUnifiedDiff(boundaryDiff);

    expect(changedFilesFromUnifiedDiff(boundaryDiff)).toEqual(["src/auth/session.ts"]);
    expect(scope.addedLinesByFile.get("src/auth/session.ts")).toEqual(new Set([1]));
  });

  it("keeps findings whose evidence is on an added line", async () => {
    const projectRoot = path.resolve(__dirname, "../../../examples/demo-broken");
    const rules = await loadRulesFromDirectory(path.join(projectRoot, "rules"));
    const result = await analyzeDiff({ projectRoot, rules, diffText: boundaryDiff });

    expect(result.findings).toHaveLength(1);
    expect(result.findings[0]?.changed_file).toBe("src/auth/session.ts");
  });

  it("does not report old findings from files touched by unrelated diff lines", async () => {
    const projectRoot = path.resolve(__dirname, "../../../examples/demo-broken");
    const rules = await loadRulesFromDirectory(path.join(projectRoot, "rules"));
    const result = await analyzeDiff({ projectRoot, rules, diffText: unrelatedLineDiff });

    expect(result.findings).toEqual([]);
  });
});
