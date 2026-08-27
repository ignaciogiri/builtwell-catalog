import { notFound } from "next/navigation";
import { tokenIsValid } from "@/features/admin/auth";
import { listSubscribers } from "@/features/subscribe/queries";
import { formatDateTime } from "@/lib/utils";

/**
 * The token arrives in searchParams and the whole page is gated on it, so there
 * is nothing to prerender and no shell worth streaming — this route blocks.
 */
export const instant = false;

export default async function SubscribersPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  // 404 rather than 401, so a wrong token doesn't confirm the page exists.
  if (!tokenIsValid(token)) {
    notFound();
  }

  const subscribers = await listSubscribers();

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <header className="mb-10">
        <h1 className="font-medium text-2xl tracking-tight">Subscribers</h1>

        <p className="mt-2 text-muted text-sm">
          {subscribers.length === 0
            ? "Nobody has subscribed yet."
            : `${subscribers.length} ${subscribers.length === 1 ? "person" : "people"}, newest first.`}
        </p>
      </header>

      {subscribers.length > 0 ? (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-white/10 border-b text-left text-muted">
              <th className="py-2 font-normal">Email</th>
              <th className="py-2 text-right font-normal">Subscribed</th>
            </tr>
          </thead>

          <tbody>
            {subscribers.map((s) => (
              <tr className="border-white/10 border-b last:border-0" key={s.id}>
                <td className="py-3 pr-4">
                  <a
                    className="transition-opacity hover:opacity-70"
                    href={`mailto:${s.email}`}
                  >
                    {s.email}
                  </a>
                </td>

                {/* UTC throughout, so the column doesn't shift with the reader. */}
                <td className="whitespace-nowrap py-3 text-right text-muted tabular-nums">
                  {formatDateTime(s.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </main>
  );
}
