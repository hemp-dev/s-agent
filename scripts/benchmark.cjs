#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { performance } = require("node:perf_hooks");
const { runSAgentAnalysis } = require("../packages/core/dist");

const repoRoot = path.resolve(__dirname, "..");
const packageJson = JSON.parse(fs.readFileSync(path.join(repoRoot, "package.json"), "utf8"));
const fixtureRoot = path.join(repoRoot, "tests/evaluation/fixtures");
const manifestPath = path.join(fixtureRoot, "manifest.json");

function readManifest() {
  return JSON.parse(fs.readFileSync(manifestPath, "utf8")).map((fixture) => ({
    ...fixture,
    directory: path.join(fixtureRoot, fixture.directory)
  }));
}

function matchesExpectedFinding(findings, expected) {
  return findings.some(
    (finding) =>
      finding.rule_id === expected.ruleId &&
      (!expected.status || finding.status === expected.status) &&
      (expected.blocking === undefined || finding.blocking === expected.blocking)
  );
}

function ratio(numerator, denominator, fallback = 1) {
  return denominator === 0 ? fallback : numerator / denominator;
}

function roundMetric(value) {
  return Number(value.toFixed(4));
}

function formatMetric(value) {
  return value.toFixed(3);
}

function formatRuntime(milliseconds) {
  return `${Math.round(milliseconds)} ms`;
}

async function runFixture(fixture) {
  const startedAt = performance.now();
  const result = await runSAgentAnalysis({
    projectRoot: fixture.directory,
    rulesDirectory: path.join(fixture.directory, "rules")
  });
  const runtimeMs = performance.now() - startedAt;

  const expectedRuleIds = new Set(fixture.expectedFindings.map((finding) => finding.ruleId));
  const detectedExpectedFindings = fixture.expectedFindings.filter((expected) =>
    matchesExpectedFinding(result.findings, expected)
  );
  const unexpectedFindings = result.findings.filter(
    (finding) => !expectedRuleIds.has(finding.rule_id)
  );

  return {
    name: fixture.name,
    kind: fixture.kind,
    expected_findings: fixture.expectedFindings.length,
    detected_expected_findings: detectedExpectedFindings.length,
    total_findings: result.findings.length,
    unexpected_findings: unexpectedFindings.length,
    proven_findings: result.findings.filter((finding) => finding.status === "PROVEN").length,
    blocking: result.blocking,
    runtime_ms: roundMetric(runtimeMs)
  };
}

function summarize(version, runs, runtimeMs) {
  const expectedFindings = runs.reduce((total, run) => total + run.expected_findings, 0);
  const detectedExpectedFindings = runs.reduce(
    (total, run) => total + run.detected_expected_findings,
    0
  );
  const totalFindings = runs.reduce((total, run) => total + run.total_findings, 0);
  const unexpectedFindings = runs.reduce((total, run) => total + run.unexpected_findings, 0);
  const provenFindings = runs.reduce((total, run) => total + run.proven_findings, 0);
  const cleanRuns = runs.filter((run) => run.expected_findings === 0);
  const cleanFindings = cleanRuns.reduce((total, run) => total + run.total_findings, 0);
  const cleanBlockingRuns = cleanRuns.filter((run) => run.blocking);

  return {
    benchmark: "s-agent-core-evaluation-fixtures",
    version,
    generated_at: new Date().toISOString(),
    fixture_count: runs.length,
    counts: {
      expected_findings: expectedFindings,
      detected_expected_findings: detectedExpectedFindings,
      total_findings: totalFindings,
      unexpected_findings: unexpectedFindings,
      proven_findings: provenFindings,
      clean_fixtures: cleanRuns.length,
      clean_findings: cleanFindings,
      clean_blocking_fixtures: cleanBlockingRuns.length
    },
    metrics: {
      precision: roundMetric(ratio(detectedExpectedFindings, totalFindings)),
      recall: roundMetric(ratio(detectedExpectedFindings, expectedFindings)),
      false_positive_rate: roundMetric(ratio(cleanFindings, cleanRuns.length, 0)),
      proven_rate: roundMetric(ratio(provenFindings, totalFindings)),
      runtime_ms: roundMetric(runtimeMs),
      clean_blocking_rate: roundMetric(ratio(cleanBlockingRuns.length, cleanRuns.length, 0))
    },
    fixtures: runs
  };
}

function renderMarkdownTable(summary) {
  const metrics = summary.metrics;

  return [
    "| Version | Fixtures | Precision | Recall | False positive rate | PROVEN rate | Runtime | Clean blocking rate |",
    "| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
    [
      `| ${summary.version}`,
      summary.fixture_count,
      formatMetric(metrics.precision),
      formatMetric(metrics.recall),
      formatMetric(metrics.false_positive_rate),
      formatMetric(metrics.proven_rate),
      formatRuntime(metrics.runtime_ms),
      `${formatMetric(metrics.clean_blocking_rate)} |`
    ].join(" | ")
  ].join("\n");
}

async function main() {
  const version = process.env.S_AGENT_BENCHMARK_VERSION ?? packageJson.version;
  const fixtures = readManifest();
  const startedAt = performance.now();
  const runs = [];

  for (const fixture of fixtures) {
    runs.push(await runFixture(fixture));
  }

  const summary = summarize(version, runs, performance.now() - startedAt);
  const markdownTable = renderMarkdownTable(summary);

  console.log(markdownTable);
  console.log("");
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`s-agent benchmark failed: ${message}`);
  process.exitCode = 1;
});
