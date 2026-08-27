"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * A tooltip on an inline element, for the small asides in the sidebar copy.
 * The child becomes the trigger, so it keeps whatever it already was.
 */
export function Tip({
  label,
  children,
  delay = 120,
  side = "top",
}: {
  label: string;
  children: React.ReactElement;
  /** 0 opens on contact, for a target that is its own explanation. */
  delay?: number;
  /** Flip to "bottom" for a trigger near the top edge, which would clip. */
  side?: "top" | "bottom" | "left" | "right";
}) {
  return (
    <TooltipProvider delay={delay}>
      <Tooltip>
        <TooltipTrigger render={children} />
        <TooltipContent side={side}>{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
