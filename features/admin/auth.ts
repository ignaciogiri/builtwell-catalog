import "server-only";
import { timingSafeEqual } from "node:crypto";

/**
 * The gate on everything under (admin) and /api/subscribers.
 *
 * Subscriber emails are personal data and this project has no accounts, so
 * access is a single shared secret in ADMIN_TOKEN. With the variable unset
 * nothing is readable: an absent token fails closed rather than open.
 */
export function tokenIsValid(supplied: string | undefined) {
  const expected = process.env.ADMIN_TOKEN;
  if (!(expected && supplied)) {
    return false;
  }

  // Equal lengths first, since timingSafeEqual throws on a mismatch.
  const a = Buffer.from(supplied);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Reads the token from a bearer header, falling back to ?token= for a browser. */
export function tokenFromRequest(request: Request) {
  const header = request.headers.get("authorization") ?? "";
  if (header.startsWith("Bearer ")) {
    return header.slice("Bearer ".length);
  }
  return new URL(request.url).searchParams.get("token") ?? undefined;
}
