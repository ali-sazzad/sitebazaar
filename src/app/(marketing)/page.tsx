import Link from "next/link";
import { HomeHero } from "@/components/home/home-hero";
import { ClosingSoon } from "@/components/home/closing-soon";
import { CategoryIndex } from "@/components/home/category-index";
import { SaleProcess } from "@/components/home/sale-process";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: { absolute: "SiteBazaar: buy and sell websites" },
  description: "Bid on live website auctions or buy a finished site outright.",
};

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <ClosingSoon />
      <CategoryIndex />
      <SaleProcess />

      <section className="sb-container pt-20">
        <div className="grid gap-8 rounded-3xl bg-cobalt p-8 text-white sm:p-12 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <h2 className="display-tight text-5xl font-bold sm:text-6xl">Built something you&apos;re done with?</h2>
            <p className="mt-4 max-w-lg text-white/80">
              List it in a few minutes. Set a price, or open an auction and let buyers decide what it&apos;s worth.
            </p>
          </div>
          <Button asChild size="lg" className="h-12 rounded-full bg-white px-7 text-base text-ink hover:bg-marigold">
            <Link href="/sell">List your site</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
