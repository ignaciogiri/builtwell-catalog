import "server-only";
import { desc } from "drizzle-orm";
import { db, schema } from "@/lib/db";

export type Subscriber = typeof schema.subscribers.$inferSelect;

/** The subscriber list, newest first. Uncached: it is read behind a token. */
export function listSubscribers(): Promise<Subscriber[]> {
  return db
    .select()
    .from(schema.subscribers)
    .orderBy(desc(schema.subscribers.createdAt));
}
