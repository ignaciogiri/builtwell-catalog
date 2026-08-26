"use client";

import { useSyncExternalStore } from "react";
import { LAYOUT } from "@/lib/layout";

const QUERY = `(min-width: ${LAYOUT.columnsBreakpoint}px)`;

function subscribe(onChange: () => void) {
  const query = window.matchMedia(QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

const getSnapshot = () => window.matchMedia(QUERY).matches;
// The server has no viewport to measure, so it answers "don't know" and the
// first paint belongs entirely to the `lg:` classes — which are the same
// breakpoint, and are right on a phone and a desktop without running any JS.
// Guessing here instead is what made a phone paint a 320px column and then
// stretch it to full width a tick later.
const getServerSnapshot = () => null;

/**
 * Whether the layout is showing Miller columns rather than the one-at-a-time
 * stack. `null` until the client has hydrated and can read the viewport.
 *
 * Only behaviour JS owns should depend on this — the column animation, the
 * drag gesture. Anything that affects the first paint belongs in CSS.
 */
export function useIsColumns(): boolean | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
