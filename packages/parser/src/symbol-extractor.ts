import ts from "typescript";
import { extractFunctions, type FunctionInfo } from "./function-index";

export interface ExtractedSymbols {
  functions: FunctionInfo[];
}

export function extractSymbols(sourceFile: ts.SourceFile): ExtractedSymbols {
  return {
    functions: extractFunctions(sourceFile)
  };
}
