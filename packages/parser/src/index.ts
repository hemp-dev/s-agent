import path from "node:path";
import ts from "typescript";
import { extractImports, type ImportReference } from "./import-graph";
import { readSourceFiles } from "./file-index";
import { extractSymbols } from "./symbol-extractor";
import type { FunctionInfo } from "./function-index";

export interface IndexedFile {
  absolutePath: string;
  relativePath: string;
  text: string;
  imports: ImportReference[];
  functions: FunctionInfo[];
}

export interface ProjectIndex {
  root: string;
  files: IndexedFile[];
}

export async function indexProject(projectRoot: string): Promise<ProjectIndex> {
  const root = path.resolve(projectRoot);
  const sourceFiles = await readSourceFiles(root);
  const files = sourceFiles.map((entry) => {
    const sourceFile = ts.createSourceFile(
      entry.absolutePath,
      entry.text,
      ts.ScriptTarget.Latest,
      true,
      entry.absolutePath.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS
    );
    const symbols = extractSymbols(sourceFile);

    return {
      ...entry,
      imports: extractImports(root, entry.absolutePath, sourceFile),
      functions: symbols.functions
    };
  });

  return {
    root,
    files
  };
}

export * from "./file-index";
export * from "./function-index";
export * from "./import-graph";
export * from "./symbol-extractor";
