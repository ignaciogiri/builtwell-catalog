/**
 * Shared pieces of the editor that are not server actions.
 *
 * A "use server" module may only export async functions, so the state shape,
 * its initial value and the slug helper live here instead.
 */

export type AdminState = {
  status: "idle" | "ok" | "error";
  message?: string;
};

export const IDLE: AdminState = { status: "idle" };

/** Lowercase, hyphenated, ASCII-only — the shape every slug column expects. */
export function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
