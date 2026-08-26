import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPaths, getItem } from "@/lib/db/queries";

export async function generateStaticParams() {
  return getAllPaths();
}

export async function generateMetadata({
  params,
}: PageProps<"/[category]/[item]">): Promise<Metadata> {
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
