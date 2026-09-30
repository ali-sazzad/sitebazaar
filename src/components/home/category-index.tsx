import Link from "next/link";
import { listings, type ListingCategory } from "@/lib/mock/listings";
import { effectivePrice, money } from "@/lib/format";

const CATEGORIES: { name: ListingCategory; blurb: string }[] = [
  { name: "SaaS", blurb: "Landing pages, pricing and dashboards" },
  { name: "Ecommerce", blurb: "Storefronts with product and checkout pages" },
  { name: "Portfolio", blurb: "Case-study sites for designers and studios" },
  { name: "Agency", blurb: "Service sites with team and proof sections" },
  { name: "Blog", blurb: "Reading-first layouts, MDX ready" },
];

export function CategoryIndex() {
  return (
    <section className="sb-container py-20">
      <h2 className="text-4xl font-bold sm:text-5xl">Browse by kind of site</h2>
      <ul className="mt-10 border-t">
        {CATEGORIES.map(({ name, blurb }) => {
          const items = listings.filter((l) => l.category === name);
          const prices = items.map(effectivePrice);
          return (
            <li key={name} className="border-b">
              <Link
                href={`/marketplace?category=${encodeURIComponent(name)}`}
                className="group grid gap-1 py-6 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-8"
              >
                <span className="display-tight text-4xl font-bold transition-colors group-hover:text-cobalt sm:text-6xl">
                  {name}
                </span>
                <span className="text-sm text-muted-ink sm:text-right">
                  {blurb}
                  <br className="hidden sm:block" />
                  <span className="sm:hidden">. </span>
                  {items.length} lots from ${money(Math.min(...prices))}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
