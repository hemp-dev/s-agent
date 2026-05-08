import path from "node:path";
import { describe, expect, it } from "vitest";
import { indexProject } from "./index";

const demoProject = path.resolve(__dirname, "../../../examples/demo-typescript-app");

describe("TypeScript parser", () => {
  it("indexes files, imports, and functions", async () => {
    const index = await indexProject(demoProject);
    const session = index.files.find((file) => file.relativePath === "src/auth/session.ts");

    expect(session).toBeDefined();
    expect(session?.imports[0]?.importedPath).toBe("src/billing/billing-service.ts");
    expect(session?.functions.map((fn) => fn.name)).toContain("startSession");
  });
});
