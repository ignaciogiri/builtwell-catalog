"use server";

import { db, schema } from "@/lib/db";

// Deliberately permissive: enough to catch typos without rejecting valid
// addresses that stricter patterns get wrong.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type SubscribeState = {
  status: "idle" | "ok" | "error";
  message?: string;
};

export async function subscribe(
  _prev: SubscribeState,
  formData: FormData
): Promise<SubscribeState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!EMAIL.test(email)) {
    return { status: "error", message: "Enter a valid email." };
  }

  try {
    await db
      .insert(schema.subscribers)
      .values({ email })
      .onConflictDoNothing({ target: schema.subscribers.email });

    // Re-subscribing is a no-op, but the user shouldn't see it as a failure.
    return { status: "ok", message: "Subscribed." };
  } catch {
    return { status: "error", message: "Something went wrong. Try again." };
  }
}
