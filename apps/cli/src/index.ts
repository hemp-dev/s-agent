#!/usr/bin/env node
import { runCli } from "./main";

runCli(process.argv.slice(2), process.cwd()).then(
  (exitCode) => {
    process.exitCode = exitCode;
  },
  (error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`s-agent failed: ${message}`);
    process.exitCode = 1;
  }
);
