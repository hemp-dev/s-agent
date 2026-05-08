import ts from "typescript";

export interface FunctionInfo {
  name: string;
  exported: boolean;
  line: number;
  endLine: number;
  comments: string[];
}

function hasExportModifier(node: ts.Node): boolean {
  return Boolean(
    ts.canHaveModifiers(node) &&
      ts.getModifiers(node)?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)
  );
}

function collectLeadingComments(sourceFile: ts.SourceFile, node: ts.Node): string[] {
  const text = sourceFile.getFullText();
  const ranges = ts.getLeadingCommentRanges(text, node.getFullStart()) ?? [];

  return ranges
    .map((range) => text.slice(range.pos, range.end).replace(/^\/\*\*?|\*\/$|^\/\//g, "").trim())
    .filter(Boolean);
}

function lineFor(sourceFile: ts.SourceFile, position: number): number {
  return sourceFile.getLineAndCharacterOfPosition(position).line + 1;
}

export function extractFunctions(sourceFile: ts.SourceFile): FunctionInfo[] {
  const functions: FunctionInfo[] = [];

  function addFunction(node: ts.Node, name: string, exported: boolean): void {
    functions.push({
      name,
      exported,
      line: lineFor(sourceFile, node.getStart(sourceFile)),
      endLine: lineFor(sourceFile, node.getEnd()),
      comments: collectLeadingComments(sourceFile, node)
    });
  }

  function visit(node: ts.Node): void {
    if (ts.isFunctionDeclaration(node) && node.name) {
      addFunction(node, node.name.text, hasExportModifier(node));
    }

    if (ts.isVariableStatement(node)) {
      const exported = hasExportModifier(node);

      for (const declaration of node.declarationList.declarations) {
        if (
          ts.isIdentifier(declaration.name) &&
          declaration.initializer &&
          (ts.isArrowFunction(declaration.initializer) ||
            ts.isFunctionExpression(declaration.initializer))
        ) {
          addFunction(declaration, declaration.name.text, exported);
        }
      }
    }

    if (ts.isMethodDeclaration(node) && ts.isIdentifier(node.name)) {
      addFunction(node, node.name.text, hasExportModifier(node));
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return functions;
}

export function findFunctionAtLine(
  functions: readonly FunctionInfo[],
  line: number
): FunctionInfo | undefined {
  return functions.find((fn) => line >= fn.line && line <= fn.endLine);
}
