/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import { ListingCard } from "@/components/listing/listing-card";
import { getFavorites } from "@/lib/favorites/favorites";
import { getRecents, type RecentItem } from "@/lib/recent/recent";
import { listingFromId, listingsFromIds } from "@/lib/mock/map-listings";

export default function DashboardPage() {
  const [favIds, setFavIds] = useState<string[]>([]);
  const [recents, setRecents] = useState<RecentItem[]>([]);

  useEffect(() => {
    setFavIds(getFavorites());
    setRecents(getRecents());
  }, []);

  const favoriteListings = useMemo(() => listingsFromIds(favIds), [favIds]);

  const recentListings = useMemo(() => {
    // keep recent order
    return recents
      .map((r) => listingFromId(r.id))
      .filter((l): l is NonNullable<typeof l> => l !== null);
  }, [recents]);

  return (
    <div className="sb-container py-10">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Dashboard
          </h1>
          <p className="mt-2 text-slate-600">
            Your saved listings and recently viewed items (persisted locally).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            style={{
              background: "hsla(var(--sb-grad-a) / .12)",
              color: "hsl(var(--sb-text))",
            }}
          >
            {favoriteListings.length} favorites
          </Badge>
          <Badge
            style={{
              background: "hsla(var(--sb-grad-b) / .12)",
              color: "hsl(var(--sb-text))",
            }}
          >
            {recentListings.length} recent
          </Badge>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Favorites */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Favorites</h2>
          <Link className="text-sm text-slate-600 hover:text-slate-900" href="/marketplace">
            Browse more →
          </Link>
        </div>

        {favoriteListings.length === 0 ? (
          <EmptyBlock
            title="No favorites yet"
            desc="Save listings to compare later. Favorites persist in localStorage."
            primaryHref="/marketplace"
            primaryLabel="Go to Marketplace"
          />
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteListings.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        )}
      </section>

      <Separator className="my-10" />

      {/* Recently viewed */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Recently viewed</h2>
          <Link className="text-sm text-slate-600 hover:text-slate-900" href="/marketplace">
            Explore →
          </Link>
        </div>

        {recentListings.length === 0 ? (
          <EmptyBlock
            title="Nothing viewed yet"
            desc="Open a listing and it will show up here automatically."
            primaryHref="/marketplace"
            primaryLabel="Browse listings"
          />
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentListings.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        )}
      </section>

      <Separator className="my-10" />

      {/* My bids (placeholder for next step) */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">My bids</h2>
          <span className="text-sm text-slate-500">Coming next</span>
        </div>

        <Card className="sb-card mt-4 p-6">
          <p className="text-sm font-semibold text-slate-900">Next up</p>
          <p className="mt-1 text-sm text-slate-600">
            Sprint 3 Step 4 will add auction bidding flow + bid persistence, then this section will populate.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/marketplace">Find auctions</Link>
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
}

function EmptyBlock({
  title,
  desc,
  primaryHref,
  primaryLabel,
}: {
  title: string;
  desc: string;
  primaryHref: string;
  primaryLabel: string;
}) {
  return (
    <Card className="sb-card mt-4 p-6">
      <p className="text-base font-semibold text-slate-900">{title}</p>
      <p className="mt-1 text-sm text-slate-600">{desc}</p>
      <div className="mt-4">
        <Button
          asChild
          className="rounded-full text-white"
          style={{
            background:
              "linear-gradient(135deg, hsl(var(--sb-grad-a)), hsl(var(--sb-grad-b)))",
          }}
        >
          <Link href={primaryHref}>{primaryLabel}</Link>
        </Button>
      </div>
    </Card>
  );
}
