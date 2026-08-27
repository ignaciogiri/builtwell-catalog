import { tokenFromRequest, tokenIsValid } from "@/features/admin/auth";
import { listSubscribers } from "@/features/subscribe/queries";

/**
 * The subscriber list as JSON, newest first — the same read the page at
 * /admin/subscribers renders, for when you want the rows piped somewhere:
 *
 *   curl -H "Authorization: Bearer $ADMIN_TOKEN" https://catalog.builtwell.design/api/subscribers
 */
export async function GET(request: Request) {
  if (!tokenIsValid(tokenFromRequest(request))) {
    return Response.json({ error: "Not found." }, { status: 404 });
  }

  const subscribers = await listSubscribers();

  return Response.json(
    { count: subscribers.length, subscribers },
    {
      headers: {
        "cache-control": "no-store",
        "x-robots-tag": "noindex, nofollow",
      },
    }
  );
}
