import "server-only";
import { asc, eq, sql } from "drizzle-orm";
import { db, schema } from "./index";

/**
 * Reads for the editor.
 *
 * Deliberately uncached, unlike everything in queries.ts: the editor has to
 * show the row you just saved, not a copy from up to a day ago.
 */

const { categories, items, itemTags, tags } = schema;

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

export async function listItems(categorySlug?: string) {
  const rows = await db
    .select({
      id: items.id,
      slug: items.slug,
      name: items.name,
      badge: items.badge,
      updatedAt: items.updatedAt,
      category: categories.slug,
      categoryName: categories.name,
    })
    .from(items)
    .innerJoin(categories, eq(items.categoryId, categories.id))
    .orderBy(asc(categories.position), sql`lower(${items.name})`);

  return categorySlug ? rows.filter((r) => r.category === categorySlug) : rows;
}

export async function getItemById(id: number) {
  const [row] = await db
    .select({
      item: items,
      category: categories.slug,
    })
    .from(items)
    .innerJoin(categories, eq(items.categoryId, categories.id))
    .where(eq(items.id, id))
    .limit(1);

  if (!row) {
    return null;
  }

  const tagRows = await db
    .select({ name: tags.name })
    .from(itemTags)
    .innerJoin(tags, eq(itemTags.tagId, tags.id))
    .where(eq(itemTags.itemId, id))
    .orderBy(asc(tags.name));

  return {
    ...row.item,
    category: row.category,
    tags: tagRows.map((t) => t.name),
  };
}

export type AdminTag = typeof tags.$inferSelect & { itemCount: number };

export async function listTags(): Promise<AdminTag[]> {
  const rows = await db
    .select({
      tag: tags,
      itemCount: sql<number>`count(${itemTags.itemId})::int`,
    })
    .from(tags)
    .leftJoin(itemTags, eq(itemTags.tagId, tags.id))
    .groupBy(tags.id)
    .orderBy(asc(sql`lower(${tags.name})`));

  return rows.map((r) => ({ ...r.tag, itemCount: r.itemCount }));
}
