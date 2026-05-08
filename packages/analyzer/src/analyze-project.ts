import { indexProject, type ProjectIndex } from "@s-agent/parser";
import { RuleRegistry, type SemanticRule } from "@s-agent/rules";
import type { AnalysisFinding } from "@s-agent/shared";
import { analyzeFastPath } from "./fast-path-analyzer";

export interface AnalyzeProjectInput {
  projectRoot: string;
  rules: readonly SemanticRule[];
}

export interface AnalyzeProjectResult {
  index: ProjectIndex;
  findings: AnalysisFinding[];
}

export async function analyzeProject(input: AnalyzeProjectInput): Promise<AnalyzeProjectResult> {
  const registry = new RuleRegistry([...input.rules]);
  const index = await indexProject(input.projectRoot);
  const findings = analyzeFastPath(index, registry.enforceable());

  return {
    index,
    findings
  };
}
