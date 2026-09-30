"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { getFavorites } from "@/lib/favorites/favorites";
import { getRecents, type RecentItem } from "@/lib/recent/recent";
import { listingFromId, listingsFromIds } from "@/lib/mock/map-listings";
import { getUserListings, type UserListingDraft } from "@/lib/listings/user-listings";
import { getBidStore, type Bid } from "@/lib/bids/bids";
import { getPurchases, type Purchase } from "@/lib/purchases/purchases";
import { isDefined } from "@/lib/utils/is-defined";
import { money, shortTitle } from "@/lib/format";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/motion/gsap";
import { cn } from "@/lib/utils";

import { ListingCard } from "@/components/listing/listing-card";
import { SitePreview } from "@/components/listing/site-preview";
import { Button } from "@/components/ui/button";

type TabKey = "bids" | "watchlist" | "purchases" | "listings" | "recent";

type Data = {
  favIds: string[];
  recents: RecentItem[];
  myListings: UserListingDraft[];
  myBids: Bid[];
  purchases: Purchase[];
};

const dateFmt: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" };

export default function DashboardPage() {
  const [data, setData] = useState<Data | null>(null);
  const [tab, setTab] = useState<TabKey>("bids");
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read localStorage after mount
    setData({
      favIds: getFavorites(),
      recents: getRecents(),
      myListings: getUserListings(),
      myBids: Object.values(getBidStore()).flat().filter((b) => b.bidder === "You"),
      purchases: getPurchases(),
    });
  }, []);

  const watchlist = useMemo(() => listingsFromIds(data?.favIds ?? []), [data]);
  const recent = useMemo(() => (data?.recents ?? []).map((r) => listingFromId(r.id)).filter(isDefined), [data]);

  // Latest bid per auction, newest first.
  const bidRows = useMemo(() => {
    const latest = new Map<string, { bid: Bid; count: number }>();
    for (const b of [...(data?.myBids ?? [])].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))) {
      const row = latest.get(b.listingId);
      if (row) row.count++;
      else latest.set(b.listingId, { bid: b, count: 1 });
    }
    return [...latest.values()];
  }, [data]);

  // Switching tabs: fade the new panel's items up in sequence.
  useGSAP(
    () => {
      if (!panel.current || prefersReducedMotion()) return;
      gsap.from(panel.current.querySelectorAll("[data-item]"), { autoAlpha: 0, y: 14, stagger: 0.04, duration: 0.4 });
    },
    { dependencies: [tab, data], scope: panel }
  );

  const tabs: { key: TabKey; label: string; count: number }[] = [
    { key: "bids", label: "Your bids", count: bidRows.length },
    { key: "watchlist", label: "Watchlist", count: watchlist.length },
    { key: "purchases", label: "Purchases", count: data?.purchases.length ?? 0 },
    { key: "listings", label: "Your listings", count: data?.myListings.length ?? 0 },
    { key: "recent", label: "Recently viewed", count: recent.length },
  ];

  return (
    <div className="sb-container py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display-tight text-6xl font-bold sm:text-7xl">Dashboard</h1>
          <p className="mt-3 text-muted-ink">Everything here is saved in this browser.</p>
        </div>
        <Button asChild className="h-11 rounded-full px-6">
          <Link href="/sell">List a site</Link>
        </Button>
      </div>

      <div role="tablist" aria-label="Dashboard sections" className="mt-10 flex gap-1 overflow-x-auto overflow-y-hidden border-b">
        {tabs.map((t) => (
          <button
            key={t.key}
            role="tab"
            id={`tab-${t.key}`}
            aria-selected={tab === t.key}
            aria-controls="dash-panel"
            onClick={() => setTab(t.key)}
            className={cn(
              "-mb-px flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
              tab === t.key ? "border-cobalt text-ink" : "border-transparent text-muted-ink hover:text-ink"
            )}
          >
            {t.label}
            <span className={cn("tabular rounded-full px-2 py-0.5 text-xs", tab === t.key ? "bg-cobalt text-white" : "bg-paper-deep")}>
              {data ? t.count : "–"}
            </span>
          </button>
        ))}
      </div>

      <div ref={panel} id="dash-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="pt-8">
        {!data ? null : tab === "bids" ? (
          bidRows.length === 0 ? (
            <Empty title="You haven't bid on anything yet" body="Auctions close fast. Find one worth bidding on." href="/marketplace" cta="Browse live auctions" />
          ) : (
            <ul className="divide-y border-y">
              {bidRows.map(({ bid, count }) => {
                const l = listingFromId(bid.listingId);
                return (
                  <li key={bid.listingId} data-item>
                    <Link href={`/auctions/${bid.listingId}`} className="group grid grid-cols-[5rem_1fr_auto] items-center gap-4 py-4 sm:grid-cols-[7rem_1fr_auto_auto] sm:gap-6">
                      <div className="overflow-hidden rounded-md border">
                        {l ? <SitePreview id={l.id} category={l.category} /> : null}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-display text-xl font-semibold group-hover:text-cobalt">
                          {l ? shortTitle(l.title) : bid.listingId}
                        </p>
                        <p className="text-sm text-muted-ink">
                          {count} {count === 1 ? "bid" : "bids"}, last on{" "}
                          {new Date(bid.createdAt).toLocaleString("en-US", dateFmt)}
                        </p>
                      </div>
                      <p className="text-sm text-muted-ink max-sm:hidden">Your top bid</p>
                      <p className="tabular font-display text-2xl font-semibold">${money(bid.amount)}</p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )
        ) : tab === "watchlist" ? (
          watchlist.length === 0 ? (
            <Empty title="Your watchlist is empty" body="Add lots to your watchlist to compare them here." href="/marketplace" cta="Browse lots" />
          ) : (
            <CardGrid>{watchlist.map((l) => <div key={l.id} data-item className="flex"><ListingCard listing={l} className="w-full" /></div>)}</CardGrid>
          )
        ) : tab === "purchases" ? (
          data.purchases.length === 0 ? (
            <Empty title="No purchases yet" body="Sites you buy outright will show up here with their handover status." href="/marketplace" cta="Find a site to buy" />
          ) : (
            <ul className="divide-y border-y">
              {data.purchases.map((p) => (
                <li key={p.id} data-item className="flex flex-wrap items-center justify-between gap-3 py-4">
                  <div>
                    <Link href={`/listing/${p.listingId}`} className="font-semibold hover:text-cobalt">
                      {p.title}
                    </Link>
                    <p className="text-sm text-muted-ink">
                      Bought {new Date(p.createdAt).toLocaleString("en-US", dateFmt)}. Handover in progress.
                    </p>
                  </div>
                  <p className="tabular font-display text-2xl font-semibold">${money(p.price)}</p>
                </li>
              ))}
            </ul>
          )
        ) : tab === "listings" ? (
          data.myListings.length === 0 ? (
            <Empty title="You haven't listed a site yet" body="It takes a few minutes. Set a price or open an auction." href="/sell" cta="List a site" />
          ) : (
            <CardGrid>
              {data.myListings.map((l) => (
                <div key={l.id} data-item className="overflow-hidden rounded-xl border bg-card">
                  <div className="border-b">
                    <SitePreview id={l.title} category={l.category} />
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-muted-ink">
                      {l.category}, {l.isAuction ? "auction" : "fixed price"}
                    </p>
                    <p className="mt-1 font-semibold leading-snug">{l.title}</p>
                    <div className="mt-4 flex items-end justify-between gap-3">
                      <p className="tabular font-display text-2xl font-semibold">${money(l.price)}</p>
                      <p className="text-right text-xs text-muted-ink">
                        {l.isAuction && l.endsAt
                          ? `Closes ${new Date(l.endsAt).toLocaleString("en-US", dateFmt)}`
                          : `Listed ${new Date(l.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardGrid>
          )
        ) : recent.length === 0 ? (
          <Empty title="Nothing viewed yet" body="Lots you open will be listed here so you can find them again." href="/marketplace" cta="Browse lots" />
        ) : (
          <CardGrid>{recent.map((l) => <div key={l.id} data-item className="flex"><ListingCard listing={l} className="w-full" /></div>)}</CardGrid>
        )}
      </div>
    </div>
  );
}

function CardGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;
}

function Empty({ title, body, href, cta }: { title: string; body: string; href: string; cta: string }) {
  return (
    <div data-item className="rounded-2xl border border-dashed p-10">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="mt-2 max-w-md text-muted-ink">{body}</p>
      <Button asChild className="mt-6 rounded-full">
        <Link href={href}>{cta}</Link>
      </Button>
    </div>
  );
}
