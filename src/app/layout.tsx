import type { Metadata } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Toaster } from "@/components/ui/sonner";
import { BackToTop } from "@/components/layout/back-to-top";
import { JsFlag } from "@/components/motion/js-flag";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["wdth", "opsz"],
  variable: "--font-bricolage",
  display: "swap",
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sitebazaar.vercel.app"),
  title: {
    default: "SiteBazaar: buy and sell websites",
    template: "%s | SiteBazaar",
  },
  description:
    "A marketplace for buying and selling websites, with live auctions and instant buy-now. Frontend demo built with Next.js, GSAP, Tailwind and shadcn/ui.",
  applicationName: "SiteBazaar",
  openGraph: {
    type: "website",
    siteName: "SiteBazaar",
    title: "SiteBazaar: buy and sell websites",
    description:
      "Browse website lots, bid in live auctions, or buy instantly. Frontend demo with GSAP motion.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "SiteBazaar" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SiteBazaar: buy and sell websites",
    description: "Website marketplace with live auctions. Next.js + GSAP + Tailwind.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${figtree.variable}`} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <JsFlag />
        <SiteHeader />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <SiteFooter />
        <BackToTop />
        <Toaster position="bottom-left" />
      </body>
    </html>
  );
}
