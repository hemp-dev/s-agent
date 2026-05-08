import type { APIRoute } from "astro";
import { pageMetadata, siteMetadata } from "../content/landing";
import { seoClusterPages } from "../content/seo-pages";

const routes = [
  { path: "/", priority: "1.0" },
  ...seoClusterPages.map((page) => ({ path: `/${page.slug}`, priority: "0.8" }))
] as const;

function routeUrl(path: string, baseUrl: URL): string {
  return new URL(path, baseUrl).toString();
}

export const GET: APIRoute = ({ site }) => {
  const baseUrl = site ?? new URL(siteMetadata.productionUrl);
  const entries = routes
    .map(
      (route) => `  <url>
    <loc>${routeUrl(route.path, baseUrl)}</loc>
    <lastmod>${pageMetadata.lastUpdated}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route.priority}</priority>
  </url>`
    )
    .join("\n");

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8"
    }
  });
};
