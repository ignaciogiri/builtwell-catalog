"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import { CONTACT_EMAIL } from "@/lib/site";

export function ContactButton() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can be blocked (permissions, insecure origin) — fail quietly.
    }
  }

  return (
    <button
      aria-label={`Copy ${CONTACT_EMAIL}`}
      className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-5 py-2 text-[15px] transition-colors hover:bg-white/[0.16] transition-transform duration-100 ease-out active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100"
      onClick={copy}
      type="button"
    >
      {copied ? <Check className="size-3.5" /> : null}
      {copied ? "Copied email" : "Contact"}
    </button>
  );
}
