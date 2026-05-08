import type { SemanticRule } from "@s-agent/rules";
import type { AnalysisFinding } from "@s-agent/shared";
import { analyzeProject, type AnalyzeProjectResult } from "./analyze-project";

export function changedFilesFromUnifiedDiff(diffText: string): string[] {
  const files = new Set<string>();

  for (const line of diffText.split(/\r?\n/)) {
    if (!line.startsWith("+++ b/")) {
      continue;
    }

    files.add(line.slice("+++ b/".length));
  }

  return [...files].sort();
}

export async function analyzeDiff(input: {
  projectRoot: string;
  rules: readonly SemanticRule[];
  diffText: string;
}): Promise<AnalyzeProjectResult> {
  const changedFiles = new Set(changedFilesFromUnifiedDiff(input.diffText));
  const result = await analyzeProject({ projectRoot: input.projectRoot, rules: input.rules });

  if (changedFiles.size === 0) {
    return result;
  }

  const findings: AnalysisFinding[] = result.findings.filter((finding) =>
    changedFiles.has(finding.changed_file)
  );

  return {
    ...result,
    findings
  };
}
