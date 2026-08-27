import "server-only";
import { asc, eq, sql } from "drizzle-orm";
import { db, schema } from "@/lib/db";

const { categories, items, itemTags, tags } = schema;

const byName = sql`lower(${items.name})`;

export type EditableItem = {
  id: number;
  slug: string;
  name: string;
  categoryId: number;
  categoryName: string;
  description: string | null;
  url: string | null;
  imageSourceUrl: string | null;
  imageBlobUrl: string | null;
  badge: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
  dateAdded: Date | null;
  position: number;
  tags: string[];
};

/**
 * Every item, with everything the form edits.
 *
 * The editor opens rows in a dialog rather than navigating to a page, so the
 * whole editable set is loaded once instead of a round trip per row. Two
 * queries and a join in memory, the same shape the public catalog read uses.
 */
export async function listEditableItems(): Promise<EditableItem[]> {
  const [rows, tagRows] = await Promise.all([
    db
      .select({
        id: items.id,
        slug: items.slug,
        name: items.name,
        categoryId: items.categoryId,
        categoryName: categories.name,
        description: items.description,
        url: items.url,
        imageSourceUrl: items.imageSourceUrl,
        imageBlobUrl: items.imageBlobUrl,
        badge: items.badge,
        imageWidth: items.imageWidth,
        imageHeight: items.imageHeight,
        dateAdded: items.dateAdded,
        position: items.position,
      })
      .from(items)
      .innerJoin(categories, eq(items.categoryId, categories.id))
      .orderBy(asc(categories.position), asc(byName)),
    db
      .select({ itemId: itemTags.itemId, name: tags.name })
      .from(itemTags)
      .innerJoin(tags, eq(itemTags.tagId, tags.id))
      .orderBy(asc(tags.name)),
  ]);

  const byItem = new Map<number, string[]>();
  for (const t of tagRows) {
    const list = byItem.get(t.itemId);
    if (list) {
      list.push(t.name);
    } else {
      byItem.set(t.itemId, [t.name]);
    }
  }

  return rows.map((row) => ({ ...row, tags: byItem.get(row.id) ?? [] }));
}
