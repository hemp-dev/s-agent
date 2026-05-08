import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["packages/**/*.test.ts", "apps/**/*.test.ts", "tests/**/*.test.ts"],
    globals: false
  },
  resolve: {
    alias: {
      "@s-agent/shared": path.resolve(__dirname, "packages/shared/src"),
      "@s-agent/rules": path.resolve(__dirname, "packages/rules/src"),
      "@s-agent/parser": path.resolve(__dirname, "packages/parser/src"),
      "@s-agent/analyzer": path.resolve(__dirname, "packages/analyzer/src"),
      "@s-agent/verifier": path.resolve(__dirname, "packages/verifier/src"),
      "@s-agent/explainer": path.resolve(__dirname, "packages/explainer/src"),
      "@s-agent/core": path.resolve(__dirname, "packages/core/src")
    }
  }
});
