"use client";

import { ArrowRight, Check } from "lucide-react";
import { useActionState } from "react";
import { type SubscribeState, subscribe } from "@/lib/actions";
import { cn } from "@/lib/utils";

const initial: SubscribeState = { status: "idle" };

export function SubscribeForm() {
  const [state, action, pending] = useActionState(subscribe, initial);

  if (state.status === "ok") {
    return (
      <p className="mt-5 flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-[15px] text-white">
        <Check className="size-4 shrink-0" />
        {state.message}
      </p>
    );
  }

  return (
    <form action={action} className="mt-5">
      <div
        className={cn(
          "flex items-center justify-between gap-3 rounded-xl border px-4 py-3 transition-colors focus-within:border-white/25",
          state.status === "error" ? "border-red-400/50" : "border-white/10"
        )}
      >
        <input
          aria-label="Email address"
          className="min-w-0 flex-1 bg-transparent text-[15px] text-white placeholder:text-white/45 focus:outline-none disabled:opacity-50"
          disabled={pending}
          name="email"
          placeholder="Subscribe for updates"
          required
          type="email"
        />
        <button
          aria-label="Subscribe"
          className="text-white/60 transition-colors hover:text-white disabled:opacity-50 transition-transform duration-100 ease-out active:scale-90 motion-reduce:transition-none motion-reduce:active:scale-100"
          disabled={pending}
          type="submit"
        >
          <ArrowRight className={cn("size-4", pending && "animate-pulse")} />
        </button>
      </div>
      {state.status === "error" ? (
        <p className="mt-2 text-[13px] text-red-400/90">{state.message}</p>
      ) : null}
    </form>
  );
}
