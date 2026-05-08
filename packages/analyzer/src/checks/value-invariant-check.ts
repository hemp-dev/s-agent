import type { ProjectIndex } from "@s-agent/parser";
import type { SemanticRule, ValueInvariant } from "@s-agent/rules";
import type { AnalysisFinding, EvidenceItem } from "@s-agent/shared";
import { lineAt } from "@s-agent/shared";
import { createFinding } from "./finding-factory";
import { functionAtLine, scopedFiles } from "./check-utils";

interface ValueMatch {
  line: number;
  value: number;
  snippet?: string;
}

function findValueViolations(text: string, invariant: ValueInvariant): ValueMatch[] {
  const escapedSymbol = invariant.symbol.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const assignmentPattern = new RegExp(
    `\\b${escapedSymbol}\\b\\s*(?:=|:)\\s*(\\d+(?:\\.\\d+)?)\\b`,
    "i"
  );
  const comparisonPattern = new RegExp(
    `\\b${escapedSymbol}\\b\\s*(?:>|>=)\\s*(\\d+(?:\\.\\d+)?)\\b`,
    "i"
  );
  const matches: ValueMatch[] = [];

  text.split(/\r?\n/).forEach((sourceLine, index) => {
    const assignment = sourceLine.match(assignmentPattern);
    const comparison = sourceLine.match(comparisonPattern);
    const rawValue = assignment?.[1] ?? comparison?.[1];

    if (!rawValue) {
      return;
    }

    const value = Number(rawValue);

    if (Number.isNaN(value) || value <= invariant.max) {
      return;
    }

    matches.push({
      line: index + 1,
      value,
      snippet: sourceLine.trim()
    });
  });

  return matches;
}

export function checkValueInvariants(index: ProjectIndex, rules: readonly SemanticRule[]): AnalysisFinding[] {
  const findings: AnalysisFinding[] = [];

  for (const rule of rules) {
    for (const invariant of rule.invariants.filter((item) => item.type === "value_invariant")) {
      if (!invariant.value) {
        continue;
      }

      for (const file of scopedFiles(index.files, rule)) {
        for (const match of findValueViolations(file.text, invariant.value)) {
          const fn = functionAtLine(file, match.line);
          const evidence: EvidenceItem = {
            type: "VALUE_LITERAL",
            kind: "deterministic",
            file: file.relativePath,
            line: match.line,
            symbol: invariant.value.symbol,
            detail: `${invariant.value.symbol} literal ${match.value} exceeds max ${invariant.value.max}.`,
            snippet: lineAt(file.text, match.line)
          };

          findings.push(
            createFinding({
              rule,
              invariant,
              file,
              line: match.line,
              changedSymbol: fn?.name,
              message: `Value invariant violation: ${invariant.value.symbol} is ${match.value}.`,
              evidenceKind: "deterministic",
              evidence: [evidence],
              technicalDetails: `A numeric literal exceeds the configured maximum of ${invariant.value.max}.`
            })
          );
        }
      }
    }
  }

  return findings;
}
