import "server-only";
import { inArray } from "drizzle-orm";
import { updateTag } from "next/cache";
import { db, schema } from "@/lib/db";
import { type AdminState, slugify } from "../state";

/**
 * Helpers shared by the action files. Deliberately not a "use server" module —
 * that directive requires every export to be an async server action, and these
 * are plain functions the actions call internally.
 */

const { tags } = schema;

export function text(fd: FormData, key: string) {
  const value = String(fd.get(key) ?? "").trim();
  return value.length > 0 ? value : null;
}

export function number(fd: FormData, key: string) {
  const value = text(fd, key);
  if (value === null) {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.trunc(parsed) : null;
}

export function date(fd: FormData, key: string) {
  const value = text(fd, key);
  if (value === null) {
    return null;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/**
 * Everything the public site reads is cached for a day and keyed by tag, so an
 * edit is only visible once those tags are dropped. updateTag rather than
 * revalidateTag: the editor should see its own write on the very next render.
 * The tags are cheap and the catalog is small, so a write invalidates all of
 * them rather than trying to work out which page it touched.
 */
export function revalidateCatalog() {
  updateTag("catalog");
  updateTag("categories");
}

export function failure(error: unknown): AdminState {
  const message = error instanceof Error ? error.message : String(error);
  // Postgres reports a clashing slug as a unique violation; say what it means.
  if (message.includes("duplicate key")) {
    return { status: "error", message: "That slug is already taken." };
  }
  return { status: "error", message };
}

/** Resolves tag names to rows, creating any that don't exist yet. */
export async function resolveTags(names: string[]) {
  const wanted = new Map<string, string>();
  for (const name of names) {
    const slug = slugify(name);
    if (slug) {
      wanted.set(slug, name);
    }
  }
  if (wanted.size === 0) {
    return [] as number[];
  }

  await db
    .insert(tags)
    .values([...wanted].map(([slug, name]) => ({ slug, name })))
    .onConflictDoNothing({ target: tags.slug });

  const rows = await db
    .select({ id: tags.id })
    .from(tags)
    .where(inArray(tags.slug, [...wanted.keys()]));

  return rows.map((r) => r.id);
}
