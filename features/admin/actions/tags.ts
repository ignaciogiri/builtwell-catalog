"use server";

import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { type AdminState, slugify } from "../state";
import { failure, revalidateCatalog, text } from "./shared";

const { tags } = schema;

export async function saveTag(
  _prev: AdminState,
  fd: FormData
): Promise<AdminState> {
  const id = Number(fd.get("id") ?? 0) || null;
  const name = text(fd, "name");
  if (!name) {
    return { status: "error", message: "Name is required." };
  }

  const slug = slugify(text(fd, "slug") ?? name);
  if (!slug) {
    return { status: "error", message: "Name must contain letters or digits." };
  }

  try {
    if (id) {
      await db.update(tags).set({ slug, name }).where(eq(tags.id, id));
    } else {
      await db
        .insert(tags)
        .values({ slug, name })
        .onConflictDoNothing({ target: tags.slug });
    }
  } catch (error) {
    return failure(error);
  }

  revalidateCatalog();
  return { status: "ok", message: "Saved." };
}

export async function deleteTag(
  _prev: AdminState,
  fd: FormData
): Promise<AdminState> {
  const id = Number(fd.get("id") ?? 0) || null;
  if (!id) {
    return { status: "error", message: "Missing tag." };
  }

  try {
    await db.delete(tags).where(eq(tags.id, id));
  } catch (error) {
    return failure(error);
  }

  revalidateCatalog();
  return { status: "ok", message: "Deleted." };
}
