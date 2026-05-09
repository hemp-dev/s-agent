import path from "node:path";
import { runSAgentAnalysis, type SAgentAnalysisResult } from "@s-agent/core";
import type { FindingStatus } from "@s-agent/verifier";
import fixtureManifest from "./fixtures/manifest.json";

export interface ExpectedFinding {
  ruleId: string;
  status?: FindingStatus;
  blocking?: boolean;
}

export interface EvaluationFixture {
  name: string;
  directory: string;
  expectedFindings: ExpectedFinding[];
  kind: "clean" | "violation" | "false-positive" | "ambiguous";
}

const fixtureRoot = path.resolve(__dirname, "fixtures");

export const evaluationFixtures: EvaluationFixture[] = fixtureManifest.map((fixture) => ({
  ...fixture,
  directory: path.join(fixtureRoot, fixture.directory)
})) as EvaluationFixture[];

export interface FixtureRun {
  fixture: EvaluationFixture;
  result: SAgentAnalysisResult;
}

export async function runEvaluationFixture(fixture: EvaluationFixture): Promise<FixtureRun> {
  return {
    fixture,
    result: await runSAgentAnalysis({
      projectRoot: fixture.directory,
      rulesDirectory: path.join(fixture.directory, "rules")
    })
  };
}

export async function runEvaluationFixtures(
  fixtures: readonly EvaluationFixture[] = evaluationFixtures
): Promise<FixtureRun[]> {
  return Promise.all(fixtures.map(runEvaluationFixture));
}

export function matchesExpectedFinding(run: FixtureRun, expected: ExpectedFinding): boolean {
  return run.result.findings.some(
    (finding) =>
      finding.rule_id === expected.ruleId &&
      (!expected.status || finding.status === expected.status) &&
      (expected.blocking === undefined || finding.blocking === expected.blocking)
  );
}

export function expectedFindingCount(runs: readonly FixtureRun[]): number {
  return runs.reduce((total, run) => total + run.fixture.expectedFindings.length, 0);
}

export function detectedExpectedFindingCount(runs: readonly FixtureRun[]): number {
  return runs.reduce(
    (total, run) =>
      total +
      run.fixture.expectedFindings.filter((expected) => matchesExpectedFinding(run, expected)).length,
    0
  );
}

export function unexpectedFindingCount(runs: readonly FixtureRun[]): number {
  return runs.reduce((total, run) => {
    const expectedRuleIds = new Set(run.fixture.expectedFindings.map((finding) => finding.ruleId));
    const unexpected = run.result.findings.filter((finding) => !expectedRuleIds.has(finding.rule_id));
    return total + unexpected.length;
  }, 0);
}

export function totalFindingCount(runs: readonly FixtureRun[]): number {
  return runs.reduce((total, run) => total + run.result.findings.length, 0);
}
