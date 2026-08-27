import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Dates read in UTC, not the server's zone, so a row says the same thing
 * everywhere and doesn't slip a day either side of midnight.
 *
 * Intl does the whole job in one call. date-fns cannot: formatting in another
 * zone needs @date-fns/tz or @date-fns/utc, whose TZDate and UTCDate call
 * `new Date()` with no arguments in their constructors — a dynamic API under
 * cacheComponents, so a "use cache" render that builds one never finishes
 * filling its entry and every item page fails to prerender. date-fns-tz avoids
 * the subclass but rounds through local time, which puts it an hour out on the
 * host's own DST-transition hour.
 */
const DATE = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeZone: "UTC",
});

const DATE_TIME = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
});

export function formatDate(date: Date | null) {
  return date ? DATE.format(date) : "—";
}

/** As formatDate, plus the time — for lists where the order within a day matters. */
export function formatDateTime(date: Date | null) {
  return date ? DATE_TIME.format(date) : "—";
}
