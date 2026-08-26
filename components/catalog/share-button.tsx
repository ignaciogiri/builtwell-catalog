"use client";

import { Check, Link2 } from "lucide-react";
import { useState } from "react";

export function ShareButton({
  slug,
  category,
}: {
  slug: string;
  category: string;
}) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = `${window.location.origin}/${category}/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can be blocked (permissions, insecure origin) — fail quietly.
    }
  }

  return (
    <button
      className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-[15px] text-white transition-colors hover:bg-white/[0.16] focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 transition-transform duration-100 ease-out active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100"
      onClick={share}
      type="button"
    >
      {copied ? <Check className="size-4" /> : <Link2 className="size-4" />}
      {copied ? "Copied" : "Share"}
    </button>
  );
}
