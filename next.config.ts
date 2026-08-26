import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets a production build run without clobbering the .next a dev server is
  // already using: NEXT_DIST_DIR=.next-verify bun run build
  distDir: process.env.NEXT_DIST_DIR || ".next",
  cacheComponents: true,
  typedRoutes: true,
  // Memoises components and hooks automatically, so no hand-written useMemo.
  reactCompiler: true,
  // Prefetches one shared App Shell per route rather than a payload per link.
  partialPrefetching: true,
  experimental: {
    // Saves a stylesheet round trip on first paint.
    inlineCss: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
};

export default nextConfig;
