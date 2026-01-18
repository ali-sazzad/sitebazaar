/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { listings } from "@/lib/mock/listings";
import { DEFAULT_FILTERS } from "@/lib/browse/defaults";
import type { BrowseFilters } from "@/lib/browse/types";
import { applyBrowsePipeline } from "@/lib/browse/pipeline";
import { STORAGE_KEYS } from "@/lib/storage/keys";
import { readLocal, writeLocal } from "@/lib/storage/local";

import { ListingCard } from "@/components/listing/listing-card";
import { ListingSkeleton } from "@/components/listing/listing-skeleton";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const categories = ["All", "Portfolio", "Ecommerce", "SaaS", "Blog", "Agency"] as const;
const techs = ["All", "Next.js", "React", "Vue", "HTML"] as const;
const sorts = [
  { value: "popular", label: "Most popular" },
  { value: "newest", label: "Newest" },
  { value: "endingSoon", label: "Ending soon" },
  { value: "price", label: "Lowest price" },
] as const;

export default function MarketplacePage() {
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<BrowseFilters>(DEFAULT_FILTERS);

  // Load persisted filters
  useEffect(() => {
    const saved = readLocal<BrowseFilters>(STORAGE_KEYS.browseFilters, DEFAULT_FILTERS);
    setFilters(saved);
    // simulate loading for skeleton demo
    const t = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(t);
  }, []);

  // Persist filters
  useEffect(() => {
    if (!loading) writeLocal(STORAGE_KEYS.browseFilters, filters);
  }, [filters, loading]);

  const result = useMemo(() => applyBrowsePipeline(listings, filters), [filters]);

  const onReset = () => setFilters(DEFAULT_FILTERS);

  return (
    <div className="sb-container py-10">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Marketplace</h1>
          <p className="mt-2 text-slate-600">
            Search, filter, and sort listings. Favorites/bids come next.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge style={{ background: "hsla(var(--sb-grad-a) / .12)", color: "hsl(var(--sb-text))" }}>
            {loading ? "Loading…" : `${result.total} results`}
          </Badge>
          <Button variant="outline" className="rounded-full" onClick={onReset}>
            Reset
          </Button>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Responsive layout:
          Mobile: filters on top
          Desktop: sidebar + grid
      */}
      <div className="grid gap-6 md:grid-cols-[280px_1fr]">
        {/* Filters */}
        <aside className="rounded-2xl border sb-border bg-white/60 p-4">
          <p className="text-sm font-semibold text-slate-900">Filters</p>
          <p className="mt-1 text-sm text-slate-600">
            These persist automatically.
          </p>

          <div className="mt-4 space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-600">Search</label>
              <Input
                value={filters.query}
                onChange={(e) => setFilters((p) => ({ ...p, query: e.target.value }))}
                placeholder="e.g. ecommerce, landing, portfolio…"
                className="mt-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-600">Category</label>
                <Select
                  value={filters.category}
                  onValueChange={(v) => setFilters((p) => ({ ...p, category: v as any }))}
                >
                  <SelectTrigger className="mt-2  bg-white/70 border-slate-300 hover:bg-white focus:ring-2 focus:ring-offset-2">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/85 border-slate-400/50 shadow-xl">
                    {categories.map((c) => (
                      <SelectItem 
                        key={c} 
                        value={c}
                        className="focus:bg-slate-100 hover:bg-white/15 data-[state=checked]:bg-slate-100 data-[state=checked]:font-semibold"
                        >
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600">Tech</label>
                <Select
                  value={filters.tech}
                  onValueChange={(v) => setFilters((p) => ({ ...p, tech: v as any }))}
                >
                  <SelectTrigger className="mt-2  bg-white/70 border-slate-300 hover:bg-white focus:ring-2 focus:ring-offset-2">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/85 border-slate-400/50 shadow-xl">
                    {techs.map((t) => (
                      <SelectItem 
                        key={t} 
                        value={t}
                        className="focus:bg-slate-100 hover:bg-white/15 data-[state=checked]:bg-slate-100 data-[state=checked]:font-semibold"
                        >
                          {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-600">Min ($)</label>
                <Input
                  type="number"
                  value={filters.priceMin}
                  onChange={(e) => setFilters((p) => ({ ...p, priceMin: Number(e.target.value || 0) }))}
                  className="mt-2  bg-white/70 border-green-300"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Max ($)</label>
                <Input
                  type="number"
                  value={filters.priceMax}
                  onChange={(e) => setFilters((p) => ({ ...p, priceMax: Number(e.target.value || 0) }))}
                  className="mt-2  bg-white/70 border-red-300"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600">Sort</label>
              <Select
                value={filters.sort}
                onValueChange={(v) => setFilters((p) => ({ ...p, sort: v as any }))}
              >
                <SelectTrigger className="mt-2  bg-white/70 border-slate-300 hover:bg-white focus:ring-2 focus:ring-offset-2">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="bg-white/85 border-slate-400/50 shadow-xl">
                  {sorts.map((s) => (
                    <SelectItem 
                      key={s.value} 
                      value={s.value}
                      className="focus:bg-slate-100 hover:bg-white/15 data-[state=checked]:bg-slate-100 data-[state=checked]:font-semibold"
                      >
                        {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <button
              type="button"
              className="w-full rounded-xl border sb-border bg-white px-3 py-2 text-left text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
              onClick={() => setFilters((p) => ({ ...p, auctionOnly: !p.auctionOnly }))}
              aria-pressed={filters.auctionOnly}
            >
              <span className="flex items-center justify-between">
                <span>Auction only</span>
                <span
                  className="rounded-full px-2 py-1 text-xs font-semibold"
                  style={{
                    background: filters.auctionOnly
                      ? "linear-gradient(135deg, hsl(var(--sb-warm)), hsl(var(--sb-grad-a)))"
                      : "hsla(var(--sb-grad-a)/.10)",
                    color: filters.auctionOnly ? "white" : "hsl(var(--sb-text))",
                  }}
                >
                  {filters.auctionOnly ? "ON" : "OFF"}
                </span>
              </span>
            </button>
          </div>
        </aside>

        {/* Results */}
        <section>
          {/* Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              Array.from({ length: 9 }).map((_, i) => <ListingSkeleton key={i} />)
            ) : result.total === 0 ? (
              <div className="sm:col-span-2 lg:col-span-3 rounded-2xl border sb-border bg-white/70 p-8">
                <p className="text-lg font-semibold text-slate-900">No results</p>
                <p className="mt-1 text-slate-600">
                  Try changing your filters or search term.
                </p>
                <Button className="mt-4 rounded-full" variant="outline" onClick={onReset}>
                  Reset filters
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
