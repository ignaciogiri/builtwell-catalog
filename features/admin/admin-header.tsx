"use client";

import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { NAV } from "./nav";

/**
 * The sticky bar above each section.
 *
 * The title comes from the same NAV the sidebar renders, so a section is named
 * in one place rather than repeated in every page.
 */
export function AdminHeader() {
  const pathname = usePathname();
  const current = NAV.find((item) => item.href === pathname);

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur">
      <SidebarTrigger className="-ml-1" />
      <Separator className="mr-1 data-[orientation=vertical]:h-4" orientation="vertical" />

      <div className="flex min-w-0 items-baseline gap-2">
        <h1 className="truncate font-medium text-sm">
          {current?.label ?? "Editor"}
        </h1>
        {current ? (
          <span className="hidden truncate text-muted-foreground text-xs sm:inline">
            {current.description}
          </span>
        ) : null}
      </div>
    </header>
  );
}
