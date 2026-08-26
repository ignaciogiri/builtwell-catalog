import "server-only";
import { asc, eq, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db, schema } from "./index";

const { categories, items, itemTags, tags } = schema;

/**
 * Case-insensitive name ordering.
 *
 * Every column is sorted alphabetically rather than by insert order, so a row
 * added later lands in the right place without renumbering anything.
 */
const byName = sql`lower(${items.name})`;

/**
 * The catalog is edited in the database, not by user traffic, so every read is
 * cached for a day and invalidated by tag when content changes.
 */

export async function getCategories() {
  "use cache";
  cacheLife("days");
  cacheTag("catalog", "categories");

  return db.select().from(categories).orderBy(asc(categories.position));
}

export async function getItems(categorySlug: string) {
  "use cache";
  cacheLife("days");
  cacheTag("catalog", `category:${categorySlug}`);

  return db
    .select({
      id: items.id,
      slug: items.slug,
      name: items.name,
      imageSourceUrl: items.imageSourceUrl,
      imageBlobUrl: items.imageBlobUrl,
    })
    .from(items)
    .innerJoin(categories, eq(items.categoryId, categories.id))
    .where(eq(categories.slug, categorySlug))
    .orderBy(asc(byName));
}

export async function getItem(categorySlug: string, itemSlug: string) {
  "use cache";
  cacheLife("days");
  cacheTag("catalog", `item:${categorySlug}/${itemSlug}`);

  const rows = await db
    .select({
      id: items.id,
      slug: items.slug,
      name: items.name,
      description: items.description,
      url: items.url,
      imageSourceUrl: items.imageSourceUrl,
      imageBlobUrl: items.imageBlobUrl,
      imageWidth: items.imageWidth,
      imageHeight: items.imageHeight,
      dateAdded: items.dateAdded,
      categorySlug: categories.slug,
    })
    .from(items)
    .innerJoin(categories, eq(items.categoryId, categories.id))
    .where(eq(categories.slug, categorySlug));

  const row = rows.find((r) => r.slug === itemSlug);
  if (!row) {
    return null;
  }

  const itemTagRows = await db
    .select({ name: tags.name })
    .from(itemTags)
    .innerJoin(tags, eq(itemTags.tagId, tags.id))
    .where(eq(itemTags.itemId, row.id));

  return { ...row, tags: itemTagRows.map((t) => t.name) };
}

/** Every (category, item) pair — used to prerender the whole catalog. */
export async function getAllPaths() {
  "use cache";
  cacheLife("days");
  cacheTag("catalog");

  return db
    .select({ category: categories.slug, item: items.slug })
    .from(items)
    .innerJoin(categories, eq(items.categoryId, categories.id))
    .orderBy(asc(categories.position), asc(byName));
}

/** slug -> display name, for breadcrumbs. */
export async function getAllNames() {
  "use cache";
  cacheLife("days");
  cacheTag("catalog");

  const [cats, its] = await Promise.all([
    db
      .select({ slug: categories.slug, name: categories.name })
      .from(categories),
    db.select({ slug: items.slug, name: items.name }).from(items),
  ]);

  return Object.fromEntries(
    [...cats, ...its].map((r) => [r.slug, r.name])
  ) as Record<string, string>;
}

/** Prefers the mirrored Blob copy, falling back to the original source url. */
export function imageUrl(item: {
  imageBlobUrl: string | null;
  imageSourceUrl: string | null;
}) {
  return item.imageBlobUrl ?? item.imageSourceUrl;
}

export type CatalogItem = {
  slug: string;
  name: string;
  category: string;
  description: string | null;
  url: string | null;
  image: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
  dateAdded: Date | null;
  badge: string | null;
  tags: string[];
};

/**
 * The whole catalog in one payload (~56 KB).
 *
 * The browser UI is a single persistent client component, so it needs every
 * item up front rather than per route. That is what lets panels animate in and
 * out: nothing crosses a route slot, where exit animations cannot be tracked.
 */
export async function getCatalog() {
  "use cache";
  cacheLife("days");
  cacheTag("catalog");

  const [rows, tagRows] = await Promise.all([
    db
      .select({
        id: items.id,
        slug: items.slug,
        name: items.name,
        category: categories.slug,
        description: items.description,
        url: items.url,
        imageBlobUrl: items.imageBlobUrl,
        imageSourceUrl: items.imageSourceUrl,
        imageWidth: items.imageWidth,
        imageHeight: items.imageHeight,
        dateAdded: items.dateAdded,
        badge: items.badge,
      })
      .from(items)
      .innerJoin(categories, eq(items.categoryId, categories.id))
      .orderBy(asc(categories.position), asc(byName)),
    db
      .select({ itemId: itemTags.itemId, name: tags.name })
      .from(itemTags)
      .innerJoin(tags, eq(itemTags.tagId, tags.id)),
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

  return rows.map(
    ({ id, imageBlobUrl, imageSourceUrl, ...rest }): CatalogItem => ({
      ...rest,
      image: imageBlobUrl ?? imageSourceUrl,
      tags: byItem.get(id) ?? [],
    })
  );
}
