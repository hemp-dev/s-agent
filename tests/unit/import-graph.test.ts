import path from "node:path";
import ts from "typescript";
import { describe, expect, it } from "vitest";
import { extractImports } from "@s-agent/parser";

describe("unit: import graph", () => {
  it("extracts relative TypeScript imports with line numbers", () => {
    const projectRoot = path.resolve(__dirname, "../evaluation/fixtures/layer-boundary-violation");
    const absolutePath = path.join(projectRoot, "src/auth/session.ts");
    const sourceFile = ts.createSourceFile(
      absolutePath,
      "import { chargeForSession } from \"../billing/billing-service\";\n",
      ts.ScriptTarget.Latest,
      true
    );
    const imports = extractImports(projectRoot, absolutePath, sourceFile);

    expect(imports[0]).toEqual(
      expect.objectContaining({
        source: "../billing/billing-service",
        importedPath: "src/billing/billing-service.ts",
        line: 1
      })
    );
  });
});
