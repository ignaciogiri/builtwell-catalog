/** Everything about the site itself: identity, metadata, and the links in the chrome. */

export const SITE = {
  name: "Catalog",
  title: "Catalog — All things design",
  description:
    "An open-source, ever-growing library of design resources: apps, foundries, studios, publications, mockups and tools.",
  /** Override in production with NEXT_PUBLIC_SITE_URL. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://catalog.builtwell.design",
} as const;

/**
 * Google Analytics measurement id.
 *
 * Read from the environment rather than hardcoded: the id ships to the browser
 * either way, but a fork that deploys this shouldn't silently report into
 * someone else's property. Unset means no analytics is loaded at all.
 */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;

export const BUILTWELL_URL = "https://builtwell.design";

export const AUTHOR_URL = "https://ignaciogiri.vercel.app";

export const OFFGRID_URL = "https://offgrid.inc";

/** Fons Mans, who runs Studio Offgrid — the catalog this one is modelled on. */
export const OFFGRID_OWNER_URL = "https://x.com/FonsMans";

/** Update if the repo moves. */
export const REPO_URL = "https://github.com/ignaciogiri/builtwell-catalog";

export const CONTACT_EMAIL = "nacho@builtwell.design";

export const BACKDROP = "/backdrop.jpg";

/** Photo credit for the backdrop. */
export const BACKDROP_CREDIT = {
  handle: "@ignaciogiri",
  url: "https://unsplash.com/@ignaciogiri",
  avatar: "/ignacio-giri.jpg",
} as const;
