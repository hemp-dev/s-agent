import { describe, expect, it } from "vitest";
import {
  detectedExpectedFindingCount,
  runEvaluationFixtures,
  totalFindingCount,
  unexpectedFindingCount
} from "./fixture-runner";

describe("precision benchmark", () => {
  it("keeps semantic precision at or above the MVP threshold", async () => {
    const runs = await runEvaluationFixtures();
    const truePositives = detectedExpectedFindingCount(runs);
    const totalFindings = totalFindingCount(runs);
    const falsePositives = unexpectedFindingCount(runs);
    const precision = totalFindings === 0 ? 1 : truePositives / totalFindings;

    expect(falsePositives).toBe(0);
    expect(precision).toBeGreaterThanOrEqual(0.8);
  });
});
