import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse",
  description:
    "Browse a category of the catalog: apps, foundries, studios, publications, mockups and tools.",
};

/** A category with nothing selected shows two panels and no detail. */
export default function Page() {
  return null;
}
