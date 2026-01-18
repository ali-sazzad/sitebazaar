/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ListingCard } from "@/components/listing/listing-card";

import { getFavorites } from "@/lib/favorites/favorites";
import { getRecents, type RecentItem } from "@/lib/recent/recent";
import { listingFromId, listingsFromIds } from "@/lib/mock/map-listings";

import { getUserListings, type UserListingDraft } from "@/lib/listings/user-listings";
import { getBidStore, type Bid } from "@/lib/bids/bids";

function money(n: number) {
  return new Intl.NumberFormat("en-US").format(n);
}

export default function DashboardPage() {
  const [favIds, setFavIds] = useState<string[]>([]);
  const [recents, setRecents] = useState<RecentItem[]>([]);

  const [myListings, setMyListings] = useState<UserListingDraft[]>([]);
  const [myBids, setMyBids] = useState<Bid[]>([]);

  useEffect(() => {
    setFavIds(getFavorites());
    setRecents(getRecents());
    setMyListings(getUserListings());

    // Flatten store into array and keep only "You" bids
    const store = getBidStore();
    const all = Object.values(store).flat();
    setMyBids(all.filter((b) => b.bidder === "You"));
  }, []);

  const favoriteListings = useMemo(() => listingsFromIds(favIds), [favIds]);

  // ✅ IMPORTANT: this filters out null AND narrows type to Listing[]
  const recentListings = useMemo(() => {
    return recents
      .map((r) => listingFromId(r.id))
      .filter((l): l is NonNullable<typeof l> => l !== null);
  }, [recents]);

  // Group my bids by listingId (newest first)
  const bidsByListing = useMemo(() => {
    const map = new Map<string, Bid[]>();
    const sorted = [...myBids].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    for (const b of sorted) {
      const arr = map.get(b.listingId) ?? [];
      arr.push(b);
      map.set(b.listingId, arr);
    }

    return map;
  }, [myBids]);

  return (
    <div className="sb-container py-10">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Dashboard
          </h1>
          <p className="mt-2 text-slate-600">
            Frontend-only. Everything is stored in localStorage.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
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

          <Badge
            style={{
              background: "hsla(var(--sb-warm) / .14)",
              color: "hsl(var(--sb-text))",
            }}
          >
            {myListings.length} my listings
          </Badge>

          <Badge
            style={{
              background: "hsla(var(--sb-warm) / .10)",
              color: "hsl(var(--sb-text))",
            }}
          >
            {myBids.length} my bids
          </Badge>
        </div>
      </div>

      <Separator className="my-6" />

      {/* My Listings */}
      <section>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">My listings</h2>

          <Button
            asChild
            className="rounded-full text-white"
            style={{
              background:
                "linear-gradient(135deg, hsl(var(--sb-grad-a)), hsl(var(--sb-grad-b)))",
            }}
          >
            <Link href="/sell">Create listing</Link>
          </Button>
        </div>

        {myListings.length === 0 ? (
          <EmptyBlock
            title="No listings yet"
            desc="Create your first listing draft from the Sell page."
            primaryHref="/sell"
            primaryLabel="Go to Sell page"
          />
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {myListings.map((l) => (
              <Card key={l.id} className="sb-card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm text-slate-500">{l.category}</p>
                    <p className="mt-1 font-semibold text-slate-900 line-clamp-2">
                      {l.title}
                    </p>
                  </div>

                  <span
                    className="rounded-full px-2.5 py-1 text-xs font-semibold text-white whitespace-nowrap"
                    style={{
                      background: l.isAuction
                        ? "linear-gradient(135deg, hsl(var(--sb-warm)), hsl(var(--sb-grad-a)))"
                        : "linear-gradient(135deg, hsl(var(--sb-grad-a)), hsl(var(--sb-grad-b)))",
                    }}
                  >
                    {l.isAuction ? "Auction" : "Buy Now"}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {l.techStack.slice(0, 3).map((t) => (
                    <span key={t} className="sb-chip">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <p className="text-xs text-slate-500">Price</p>
                    <p className="text-lg font-semibold text-slate-900">
                      ${money(l.price)}
                    </p>
                  </div>
                  <p className="text-xs text-slate-500">
                    {new Date(l.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {l.isAuction && l.endsAt ? (
                  <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs font-semibold text-slate-700">Ends</p>
                    <p className="mt-1 text-xs text-slate-600">
                      {new Date(l.endsAt).toLocaleString()}
                    </p>
                  </div>
                ) : null}

                <div className="mt-4 flex gap-2">
                  <Button asChild variant="outline" className="rounded-xl w-full">
                    <Link href="/marketplace">View marketplace</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <Separator className="my-10" />

      {/* Favorites */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Favorites</h2>
          <Link
            className="text-sm text-slate-600 hover:text-slate-900"
            href="/marketplace"
          >
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
          <Link
            className="text-sm text-slate-600 hover:text-slate-900"
            href="/marketplace"
          >
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

      {/* My Bids */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">My bids</h2>
          <Link
            className="text-sm text-slate-600 hover:text-slate-900"
            href="/marketplace"
          >
            Find auctions →
          </Link>
        </div>

        {myBids.length === 0 ? (
          <EmptyBlock
            title="No bids yet"
            desc="Place a bid on any auction listing and it will appear here."
            primaryHref="/marketplace"
            primaryLabel="Browse auctions"
          />
        ) : (
          <div className="mt-4 grid gap-4">
            {[...bidsByListing.entries()].map(([listingId, bids]) => {
              const listing = listingFromId(listingId);

              return (
                <Card key={listingId} className="sb-card p-5">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-sm text-slate-500">Listing</p>
                      <p className="font-semibold text-slate-900 line-clamp-2">
                        {listing?.title ?? `Listing ${listingId}`}
                      </p>
                    </div>

                    <div className="mt-2 sm:mt-0 flex items-center gap-2">
                      <Badge
                        style={{
                          background: "hsla(var(--sb-grad-a) / .12)",
                          color: "hsl(var(--sb-text))",
                        }}
                      >
                        {bids.length} bids
                      </Badge>

                      {listing ? (
                        <Button asChild variant="outline" className="rounded-full">
                          <Link href={`/auctions/${listingId}`}>Open auction</Link>
                        </Button>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Amount</TableHead>
                          <TableHead className="text-right">Time</TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {bids.slice(0, 5).map((b) => (
                          <TableRow key={b.id}>
                            <TableCell className="font-semibold text-slate-900">
                              ${money(b.amount)}
                            </TableCell>
                            <TableCell className="text-right text-slate-600 text-sm">
                              {new Date(b.createdAt).toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
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
