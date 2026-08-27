import "server-only";
import { asc, eq, sql } from "drizzle-orm";
import { db, schema } from "@/lib/db";

const { categories, items } = schema;

export type AdminCategory = typeof categories.$inferSelect & {
  itemCount: number;
};

export async function listCategories(): Promise<AdminCategory[]> {
  const rows = await db
    .select({
      category: categories,
      itemCount: sql<number>`count(${items.id})::int`,
    })
    .from(categories)
    .leftJoin(items, eq(items.categoryId, categories.id))
    .groupBy(categories.id)
    .orderBy(asc(categories.position), asc(categories.name));

  return rows.map((r) => ({ ...r.category, itemCount: r.itemCount }));
}
