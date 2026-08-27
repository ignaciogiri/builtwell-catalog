"use server";

import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { type AdminState, slugify } from "../state";
import {
  date,
  failure,
  number,
  resolveTags,
  revalidateCatalog,
  text,
} from "./shared";

const { items, itemTags } = schema;

export async function saveItem(
  _prev: AdminState,
  fd: FormData
): Promise<AdminState> {
  const id = Number(fd.get("id") ?? 0) || null;
  const name = text(fd, "name");
  const categoryId = Number(fd.get("categoryId") ?? 0) || null;

  if (!name) {
    return { status: "error", message: "Name is required." };
  }
  if (!categoryId) {
    return { status: "error", message: "Pick a category." };
  }

  const slug = slugify(text(fd, "slug") ?? name);
  if (!slug) {
    return { status: "error", message: "Name must contain letters or digits." };
  }

  const values = {
    slug,
    name,
    categoryId,
    description: text(fd, "description"),
    url: text(fd, "url"),
    imageSourceUrl: text(fd, "imageSourceUrl"),
    imageBlobUrl: text(fd, "imageBlobUrl"),
    badge: text(fd, "badge"),
    imageWidth: number(fd, "imageWidth"),
    imageHeight: number(fd, "imageHeight"),
    dateAdded: date(fd, "dateAdded"),
    position: number(fd, "position") ?? 0,
    updatedAt: new Date(),
  };

  const tagNames = String(fd.get("tags") ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  let savedId: number;
  try {
    if (id) {
      await db.update(items).set(values).where(eq(items.id, id));
      savedId = id;
    } else {
      const [row] = await db
        .insert(items)
        .values(values)
        .returning({ id: items.id });
      savedId = row.id;
    }

    const tagIds = await resolveTags(tagNames);
    await db.delete(itemTags).where(eq(itemTags.itemId, savedId));
    if (tagIds.length > 0) {
      await db
        .insert(itemTags)
        .values(tagIds.map((tagId) => ({ itemId: savedId, tagId })))
        .onConflictDoNothing();
    }
  } catch (error) {
    return failure(error);
  }

  revalidateCatalog();

  // Both paths report back in place: the editor is a dialog over the list, and
  // the list refreshes behind it rather than navigating anywhere.
  return { status: "ok", message: id ? "Saved." : "Item created." };
}

export async function deleteItem(
  _prev: AdminState,
  fd: FormData
): Promise<AdminState> {
  const id = Number(fd.get("id") ?? 0) || null;
  if (!id) {
    return { status: "error", message: "Missing item." };
  }

  try {
    await db.delete(items).where(eq(items.id, id));
  } catch (error) {
    return failure(error);
  }

  revalidateCatalog();
  return { status: "ok", message: "Deleted." };
}
