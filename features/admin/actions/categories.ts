"use server";

import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { type AdminState, slugify } from "../state";
import { failure, number, revalidateCatalog, text } from "./shared";

const { categories } = schema;

export async function saveCategory(
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

  const values = {
    slug,
    name,
    badge: text(fd, "badge"),
    position: number(fd, "position") ?? 0,
  };

  try {
    if (id) {
      await db.update(categories).set(values).where(eq(categories.id, id));
    } else {
      await db.insert(categories).values(values);
    }
  } catch (error) {
    return failure(error);
  }

  revalidateCatalog();
  return { status: "ok", message: "Saved." };
}

export async function deleteCategory(
  _prev: AdminState,
  fd: FormData
): Promise<AdminState> {
  const id = Number(fd.get("id") ?? 0) || null;
  if (!id) {
    return { status: "error", message: "Missing category." };
  }

  try {
    // The schema cascades, so this takes the category's items with it.
    await db.delete(categories).where(eq(categories.id, id));
  } catch (error) {
    return failure(error);
  }

  revalidateCatalog();
  return { status: "ok", message: "Deleted." };
}
