import { describe, expect, it } from "vitest";
import { matchesAnyPath, matchesPath } from "./module-matcher";

describe("module matcher", () => {
  it("matches glob-style module paths", () => {
    expect(matchesPath("src/auth/session.ts", "src/auth/**")).toBe(true);
    expect(matchesPath("src/billing/index.ts", "src/auth/**")).toBe(false);
  });

  it("matches module prefixes without glob syntax", () => {
    expect(matchesAnyPath("src/auth/session.ts", ["src/auth"])).toBe(true);
  });
});
