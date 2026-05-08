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

function astroFrontmatterScript(text: string): string {
  const lines = text.split(/\r?\n/);

  if (lines[0]?.trim() !== "---") {
    return "";
  }

  const closingFenceIndex = lines.findIndex((line, index) => index > 0 && line.trim() === "---");

  if (closingFenceIndex === -1) {
    return "";
  }

  return lines
    .map((line, index) => (index > 0 && index < closingFenceIndex ? line : ""))
    .join("\n");
}

function scriptTextFor(entry: { absolutePath: string; text: string }): string {
  if (entry.absolutePath.endsWith(".astro")) {
    return astroFrontmatterScript(entry.text);
  }

  return entry.text;
}

function scriptKindFor(absolutePath: string): ts.ScriptKind {
  return absolutePath.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
}

export async function indexProject(projectRoot: string): Promise<ProjectIndex> {
  const root = path.resolve(projectRoot);
  const sourceFiles = await readSourceFiles(root);
  const files = sourceFiles.map((entry) => {
    const scriptText = scriptTextFor(entry);
    const sourceFile = ts.createSourceFile(
      entry.absolutePath,
      scriptText,
      ts.ScriptTarget.Latest,
      true,
      scriptKindFor(entry.absolutePath)
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
