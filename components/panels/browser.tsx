"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { Detail } from "@/components/catalog/detail";
import { NavRow } from "@/components/catalog/nav-row";
import { useIsColumns } from "@/hooks/use-is-columns";
import type { CatalogItem } from "@/lib/db/queries";
import type { Category } from "@/lib/db/schema";
import { WIDTHS } from "@/lib/layout";
import { cn } from "@/lib/utils";

const EASE = [0.32, 0.72, 0, 1] as const;
const DURATION = 0.34;

/**
 * The Miller-column browser.
 *
 * All three columns live in this one persistent client component. Selection is
 * derived from the URL, so the routes still exist for deep links and SEO, but
 * navigating never swaps a route slot — which is what makes exit animations
 * possible at all. AnimatePresence cannot track a child that lives in an App
 * Router slot; here it owns and keys the panel directly.
 *
 * Which panels are on screen, and how wide, is decided in CSS at the same
 * `lg` breakpoint the rest of the frame uses. A panel is mounted whenever the
 * URL has data for it and hidden by media query when the stack has no room —
 * so the server renders one layout that is already correct on both a phone
 * and a desktop. JS only layers the column animation on top, once it knows.
 */
export function Browser({
  categories,
  catalog,
  sidebar,
}: {
  categories: Category[];
  catalog: CatalogItem[];
  sidebar: React.ReactNode;
}) {
  const pathname = usePathname();
  const [categorySlug, itemSlug] = pathname.split("/").filter(Boolean);
  const isColumns = useIsColumns();

  // No useMemo: the React Compiler memoises these automatically.
  const items = categorySlug
    ? catalog.filter((i) => i.category === categorySlug)
    : [];
  const selected = itemSlug
    ? (items.find((i) => i.slug === itemSlug) ?? null)
    : null;

  const depth = pathname.split("/").filter(Boolean).length;

  // Widths are class-driven until hydration; from then on the animation owns
  // the inline width, and the stack has to be told to give it back.
  const width = (columnWidth: number) => {
    if (isColumns === null) {
      return false as const;
    }
    return isColumns
      ? { width: columnWidth, opacity: 1 }
      : { width: "100%", opacity: 1 };
  };
  const collapse = isColumns ? { width: 0, opacity: 0 } : undefined;

  return (
    <div className="flex min-h-0 flex-1">
      {/* Categories — always mounted, never animates. */}
      <div
        className={cn(
          "h-full min-h-0 w-full shrink-0 flex-col justify-between lg:w-(--w-categories)",
          depth === 0 ? "flex" : "hidden lg:flex",
          // The 1px is always reserved and only the colour toggles. These
          // columns are a fixed pixel width with border-box, so adding a
          // border later would take that pixel out of the content instead.
          "lg:border-r",
          depth > 0 ? "lg:border-white/10" : "lg:border-transparent"
        )}
      >
        <nav className="scroll-thin flex-1 overflow-y-auto p-3">
          {categories.map((c) => (
            <NavRow
              badge={c.badge}
              href={`/${c.slug}`}
              key={c.id}
              label={c.name}
              match="prefix"
            />
          ))}
        </nav>
        {sidebar}
      </div>

      <AnimatePresence initial={false}>
        {categorySlug ? (
          <motion.div
            animate={width(WIDTHS.items)}
            className={cn(
              "min-h-0 w-full shrink-0 overflow-hidden lg:w-(--w-items)",
              depth === 1 ? "block" : "hidden lg:block"
            )}
            exit={collapse}
            // Narrow screens swap one full-width panel for another, so there is
            // no width to animate — only a flash. Desktop opens a new column
            // beside the others, which is the part worth animating.
            initial={isColumns ? { width: 0, opacity: 0 } : false}
            key="items"
            transition={{ duration: DURATION, ease: EASE }}
          >
            {/* Fixed width so contents don't reflow while the outer clips. */}
            <div
              className={cn(
                "flex h-full min-h-0 w-full flex-col lg:w-(--w-items)",
                // Reserved, not added on demand — see the categories column.
                "lg:border-r",
                itemSlug ? "lg:border-white/10" : "lg:border-transparent"
              )}
            >
              <nav className="scroll-thin flex-1 overflow-y-auto p-3">
                {items.map((i) => (
                  <NavRow
                    badge={i.badge}
                    hoverPrefetch
                    href={`/${i.category}/${i.slug}`}
                    image={i.image}
                    key={i.slug}
                    label={i.name}
                  />
                ))}
              </nav>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {selected ? (
          <motion.div
            animate={width(WIDTHS.detail)}
            className={cn(
              "min-h-0 w-full shrink-0 overflow-hidden lg:w-(--w-detail)",
              depth === 2 ? "block" : "hidden lg:block"
            )}
            exit={collapse}
            // See the items panel: nothing to animate when the panel simply
            // fills the screen.
            initial={isColumns ? { width: 0, opacity: 0 } : false}
            key="detail"
            transition={{ duration: DURATION, ease: EASE }}
          >
            {/* Fixed width so contents don't reflow while the outer clips. */}
            <div className="h-full min-h-0 w-full lg:w-(--w-detail)">
              <div className="scroll-thin h-full overflow-y-auto">
                <Detail image={selected.image} item={selected} />
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
