import { notFound } from "next/navigation";
import { getCategories } from "@/lib/db/queries";

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ category: c.slug }));
}

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
