import type { ProjectIndex } from "@s-agent/parser";
import type { SemanticRule } from "@s-agent/rules";
import type { AnalysisFinding, EvidenceItem } from "@s-agent/shared";
import { matchesPath } from "@s-agent/shared";
import { createFinding } from "./finding-factory";
import { functionAtLine, importMatchesPattern } from "./check-utils";

export function checkLayerBoundaries(index: ProjectIndex, rules: readonly SemanticRule[]): AnalysisFinding[] {
  const findings: AnalysisFinding[] = [];

  for (const rule of rules) {
    for (const invariant of rule.invariants.filter((item) => item.type === "layer_boundary")) {
      if (!invariant.from || !invariant.to) {
        continue;
      }

      for (const file of index.files) {
        if (!matchesPath(file.relativePath, invariant.from)) {
          continue;
        }

        for (const importReference of file.imports) {
          if (!importMatchesPattern(importReference, invariant.to)) {
            continue;
          }

          const fn = functionAtLine(file, importReference.line);
          const evidence: EvidenceItem = {
            type: "IMPORT",
            kind: "deterministic",
            file: file.relativePath,
            line: importReference.line,
            symbol: importReference.source,
            detail: `Import '${importReference.source}' crosses forbidden boundary '${invariant.from}' -> '${invariant.to}'.`,
            snippet: importReference.text
          };

          findings.push(
            createFinding({
              rule,
              invariant,
              file,
              line: importReference.line,
              changedSymbol: fn?.name,
              message: `Layer boundary violation: ${file.relativePath} imports ${importReference.source}.`,
              evidenceKind: "deterministic",
              evidence: [evidence],
              technicalDetails: `The importing file matches '${invariant.from}' and the resolved import matches '${invariant.to}'.`
            })
          );
        }
      }
    }
  }

  return findings;
}
