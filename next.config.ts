import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets a production build run without clobbering the .next a dev server is
  // already using: NEXT_DIST_DIR=.next-verify bun run build
  distDir: process.env.NEXT_DIST_DIR || ".next",
  cacheComponents: true,
  typedRoutes: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      // Fallback for any item not yet mirrored into Blob.
      { protocol: "https", hostname: "framerusercontent.com" },
    ],
  },
};

export default nextConfig;
