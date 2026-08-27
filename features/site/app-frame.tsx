"use client";

import { motion, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { usePanelWidths } from "@/features/catalog/hooks/use-panel-widths";

/**
 * The app frame, draggable with a spring rubber-band back into place.
 *
 * Dragging is a gesture the user can interrupt and reverse, so the return is a
 * spring rather than an eased tween — a spring carries velocity through an
 * interruption, a duration curve restarts.
 *
 * Off below the columns breakpoint and under reduced motion: there the panel
 * fills the screen and dragging would fight the panels' own scrolling.
 */
export function AppFrame({ children }: { children: React.ReactNode }) {
  const bounds = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { isColumns } = usePanelWidths();
  const draggable = isColumns && !reduceMotion;

  return (
    <div
      // pointer-events-none: this wrapper spans the whole viewport, so
      // without it the empty margin would swallow clicks meant for what
      // sits behind the frame (the Builtwell mark, the photo credit).
      className="pointer-events-none relative z-10 flex h-dvh items-stretch overflow-hidden p-0 lg:p-11"
      ref={bounds}
    >
      <motion.div
        className="pointer-events-auto flex min-h-0 flex-1 flex-col overflow-hidden bg-black/55 backdrop-blur-2xl lg:flex-none lg:rounded-2xl lg:border lg:border-white/10"
        drag={draggable}
        // Resists as you pull instead of following one-to-one.
        dragElastic={0.1}
        dragMomentum={false}
        // Always returns home. Without this the frame simply stays wherever it
        // was dropped, which reads as a broken layout rather than a gesture.
        dragSnapToOrigin
        style={{ cursor: draggable ? "grab" : undefined }}
        transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
        whileDrag={{ cursor: "grabbing" }}
      >
        {children}
      </motion.div>
    </div>
  );
}
