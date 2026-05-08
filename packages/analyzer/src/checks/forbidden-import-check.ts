import type { ProjectIndex } from "@s-agent/parser";
import type { SemanticRule } from "@s-agent/rules";
import type { AnalysisFinding, EvidenceItem } from "@s-agent/shared";
import { createFinding } from "./finding-factory";
import { functionAtLine, importMatchesPattern, scopedFiles } from "./check-utils";

export function checkForbiddenImports(index: ProjectIndex, rules: readonly SemanticRule[]): AnalysisFinding[] {
  const findings: AnalysisFinding[] = [];

  for (const rule of rules) {
    for (const invariant of rule.invariants.filter((item) => item.type === "forbidden_import")) {
      const forbiddenImports = invariant.forbidden_imports ?? [];

      for (const file of scopedFiles(index.files, rule)) {
        for (const importReference of file.imports) {
          const matchedPattern = forbiddenImports.find((pattern) =>
            importMatchesPattern(importReference, pattern)
          );

          if (!matchedPattern) {
            continue;
          }

          const fn = functionAtLine(file, importReference.line);
          const evidence: EvidenceItem = {
            type: "IMPORT",
            kind: "deterministic",
            file: file.relativePath,
            line: importReference.line,
            symbol: importReference.source,
            detail: `Import '${importReference.source}' matches forbidden pattern '${matchedPattern}'.`,
            snippet: importReference.text
          };

          findings.push(
            createFinding({
              rule,
              invariant,
              file,
              line: importReference.line,
              changedSymbol: fn?.name,
              message: `Forbidden import: ${file.relativePath} imports ${importReference.source}.`,
              evidenceKind: "deterministic",
              evidence: [evidence],
              technicalDetails: `The file is in rule scope and imports a forbidden dependency pattern.`
            })
          );
        }
      }
    }
  }

  return findings;
}
