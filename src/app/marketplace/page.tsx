"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

import { listings, type ListingCategory } from "@/lib/mock/listings";
import { DEFAULT_FILTERS } from "@/lib/browse/defaults";
import type { BrowseFilters, SortKey } from "@/lib/browse/types";
import { applyBrowsePipeline } from "@/lib/browse/pipeline";
import { STORAGE_KEYS } from "@/lib/storage/keys";
import { readLocal, writeLocal } from "@/lib/storage/local";
import { money } from "@/lib/format";
import { gsap, useGSAP, Flip, prefersReducedMotion } from "@/lib/motion/gsap";
import { cn } from "@/lib/utils";

import { ListingCard } from "@/components/listing/listing-card";
import { ListingSkeleton } from "@/components/listing/listing-skeleton";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CATEGORIES = ["All", "SaaS", "Ecommerce", "Portfolio", "Agency", "Blog"] as const;
const TECHS = ["All", "Next.js", "React", "Vue", "HTML"] as const;
const SORTS: { value: SortKey; label: string }[] = [
  { value: "popular", label: "Most viewed" },
  { value: "newest", label: "Newest" },
  { value: "endingSoon", label: "Ending soonest" },
  { value: "price", label: "Lowest price" },
];
const PRICE_CEILING = DEFAULT_FILTERS.priceMax;

export default function MarketplacePage() {
  return (
    <Suspense fallback={null}>
      <Marketplace />
    </Suspense>
  );
}

function Marketplace() {
  const params = useSearchParams();
  const [ready, setReady] = useState(false);
  const [filters, setFilters] = useState<BrowseFilters>(DEFAULT_FILTERS);
  const grid = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);

  // Restore saved filters; a ?category= link from the home page takes priority.
  useEffect(() => {
    const saved = readLocal<BrowseFilters>(STORAGE_KEYS.browseFilters, DEFAULT_FILTERS);
    const fromUrl = params.get("category") as ListingCategory | null;
    const valid = fromUrl && (CATEGORIES as readonly string[]).includes(fromUrl);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from storage
    setFilters({ ...DEFAULT_FILTERS, ...saved, ...(valid ? { category: fromUrl } : {}) });
    setReady(true);
  }, [params]);

  useEffect(() => {
    if (ready) writeLocal(STORAGE_KEYS.browseFilters, filters);
  }, [filters, ready]);

  const result = useMemo(() => applyBrowsePipeline(listings, filters), [filters]);

  /** Every filter change goes through here so the grid can FLIP from its old layout. */
  const update = (patch: Partial<BrowseFilters>) => {
    if (grid.current && !prefersReducedMotion()) {
      flipState.current = Flip.getState(grid.current.querySelectorAll("[data-flip-id]"));
    }
    setFilters((f) => ({ ...f, ...patch }));
  };

  useGSAP(
    () => {
      const state = flipState.current;
      if (!state) return;
      flipState.current = null;
      Flip.from(state, {
        targets: grid.current!.querySelectorAll("[data-flip-id]"),
        duration: 0.55,
        ease: "power3.inOut",
        stagger: 0.02,
        absolute: true,
        onEnter: (els) =>
          gsap.fromTo(els, { autoAlpha: 0, scale: 0.92 }, { autoAlpha: 1, scale: 1, duration: 0.45, delay: 0.15 }),
      });
    },
    { dependencies: [result], scope: grid }
  );

  const reset = () => update(DEFAULT_FILTERS);
  const isDefault = JSON.stringify(filters) === JSON.stringify(DEFAULT_FILTERS);

  return (
    <div className="sb-container py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display-tight text-5xl font-bold sm:text-6xl">Browse lots</h1>
          <p className="mt-3 text-muted-ink" aria-live="polite">
            {ready ? `${result.total} of ${listings.length} lots match` : <Skeleton className="h-5 w-36" />}
          </p>
        </div>
        <div className="relative w-full sm:w-80">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-ink" />
          <Input
            type="search"
            aria-label="Search lots"
            value={filters.query}
            onChange={(e) => update({ query: e.target.value })}
            placeholder="Search by name, feature or tag"
            className="h-11 rounded-full bg-card pl-10"
          />
        </div>
      </div>

      {/* Category tabs */}
      <div role="group" aria-label="Category" className="mt-8 flex gap-2 overflow-x-auto overflow-y-hidden border-b pb-4">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={filters.category === c}
            onClick={() => update({ category: c })}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              filters.category === c ? "bg-ink text-white" : "text-muted-ink hover:bg-paper-deep hover:text-ink"
            )}
          >
            {c === "All" ? "All lots" : c}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside aria-label="Filters" className="h-fit space-y-7 lg:sticky lg:top-24">
          <div>
            <Label htmlFor="sort" className="text-sm font-semibold">Sort by</Label>
            <Select value={filters.sort} onValueChange={(v) => update({ sort: v as SortKey })}>
              <SelectTrigger id="sort" className="mt-2 h-10 w-full bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORTS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <fieldset>
            <legend className="text-sm font-semibold">Built with</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {TECHS.map((t) => (
                <button
                  key={t}
                  type="button"
                  aria-pressed={filters.tech === t}
                  onClick={() => update({ tech: t })}
                  className={cn(
                    "rounded-md border px-3 py-1.5 text-sm transition-colors",
                    filters.tech === t ? "border-cobalt bg-cobalt text-white" : "bg-card hover:border-ink/40"
                  )}
                >
                  {t === "All" ? "Any" : t}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="flex w-full justify-between text-sm font-semibold">
              <span>Price</span>
              <span className="tabular font-normal text-muted-ink">
                ${money(filters.priceMin)} to ${money(filters.priceMax)}
              </span>
            </legend>
            <Slider
              className="mt-4"
              min={0}
              max={PRICE_CEILING}
              step={10}
              value={[filters.priceMin, filters.priceMax]}
              onValueChange={([priceMin, priceMax]) => update({ priceMin, priceMax })}
              thumbLabels={["Minimum price", "Maximum price"]}
            />
          </fieldset>

          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="auction-only" className="text-sm font-semibold">Live auctions only</Label>
            <Switch
              id="auction-only"
              checked={filters.auctionOnly}
              onCheckedChange={(auctionOnly) => update({ auctionOnly })}
            />
          </div>

          <Button variant="outline" className="w-full rounded-full" onClick={reset} disabled={isDefault}>
            Clear filters
          </Button>
        </aside>

        <section aria-label="Results">
          <div ref={grid} className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {!ready ? (
              Array.from({ length: 6 }).map((_, i) => <ListingSkeleton key={i} />)
            ) : result.total === 0 ? (
              <div className="rounded-xl border border-dashed p-10 sm:col-span-2 xl:col-span-3">
                <h2 className="text-2xl font-semibold">No lots match these filters</h2>
                <p className="mt-2 text-muted-ink">
                  Widen the price range or clear a filter to see more.
                </p>
                <Button className="mt-5 rounded-full" onClick={reset}>
                  Clear filters
                </Button>
              </div>
            ) : (
              result.items.map((l) => <ListingCard key={l.id} listing={l} />)
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
