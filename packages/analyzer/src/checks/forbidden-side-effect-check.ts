import type { ProjectIndex } from "@s-agent/parser";
import type { SemanticRule } from "@s-agent/rules";
import type { AnalysisFinding, EvidenceItem } from "@s-agent/shared";
import { lineAt } from "@s-agent/shared";
import { STRONG_HEURISTIC_CONFIDENCE } from "../confidence";
import { createFinding } from "./finding-factory";
import { functionAllowed, functionAtLine, scopedFiles } from "./check-utils";

const defaultForbiddenCalls = [
  "save",
  "create",
  "update",
  "delete",
  "insert",
  "emit",
  "publish",
  "dispatch"
];

function findCallLines(text: string, calls: readonly string[]): Array<{ call: string; line: number }> {
  const lines = text.split(/\r?\n/);
  const matches: Array<{ call: string; line: number }> = [];

  lines.forEach((sourceLine, index) => {
    for (const call of calls) {
      const expression = new RegExp(`(?:\\b|\\.)${call}\\s*\\(`);
      if (expression.test(sourceLine)) {
        matches.push({ call, line: index + 1 });
      }
    }
  });

  return matches;
}

export function checkForbiddenSideEffects(
  index: ProjectIndex,
  rules: readonly SemanticRule[]
): AnalysisFinding[] {
  const findings: AnalysisFinding[] = [];

  for (const rule of rules) {
    for (const invariant of rule.invariants.filter((item) => item.type === "forbidden_side_effect")) {
      const forbiddenCalls = invariant.forbidden_calls?.length
        ? invariant.forbidden_calls
        : defaultForbiddenCalls;

      for (const file of scopedFiles(index.files, rule)) {
        for (const match of findCallLines(file.text, forbiddenCalls)) {
          const fn = functionAtLine(file, match.line);

          if (!functionAllowed(fn?.name, invariant.functions)) {
            continue;
          }

          const evidence: EvidenceItem = {
            type: "FORBIDDEN_CALL",
            kind: "heuristic",
            file: file.relativePath,
            line: match.line,
            symbol: fn?.name,
            detail: `Read-only invariant saw suspicious side-effect call '${match.call}'.`,
            snippet: lineAt(file.text, match.line)
          };

          findings.push(
            createFinding({
              rule,
              invariant,
              file,
              line: match.line,
              changedSymbol: fn?.name,
              message: `Possible forbidden side effect: ${match.call}() in ${file.relativePath}.`,
              evidenceKind: "heuristic",
              evidence: [evidence],
              technicalDetails: `The rule marks this scope as read-only and the call name is side-effect-like.`,
              confidence: STRONG_HEURISTIC_CONFIDENCE
            })
          );
        }
      }
    }
  }

  return findings;
}
