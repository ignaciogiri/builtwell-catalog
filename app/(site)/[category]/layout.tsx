import { notFound } from "next/navigation";
import { getCategories } from "@/lib/db/queries";

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ category: c.slug }));
}

/**
 * Every category is prerendered by generateStaticParams, so this only blocks
 * for a slug that is not a category — which exists to 404. The layout renders
 * no UI of its own, so a Suspense boundary would wrap nothing.
 */
export const instant = false;

export default async function CategoryLayout({
  params,
  children,
}: LayoutProps<"/[category]">) {
  const { category } = await params;
  const categories = await getCategories();
  if (!categories.some((c) => c.slug === category)) {
    notFound();
  }

  return children;
}
