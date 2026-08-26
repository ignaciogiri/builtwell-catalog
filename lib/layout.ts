/** Geometry of the Miller columns, shared by the server render and `usePanelWidths`. */

/** Fixed column widths on desktop, measured from the reference design. */
export const WIDTHS = {
  categories: 320,
  items: 320,
  detail: 480,
} as const;

export const LAYOUT = {
  /** Below this the stack collapses to one panel at a time. */
  columnsBreakpoint: 1024,
  /** Used for the server render, before the real viewport is known. */
  assumedViewport: 1440,
} as const;
