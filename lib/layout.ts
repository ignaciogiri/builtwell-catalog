/**
 * Geometry of the Miller columns.
 *
 * The layout itself is CSS — see the `--w-*` custom properties in globals.css.
 * These are the same numbers for the column animation, which needs them as
 * plain numbers to tween.
 */

/** Fixed column widths on desktop, measured from the reference design. */
export const WIDTHS = {
  categories: 320,
  items: 320,
  detail: 480,
} as const;

export const LAYOUT = {
  /** Below this the stack collapses to one panel at a time. */
  columnsBreakpoint: 1024,
} as const;
