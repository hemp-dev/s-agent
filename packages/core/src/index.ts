import path from "node:path";
import { analyzeDiff, analyzeProject } from "@s-agent/analyzer";
import { renderJsonReport, renderMarkdownReport } from "@s-agent/explainer";
import { loadRulesFromDirectory, RuleRegistry, type SemanticRule } from "@s-agent/rules";
import { verifyFindings, type ProofCarryingFinding } from "@s-agent/verifier";

export interface SAgentConfig {
  projectRoot: string;
  rulesDirectory?: string;
  diffText?: string;
}

export interface SAgentAnalysisResult {
  projectRoot: string;
  rulesDirectory: string;
  rules: SemanticRule[];
  findings: ProofCarryingFinding[];
  blocking: boolean;
}

export function defaultRulesDirectory(projectRoot: string): string {
  return path.join(projectRoot, "rules");
}

export async function runSAgentAnalysis(config: SAgentConfig): Promise<SAgentAnalysisResult> {
  const projectRoot = path.resolve(config.projectRoot);
  const rulesDirectory = path.resolve(config.rulesDirectory ?? defaultRulesDirectory(projectRoot));
  const rules = await loadRulesFromDirectory(rulesDirectory);
  const registry = new RuleRegistry(rules);
  const enforceableRules = registry.enforceable();
  const analysis = config.diffText !== undefined
    ? await analyzeDiff({
        projectRoot,
        rules: enforceableRules,
        diffText: config.diffText
      })
    : await analyzeProject({
        projectRoot,
        rules: enforceableRules
      });
  const findings = verifyFindings(analysis.findings, rules);

  return {
    projectRoot,
    rulesDirectory,
    rules,
    findings,
    blocking: findings.some((finding) => finding.blocking)
  };
}

export function renderAnalysisMarkdown(result: SAgentAnalysisResult): string {
  return renderMarkdownReport({
    projectRoot: result.projectRoot,
    findings: result.findings
  });
}

export function renderAnalysisJson(result: SAgentAnalysisResult): string {
  return renderJsonReport({
    projectRoot: result.projectRoot,
    findings: result.findings
  });
}
