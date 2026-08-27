import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Breadcrumb } from "@/features/catalog/breadcrumb";
import { Browser } from "@/features/catalog/browser";
import { AppFrame } from "@/features/site/app-frame";
import { BuiltwellMark } from "@/features/site/builtwell-mark";
import { ContactButton } from "@/features/site/contact-button";
import { EmDash } from "@/features/site/em-dash";
import { PhotoCredit } from "@/features/site/photo-credit";
import { SubscribeForm } from "@/features/subscribe/form";
import { Tip } from "@/features/site/tip";
import { getAllNames, getCatalog, getCategories } from "@/features/catalog/queries";
import {
  AUTHOR_URL,
  BACKDROP,
  BUILTWELL_URL,
  GA_MEASUREMENT_ID,
  OFFGRID_OWNER_URL,
  OFFGRID_URL,
  REPO_URL,
  SITE,
} from "@/features/site/config";
import "../globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: "Ignacio Giri", url: AUTHOR_URL }],
  creator: "Ignacio Giri",
  keywords: [
    "design resources",
    "design tools",
    "type foundries",
    "design studios",
    "design publications",
    "mockups",
    "design inspiration",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    url: SITE.url,
    images: [
      {
        url: "/og.jpg",
        width: 1600,
        height: 840,
        alt: SITE.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
    images: ["/og.jpg"],
    creator: "@ignaciogiri",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

const linkClass = "text-white transition-colors hover:text-white/70";

function Sidebar() {
  return (
    <div className="space-y-4 border-white/10 border-t px-6 py-6 text-[15px] text-white/55 leading-relaxed">
      <p>
        Catalog is an ever-growing library of design resources, updated
        regularly.
      </p>

      <p>
        Inspired by{" "}
        <a className={linkClass} href={OFFGRID_URL} rel="noreferrer">
          Studio Offgrid
        </a>{" "}
        by{" "}
        <Tip label="Cool name!">
          <a className={linkClass} href={OFFGRID_OWNER_URL} rel="noreferrer">
            Fons Mans
          </a>
        </Tip>
        , and soon curated by{" "}
        <a className={linkClass} href={AUTHOR_URL} rel="noreferrer">
          Ignacio Giri
        </a>
        , founder of{" "}
        <a className={linkClass} href={BUILTWELL_URL} rel="noreferrer">
          Builtwell
        </a>
        .
      </p>

      <p>
        It&rsquo;s{" "}
        <a className={linkClass} href={REPO_URL} rel="noreferrer">
          open source
        </a>
        , including an MCP server (poorly tested) <EmDash /> coded with natural
        language in 60 minutes.
      </p>

      <SubscribeForm />
    </div>
  );
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [categories, names, catalog] = await Promise.all([
    getCategories(),
    getAllNames(),
    getCatalog(),
  ]);

  return (
    <html
      className={`${geistSans.variable} dark h-full bg-black antialiased`}
      lang="en"
    >
      <body className="h-full overflow-hidden font-sans text-white">
        <div
          aria-hidden
          className="fixed inset-0 z-0 bg-center bg-cover bg-no-repeat"
          style={{ backgroundImage: `url(${BACKDROP})` }}
        />

        <AppFrame>
          {/* Spans the full container, so it grows with the panels. */}
          <header className="flex shrink-0 items-center justify-between gap-4 border-white/10 border-b px-6 py-5">
            <Breadcrumb names={names} />

            <ContactButton />
          </header>

          <Browser
            catalog={catalog}
            categories={categories}
            sidebar={<Sidebar />}
          />

          {/* The routes render no UI of their own — they exist for real URLs,
                metadata and not-found handling. Kept in the tree so they run. */}
          {children}
        </AppFrame>

        {/* Outside the frame and under it, on the same inset the frame keeps
            (lg:p-11). Desktop only: below the columns breakpoint the frame runs
            edge to edge and there is no margin to sit in. */}
        <Tip delay={0} label="Visit Builtwell" side="bottom">
          <a
            aria-label="Builtwell"
            className="fixed top-11 right-11 z-0 hidden text-white transition-opacity hover:opacity-70 lg:block"
            href={BUILTWELL_URL}
            rel="noreferrer"
          >
            {/* Scales with the viewport: ~51px at the columns breakpoint, ~72px
                at 1440, capped at 112px so it stops growing on wide screens. */}
            <BuiltwellMark className="h-[clamp(2.5rem,5vw,7rem)] w-auto" />
          </a>
        </Tip>

        <PhotoCredit />

        <Analytics />
        {GA_MEASUREMENT_ID ? (
          <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
        ) : null}
      </body>
    </html>
  );
}
