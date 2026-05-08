import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import { relativeToRoot } from "@s-agent/shared";

export interface ImportReference {
  source: string;
  importedPath?: string;
  line: number;
  text: string;
}

function resolveImportCandidate(candidate: string): string | undefined {
  const candidates = [
    candidate,
    `${candidate}.ts`,
    `${candidate}.tsx`,
    path.join(candidate, "index.ts"),
    path.join(candidate, "index.tsx")
  ];

  return candidates.find((filePath) => fs.existsSync(filePath));
}

export function resolveImportPath(
  projectRoot: string,
  importerAbsolutePath: string,
  moduleSpecifier: string
): string | undefined {
  if (!moduleSpecifier.startsWith(".")) {
    return undefined;
  }

  const absoluteCandidate = path.resolve(path.dirname(importerAbsolutePath), moduleSpecifier);
  const resolved = resolveImportCandidate(absoluteCandidate);

  return resolved ? relativeToRoot(projectRoot, resolved) : undefined;
}

export function extractImports(
  projectRoot: string,
  absolutePath: string,
  sourceFile: ts.SourceFile
): ImportReference[] {
  const imports: ImportReference[] = [];

  function addImport(moduleSpecifier: ts.Expression, node: ts.Node): void {
    if (!ts.isStringLiteral(moduleSpecifier)) {
      return;
    }

    const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
    imports.push({
      source: moduleSpecifier.text,
      importedPath: resolveImportPath(projectRoot, absolutePath, moduleSpecifier.text),
      line: line + 1,
      text: node.getText(sourceFile)
    });
  }

  sourceFile.forEachChild((node) => {
    if (ts.isImportDeclaration(node) && node.moduleSpecifier) {
      addImport(node.moduleSpecifier, node);
    }

    if (ts.isExportDeclaration(node) && node.moduleSpecifier) {
      addImport(node.moduleSpecifier, node);
    }
  });

  return imports;
}
