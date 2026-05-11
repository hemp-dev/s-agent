#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import {
  defaultRulesDirectory,
  renderAnalysisJson,
  renderAnalysisMarkdown,
  runSAgentAnalysis
} from "@s-agent/core";
import { loadRulesFromDirectory, RuleRegistry } from "@s-agent/rules";

interface ParsedArgs {
  command: string[];
  flags: Map<string, string | boolean>;
}

export interface CliIO {
  stdout(message: string): void;
  stderr(message: string): void;
  readStdin?(): Promise<string>;
}

const consoleIO: CliIO = {
  stdout: (message) => console.log(message),
  stderr: (message) => console.error(message),
  readStdin: () =>
    new Promise((resolve, reject) => {
      let content = "";
      process.stdin.setEncoding("utf8");
      process.stdin.on("data", (chunk: string) => {
        content += chunk;
      });
      process.stdin.on("end", () => {
        resolve(content);
      });
      process.stdin.on("error", reject);
    })
};

function parseArgs(argv: string[]): ParsedArgs {
  const command: string[] = [];
  const flags = new Map<string, string | boolean>();

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (!token.startsWith("--")) {
      command.push(token);
      continue;
    }

    const key = token.slice(2);
    const next = argv[index + 1];

    if (!next || next.startsWith("--")) {
      flags.set(key, true);
      continue;
    }

    flags.set(key, next);
    index += 1;
  }

  return { command, flags };
}

function flagString(flags: Map<string, string | boolean>, name: string): string | undefined {
  const value = flags.get(name);
  return typeof value === "string" ? value : undefined;
}

function hasFlag(flags: Map<string, string | boolean>, name: string): boolean {
  return flags.get(name) === true;
}

function usage(): string {
  return [
    "Usage:",
    "  s-agent init",
    "  s-agent rules validate [--rules rules]",
    "  s-agent analyze [--project .] [--rules rules] [--diff file|--diff-stdin] [--json|--markdown]"
  ].join("\n");
}

async function exists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function initProject(cwd: string, io: CliIO): Promise<void> {
  const rulesDirectory = path.join(cwd, "rules");
  const ruleFile = path.join(rulesDirectory, "s-agent-architecture.rules.yml");

  await fs.mkdir(rulesDirectory, { recursive: true });

  if (await exists(ruleFile)) {
    io.stdout(`S-Agent rules already exist at ${ruleFile}`);
    return;
  }

  await fs.writeFile(
    ruleFile,
    [
      "rules:",
      "  - rule_id: PROJECT-ARCH-001",
      "    domain: architecture",
      "    status: candidate",
      "    owner: team",
      "    severity: warning",
      "    scope:",
      "      modules:",
      "        - \"src/**\"",
      "    intent: \"Project modules should preserve documented architecture boundaries.\"",
      "    invariants:",
      "      - id: PROJECT-ARCH-001",
      "        type: forbidden_import",
      "        description: \"Replace this candidate rule with a project-specific boundary.\"",
      "        forbidden_imports:",
      "          - \"src/example-forbidden/**\"",
      "    enforcement:",
      "      mode: review",
      "    source:",
      "      file: \"CLAUDE.md\"",
      "      section: \"architecture\"",
      ""
    ].join("\n"),
    "utf8"
  );

  io.stdout(`Created starter S-Agent rule at ${ruleFile}`);
}

async function validateRules(rulesDirectory: string, io: CliIO): Promise<void> {
  const rules = await loadRulesFromDirectory(rulesDirectory);
  const registry = new RuleRegistry(rules);

  io.stdout(`Loaded ${registry.all().length} SemanticRule(s).`);
  io.stdout(`Approved enforceable rules: ${registry.enforceable().length}.`);
}

async function readDiffText(
  flags: Map<string, string | boolean>,
  cwd: string,
  io: CliIO
): Promise<string | undefined> {
  const diffPath = flagString(flags, "diff");
  const diffStdin = hasFlag(flags, "diff-stdin") || diffPath === "-";

  if (diffPath && diffPath !== "-" && diffStdin) {
    throw new Error("Use either --diff <file> or --diff-stdin, not both.");
  }

  if (diffPath && diffPath !== "-") {
    return fs.readFile(path.resolve(cwd, diffPath), "utf8");
  }

  if (diffStdin) {
    if (!io.readStdin) {
      throw new Error("This CLI environment cannot read diff from stdin.");
    }

    return io.readStdin();
  }

  return undefined;
}

async function analyze(
  flags: Map<string, string | boolean>,
  cwd: string,
  io: CliIO
): Promise<number> {
  const projectRoot = path.resolve(flagString(flags, "project") ?? cwd);
  const rulesDirectory = path.resolve(flagString(flags, "rules") ?? defaultRulesDirectory(projectRoot));
  const diffText = await readDiffText(flags, cwd, io);
  const result = await runSAgentAnalysis({ projectRoot, rulesDirectory, diffText });
  const outputJson = hasFlag(flags, "json");
  const outputMarkdown = hasFlag(flags, "markdown") || !outputJson;

  if (outputJson) {
    io.stdout(renderAnalysisJson(result));
  } else if (outputMarkdown) {
    io.stdout(renderAnalysisMarkdown(result));
  }

  return result.blocking ? 1 : 0;
}

export async function runCli(
  argv: readonly string[],
  cwd: string,
  io: CliIO = consoleIO
): Promise<number> {
  const parsed = parseArgs([...argv]);
  const [first, second] = parsed.command;

  if (first === "init") {
    await initProject(cwd, io);
    return 0;
  }

  if (first === "rules" && second === "validate") {
    const rulesDirectory = path.resolve(flagString(parsed.flags, "rules") ?? defaultRulesDirectory(cwd));
    await validateRules(rulesDirectory, io);
    return 0;
  }

  if (first === "analyze") {
    return analyze(parsed.flags, cwd, io);
  }

  io.stdout(usage());
  return 0;
}

if (require.main === module) {
  runCli(process.argv.slice(2), process.cwd()).then(
    (exitCode) => {
      process.exitCode = exitCode;
    },
    (error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      consoleIO.stderr(`s-agent failed: ${message}`);
      process.exitCode = 1;
    }
  );
}
