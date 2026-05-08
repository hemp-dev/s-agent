import fs from "node:fs/promises";
import path from "node:path";
import YAML from "yaml";
import type { SemanticRule } from "./semantic-rule";
import { RuleValidationError, validateRules } from "./rule-validator";

const RULE_FILE_PATTERN = /\.(rules\.)ya?ml$/;

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function collectRuleFiles(directory: string): Promise<string[]> {
  const exists = await pathExists(directory);

  if (!exists) {
    return [];
  }

  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return collectRuleFiles(fullPath);
      }

      if (entry.isFile() && RULE_FILE_PATTERN.test(entry.name)) {
        return [fullPath];
      }

      return [];
    })
  );

  return files.flat().sort();
}

function extractRules(document: unknown, filePath: string): unknown[] {
  if (Array.isArray(document)) {
    return document;
  }

  if (
    document &&
    typeof document === "object" &&
    "rules" in document &&
    Array.isArray((document as { rules: unknown }).rules)
  ) {
    return (document as { rules: unknown[] }).rules;
  }

  throw new RuleValidationError(
    `Invalid rule document in ${filePath}: expected top-level 'rules' array`,
    ["rules: expected array"],
    filePath
  );
}

export async function loadRuleFile(filePath: string): Promise<SemanticRule[]> {
  const content = await fs.readFile(filePath, "utf8");
  const parsed = YAML.parse(content);
  const rawRules = extractRules(parsed, filePath);
  return validateRules(rawRules, filePath);
}

export async function loadRulesFromDirectory(directory: string): Promise<SemanticRule[]> {
  const files = await collectRuleFiles(directory);
  const ruleSets = await Promise.all(files.map((file) => loadRuleFile(file)));
  return ruleSets.flat();
}
