import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Toaster } from "@/components/ui/sonner";
import { BackToTop } from "@/components/layout/back-to-top";

export const metadata: Metadata = {
  metadataBase: new URL("https://sitebazaar.vercel.app"),
  title: {
    default: "SiteBazaar — Buy & Sell Websites",
    template: "%s — SiteBazaar",
  },
  description:
    "A colorful frontend-only marketplace for buying & selling websites with a simulated bidding flow. Built with Next.js, TypeScript, Tailwind, and shadcn/ui.",
  applicationName: "SiteBazaar",
  openGraph: {
    type: "website",
    siteName: "SiteBazaar",
    title: "SiteBazaar — Buy & Sell Websites",
    description:
      "Marketplace UI with search/filter/sort, listing detail, auctions, dashboard persistence. Frontend-only demo.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "SiteBazaar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SiteBazaar — Buy & Sell Websites",
    description:
      "Frontend-only marketplace with bidding UI. Next.js + Tailwind + shadcn/ui.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {/* Header must NOT be inside any overflow container */}
        <SiteHeader />

        <main id="main" className="min-h-[calc(100vh-200px)]">
          {children}
        </main>

        <SiteFooter />

        {/* Back to top button */}
        <BackToTop />

        <Toaster richColors />
      </body>
    </html>
  );
}
