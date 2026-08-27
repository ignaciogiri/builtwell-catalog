import type { MetadataRoute } from "next";
import { SITE } from "@/features/site/config";

export default function robots(): MetadataRoute.Robots {
  return {
    // The editor is unauthenticated, so keep it out of every index. The pages
    // also send noindex headers of their own; this stops the crawl entirely.
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
