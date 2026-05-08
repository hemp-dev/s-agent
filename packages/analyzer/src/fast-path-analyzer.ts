import type { ProjectIndex } from "@s-agent/parser";
import type { SemanticRule } from "@s-agent/rules";
import type { AnalysisFinding } from "@s-agent/shared";
import { checkForbiddenImports } from "./checks/forbidden-import-check";
import { checkForbiddenSideEffects } from "./checks/forbidden-side-effect-check";
import { checkLayerBoundaries } from "./checks/layer-boundary-check";
import { checkValueInvariants } from "./checks/value-invariant-check";

export function analyzeFastPath(index: ProjectIndex, rules: readonly SemanticRule[]): AnalysisFinding[] {
  return [
    ...checkLayerBoundaries(index, rules),
    ...checkForbiddenImports(index, rules),
    ...checkForbiddenSideEffects(index, rules),
    ...checkValueInvariants(index, rules)
  ];
}
