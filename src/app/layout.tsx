import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: {
    default: "SiteBazaar — Buy & Sell Websites",
    template: "%s — SiteBazaar",
  },
  description:
    "A colorful marketplace UI for buying & selling websites with simulated bidding, favorites, and dashboards.",
  openGraph: {
    title: "SiteBazaar",
    description:
      "Marketplace for buying & selling websites (Buy Now + Auctions). Frontend-only demo with persistence.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        <main className="min-h-[calc(100vh-200px)]">{children}</main>
        <SiteFooter />
        <Toaster richColors />
      </body>
    </html>
  );
}
