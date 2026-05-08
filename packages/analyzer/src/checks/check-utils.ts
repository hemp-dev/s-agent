import path from "node:path";
import type { FunctionInfo, IndexedFile, ImportReference } from "@s-agent/parser";
import type { SemanticRule } from "@s-agent/rules";
import { matchesAnyPath, matchesPath, normalizeProjectPath } from "@s-agent/shared";

export function scopedFiles(files: readonly IndexedFile[], rule: SemanticRule): IndexedFile[] {
  return files.filter((file) => matchesAnyPath(file.relativePath, rule.scope.modules));
}

export function importMatchesPattern(importReference: ImportReference, pattern: string): boolean {
  if (importReference.importedPath && matchesPath(importReference.importedPath, pattern)) {
    return true;
  }

  const normalizedPattern = normalizeProjectPath(pattern);
  const normalizedSource = normalizeProjectPath(importReference.source);

  if (!normalizedPattern.includes("*")) {
    return (
      normalizedSource === normalizedPattern ||
      normalizedSource.startsWith(`${normalizedPattern}/`) ||
      normalizedSource.endsWith(`/${normalizedPattern}`)
    );
  }

  const basenamePattern = normalizeProjectPath(path.basename(normalizedPattern));
  return Boolean(basenamePattern && normalizedSource.includes(basenamePattern.replace(/\*/g, "")));
}

export function functionAtLine(file: IndexedFile, line: number): FunctionInfo | undefined {
  return file.functions.find((fn) => line >= fn.line && line <= fn.endLine);
}

export function functionAllowed(functionName: string | undefined, allowed?: readonly string[]): boolean {
  if (!allowed?.length) {
    return true;
  }

  return Boolean(functionName && allowed.includes(functionName));
}
