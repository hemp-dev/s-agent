import path from "node:path";

export function toPosixPath(filePath: string): string {
  return filePath.split(path.sep).join("/");
}

export function normalizeProjectPath(filePath: string): string {
  const normalized = toPosixPath(filePath).replace(/^\.\//, "");
  return normalized.startsWith("/") ? normalized.slice(1) : normalized;
}

export function relativeToRoot(root: string, absolutePath: string): string {
  return normalizeProjectPath(path.relative(root, absolutePath));
}

export function lineNumberFromPosition(text: string, position: number): number {
  return text.slice(0, position).split(/\r?\n/).length;
}

export function lineAt(text: string, line: number): string | undefined {
  return text.split(/\r?\n/)[line - 1]?.trim();
}
