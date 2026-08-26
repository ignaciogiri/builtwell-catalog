import type { Metadata } from "next";
import { getCategories } from "@/lib/db/queries";

export async function generateMetadata({
  params,
}: PageProps<"/[category]">): Promise<Metadata> {
  const { category } = await params;
  const row = (await getCategories()).find((c) => c.slug === category);
  if (!row) {
    return {};
  }

  const description = `${row.name} in Catalog — an open-source library of design resources.`;

  return {
    title: row.name,
    description,
    alternates: { canonical: `/${category}` },
    openGraph: {
      title: `${row.name} — Catalog`,
      description,
      url: `/${category}`,
    },
  };
}

/** A category with nothing selected shows two panels and no detail. */
export default function Page() {
  return null;
}
