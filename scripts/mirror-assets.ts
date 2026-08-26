/**
 * Mirrors every scraped item image into Vercel Blob and records the resulting public
 * url on each item.
 *
 * The store is public, so `put()` returns a permanent CDN url we can persist
 * and render directly — no signing, no proxy route.
 *
 * Requires BLOB_READ_WRITE_TOKEN. Without it the app falls back to
 * `image_source_url`, so running this is optional.
 */
import { put } from "@vercel/blob";
import { eq, isNotNull } from "drizzle-orm";
import { imageSize } from "image-size";
import { db, schema } from "../lib/db";

const { items } = schema;
const CONCURRENCY = 8;

async function mirror(row: typeof items.$inferSelect) {
  const src = row.imageSourceUrl!;
  const ext = (src.split(".").pop() ?? "png").split("?")[0].toLowerCase();

  const res = await fetch(src);
  if (!res.ok) {
    console.error(`  ! ${row.slug}: ${res.status}`);
    return false;
  }

  const bytes = Buffer.from(await res.arrayBuffer());
  let width: number | null = null;
  let height: number | null = null;
  try {
    const size = imageSize(bytes);
    width = size.width ?? null;
    height = size.height ?? null;
  } catch {
    // Unreadable header: fall back to a square frame in the UI.
  }

  const { url } = await put(`images/${row.slug}.${ext}`, bytes, {
    access: "public",
    // Passed explicitly: an ambient VERCEL_OIDC_TOKEN would otherwise win and
    // resolve to whichever store the linked project points at.
    token: process.env.BLOB_READ_WRITE_TOKEN,
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 31_536_000,
  });

  await db
    .update(items)
    .set({ imageBlobUrl: url, imageWidth: width, imageHeight: height })
    .where(eq(items.id, row.id));
  console.log(`  ✓ ${row.slug}`);
  return true;
}

async function main() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error(
      "Missing BLOB_READ_WRITE_TOKEN — skipping.\n" +
        "Run `vercel blob create-store <name> --access public --yes`, or keep\n" +
        "using the source urls (the app renders fine either way)."
    );
    process.exit(0);
  }

  const rows = await db
    .select()
    .from(items)
    .where(isNotNull(items.imageSourceUrl));

  let done = 0;
  for (let i = 0; i < rows.length; i += CONCURRENCY) {
    const batch = rows.slice(i, i + CONCURRENCY);
    const results = await Promise.all(batch.map(mirror));
    done += results.filter(Boolean).length;
  }

  console.log(`\nmirrored ${done}/${rows.length} images to Vercel Blob`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
