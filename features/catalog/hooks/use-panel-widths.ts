"use client";

import { useSyncExternalStore } from "react";

/** Fixed column widths on desktop, measured from the reference design. */
const WIDTHS = {
  categories: 320,
  items: 320,
  detail: 480,
} as const;

const LAYOUT = {
  /** Below this the stack collapses to one panel at a time. */
  columnsBreakpoint: 1024,
  /** Used for the server render, before the real viewport is known. */
  assumedViewport: 1440,
} as const;

function subscribe(onChange: () => void) {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
}

const getWidth = () => window.innerWidth;
// Server and first client paint agree on a desktop-ish width so the static
// HTML matches; the real value lands on the first resize/effect tick.
const getServerWidth = () => LAYOUT.assumedViewport;

/**
 * Panel widths.
 *
 * Desktop keeps the fixed column widths from the reference design. Below the
 * breakpoint the stack shows one panel at a time, and that panel fills the
 * screen — the only place the sizing is fluid.
 */
export function usePanelWidths() {
  const viewport = useSyncExternalStore(subscribe, getWidth, getServerWidth);
  const isColumns = viewport >= LAYOUT.columnsBreakpoint;

  if (!isColumns) {
    return {
      isColumns,
      categories: viewport,
      items: viewport,
      detail: viewport,
    };
  }

  return { isColumns, ...WIDTHS };
}
