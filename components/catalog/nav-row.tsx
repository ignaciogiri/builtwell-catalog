"use client";

import { ChevronRight, Folder } from "lucide-react";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type Props<T extends string> = {
  href: Route<T>;
  label: string;
  image?: string | null;
  badge?: string | null;
  /** Categories stay lit while a child item is open; items match exactly. */
  match?: "prefix" | "exact";
};

export function NavRow<T extends string>({
  href,
  label,
  image,
  badge,
  match = "exact",
}: Props<T>) {
  const pathname = usePathname();
  const selected =
    match === "prefix"
      ? pathname === href || pathname.startsWith(`${href}/`)
      : pathname === href;

  return (
    <Link
      aria-current={selected ? "true" : undefined}
      className={cn(
        "group flex items-center gap-3 rounded-xl px-3 py-2 transition-colors duration-150",
        selected ? "bg-white text-black" : "text-white hover:bg-white/[0.07]"
      )}
      href={href}
    >
      <span className="flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-[6px]">
        {image ? (
          <Image
            alt=""
            className="size-6 rounded-[6px] object-cover"
            height={48}
            src={image}
            width={48}
          />
        ) : (
          <Folder
            className={cn(
              "size-[18px]",
              selected ? "text-black" : "text-white"
            )}
            strokeWidth={1.5}
          />
        )}
      </span>

      <span className="min-w-0 flex-1 truncate text-[15px] leading-6 tracking-[-0.01em]">
        {label}
      </span>

      {badge ? (
        // One solid pill, so it reads the same on a selected white row as on a
        // dark one — a translucent tint only works over dark.
        <span className="shrink-0 rounded-full bg-orange-400 px-2 py-0.5 font-medium text-[11px] text-orange-950 tracking-wide">
          {badge}
        </span>
      ) : null}

      <ChevronRight
        className={cn(
          "size-[18px] shrink-0",
          selected
            ? "text-black opacity-70"
            : "text-white/35 group-hover:opacity-70"
        )}
        strokeWidth={1.75}
      />
    </Link>
  );
}
