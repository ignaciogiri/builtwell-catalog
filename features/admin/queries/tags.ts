import "server-only";
import { asc, eq, sql } from "drizzle-orm";
import { db, schema } from "@/lib/db";

const { itemTags, tags } = schema;

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
