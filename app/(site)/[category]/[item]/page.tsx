import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { getAllPaths, getItem } from "@/features/catalog/queries";

export async function generateStaticParams() {
  return getAllPaths();
}

export async function generateMetadata({
  params,
}: PageProps<"/[category]/[item]">): Promise<Metadata> {
  "use cache";
  cacheLife("days");
  const { category, item } = await params;
  const row = await getItem(category, item);
  if (!row) {
    return {};
  }

  const url = `/${category}/${item}`;
  const description = row.description ?? undefined;

  return {
    title: row.name,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: `${row.name} — Catalog`,
      description,
      url,
      images: [{ url: "/og.jpg", width: 1600, height: 840, alt: row.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${row.name} — Catalog`,
      description,
    },
  };
}

/**
 * Every item is prerendered by generateStaticParams, so this only blocks for a
 * slug that is not in the catalog — which exists to 404. Wrapping it in
 * Suspense would put a boundary around a component that renders nothing.
 */
export const instant = false;

/**
 * The panels themselves are rendered by the persistent Browser in the root
 * layout. This route exists so every item is a real, prerendered URL with its
 * own metadata — it renders nothing of its own.
 */
export default async function Page({
  params,
}: PageProps<"/[category]/[item]">) {
  const { category, item } = await params;
  if (!(await getItem(category, item))) {
    notFound();
  }
  return null;
}
