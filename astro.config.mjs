import { defineConfig } from "astro/config";

const site = process.env.SITE_URL ?? "https://intentguard.dev";

export default defineConfig({
  output: "static",
  site
});
