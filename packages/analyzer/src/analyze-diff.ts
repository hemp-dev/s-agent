import type { SemanticRule } from "@s-agent/rules";
import type { AnalysisFinding, EvidenceItem } from "@s-agent/shared";
import { analyzeProject, type AnalyzeProjectResult } from "./analyze-project";

export interface DiffScope {
  changedFiles: string[];
  addedLinesByFile: Map<string, Set<number>>;
}

const hunkHeaderPattern = /^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/;

export function changedFilesFromUnifiedDiff(diffText: string): string[] {
  return parseUnifiedDiff(diffText).changedFiles;
}

function normalizedDiffPath(pathText: string): string | undefined {
  const trimmed = pathText.trim();

  if (trimmed === "/dev/null") {
    return undefined;
  }

  const withoutPrefix = trimmed.replace(/^[ab]\//, "");
  const withoutMetadata = withoutPrefix.split(/\t|\s/)[0];

  return withoutMetadata || undefined;
}

export function parseUnifiedDiff(diffText: string): DiffScope {
  const addedLinesByFile = new Map<string, Set<number>>();
  let currentFile: string | undefined;
  let currentNewLine: number | undefined;

  for (const line of diffText.split(/\r?\n/)) {
    if (line.startsWith("+++ ")) {
      currentFile = normalizedDiffPath(line.slice("+++ ".length));
      currentNewLine = undefined;

      if (currentFile && !addedLinesByFile.has(currentFile)) {
        addedLinesByFile.set(currentFile, new Set());
      }

      continue;
    }

    const hunkHeader = line.match(hunkHeaderPattern);

    if (hunkHeader) {
      currentNewLine = Number(hunkHeader[1]);
      continue;
    }

    if (!currentFile || currentNewLine === undefined) {
      continue;
    }

    if (line.startsWith("+") && !line.startsWith("+++")) {
      addedLinesByFile.get(currentFile)?.add(currentNewLine);
      currentNewLine += 1;
      continue;
    }

    if (line.startsWith(" ") || line === "") {
      currentNewLine += 1;
    }
  }

  return {
    changedFiles: [...addedLinesByFile.keys()].sort(),
    addedLinesByFile
  };
}

function evidenceTouchesDiff(evidence: EvidenceItem, addedLines: ReadonlySet<number>): boolean {
  return evidence.line !== undefined && addedLines.has(evidence.line);
}

export function findingTouchesDiff(finding: AnalysisFinding, diffScope: DiffScope): boolean {
  const addedLines = diffScope.addedLinesByFile.get(finding.changed_file);

  if (!addedLines) {
    return false;
  }

  return finding.evidence
    .filter((evidence) => evidence.file === finding.changed_file)
    .some((evidence) => evidenceTouchesDiff(evidence, addedLines));
}

export async function analyzeDiff(input: {
  projectRoot: string;
  rules: readonly SemanticRule[];
  diffText: string;
}): Promise<AnalyzeProjectResult> {
  const diffScope = parseUnifiedDiff(input.diffText);
  const result = await analyzeProject({ projectRoot: input.projectRoot, rules: input.rules });

  const findings: AnalysisFinding[] = result.findings.filter((finding) =>
    findingTouchesDiff(finding, diffScope)
  );

  return {
    ...result,
    findings
  };
}
