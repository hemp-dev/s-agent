import { describe, expect, it } from "vitest";
import {
  evaluationFixtures,
  matchesExpectedFinding,
  runEvaluationFixture
} from "./fixture-runner";

describe("semantic fixture runner", () => {
  it.each(evaluationFixtures)("runs fixture: $name", async (fixture) => {
    const run = await runEvaluationFixture(fixture);

    for (const expected of fixture.expectedFindings) {
      expect(matchesExpectedFinding(run, expected)).toBe(true);
    }

    if (fixture.kind === "clean") {
      expect(run.result.blocking).toBe(false);
      expect(run.result.findings).toEqual([]);
    }

    if (fixture.kind === "ambiguous") {
      expect(run.result.blocking).toBe(false);
      expect(run.result.findings.every((finding) => finding.status !== "PROVEN")).toBe(true);
    }
  });

  it("proves the broken benchmark includes at least one blocking PROVEN finding", async () => {
    const brokenFixtures = evaluationFixtures.filter((fixture) => fixture.kind === "violation");
    const runs = await Promise.all(brokenFixtures.map(runEvaluationFixture));
    const provenFindings = runs.flatMap((run) =>
      run.result.findings.filter((finding) => finding.status === "PROVEN")
    );

    expect(provenFindings.length).toBeGreaterThanOrEqual(1);
    expect(provenFindings.some((finding) => finding.blocking)).toBe(true);
  });
});
