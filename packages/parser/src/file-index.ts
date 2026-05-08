import fs from "node:fs/promises";
import path from "node:path";
import { relativeToRoot } from "@s-agent/shared";

const ignoredDirectories = new Set([".git", "dist", "node_modules", "coverage"]);
const sourceFileExtensions = /\.(astro|ts|tsx)$/;

export interface SourceFileEntry {
  absolutePath: string;
  relativePath: string;
  text: string;
}

function isIndexableSourceFile(fileName: string): boolean {
  return sourceFileExtensions.test(fileName) && !fileName.endsWith(".d.ts");
}

export async function listTypeScriptFiles(projectRoot: string): Promise<string[]> {
  async function visit(directory: string): Promise<string[]> {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    const results = await Promise.all(
      entries.map(async (entry) => {
        if (ignoredDirectories.has(entry.name)) {
          return [];
        }

        const fullPath = path.join(directory, entry.name);

        if (entry.isDirectory()) {
          return visit(fullPath);
        }

        if (entry.isFile() && isIndexableSourceFile(entry.name)) {
          return [fullPath];
        }

        return [];
      })
    );

    return results.flat();
  }

  return visit(projectRoot);
}

export async function readSourceFiles(projectRoot: string): Promise<SourceFileEntry[]> {
  const files = await listTypeScriptFiles(projectRoot);

  return Promise.all(
    files.sort().map(async (absolutePath) => ({
      absolutePath,
      relativePath: relativeToRoot(projectRoot, absolutePath),
      text: await fs.readFile(absolutePath, "utf8")
    }))
  );
}
