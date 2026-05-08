import { defineConfig } from "astro/config";

const site = process.env.SITE_URL ?? "https://axiomguard.dev";

export default defineConfig({
  output: "static",
  site
});
