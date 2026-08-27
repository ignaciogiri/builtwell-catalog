"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { Detail } from "@/features/catalog/detail";
import { NavRow } from "@/features/catalog/nav-row";
import { usePanelWidths } from "@/features/catalog/hooks/use-panel-widths";
import type { CatalogItem } from "@/features/catalog/queries";
import type { Category } from "@/lib/db/schema";
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
  const {
    isColumns,
    categories: catW,
    items: itemsW,
    detail: detailW,
  } = usePanelWidths();

  // No useMemo: the React Compiler memoises these automatically.
  const items = categorySlug
    ? catalog.filter((i) => i.category === categorySlug)
    : [];
  const selected = itemSlug
    ? (items.find((i) => i.slug === itemSlug) ?? null)
    : null;

  const depth = pathname.split("/").filter(Boolean).length;
  const show = (panelDepth: number) => isColumns || depth === panelDepth;

  return (
    <div className="flex min-h-0 flex-1">
      {/* Categories — always mounted, never animates. */}
      {show(0) ? (
        <div
          className={cn(
            "flex h-full min-h-0 shrink-0 flex-col justify-between",
            !isColumns && "w-full",
            // The 1px is always reserved and only the colour toggles. These
            // columns are a fixed pixel width with border-box, so adding a
            // border later would take that pixel out of the content instead.
            isColumns && "border-r",
            isColumns && depth > 0 ? "border-white/10" : "border-transparent"
          )}
          style={{ width: isColumns ? catW : undefined }}
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
      ) : null}

      <AnimatePresence initial={false}>
        {categorySlug && show(1) ? (
          <motion.div
            animate={isColumns ? { width: itemsW, opacity: 1 } : false}
            className="min-h-0 shrink-0 overflow-hidden"
            exit={isColumns ? { width: 0, opacity: 0 } : undefined}
            // Narrow screens swap one full-width panel for another, so there is
            // no width to animate — only a flash. Desktop opens a new column
            // beside the others, which is the part worth animating.
            initial={isColumns ? { width: 0, opacity: 0 } : false}
            key="items"
            style={isColumns ? undefined : { width: "100%" }}
            transition={{ duration: DURATION, ease: EASE }}
          >
            <div
              className={cn(
                "flex h-full min-h-0 flex-col",
                !isColumns && "w-full",
                // Reserved, not added on demand — see the categories column.
                isColumns && "border-r",
                isColumns && itemSlug ? "border-white/10" : "border-transparent"
              )}
              style={{ width: isColumns ? itemsW : undefined }}
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
        {selected && show(2) ? (
          <motion.div
            animate={isColumns ? { width: detailW, opacity: 1 } : false}
            className="min-h-0 shrink-0 overflow-hidden"
            exit={isColumns ? { width: 0, opacity: 0 } : undefined}
            // See the items panel: nothing to animate when the panel simply
            // fills the screen.
            initial={isColumns ? { width: 0, opacity: 0 } : false}
            key="detail"
            style={isColumns ? undefined : { width: "100%" }}
            transition={{ duration: DURATION, ease: EASE }}
          >
            {/* Fixed width so contents don't reflow while the outer clips. */}
            <div
              className={cn("h-full min-h-0", !isColumns && "w-full")}
              style={{ width: isColumns ? detailW : undefined }}
            >
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
