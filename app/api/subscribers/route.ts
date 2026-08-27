import { timingSafeEqual } from "node:crypto";
import { desc } from "drizzle-orm";
import { db, schema } from "@/lib/db";

/**
 * The subscriber list, newest first.
 *
 * These are personal email addresses, so the route is gated on ADMIN_TOKEN and
 * refuses to answer at all when that variable is missing. Pass the token as a
 * bearer header, or as ?token= when you just want to read it in a browser:
 *
 *   curl -H "Authorization: Bearer $ADMIN_TOKEN" https://catalog.builtwell.design/api/subscribers
 */
export const dynamic = "force-dynamic";

function authorized(request: Request) {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) {
    return false;
  }

  const url = new URL(request.url);
  const header = request.headers.get("authorization") ?? "";
  const supplied = header.startsWith("Bearer ")
    ? header.slice("Bearer ".length)
    : (url.searchParams.get("token") ?? "");

  // Compare over fixed-length digests so the check leaks nothing about length.
  const a = Buffer.from(supplied);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return Response.json({ error: "Not found." }, { status: 404 });
  }

  const rows = await db
    .select({
      id: schema.subscribers.id,
      email: schema.subscribers.email,
      createdAt: schema.subscribers.createdAt,
    })
    .from(schema.subscribers)
    .orderBy(desc(schema.subscribers.createdAt));

  return Response.json(
    { count: rows.length, subscribers: rows },
    {
      headers: {
        "cache-control": "no-store",
        "x-robots-tag": "noindex, nofollow",
      },
    }
  );
}
