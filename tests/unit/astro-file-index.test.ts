import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { indexProject } from "@s-agent/parser";

describe("unit: Astro file indexing", () => {
  it("indexes Astro frontmatter imports with original line numbers", async () => {
    const projectRoot = await fs.mkdtemp(path.join(os.tmpdir(), "s-agent-astro-index-"));
    await fs.mkdir(path.join(projectRoot, "src/pages"), { recursive: true });
    await fs.mkdir(path.join(projectRoot, "src/content"), { recursive: true });
    await fs.writeFile(
      path.join(projectRoot, "src/pages/index.astro"),
      [
        "---",
        "import { brand } from \"../content/landing\";",
        "const title = brand.product;",
        "---",
        "<h1>{title}</h1>",
        ""
      ].join("\n"),
      "utf8"
    );
    await fs.writeFile(
      path.join(projectRoot, "src/content/landing.ts"),
      "export const brand = { product: \"IntentGuard\" } as const;\n",
      "utf8"
    );

    const index = await indexProject(projectRoot);
    const page = index.files.find((file) => file.relativePath === "src/pages/index.astro");

    expect(page).toBeDefined();
    expect(page?.imports).toEqual([
      expect.objectContaining({
        source: "../content/landing",
        importedPath: "src/content/landing.ts",
        line: 2
      })
    ]);
  });
});
