import { desc } from "drizzle-orm";
import { tokenFromRequest, tokenIsValid } from "@/lib/admin-auth";
import { db, schema } from "@/lib/db";

/**
 * The subscriber list as JSON, newest first — the same rows the page at
 * /admin/subscribers renders, for when you want them piped somewhere:
 *
 *   curl -H "Authorization: Bearer $ADMIN_TOKEN" https://catalog.builtwell.design/api/subscribers
 */
export async function GET(request: Request) {
  if (!tokenIsValid(tokenFromRequest(request))) {
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
