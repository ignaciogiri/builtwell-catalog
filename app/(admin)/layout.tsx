import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AdminHeader } from "@/features/admin/admin-header";
import { AppSidebar } from "@/features/admin/app-sidebar";
import "../globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

/**
 * The editor gets its own root layout.
 *
 * The public layout mounts the persistent three-column browser and the whole
 * catalog payload with it, none of which the editor wants — a route group with
 * a second root layout is the only way to opt out of it entirely.
 */
export const metadata: Metadata = {
  title: "Catalog editor",
  robots: { index: false, follow: false, nocache: true },
};

// Both route groups own a root layout, so each is typed as the "/" layout.
export default function AdminLayout({ children }: LayoutProps<"/">) {
  return (
    <html className={`${geistSans.variable} dark`} lang="en">
      <body className="bg-background font-sans text-foreground antialiased">
        <SidebarProvider>
          <AppSidebar />

          <SidebarInset>
            <AdminHeader />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
