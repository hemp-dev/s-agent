import { describe, expect, it } from "vitest";
import {
  detectedExpectedFindingCount,
  evaluationFixtures,
  expectedFindingCount,
  runEvaluationFixtures
} from "./fixture-runner";

describe("recall benchmark", () => {
  it("detects the known semantic violations in the benchmark fixtures", async () => {
    const violationFixtures = evaluationFixtures.filter((fixture) => fixture.kind === "violation");
    const runs = await runEvaluationFixtures(violationFixtures);
    const detected = detectedExpectedFindingCount(runs);
    const expected = expectedFindingCount(runs);
    const recall = expected === 0 ? 1 : detected / expected;

    expect(detected).toBe(expected);
    expect(recall).toBe(1);
  });
});
