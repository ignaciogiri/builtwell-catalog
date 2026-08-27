"use client";

import { Tip } from "./tip";

/**
 * The only em dash on the page, and it was typed by a person. The tooltip is
 * the joke: everything else here was written in natural language to a model.
 */
export function EmDash() {
  return (
    <Tip label="em dash added by a human">
      <span className="cursor-help">&mdash;</span>
    </Tip>
  );
}
