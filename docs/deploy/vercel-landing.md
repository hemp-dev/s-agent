# Vercel Landing Deployment

The landing site is deployed separately from S-Agent Core.

Use the `vercel/landing` branch for Vercel. That branch contains only the Astro
landing site at repository root, so Vercel does not receive the full S-Agent
monorepo.

S-Agent Core releases are cut from `main` and must not include `apps/site`.
