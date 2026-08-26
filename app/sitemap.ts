import type { MetadataRoute } from "next";
import { getAllPaths, getCategories } from "@/lib/db/queries";
import { SITE } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, paths] = await Promise.all([
    getCategories(),
    getAllPaths(),
  ]);

  return [
    { url: SITE.url, changeFrequency: "weekly", priority: 1 },
    ...categories.map((c) => ({
      url: `${SITE.url}/${c.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...paths.map((p) => ({
      url: `${SITE.url}/${p.category}/${p.item}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
