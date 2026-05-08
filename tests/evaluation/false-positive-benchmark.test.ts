import { describe, expect, it } from "vitest";
import { evaluationFixtures, runEvaluationFixtures, totalFindingCount } from "./fixture-runner";

describe("false positive benchmark", () => {
  it("keeps clean and false-positive control fixtures free of findings", async () => {
    const controlFixtures = evaluationFixtures.filter(
      (fixture) => fixture.kind === "clean" || fixture.kind === "false-positive"
    );
    const runs = await runEvaluationFixtures(controlFixtures);
    const findings = totalFindingCount(runs);
    const falsePositiveRate = findings / controlFixtures.length;

    expect(findings).toBe(0);
    expect(falsePositiveRate).toBeLessThanOrEqual(0.2);
  });
});
