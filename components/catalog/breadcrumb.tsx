"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * `catalog. / Apps` — one level deep, and only on narrow screens.
 *
 * On desktop the columns themselves show where you are, so the trail is
 * redundant; on mobile only one panel is visible, so it is the way back out.
 */
export function Breadcrumb({ names }: { names: Record<string, string> }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const parent = segments.at(-2) ?? segments.at(-1);

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex min-w-0 items-baseline gap-2.5"
    >
      <Link
        className="shrink-0 font-bold text-[22px] leading-none tracking-[-0.02em]"
        href="/"
      >
        catalog.
      </Link>

      {parent ? (
        <span className="flex min-w-0 items-baseline gap-2 leading-none lg:hidden">
          <span aria-hidden className="text-white/30">
            /
          </span>
          <Link
            className="truncate text-[15px] text-white/55 transition-colors hover:text-white"
            href={`/${parent}`}
          >
            {names[parent] ?? parent}
          </Link>
        </span>
      ) : null}
    </nav>
  );
}
