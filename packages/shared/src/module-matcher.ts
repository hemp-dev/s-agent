import { normalizeProjectPath } from "./path-utils";

function escapeRegex(value: string): string {
  return value.replace(/[.+^${}()|[\]\\]/g, "\\$&");
}

function globToRegex(pattern: string): RegExp {
  const normalized = normalizeProjectPath(pattern);
  let source = "";

  for (let index = 0; index < normalized.length; index += 1) {
    const char = normalized[index];
    const next = normalized[index + 1];

    if (char === "*" && next === "*") {
      source += ".*";
      index += 1;
      continue;
    }

    if (char === "*") {
      source += "[^/]*";
      continue;
    }

    source += escapeRegex(char);
  }

  return new RegExp(`^${source}$`);
}

export function matchesPath(filePath: string, pattern: string): boolean {
  const file = normalizeProjectPath(filePath);
  const normalizedPattern = normalizeProjectPath(pattern);

  if (normalizedPattern.includes("*")) {
    return globToRegex(normalizedPattern).test(file);
  }

  if (normalizedPattern.endsWith("/")) {
    return file.startsWith(normalizedPattern);
  }

  return file === normalizedPattern || file.startsWith(`${normalizedPattern}/`);
}

export function matchesAnyPath(filePath: string, patterns: readonly string[] = []): boolean {
  return patterns.some((pattern) => matchesPath(filePath, pattern));
}
